const pool = require('../db'); // Assuming db.js exists

const olympicsController = {
  // Get live global leaderboard
  getLeaderboard: async (req, res) => {
    try {
      const query = `
        SELECT 
          e.country_code, 
          SUM(v.points) as total_points 
        FROM olympic_entries e
        JOIN olympic_votes v ON e.id = v.entry_id
        GROUP BY e.country_code
        ORDER BY total_points DESC
        LIMIT 10
      `;
      const result = await pool.query(query);
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error fetching leaderboard' });
    }
  },

  // Cast a vote for an entry
  castVote: async (req, res) => {
    const { userId, entryId, category } = req.body;
    
    try {
      // 1. Verify user hasn't voted in this category for this entry
      const checkVote = await pool.query(
        'SELECT id FROM olympic_votes WHERE user_id = $1 AND entry_id = $2 AND category = $3',
        [userId, entryId, category]
      );

      if (checkVote.rows.length > 0) {
        return res.status(400).json({ error: 'You have already voted for this entry in this category.' });
      }

      // 2. Check user voting credits (mocked for now, assuming users table has a voting_credits column)
      const userRes = await pool.query('SELECT reward_points as voting_credits FROM users WHERE id = $1', [userId]);
      const credits = userRes.rows[0]?.voting_credits || 0;

      if (credits <= 0) {
        return res.status(403).json({ error: 'Insufficient voting credits. Come back tomorrow!' });
      }

      // 3. Cast the vote and deduct a credit (atomic transaction)
      await pool.query('BEGIN');
      
      await pool.query(
        'INSERT INTO olympic_votes (user_id, entry_id, category, points) VALUES ($1, $2, $3, $4)',
        [userId, entryId, category, 10] // each vote is worth 10 points
      );

      await pool.query(
        'UPDATE users SET reward_points = reward_points - 1 WHERE id = $1',
        [userId]
      );

      await pool.query('COMMIT');

      res.status(200).json({ message: 'Vote cast successfully!', pointsAwarded: 10 });
    } catch (err) {
      await pool.query('ROLLBACK');
      console.error(err);
      res.status(500).json({ error: 'Failed to cast vote due to server error' });
    }
  }
};

module.exports = olympicsController;
