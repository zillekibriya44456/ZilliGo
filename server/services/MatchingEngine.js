const db = require('../utils/db');

class MatchingEngine {
  // Haversine formula to calculate distance in km
  static getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c; // Distance in km
  }

  static deg2rad(deg) {
    return deg * (Math.PI/180);
  }

  // Find the nearest available guide
  static async findNearestGuide(city, travelerLat, travelerLon, ignoreGuideIds = []) {
    try {
      // 1. Fetch all online, available guides (we can filter by city if needed, but doing distance is better)
      let query = `
        SELECT g.guide_id, g.latitude, g.longitude, u.name as guide_name, u.avatar
        FROM guide_locations g
        JOIN users u ON g.guide_id = u.id
        WHERE g.online_status = 'online' 
        AND g.availability_status = 'available'
      `;
      
      const values = [];
      if (ignoreGuideIds.length > 0) {
        query += ` AND g.guide_id != ALL($1::int[])`;
        values.push(ignoreGuideIds);
      }

      const res = await db.query(query, values);
      
      if (res.rows.length === 0) return null;

      // 2. Calculate distance for all and sort
      const guidesWithDistance = res.rows.map(guide => {
        const dist = this.getDistance(travelerLat, travelerLon, guide.latitude, guide.longitude);
        return { ...guide, distance: dist };
      });

      guidesWithDistance.sort((a, b) => a.distance - b.distance);

      return guidesWithDistance[0]; // Return the nearest
    } catch (err) {
      console.error('Error in findNearestGuide:', err);
      return null;
    }
  }

  static async processEscalations(io) {
    try {
      // Find pending requests that have expired. 
      // We use FOR UPDATE SKIP LOCKED to ensure atomic processing across concurrent instances.
      const expiredRes = await db.query(`
        SELECT id, traveler_id, guide_id, city, latitude, longitude, amount, duration_minutes 
        FROM booking_requests 
        WHERE status = 'pending' AND expires_at < NOW()
        FOR UPDATE SKIP LOCKED
      `);

      for (const req of expiredRes.rows) {
        // Mark current as expired
        await db.query(`UPDATE booking_requests SET status = 'expired' WHERE id = $1`, [req.id]);
        
        // Notify the guide that they missed it
        io.emit('booking_expired', { guideId: req.guide_id, requestId: req.id });

        // Find next guide (ignoring the one who just missed it)
        // In a real system we'd track ALL previously asked guides, but for MVP we just ignore the immediate last one
        const nextGuide = await this.findNearestGuide(req.city, req.latitude, req.longitude, [req.guide_id]);
        
        if (nextGuide) {
          // Create new request
          const newReqRes = await db.query(`
            INSERT INTO booking_requests (traveler_id, guide_id, city, latitude, longitude, amount, duration_minutes, expires_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, NOW() + INTERVAL '60 seconds')
            RETURNING *
          `, [req.traveler_id, nextGuide.guide_id, req.city, req.latitude, req.longitude, req.amount, req.duration_minutes]);
          
          const newReq = newReqRes.rows[0];
          
          // Notify the new guide
          io.emit('booking_request', {
            requestId: newReq.id,
            guideId: nextGuide.guide_id,
            guideName: nextGuide.guide_name,
            distance: nextGuide.distance.toFixed(1),
            travelerId: req.traveler_id,
            amount: req.amount,
            duration: req.duration_minutes,
            expiresAt: newReq.expires_at
          });

          // Notify traveler that we are routing to someone else
          io.emit('booking_routing', {
            travelerId: req.traveler_id,
            newGuideName: nextGuide.guide_name,
            distance: nextGuide.distance.toFixed(1)
          });
        } else {
          // No more guides available
          io.emit('booking_failed', {
            travelerId: req.traveler_id,
            message: 'No guides available nearby at the moment.'
          });
        }
      }
    } catch (err) {
      console.error('Error processing escalations:', err);
    }
  }
}

module.exports = MatchingEngine;
