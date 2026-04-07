import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="container">
      <h2>Welcome, {user?.name}</h2>
      <p>Email: {user?.email}</p>
      <p>Subscription: {user?.is_subscribed ? 'Active Premium' : 'Not Subscribed'}</p>
    </div>
  );
}
