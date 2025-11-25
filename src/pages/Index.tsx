import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  // Redirect authenticated users to their dashboard
  if (user) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  // Redirect unauthenticated users to landing page
  return <Navigate to="/landing" replace />;
};

export default Index;
