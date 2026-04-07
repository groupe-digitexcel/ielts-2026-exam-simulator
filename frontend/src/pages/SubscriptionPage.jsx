import { useEffect, useState } from 'react';
import API from '../api';
import { useAuth } from '../context/AuthContext';

export default function SubscriptionPage() {
  const [info, setInfo] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('MoMo');
  const [transactionRef, setTransactionRef] = useState('');
  const { fetchMe } = useAuth();

  useEffect(() => {
    API.get('/subscription/info').then((res) => setInfo(res.data));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await API.post('/subscription/request', { paymentMethod, transactionRef });
    alert('Subscription request sent. Wait for admin approval.');
    fetchMe();
  };

  return (
    <div className="container">
      <h2>Premium Subscription</h2>

      {info && (
        <div className="card">
          <p><strong>MoMo:</strong> {info.momo.name} - {info.momo.number}</p>
          <p><strong>Orange Money:</strong> {info.orangeMoney.name} - {info.orangeMoney.number}</p>
        </div>
      )}

      <form onSubmit={submit} className="form">
        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <option value="MoMo">MoMo</option>
          <option value="Orange Money">Orange Money</option>
        </select>
        <input
          placeholder="Transaction Reference"
          value={transactionRef}
          onChange={(e) => setTransactionRef(e.target.value)}
        />
        <button type="submit">Submit Subscription Request</button>
      </form>
    </div>
  );
}
