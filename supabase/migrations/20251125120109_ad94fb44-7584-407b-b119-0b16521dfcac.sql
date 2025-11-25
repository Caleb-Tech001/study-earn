-- Add INSERT policy for login_history table
-- Only allow service role to insert (users cannot insert their own records)
CREATE POLICY "Only service role can insert login history"
ON public.login_history
FOR INSERT
WITH CHECK (false);

-- Note: Service role bypasses RLS, so edge functions and backend services
-- can still insert records while preventing client-side manipulation