import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PublicLayout } from '@/layouts/PublicLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { generateDeviceFingerprint, getDeviceName } from '@/utils/deviceFingerprint';
import { GraduationCap, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const VerifyPhone = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signUp } = useAuth();
  const { toast } = useToast();
  
  const phone_number = location.state?.phone_number;
  const role = location.state?.role;
  const devOtp = location.state?.dev_otp; // For development
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [trustDevice, setTrustDevice] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!phone_number) {
      navigate('/choose-role');
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phone_number, navigate]);

  useEffect(() => {
    // Auto-focus first input
    inputRefs.current[0]?.focus();
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
    const newOtp = pastedData.slice(0, 6).split('');
    setOtp([...newOtp, ...Array(6 - newOtp.length).fill('')]);
    
    if (newOtp.length > 0) {
      inputRefs.current[Math.min(newOtp.length, 5)]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      toast({
        title: 'Invalid Code',
        description: 'Please enter all 6 digits',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const deviceFingerprint = await generateDeviceFingerprint();

      // Verify OTP
      const { data, error } = await supabase.functions.invoke('verify-otp', {
        body: { 
          phone_number,
          code: otpCode,
          device_fingerprint: trustDevice ? deviceFingerprint : undefined,
          trust_device: trustDevice
        }
      });

      if (error || !data.success) {
        throw new Error(data?.error || 'Verification failed');
      }

      // Create user account with phone number
      const tempEmail = `${phone_number.replace(/\+/g, '')}@phone.studyearn.app`;
      const tempPassword = crypto.randomUUID();

      const { error: signUpError } = await signUp(tempEmail, tempPassword, role);

      if (signUpError) {
        throw signUpError;
      }

      toast({
        title: 'Phone Verified!',
        description: 'Your phone number has been verified successfully',
      });

      navigate('/profile-setup', { state: { role, phone_number } });
    } catch (error: any) {
      toast({
        title: 'Verification Failed',
        description: error.message || 'Invalid or expired code',
        variant: 'destructive',
      });
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.functions.invoke('send-otp', {
        body: { phone_number }
      });

      if (error) throw error;

      toast({
        title: 'Code Resent',
        description: 'A new verification code has been sent',
      });

      setCountdown(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to resend code',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PublicLayout showNav={false}>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 px-4">
        <div className="w-full max-w-md animate-fade-in">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-primary">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="mb-2 font-display text-4xl font-bold">Verify Your Phone</h1>
            <p className="text-muted-foreground">
              We sent a code to <span className="font-semibold">{phone_number}</span>
            </p>
            {devOtp && (
              <p className="mt-2 rounded-lg bg-primary/10 p-2 text-sm text-primary">
                Dev OTP: {devOtp}
              </p>
            )}
          </div>

          <Card className="border-2 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* OTP Input */}
              <div>
                <div className="flex justify-center gap-2">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className="h-14 w-12 text-center text-2xl font-bold"
                    />
                  ))}
                </div>
              </div>

              {/* Trust Device */}
              <div className="flex items-start gap-2">
                <Checkbox
                  id="trust"
                  checked={trustDevice}
                  onCheckedChange={(checked) => setTrustDevice(checked as boolean)}
                />
                <label
                  htmlFor="trust"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  <div className="flex items-center gap-1">
                    <Shield className="h-4 w-4 text-primary" />
                    <span>Trust this device for 30 days</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    You won't need to verify your phone on this device for 30 days
                  </p>
                </label>
              </div>

              {/* Verify Button */}
              <Button
                type="submit"
                className="w-full gradient-primary text-lg shadow-primary"
                size="lg"
                disabled={isLoading || otp.join('').length !== 6}
              >
                {isLoading ? 'Verifying...' : 'Verify Phone'}
              </Button>

              {/* Resend */}
              <div className="text-center">
                {canResend ? (
                  <Button
                    type="button"
                    variant="link"
                    onClick={handleResend}
                    disabled={isLoading}
                  >
                    Resend Code
                  </Button>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Resend code in {countdown}s
                  </p>
                )}
              </div>
            </form>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
};

export default VerifyPhone;