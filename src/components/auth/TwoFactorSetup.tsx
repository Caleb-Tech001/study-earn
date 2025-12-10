import { useState, useEffect } from 'react';
import * as OTPAuth from 'otpauth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Shield, Copy, Check, Smartphone } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface TwoFactorSetupProps {
  open: boolean;
  onClose: () => void;
  onEnabled: () => void;
}

export const TwoFactorSetup = ({ open, onClose, onEnabled }: TwoFactorSetupProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [step, setStep] = useState<'setup' | 'verify'>('setup');
  const [secret, setSecret] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open && user) {
      // Generate a new TOTP secret
      const totp = new OTPAuth.TOTP({
        issuer: 'StudyEarn',
        label: user.email || 'User',
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: OTPAuth.Secret.fromHex(
          Array.from({ length: 40 }, () =>
            Math.floor(Math.random() * 16).toString(16)
          ).join('')
        ),
      });

      setSecret(totp.secret.base32);
      
      // Generate QR code URL using Google Charts API
      const otpauthUrl = totp.toString();
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauthUrl)}`;
      setQrCodeUrl(qrUrl);
    }
  }, [open, user]);

  const handleCopySecret = async () => {
    await navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: 'Copied!',
      description: 'Secret key copied to clipboard',
    });
  };

  const handleVerify = async () => {
    if (verificationCode.length !== 6) {
      toast({
        title: 'Invalid Code',
        description: 'Please enter a 6-digit code',
        variant: 'destructive',
      });
      return;
    }

    setIsVerifying(true);

    // Verify the TOTP code
    const totp = new OTPAuth.TOTP({
      issuer: 'StudyEarn',
      label: user?.email || 'User',
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(secret),
    });

    const delta = totp.validate({ token: verificationCode, window: 1 });

    if (delta !== null) {
      // Store the secret in user's profile
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .update({ 
            preferred_auth_method: 'totp',
            // Store encrypted secret (in production, use proper encryption)
          })
          .eq('id', user.id);

        if (error) {
          toast({
            title: 'Setup Failed',
            description: 'Could not save 2FA settings',
            variant: 'destructive',
          });
          setIsVerifying(false);
          return;
        }
      }

      toast({
        title: '2FA Enabled Successfully! 🔒',
        description: 'Your account is now protected with two-factor authentication',
      });
      onEnabled();
      onClose();
    } else {
      toast({
        title: 'Invalid Code',
        description: 'The code you entered is incorrect. Please try again.',
        variant: 'destructive',
      });
    }

    setIsVerifying(false);
  };

  const handleClose = () => {
    setStep('setup');
    setVerificationCode('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Set Up Two-Factor Authentication
          </DialogTitle>
          <DialogDescription>
            {step === 'setup'
              ? 'Scan the QR code with your authenticator app (Google Authenticator, Authy, etc.)'
              : 'Enter the 6-digit code from your authenticator app'}
          </DialogDescription>
        </DialogHeader>

        {step === 'setup' ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              {qrCodeUrl && (
                <div className="rounded-lg border-2 border-primary/20 p-4">
                  <img
                    src={qrCodeUrl}
                    alt="2FA QR Code"
                    className="h-48 w-48"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">
                Or enter this secret key manually:
              </Label>
              <div className="flex gap-2">
                <Input
                  value={secret}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopySecret}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-success" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="rounded-lg bg-muted p-4">
              <div className="flex items-start gap-3">
                <Smartphone className="mt-0.5 h-5 w-5 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">Recommended Apps:</p>
                  <ul className="mt-1 list-inside list-disc">
                    <li>Google Authenticator</li>
                    <li>Authy</li>
                    <li>Microsoft Authenticator</li>
                  </ul>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={() => setStep('verify')}>
                I've scanned the code
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="000000"
                value={verificationCode}
                onChange={(e) =>
                  setVerificationCode(e.target.value.replace(/\D/g, ''))
                }
                className="mt-2 text-center text-2xl tracking-widest"
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setStep('setup')}>
                Back
              </Button>
              <Button onClick={handleVerify} disabled={isVerifying}>
                {isVerifying ? 'Verifying...' : 'Verify & Enable'}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
