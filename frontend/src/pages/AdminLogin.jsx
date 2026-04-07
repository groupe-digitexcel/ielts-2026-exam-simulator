import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const { login } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    const { data } = await API.post('/auth/login', form);

    if (data.user.role !== 'admin') {
      alert('Not an admin account');
      return;
    }

    login(data.token, data.user);
    navigate('/admin');
  };

  return (
    <div className="container">
      <h2>Admin Login</h2>
      <form onSubmit={submit} className="form">
        <input placeholder="Admin Email" type="email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Password" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button type="submit">Login as Admin</button>
      </form>
    </div>
  );
}
