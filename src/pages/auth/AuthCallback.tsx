import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the session from the URL hash
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (session) {
          // Check if user has completed profile setup
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', session.user.id)
            .single();

          // Get role from query params or session metadata
          const urlParams = new URLSearchParams(window.location.search);
          const role = urlParams.get('role') || session.user.user_metadata?.role || 'learner';

          if (!profile?.full_name) {
            // Redirect to profile setup if no name
            navigate('/profile-setup', { state: { role } });
          } else {
            // User is fully set up, go to dashboard
            const userRole = session.user.user_metadata?.role || 'learner';
            toast({
              title: 'Welcome back!',
              description: 'Successfully signed in',
            });
            navigate(`/${userRole}/dashboard`);
          }
        } else {
          // No session, redirect to login
          navigate('/login');
        }
      } catch (error: any) {
        console.error('Auth callback error:', error);
        toast({
          title: 'Authentication Error',
          description: error.message || 'Failed to complete sign in',
          variant: 'destructive',
        });
        navigate('/login');
      }
    };

    handleCallback();
  }, [navigate, toast]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="text-center">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg font-medium">Completing sign in...</p>
        <p className="mt-2 text-sm text-muted-foreground">Please wait while we set up your account</p>
      </div>
    </div>
  );
};

export default AuthCallback;