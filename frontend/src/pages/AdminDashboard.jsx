import { useEffect, useState } from 'react';
import API from '../api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]);

  const loadData = async () => {
    const statsRes = await API.get('/admin/stats');
    const reqRes = await API.get('/admin/subscriptions');
    setStats(statsRes.data);
    setRequests(reqRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const approve = async (id) => {
    await API.put(`/admin/subscriptions/${id}/approve`);
    loadData();
  };

  const reject = async (id) => {
    await API.put(`/admin/subscriptions/${id}/reject`);
    loadData();
  };

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>

      {stats && (
        <div className="card">
          <p>Total Users: {stats.totalUsers}</p>
          <p>Total Results: {stats.totalResults}</p>
          <p>Pending Subscriptions: {stats.totalPendingSubscriptions}</p>
        </div>
      )}

      <h3>Subscription Requests</h3>
      {requests.map((req) => (
        <div key={req.id} className="card">
          <p><strong>{req.name}</strong> ({req.email})</p>
          <p>Method: {req.payment_method}</p>
          <p>Ref: {req.transaction_ref}</p>
          <p>Status: {req.status}</p>

          {req.status === 'pending' && (
            <div className="row">
              <button onClick={() => approve(req.id)}>Approve</button>
              <button onClick={() => reject(req.id)}>Reject</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
