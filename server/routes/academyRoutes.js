const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { protect } = require('../middleware/authMiddleware');
const { toCamel } = require('../utils/camelCase');

// Mock data fallback since seed sometimes fails
const mockCourse = {
  id: 101, title: 'Japanese Culture & Basic Phrases', description: 'Learn essential phrases and cultural etiquette before your trip to Japan. A must-take course for first-time travelers.', category: 'Languages', level: 'Beginner', coverImage: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80', authorName: 'ZilliGo Academy'
};
const mockLessons = [
  { id: 201, courseId: 101, title: 'Lesson 1: Greetings & Etiquette', content: 'In Japan, bowing is a common greeting...', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', quizData: { question: 'What is the most polite way to say Hello in Japanese?', options: ['Konnichiwa', 'Sayonara', 'Arigato', 'Sushi'], correctIndex: 0 }, orderIndex: 1 },
  { id: 202, courseId: 101, title: 'Lesson 2: Dining Out', content: 'Tipping is not customary in Japan...', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', quizData: { question: 'Is it acceptable to leave a tip at a restaurant in Japan?', options: ['Yes, always 15-20%', 'Yes, but only in cash', 'No, tipping is not practiced', 'Only at dinner'], correctIndex: 2 }, orderIndex: 2 }
];

// GET /api/academy/courses
router.get('/courses', async (req, res) => {
  try {
    const result = await db.query('SELECT c.*, u.name as author_name FROM academy_courses c LEFT JOIN users u ON c.author_id = u.id ORDER BY c.created_at DESC');
    if (result.rows.length === 0) {
      return res.json([mockCourse]);
    }
    res.json(result.rows.map(toCamel));
  } catch (err) {
    res.status(500).json({ message: 'Error fetching courses' });
  }
});

// GET /api/academy/courses/:id/lessons
router.get('/courses/:id/lessons', async (req, res) => {
  try {
    const courseId = parseInt(req.params.id, 10);
    const result = await db.query('SELECT * FROM course_lessons WHERE course_id = $1 ORDER BY order_index ASC', [courseId]);
    if (result.rows.length === 0 && courseId === 101) {
      return res.json(mockLessons);
    }
    res.json(result.rows.map(toCamel));
  } catch (err) {
    res.status(500).json({ message: 'Error fetching lessons' });
  }
});

// POST /api/academy/enroll
router.post('/enroll', protect, async (req, res) => {
  try {
    const { courseId } = req.body;
    const result = await db.query(`
      INSERT INTO course_enrollments (user_id, course_id, progress_data)
      VALUES ($1, $2, '{}')
      ON CONFLICT DO NOTHING RETURNING *
    `, [req.user.id, courseId]);
    res.status(201).json(toCamel(result.rows[0] || {}));
  } catch (err) {
    res.status(500).json({ message: 'Error enrolling in course' });
  }
});

// PUT /api/academy/progress
router.put('/progress', protect, async (req, res) => {
  try {
    const { courseId, lessonId, completed } = req.body;
    // In a real DB we'd use jsonb_set, but for simplicity here we'll just pull, modify, and push
    const getRes = await db.query('SELECT progress_data FROM course_enrollments WHERE user_id = $1 AND course_id = $2', [req.user.id, courseId]);
    if (getRes.rows.length > 0) {
      let progress = getRes.rows[0].progress_data || {};
      progress[lessonId] = true;
      const isCourseCompleted = completed; 

      await db.query(`
        UPDATE course_enrollments SET progress_data = $1, completed = $2
        WHERE user_id = $3 AND course_id = $4
      `, [progress, isCourseCompleted, req.user.id, courseId]);

      if (isCourseCompleted) {
        // Award a certification stamp!
        await db.query(`
          INSERT INTO digital_passports (user_id, country_code, stamp_name)
          VALUES ($1, 'ACADEMY', 'Certified Learner')
          ON CONFLICT DO NOTHING
        `, [req.user.id]);
      }
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Error updating progress' });
  }
});

module.exports = router;
