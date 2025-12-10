import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Landing from './Landing';

const Index = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  // Redirect authenticated users to their dashboard
  if (user) {
    const userRole = user.user_metadata?.role || 'learner';
    return <Navigate to={`/${userRole}/dashboard`} replace />;
  }

  // Show landing page for unauthenticated users
  return <Landing />;
};

export default Index;
