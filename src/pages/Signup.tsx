import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { PublicLayout } from '@/layouts/PublicLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { GraduationCap, Mail, Lock, Eye, EyeOff, ArrowLeft, Loader2, Gift, CheckCircle2 } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signUp, signInWithProvider } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [referralValid, setReferralValid] = useState<boolean | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'apple' | null>(null);
  
  const selectedRole = (location.state?.role as string) || null;

  // Validate referral code
  const validateReferralCode = async (code: string) => {
    if (!code.trim()) {
      setReferralValid(null);
      return;
    }
    
    const { data } = await supabase
      .from('referral_codes')
      .select('code')
      .ilike('code', code.trim())
      .eq('is_active', true)
      .single();
    
    setReferralValid(!!data);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRole) {
      toast({
        title: 'Role Required',
        description: 'Please go back and select a role',
        variant: 'destructive',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please make sure both passwords are the same',
        variant: 'destructive',
      });
      return;
    }

    if (!agreeToTerms) {
      toast({
        title: 'Terms Required',
        description: 'Please agree to the terms of service',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Pass referral code in metadata
      const { error } = await signUp(email, password, selectedRole, referralCode.trim() || undefined);
      
      if (error) {
        if (error.message.includes('already registered')) {
          toast({
            title: 'Email Already Exists',
            description: 'This email is already registered. Please sign in instead.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Signup Failed',
            description: error.message,
            variant: 'destructive',
          });
        }
      } else {
        // Calculate bonus amount for toast message
        const baseBonus = 0.05;
        const referralBonus = referralValid ? 1.00 : 0;
        const totalBonus = baseBonus + referralBonus;
        
        toast({
          title: 'Welcome to StudyEarn! 🎉',
          description: `Your account has been created. You received $${totalBonus.toFixed(2)} signup bonus!`,
        });
        navigate('/profile-setup', { state: { role: selectedRole, referralCode: referralCode.trim() } });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = async (provider: 'google' | 'apple') => {
    if (!selectedRole) {
      toast({
        title: 'Role Required',
        description: 'Please go back and select a role',
        variant: 'destructive',
      });
      return;
    }

    setSocialLoading(provider);
    try {
      const { error } = await signInWithProvider(provider, selectedRole);
      
      if (error) {
        toast({
          title: 'Sign Up Failed',
          description: error.message,
          variant: 'destructive',
        });
      }
      // OAuth redirect happens automatically
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <PublicLayout showNav={false}>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 px-4 py-12">
        <div className="w-full max-w-md animate-fade-in">
          {/* Back button */}
          <Link 
            to="/choose-role" 
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>

          {/* Logo */}
          <div className="mb-8 text-center">
            <Link to="/" className="mb-6 inline-flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="font-display text-2xl font-bold">StudyEarn</span>
            </Link>
            <h1 className="mb-2 font-display text-4xl font-bold">Create Your Account</h1>
            <p className="text-muted-foreground">
              {selectedRole && (
                <span className="inline-flex items-center gap-1">
                  Signing up as <span className="font-semibold capitalize">{selectedRole}</span>
                </span>
              )}
            </p>
          </div>

          <Card className="border-2 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Must be at least 8 characters
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Referral Code */}
              <div>
                <Label htmlFor="referralCode">Referral Code (Optional)</Label>
                <div className="relative mt-2">
                  <Gift className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="referralCode"
                    type="text"
                    placeholder="Enter referral code for bonus"
                    value={referralCode}
                    onChange={(e) => {
                      setReferralCode(e.target.value);
                      validateReferralCode(e.target.value);
                    }}
                    className={`pl-10 pr-10 ${
                      referralValid === true ? 'border-success' : 
                      referralValid === false ? 'border-destructive' : ''
                    }`}
                  />
                  {referralValid === true && (
                    <CheckCircle2 className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-success" />
                  )}
                </div>
                {referralValid === true && (
                  <p className="mt-1 text-xs text-success">Valid code! You'll get $1 bonus!</p>
                )}
                {referralValid === false && (
                  <p className="mt-1 text-xs text-destructive">Invalid referral code</p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  New users get $0.05 signup bonus. With valid referral: $1.05 total!
                </p>
              </div>

              {/* Terms checkbox */}
              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                />
                <label
                  htmlFor="terms"
                  className="text-xs leading-tight peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the{' '}
                  <Link to="/legal" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/legal" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full gradient-primary text-lg shadow-primary"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>

              <Link to="/phone-signup" state={{ role: selectedRole }} className="block mt-3">
                <Button type="button" variant="outline" className="w-full">
                  Sign up with Phone
                </Button>
              </Link>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">Already have an account? </span>
                <Link to="/login" className="font-medium text-primary hover:underline">
                  Sign in instead
                </Link>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Signup;
