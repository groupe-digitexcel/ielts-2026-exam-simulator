const pool = require('../config/db');

const getExamQuestions = async (req, res) => {
  try {
    const { section = 'reading' } = req.query;

    const [rows] = await pool.query(
      'SELECT id, section, question_text, option_a, option_b, option_c, option_d FROM questions WHERE section = ? ORDER BY id ASC',
      [section]
    );

    res.json(rows);
  } catch (error) {
    console.error('getExamQuestions error:', error);
    res.status(500).json({ message: 'Failed to fetch exam questions' });
  }
};

module.exports = { getExamQuestions };
