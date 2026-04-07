import { useEffect, useState } from 'react';
import API from '../api';

export default function ExamPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(null);

  useEffect(() => {
    API.get('/exam/questions?section=reading')
      .then((res) => setQuestions(res.data))
      .catch(() => alert('Premium access required or failed to load exam'));
  }, []);

  const choose = (questionId, option) => {
    setAnswers((prev) => {
      const filtered = prev.filter((a) => a.question_id !== questionId);
      return [...filtered, { question_id: questionId, selected_option: option }];
    });
  };

  const submit = async () => {
    const { data } = await API.post('/results/submit', {
      section: 'reading',
      answers
    });
    setSubmitted(data);
  };

  return (
    <div className="container">
      <h2>Reading Exam</h2>

      {questions.map((q) => (
        <div key={q.id} className="card">
          <p><strong>{q.question_text}</strong></p>
          {['A', 'B', 'C', 'D'].map((opt) => (
            <label key={opt} className="option">
              <input
                type="radio"
                name={`q-${q.id}`}
                onChange={() => choose(q.id, opt)}
              />
              {q[`option_${opt.toLowerCase()}`]}
            </label>
          ))}
        </div>
      ))}

      {questions.length > 0 && <button onClick={submit}>Submit Exam</button>}

      {submitted && (
        <div className="card success">
          <h3>Exam Submitted</h3>
          <p>Score: {submitted.score}/{submitted.total}</p>
          <p>Band Score: {submitted.band_score}</p>
        </div>
      )}
    </div>
  );
}
