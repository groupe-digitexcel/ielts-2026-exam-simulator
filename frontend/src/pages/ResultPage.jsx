import { useEffect, useState } from 'react';
import API from '../api';

export default function ResultPage() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    API.get('/results/my-results').then((res) => setResults(res.data));
  }, []);

  return (
    <div className="container">
      <h2>My Results</h2>
      {results.map((r) => (
        <div key={r.id} className="card">
          <p>Section: {r.section}</p>
          <p>Score: {r.score}/{r.total_questions}</p>
          <p>Band: {r.band_score}</p>
          <p>Date: {new Date(r.created_at).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
