const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const crypto = require('crypto');
const uuidv4 = () => crypto.randomUUID();

let isDbInitialized = false;

// Auto-create table safely before first use
const ensureDb = async () => {
  if (isDbInitialized) return;
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS random_chat_rooms (
        id VARCHAR(50) PRIMARY KEY,
        user1_id VARCHAR(100),
        user2_id VARCHAR(100),
        offer TEXT,
        answer TEXT,
        user1_ice TEXT DEFAULT '[]',
        user2_ice TEXT DEFAULT '[]',
        messages TEXT DEFAULT '[]',
        status VARCHAR(20) DEFAULT 'waiting',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    isDbInitialized = true;
  } catch (err) {
    console.error('Failed to init random_chat_rooms table', err);
    throw err;
  }
};

// POST /api/random-chat/join
router.post('/join', async (req, res) => {
  try {
    await ensureDb();
    const userId = req.body.userId || uuidv4();
    
    // 1. Clean up dead ghosts (anyone who hasn't polled in 60 seconds)
    // Using EXTRACT(EPOCH) guarantees we don't get timezone mismatch bugs
    await db.query(`DELETE FROM random_chat_rooms WHERE EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) - EXTRACT(EPOCH FROM last_active) > 60`);
    
    // 2. ATOMIC MATCHMAKING: Find a waiting room and lock it instantly so no one else can take it.
    // This perfectly simulates a dedicated Redis/Socket.io Queue using PostgreSQL.
    const result = await db.query(`
      UPDATE random_chat_rooms 
      SET user2_id = $1, status = 'matched', last_active = CURRENT_TIMESTAMP 
      WHERE id = (
        SELECT id FROM random_chat_rooms 
        WHERE status = 'waiting' AND user1_id != $1 
        ORDER BY created_at ASC
        LIMIT 1 
        FOR UPDATE SKIP LOCKED
      )
      RETURNING id
    `, [userId]);
    
    if (result.rows.length > 0) {
      // Match found! Join the room.
      const roomId = result.rows[0].id;
      return res.json({ roomId, role: 'responder', userId });
    } else {
      // 3. Create a new waiting room
      const roomId = uuidv4();
      await db.query(`INSERT INTO random_chat_rooms (id, user1_id) VALUES ($1, $2)`, [roomId, userId]);
      return res.json({ roomId, role: 'initiator', userId });
    }
  } catch (err) {
    console.error('[RandomChat] Join Error:', err);
    res.status(500).json({ error: 'Failed to join matching queue' });
  }
});

// GET /api/random-chat/debug
router.get('/debug', async (req, res) => {
  try {
    await ensureDb();
    const result = await db.query('SELECT * FROM random_chat_rooms ORDER BY created_at DESC LIMIT 20');
    res.json({ rooms: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/random-chat/time-test
router.get('/time-test', async (req, res) => {
  try {
    const r = await db.query(`SELECT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) as now_epoch, CURRENT_TIMESTAMP as now_timestamp`);
    res.json(r.rows[0]);
  } catch(e) { res.status(500).json({error: e.message}); }
});

router.get('/time-test2', async (req, res) => {
  try {
    await db.query(`INSERT INTO random_chat_rooms (id, user1_id) VALUES ('test-time-id', 'test')`);
    const r = await db.query(`SELECT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) - EXTRACT(EPOCH FROM last_active) as diff FROM random_chat_rooms WHERE id = 'test-time-id'`);
    await db.query(`DELETE FROM random_chat_rooms WHERE id = 'test-time-id'`);
    res.json(r.rows[0]);
  } catch(e) { res.status(500).json({error: e.message}); }
});

// GET /api/random-chat/room/:id
router.get('/room/:id', async (req, res) => {
  res.setHeader('Cache-Control', 'no-store, max-age=0, must-revalidate');
  try {
    await ensureDb();
    const { id } = req.params;
    const result = await db.query(`SELECT * FROM random_chat_rooms WHERE id = $1`, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Room closed or not found' });
    }
    
    const room = result.rows[0];
    
    // Update last active so the room doesn't expire while they are actively polling
    await db.query(`UPDATE random_chat_rooms SET last_active = CURRENT_TIMESTAMP WHERE id = $1`, [id]);
    
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch room status' });
  }
});

// POST /api/random-chat/room/:id/signal
router.post('/room/:id/signal', async (req, res) => {
  try {
    await ensureDb();
    const { id } = req.params;
    const { type, data, role } = req.body;
    
    if (type === 'offer') {
      await db.query(`UPDATE random_chat_rooms SET offer = $1, last_active = CURRENT_TIMESTAMP WHERE id = $2`, [JSON.stringify(data), id]);
    } else if (type === 'answer') {
      await db.query(`UPDATE random_chat_rooms SET answer = $1, last_active = CURRENT_TIMESTAMP WHERE id = $2`, [JSON.stringify(data), id]);
    } else if (type === 'ice-candidate') {
      const field = role === 'initiator' ? 'user1_ice' : 'user2_ice';
      
      const current = await db.query(`SELECT ${field} FROM random_chat_rooms WHERE id = $1`, [id]);
      let arr = [];
      if (current.rows.length > 0 && current.rows[0][field]) {
         arr = JSON.parse(current.rows[0][field]);
      }
      arr.push(data);
      
      await db.query(`UPDATE random_chat_rooms SET ${field} = $1, last_active = CURRENT_TIMESTAMP WHERE id = $2`, [JSON.stringify(arr), id]);
    }
    
    res.json({ success: true });
  } catch (err) {
    console.error('Signal Error:', err);
    res.status(500).json({ error: 'Failed to save signaling data' });
  }
});

// POST /api/random-chat/room/:id/message
router.post('/room/:id/message', async (req, res) => {
  try {
    await ensureDb();
    const { id } = req.params;
    const { message } = req.body;
    
    const current = await db.query(`SELECT messages FROM random_chat_rooms WHERE id = $1`, [id]);
    let arr = [];
    if (current.rows.length > 0 && current.rows[0].messages) {
       arr = JSON.parse(current.rows[0].messages);
    }
    arr.push({ text: message, timestamp: Date.now() });
    
    await db.query(`UPDATE random_chat_rooms SET messages = $1, last_active = CURRENT_TIMESTAMP WHERE id = $2`, [JSON.stringify(arr), id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// POST /api/random-chat/room/:id/leave
router.post('/room/:id/leave', async (req, res) => {
  try {
    await ensureDb();
    await db.query(`DELETE FROM random_chat_rooms WHERE id = $1`, [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to leave room' });
  }
});

module.exports = router;
