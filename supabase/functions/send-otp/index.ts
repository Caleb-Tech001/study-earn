import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SendOTPRequest {
  phone_number: string;
  user_id?: string;
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

    const { phone_number, user_id }: SendOTPRequest = await req.json();

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // OTP expires in 10 minutes
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Store OTP in database
    const { error: insertError } = await supabaseClient
      .from('phone_verification_codes')
      .insert({
        user_id,
        phone_number,
        code: otp,
        expires_at: expiresAt.toISOString(),
      });

    if (insertError) {
      console.error('Error storing OTP:', insertError);
      throw insertError;
    }

    // TODO: Integrate with SMS provider (Twilio, AWS SNS, etc.)
    // For now, we'll log it for development
    console.log(`OTP for ${phone_number}: ${otp}`);
    
    // In production, you would send SMS here:
    // const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    // const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    // const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER');
    
    // await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': 'Basic ' + btoa(`${twilioAccountSid}:${twilioAuthToken}`),
    //     'Content-Type': 'application/x-www-form-urlencoded',
    //   },
    //   body: new URLSearchParams({
    //     To: phone_number,
    //     From: twilioPhoneNumber,
    //     Body: `Your StudyEarn verification code is: ${otp}. Valid for 10 minutes.`,
    //   }),
    // });

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'OTP sent successfully',
        // In development only:
        dev_otp: otp
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in send-otp function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});