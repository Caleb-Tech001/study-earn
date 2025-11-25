import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CheckDeviceRequest {
  user_id: string;
  device_fingerprint: string;
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

    const { user_id, device_fingerprint }: CheckDeviceRequest = await req.json();

    // Check if device is trusted
    const { data, error } = await supabaseClient
      .from('trusted_devices')
      .select('*')
      .eq('user_id', user_id)
      .eq('device_fingerprint', device_fingerprint)
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      throw error;
    }

    const isTrusted = !!data;

    // Update last_used_at if device is trusted
    if (isTrusted) {
      await supabaseClient
        .from('trusted_devices')
        .update({ last_used_at: new Date().toISOString() })
        .eq('id', data.id);
    }

    return new Response(
      JSON.stringify({ 
        is_trusted: isTrusted,
        device_info: isTrusted ? {
          device_name: data.device_name,
          last_used: data.last_used_at,
          trusted_since: data.trusted_at
        } : null
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in check-trusted-device function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});