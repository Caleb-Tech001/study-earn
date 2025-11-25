-- Add phone authentication support to profiles
ALTER TABLE public.profiles
ADD COLUMN phone_number TEXT UNIQUE,
ADD COLUMN phone_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN phone_verified_at TIMESTAMPTZ,
ADD COLUMN secondary_email TEXT,
ADD COLUMN secondary_phone TEXT,
ADD COLUMN preferred_auth_method TEXT DEFAULT 'email' CHECK (preferred_auth_method IN ('email', 'phone', 'social'));

-- Create phone verification codes table
CREATE TABLE public.phone_verification_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  code TEXT NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMPTZ NOT NULL,
  attempts INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on phone verification codes
ALTER TABLE public.phone_verification_codes ENABLE ROW LEVEL SECURITY;

-- Create policy for phone verification codes
CREATE POLICY "Users can view their own verification codes"
  ON public.phone_verification_codes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert verification codes"
  ON public.phone_verification_codes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "System can update verification codes"
  ON public.phone_verification_codes FOR UPDATE
  USING (true);

-- Create trusted devices table
CREATE TABLE public.trusted_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  device_fingerprint TEXT NOT NULL,
  device_name TEXT,
  device_type TEXT, -- mobile, tablet, desktop
  ip_address TEXT,
  user_agent TEXT,
  last_used_at TIMESTAMPTZ DEFAULT NOW(),
  trusted_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, device_fingerprint)
);

-- Enable RLS on trusted devices
ALTER TABLE public.trusted_devices ENABLE ROW LEVEL SECURITY;

-- RLS Policies for trusted devices
CREATE POLICY "Users can view their own devices"
  ON public.trusted_devices FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own devices"
  ON public.trusted_devices FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own devices"
  ON public.trusted_devices FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own devices"
  ON public.trusted_devices FOR DELETE
  USING (auth.uid() = user_id);

-- Create account recovery methods table
CREATE TABLE public.account_recovery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recovery_type TEXT NOT NULL CHECK (recovery_type IN ('email', 'phone')),
  recovery_value TEXT NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMPTZ,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on account recovery
ALTER TABLE public.account_recovery ENABLE ROW LEVEL SECURITY;

-- RLS Policies for account recovery
CREATE POLICY "Users can view their own recovery methods"
  ON public.account_recovery FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own recovery methods"
  ON public.account_recovery FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recovery methods"
  ON public.account_recovery FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recovery methods"
  ON public.account_recovery FOR DELETE
  USING (auth.uid() = user_id);

-- Create login history table for security monitoring
CREATE TABLE public.login_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  login_method TEXT NOT NULL CHECK (login_method IN ('email', 'phone', 'google', 'apple')),
  ip_address TEXT,
  user_agent TEXT,
  device_fingerprint TEXT,
  location TEXT,
  success BOOLEAN NOT NULL,
  failure_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on login history
ALTER TABLE public.login_history ENABLE ROW LEVEL SECURITY;

-- RLS Policy for login history
CREATE POLICY "Users can view their own login history"
  ON public.login_history FOR SELECT
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_phone_verification_phone ON public.phone_verification_codes(phone_number);
CREATE INDEX idx_phone_verification_expires ON public.phone_verification_codes(expires_at);
CREATE INDEX idx_trusted_devices_user ON public.trusted_devices(user_id);
CREATE INDEX idx_trusted_devices_fingerprint ON public.trusted_devices(device_fingerprint);
CREATE INDEX idx_account_recovery_user ON public.account_recovery(user_id);
CREATE INDEX idx_login_history_user ON public.login_history(user_id);

-- Create function to cleanup expired verification codes
CREATE OR REPLACE FUNCTION public.cleanup_expired_codes()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.phone_verification_codes
  WHERE expires_at < NOW() AND verified = FALSE;
END;
$$;

-- Create function to update device last used timestamp
CREATE OR REPLACE FUNCTION public.update_device_last_used()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.last_used_at = NOW();
  RETURN NEW;
END;
$$;

-- Create trigger for device last used update
CREATE TRIGGER update_device_last_used_trigger
  BEFORE UPDATE ON public.trusted_devices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_device_last_used();

-- Create trigger for account recovery updated_at
CREATE TRIGGER set_account_recovery_updated_at
  BEFORE UPDATE ON public.account_recovery
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();