import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string, role: string, referralCode?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithProvider: (provider: 'google' | 'apple', role?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<{ error: any }>;
  updatePassword: (newPassword: string) => Promise<{ error: any }>;
  updateProfile: (updates: any) => Promise<{ error: any }>;
  verifyOTP: (email: string, token: string) => Promise<{ error: any }>;
  resendOTP: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, role: string, referralCode?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          role,
          referral_code: referralCode || null
        }
      }
    });

    // If signup successful and we have a user, store referral info for later processing
    if (!error && data.user && referralCode) {
      // Get referral bonus amount if valid code
      const { data: refData } = await supabase
        .from('referral_codes')
        .select('id, code, bonus_amount, usage_count')
        .ilike('code', referralCode.trim())
        .eq('is_active', true)
        .maybeSingle();
      
      if (refData) {
        // Store signup bonus info in localStorage for WalletContext to process
        localStorage.setItem('pending_signup_bonus', JSON.stringify({
          userId: data.user.id,
          baseBonus: 100, // $100 base signup bonus
          referralBonus: Number(refData.bonus_amount),
          referralCode: refData.code, // Use the actual code from DB
          timestamp: Date.now()
        }));
        
        // Increment usage count using the exact code from database
        await supabase
          .from('referral_codes')
          .update({ usage_count: (refData.usage_count || 0) + 1 })
          .eq('id', refData.id);
      } else {
        // No valid referral, just base bonus
        localStorage.setItem('pending_signup_bonus', JSON.stringify({
          userId: data.user.id,
          baseBonus: 100, // $100 base signup bonus
          referralBonus: 0,
          referralCode: null,
          timestamp: Date.now()
        }));
      }
    } else if (!error && data.user) {
      // No referral code, just base bonus
      localStorage.setItem('pending_signup_bonus', JSON.stringify({
        userId: data.user.id,
        baseBonus: 100, // $100 base signup bonus
        referralBonus: 0,
        referralCode: null,
        timestamp: Date.now()
      }));
    }
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    return { error };
  };

  const signInWithProvider = async (provider: 'google' | 'apple', role?: string) => {
    const redirectUrl = `${window.location.origin}/auth/callback`;
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectUrl,
        queryParams: role ? {
          role: role
        } : undefined
      }
    });
    
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: 'Sign Out Failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const sendPasswordResetEmail = async (email: string) => {
    const redirectUrl = `${window.location.origin}/reset-password`;
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl
    });
    
    return { error };
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    return { error };
  };

  const updateProfile = async (updates: any) => {
    if (!user) return { error: { message: 'No user logged in' } };
    
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);
    
    return { error };
  };

  const verifyOTP = async (email: string, token: string) => {
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email'
    });
    
    return { error };
  };

  const resendOTP = async (email: string) => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email
    });
    
    return { error };
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isLoading,
      signUp,
      signIn,
      signInWithProvider,
      signOut,
      sendPasswordResetEmail,
      updatePassword,
      updateProfile,
      verifyOTP,
      resendOTP
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};