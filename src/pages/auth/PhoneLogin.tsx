import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PublicLayout } from '@/layouts/PublicLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { generateDeviceFingerprint } from '@/utils/deviceFingerprint';
import { GraduationCap, Phone, ArrowLeft } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const PhoneLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const countryCodes = [
    { code: '+1', country: 'US/Canada' },
    { code: '+44', country: 'UK' },
    { code: '+234', country: 'Nigeria' },
    { code: '+254', country: 'Kenya' },
    { code: '+27', country: 'South Africa' },
    { code: '+91', country: 'India' },
    { code: '+86', country: 'China' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullPhoneNumber = `${countryCode}${phoneNumber}`;

    setIsLoading(true);
    try {
      // Check if device is trusted
      const deviceFingerprint = await generateDeviceFingerprint();
      
      // First, check if user exists with this phone number
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, user_id:id')
        .eq('phone_number', fullPhoneNumber)
        .single();

      if (profileError || !profileData) {
        toast({
          title: 'Phone Not Found',
          description: 'No account found with this phone number',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      // Check if device is trusted
      const { data: deviceData } = await supabase.functions.invoke('check-trusted-device', {
        body: {
          user_id: profileData.id,
          device_fingerprint: deviceFingerprint
        }
      });

      if (deviceData?.is_trusted) {
        // Skip OTP for trusted device
        toast({
          title: 'Trusted Device',
          description: 'Logging you in...',
        });
        
        // Sign in directly (requires custom auth flow)
        navigate('/');
      } else {
        // Send OTP for verification
        const { data, error } = await supabase.functions.invoke('send-otp', {
          body: { 
            phone_number: fullPhoneNumber,
            user_id: profileData.id
          }
        });

        if (error) throw error;

        toast({
          title: 'OTP Sent',
          description: 'Check your phone for the verification code',
        });

        navigate('/verify-phone-login', { 
          state: { 
            phone_number: fullPhoneNumber,
            user_id: profileData.id,
            dev_otp: data.dev_otp
          } 
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send OTP',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PublicLayout showNav={false}>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 px-4 py-12">
        <div className="w-full max-w-md animate-fade-in">
          {/* Back button */}
          <Link 
            to="/login" 
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>

          {/* Logo */}
          <div className="mb-8 text-center">
            <Link to="/" className="mb-6 inline-flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="font-display text-2xl font-bold">StudyEarn</span>
            </Link>
            <h1 className="mb-2 font-display text-4xl font-bold">Sign In with Phone</h1>
            <p className="text-muted-foreground">
              Enter your phone number to continue
            </p>
          </div>

          <Card className="border-2 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Phone Number */}
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <div className="mt-2 flex gap-2">
                  <Select value={countryCode} onValueChange={setCountryCode}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {countryCodes.map((item) => (
                        <SelectItem key={item.code} value={item.code}>
                          {item.code} {item.country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="5551234567"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full gradient-primary text-lg shadow-primary"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? 'Sending Code...' : 'Continue'}
              </Button>

              <div className="space-y-3">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or sign in with</span>
                  </div>
                </div>

                <Link to="/login">
                  <Button type="button" variant="outline" className="w-full">
                    Sign in with Email
                  </Button>
                </Link>
              </div>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">Don't have an account? </span>
                <Link to="/choose-role" className="font-medium text-primary hover:underline">
                  Sign up
                </Link>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
};

export default PhoneLogin;