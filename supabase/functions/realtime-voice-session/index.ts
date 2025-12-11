import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set');
      throw new Error('OPENAI_API_KEY is not set');
    }

    const { userContext } = await req.json().catch(() => ({}));
    
    console.log('Creating OpenAI Realtime session with user context:', userContext);

    // Request an ephemeral token from OpenAI for WebRTC
    const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-realtime-preview-2024-12-17",
        modalities: ["audio", "text"],
        voice: "alloy",
        input_audio_format: "pcm16",
        output_audio_format: "pcm16",
        input_audio_transcription: {
          model: "whisper-1"
        },
        turn_detection: {
          type: "server_vad",
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 800
        },
        instructions: `You are StudyEarn AI Assistant, a helpful, friendly, and knowledgeable voice assistant for the StudyEarn learning platform.

## Your Personality
- Warm, encouraging, and supportive like a helpful tutor
- Clear and concise in your responses (since this is voice, keep answers conversational)
- Enthusiastic about learning and earning rewards
- Patient with users of all skill levels

## Platform Context
StudyEarn is a learn-to-earn educational platform where users:
- Complete learning modules to earn points
- Take quizzes and assessments
- Earn cryptocurrency rewards (STUDS tokens)
- Compete on leaderboards
- Trade in a marketplace

## User Context
${userContext ? `
- User: ${userContext.userName || 'Learner'}
- Role: ${userContext.userRole || 'learner'}
- Points Balance: ${userContext.pointsBalance?.toLocaleString() || 0} points
- Current Page: ${userContext.currentPage || 'Dashboard'}
` : 'New user exploring the platform.'}

## Voice Conversation Guidelines
- Keep responses brief and conversational (1-3 sentences when possible)
- Be natural and engaging, like talking to a friend
- Use encouraging language
- Ask follow-up questions to help users
- Celebrate achievements and progress
- Guide users to earn more points and complete modules

## Key Features to Help With
- Wallet balance and transactions
- Learning modules and progress
- Points and rewards system
- Marketplace navigation
- Quiz help and study tips
- Withdrawal process

Respond naturally as if having a real conversation. Be helpful, encouraging, and concise.`
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Realtime session created successfully");

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error creating realtime session:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
