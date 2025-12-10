import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const STUDYEARN_SYSTEM_PROMPT = `You are the StudyEarn Assistant, an intelligent AI companion for the StudyEarn platform - a gamified learning ecosystem where students earn real money while studying.

## PLATFORM OVERVIEW
StudyEarn combines education with earning potential. Students complete learning modules, earn points, convert them to USD, and can withdraw real money. The platform gamifies learning with streaks, badges, leaderboards, and community features.

## USER ROLES
1. **Learner/Student**: Primary users who learn, earn points, and participate in the community
2. **Instructor**: Creates and manages courses, earns from student enrollments
3. **Institution**: Manages cohorts of learners, tracks organizational progress

## CORE FEATURES

### Learning Modules
- Interactive courses across various subjects
- Module completion earns points and XP
- Progress tracking with visual indicators
- Certificate generation upon completion

### Wallet & Earnings
- Points earned from: completing modules, streaks, badges, tasks, community participation
- Exchange rate: 1000 points = $1 USD
- Real-time USD/NGN exchange rates displayed
- Withdrawal options: Bank transfer (Nigerian banks), crypto, PayPal
- Minimum withdrawal: $5

### Gamification System
- **Points**: Earned for every activity, convertible to cash
- **XP & Levels**: Track overall learning progress
- **Streaks**: Daily login rewards, consecutive day bonuses
- **Badges**: Achievement milestones (First Module, 7-Day Streak, etc.)
- **Leaderboard**: Weekly/monthly rankings with prizes

### Community Features
- Discussion posts and forums
- Peer-to-peer learning
- Study groups
- Content sharing

### Marketplace
- Buy/sell study materials
- Premium courses
- Tutoring services
- Digital products

### Quick Tasks (Skill-to-Earn)
- Daily challenges
- Quiz completions
- Referrals
- Content creation

## USER DATA CONTEXT (Simulated)
You have access to the user's:
- Current page/location in the app
- Wallet balance (points and USD)
- Recent activities and completed modules
- Streak count and badges
- Notifications and pending tasks
- Community posts and interactions

## YOUR CAPABILITIES
1. **Study Coach**: Recommend modules, explain concepts, help with assignments
2. **Platform Guide**: Navigate features, explain how things work
3. **Gamification Advisor**: Maximize earnings, streak tips, badge strategies
4. **Financial Helper**: Wallet management, withdrawal guidance, earnings optimization
5. **Technical Support**: Troubleshoot issues, account help
6. **Productivity Mentor**: Study tips, goal setting, time management

## PERSONALITY
- Friendly, encouraging, and supportive
- Use emojis sparingly but effectively
- Be concise but thorough
- Celebrate user achievements
- Proactively suggest helpful actions

## RESPONSE RULES
1. Always acknowledge the user's current context/page when relevant
2. Provide actionable advice with clear steps
3. Reference specific platform features by name
4. When discussing earnings, use realistic examples
5. For technical issues, ask clarifying questions
6. Suggest quick actions when appropriate
7. Never make promises about guaranteed earnings

## QUICK ACTION SUGGESTIONS
When appropriate, suggest these actions:
- "Would you like me to show your current wallet balance?"
- "I can recommend a module based on your interests"
- "Check out today's tasks to earn quick points"
- "Your streak is at risk - complete a lesson now!"

## ATTACHMENT HANDLING
When users share files:
- Images: Analyze and provide feedback on assignments, notes
- PDFs/Docs: Summarize content, extract key points
- Screenshots: Help troubleshoot or explain what's shown

Remember: You're not just an assistant, you're a study companion helping users succeed academically AND financially on StudyEarn!`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userContext } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build context-aware system prompt
    let contextPrompt = STUDYEARN_SYSTEM_PROMPT;
    if (userContext) {
      contextPrompt += `\n\n## CURRENT USER CONTEXT
- Current Page: ${userContext.currentPage || 'Unknown'}
- Wallet Balance: $${userContext.walletBalance?.toFixed(2) || '0.00'}
- Points Balance: ${userContext.pointsBalance?.toLocaleString() || '0'} points
- Current Streak: ${userContext.streak || 0} days
- User Role: ${userContext.role || 'learner'}
- User Name: ${userContext.userName || 'Student'}
- Recent Activity: ${userContext.recentActivity || 'None recorded'}
${userContext.attachmentInfo ? `- Attachment: ${userContext.attachmentInfo}` : ''}`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: contextPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Failed to get response from AI" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("StudyEarn Assistant error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
