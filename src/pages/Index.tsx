import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

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

  // Redirect unauthenticated users to welcome page
  return <Navigate to="/welcome" replace />;
};

export default Index;
