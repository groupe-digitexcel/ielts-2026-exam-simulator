const pool = require('../config/db');

const bandScore = (score, total) => {
  const percentage = (score / total) * 100;

  if (percentage >= 90) return 9.0;
  if (percentage >= 80) return 8.0;
  if (percentage >= 70) return 7.0;
  if (percentage >= 60) return 6.0;
  if (percentage >= 50) return 5.0;
  if (percentage >= 40) return 4.0;
  return 3.0;
};

const submitExam = async (req, res) => {
  try {
    const { section, answers } = req.body;

    if (!section || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'Invalid exam submission data' });
    }

    const [questions] = await pool.query(
      'SELECT id, correct_option FROM questions WHERE section = ?',
      [section]
    );

    let score = 0;
    const total = questions.length;

    const answerMap = {};
    answers.forEach((a) => {
      answerMap[a.question_id] = a.selected_option;
    });

    questions.forEach((q) => {
      if (answerMap[q.id] === q.correct_option) {
        score++;
      }
    });

    const calculatedBand = bandScore(score, total);

    const [result] = await pool.query(
      'INSERT INTO exam_results (user_id, section, score, total_questions, band_score) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, section, score, total, calculatedBand]
    );

    res.json({
      message: 'Exam submitted successfully',
      resultId: result.insertId,
      score,
      total,
      band_score: calculatedBand
    });
  } catch (error) {
    console.error('submitExam error:', error);
    res.status(500).json({ message: 'Failed to submit exam' });
  }
};

const getMyResults = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM exam_results WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );

    res.json(rows);
  } catch (error) {
    console.error('getMyResults error:', error);
    res.status(500).json({ message: 'Failed to fetch results' });
  }
};

module.exports = { submitExam, getMyResults };
