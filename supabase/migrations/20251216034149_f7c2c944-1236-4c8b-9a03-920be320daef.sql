-- Allow authenticated users to increment usage_count on referral codes
CREATE POLICY "Anyone can increment usage count"
ON public.referral_codes
FOR UPDATE
USING (is_active = true)
WITH CHECK (is_active = true);