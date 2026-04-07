import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SubscriptionGate({ children }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (!user.is_subscribed) return <Navigate to="/subscription" />;

  return children;
}
