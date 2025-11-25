import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VerifyOTPRequest {
  phone_number: string;
  code: string;
  device_fingerprint?: string;
  trust_device?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { 
      phone_number, 
      code, 
      device_fingerprint,
      trust_device 
    }: VerifyOTPRequest = await req.json();

    // Check for valid OTP
    const { data: otpData, error: otpError } = await supabaseClient
      .from('phone_verification_codes')
      .select('*')
      .eq('phone_number', phone_number)
      .eq('code', code)
      .eq('verified', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (otpError || !otpData) {
      // Increment attempts
      await supabaseClient
        .from('phone_verification_codes')
        .update({ attempts: otpData?.attempts ? otpData.attempts + 1 : 1 })
        .eq('phone_number', phone_number)
        .eq('code', code);

      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid or expired OTP'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Check attempt limit
    if (otpData.attempts >= 5) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Too many failed attempts. Please request a new OTP.'
        }),
        {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Mark OTP as verified
    const { error: updateError } = await supabaseClient
      .from('phone_verification_codes')
      .update({ verified: true })
      .eq('id', otpData.id);

    if (updateError) {
      throw updateError;
    }

    // Update profile if user exists
    if (otpData.user_id) {
      await supabaseClient
        .from('profiles')
        .update({ 
          phone_number,
          phone_verified: true,
          phone_verified_at: new Date().toISOString()
        })
        .eq('id', otpData.user_id);

      // Add trusted device if requested
      if (trust_device && device_fingerprint) {
        const userAgent = req.headers.get('user-agent') || '';
        const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '';
        
        await supabaseClient
          .from('trusted_devices')
          .insert({
            user_id: otpData.user_id,
            device_fingerprint,
            user_agent: userAgent,
            ip_address: ipAddress,
            device_name: 'Trusted Device',
            // Device trust expires in 30 days
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          });
      }
    }

    // Cleanup old codes
    await supabaseClient
      .from('phone_verification_codes')
      .delete()
      .eq('phone_number', phone_number)
      .neq('id', otpData.id);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Phone number verified successfully',
        user_id: otpData.user_id
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in verify-otp function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});