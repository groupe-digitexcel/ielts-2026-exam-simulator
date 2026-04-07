import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();
  const { login } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    const { data } = await API.post('/auth/register', form);
    login(data.token, data.user);
    navigate('/dashboard');
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={submit} className="form">
        <input placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Email" type="email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Password" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}
