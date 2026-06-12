const db = require('../utils/db');
const { toCamel } = require('../utils/camelCase');

// @desc    Get all conversations for logged in user
// @route   GET /api/messages/conversations
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const lastMessages = await db.query(`
      SELECT DISTINCT ON (partner_id)
        partner_id,
        m.id AS message_id,
        m.content AS last_msg,
        m.created_at,
        m.sender_id,
        m.is_read,
        u.name,
        u.avatar,
        u.location,
        u.role
      FROM (
        SELECT id, content, created_at, sender_id, receiver_id, is_read,
          CASE WHEN sender_id = $1 THEN receiver_id ELSE sender_id END AS partner_id
        FROM messages
        WHERE sender_id = $1 OR receiver_id = $1
      ) m
      JOIN users u ON m.partner_id = u.id
      ORDER BY partner_id, m.created_at DESC
    `, [userId]);

    const formatted = lastMessages.rows.map(row => {
      let country = row.location?.split(',')[1]?.trim() || 'Global';
      let flag = '🌍';
      if (country.toLowerCase().includes('japan')) { country = 'Japan'; flag = '🇯🇵'; }
      else if (country.toLowerCase().includes('italy')) { country = 'Italy'; flag = '🇮🇹'; }
      else if (country.toLowerCase().includes('india')) { country = 'India'; flag = '🇮🇳'; }
      else if (country.toLowerCase().includes('france')) { country = 'France'; flag = '🇫🇷'; }
      else if (country.toLowerCase().includes('usa') || country.toLowerCase().includes('states')) { country = 'USA'; flag = '🗽'; }
      
      return {
        id: row.partner_id,
        name: row.name,
        avatar: row.avatar,
        country: country,
        flag: flag,
        nativeLang: row.role === 'guide' ? 'Japanese' : 'English',
        lastMsg: row.last_msg,
        time: new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        unread: (row.sender_id !== userId && !row.is_read) ? 1 : 0,
        online: true,
        createdAt: row.created_at
      };
    });

    // Sort by latest message date descending
    formatted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(formatted);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Error retrieving conversations' });
  }
};

// @desc    Get message history with a partner
// @route   GET /api/messages/history/:partnerId
exports.getChatHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const partnerId = parseInt(req.params.partnerId, 10);

    if (isNaN(partnerId)) {
      return res.status(400).json({ message: 'Invalid partner ID' });
    }

    // Mark messages received from this partner as read
    await db.query(`
      UPDATE messages 
      SET is_read = true 
      WHERE sender_id = $1 AND receiver_id = $2 AND is_read = false
    `, [partnerId, userId]);

    const result = await db.query(`
      SELECT m.*, u.name AS sender_name, u.avatar AS sender_avatar
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE (sender_id = $1 AND receiver_id = $2)
         OR (sender_id = $2 AND receiver_id = $1)
      ORDER BY m.created_at ASC
    `, [userId, partnerId]);

    const history = result.rows.map(row => ({
      id: row.id,
      sender: row.sender_id === userId ? 'user' : 'friend',
      text: row.content,
      time: new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      original: ''
    }));

    res.json(history);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ message: 'Error fetching chat history' });
  }
};

// @desc    Send a message
// @route   POST /api/messages
// @desc    Save message to database and return formatted result
exports.sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId, content } = req.body;

    if (!receiverId || !content) {
      return res.status(400).json({ message: 'Receiver ID and content are required' });
    }

    const result = await db.query(`
      INSERT INTO messages (sender_id, receiver_id, content)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [senderId, parseInt(receiverId, 10), content]);

    const msg = result.rows[0];

    res.status(201).json({
      id: msg.id,
      sender: 'user',
      text: msg.content,
      time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
};
