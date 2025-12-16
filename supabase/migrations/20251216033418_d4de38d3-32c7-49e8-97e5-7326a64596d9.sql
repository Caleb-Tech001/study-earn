-- Create table to track signup bonuses (prevents duplicate bonuses)
CREATE TABLE public.signup_bonuses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  base_bonus numeric(10,2) NOT NULL DEFAULT 0.05,
  referral_bonus numeric(10,2) NOT NULL DEFAULT 0,
  referral_code text,
  total_bonus numeric(10,2) GENERATED ALWAYS AS (base_bonus + referral_bonus) STORED,
  claimed boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.signup_bonuses ENABLE ROW LEVEL SECURITY;

-- Users can view their own bonus
CREATE POLICY "Users can view their own bonus"
ON public.signup_bonuses
FOR SELECT
USING (auth.uid() = user_id);

-- System can insert bonuses (on signup)
CREATE POLICY "System can insert bonuses"
ON public.signup_bonuses
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own bonus (for claiming)
CREATE POLICY "Users can update their own bonus"
ON public.signup_bonuses
FOR UPDATE
USING (auth.uid() = user_id);

-- Create valid referral codes table
CREATE TABLE public.referral_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  bonus_amount numeric(10,2) NOT NULL DEFAULT 1.00,
  is_active boolean NOT NULL DEFAULT true,
  usage_count integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS (public read for validation)
ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;

-- Anyone can view active referral codes (for validation)
CREATE POLICY "Anyone can view active referral codes"
ON public.referral_codes
FOR SELECT
USING (is_active = true);

-- Insert the CalebTech referral code
INSERT INTO public.referral_codes (code, bonus_amount, is_active)
VALUES ('CalebTech', 1.00, true);