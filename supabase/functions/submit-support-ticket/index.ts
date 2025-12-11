import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SupportTicketRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

function generateTicketId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SE-${timestamp}-${random}`;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, subject, message }: SupportTicketRequest = await req.json();

    // Validate inputs
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Generate unique ticket ID
    const ticketId = generateTicketId();

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Store ticket in database
    const { error: dbError } = await supabase
      .from("support_tickets")
      .insert({
        ticket_id: ticketId,
        name,
        email,
        subject,
        message,
        status: "open",
      });

    if (dbError) {
      console.error("Database error:", dbError);
      return new Response(
        JSON.stringify({ error: "Failed to create ticket" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Send email notification to support team
    try {
      const supportEmailResult = await resend.emails.send({
        from: "StudyEarn Support <onboarding@resend.dev>",
        to: ["studyearnservices@gmail.com"],
        subject: `[Ticket: ${ticketId}] ${subject}`,
        html: `
          <h2>New Support Ticket</h2>
          <p><strong>Ticket ID:</strong> ${ticketId}</p>
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr />
          <h3>Message:</h3>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <hr />
          <p><em>Reply to this email or contact the user at ${email}</em></p>
        `,
      });
      console.log("Support email result:", JSON.stringify(supportEmailResult));
    } catch (emailError: any) {
      console.error("Failed to send support team email:", emailError?.message || emailError);
      // Continue - don't fail the request if email fails
    }

    // Send confirmation email to user
    try {
      const userEmailResult = await resend.emails.send({
        from: "StudyEarn Support <onboarding@resend.dev>",
        to: [email],
        subject: `Your StudyEarn Support Ticket: ${ticketId}`,
        html: `
          <h2>Thank you for contacting StudyEarn Support!</h2>
          <p>Hi ${name},</p>
          <p>We have received your support request and created a ticket for you.</p>
          <p><strong>Your Ticket ID:</strong> <code style="background: #f4f4f4; padding: 4px 8px; border-radius: 4px; font-size: 16px;">${ticketId}</code></p>
          <p>Please save this Ticket ID for future reference. You can use it to check the status of your request on our Help page.</p>
          <hr />
          <h3>Your Message:</h3>
          <p><strong>Subject:</strong> ${subject}</p>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <hr />
          <p>Our team will review your request and get back to you as soon as possible.</p>
          <p>Best regards,<br>The StudyEarn Team</p>
        `,
      });
      console.log("User confirmation email result:", JSON.stringify(userEmailResult));
    } catch (emailError: any) {
      console.error("Failed to send user confirmation email:", emailError?.message || emailError);
      // Continue - don't fail the request if email fails
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        ticketId,
        message: "Support ticket created successfully" 
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Error in submit-support-ticket function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
