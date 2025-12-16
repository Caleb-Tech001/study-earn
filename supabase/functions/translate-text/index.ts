import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { texts, targetLanguage, sourceLanguage = "en" } = await req.json();

    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      return new Response(
        JSON.stringify({ error: "texts array is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!targetLanguage) {
      return new Response(
        JSON.stringify({ error: "targetLanguage is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (targetLanguage === sourceLanguage) {
      return new Response(
        JSON.stringify({ translations: texts }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Use faster flash-lite model and larger batches for speed
    const batchSize = 50;
    const batches: string[][] = [];
    for (let i = 0; i < texts.length; i += batchSize) {
      batches.push(texts.slice(i, i + batchSize));
    }

    // Process all batches in parallel for speed
    const batchPromises = batches.map(async (batch) => {
      const prompt = `Translate from ${sourceLanguage} to ${targetLanguage}. Return ONLY a JSON array of translated strings, same order. Keep numbers/formatting intact.

${JSON.stringify(batch)}`;

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-lite",
          messages: [
            { role: "system", content: "You are a fast translator. Return ONLY valid JSON arrays." },
            { role: "user", content: prompt },
          ],
        }),
      });

      if (!response.ok) {
        console.error(`AI error: ${response.status}`);
        return batch;
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "";
      
      try {
        const cleanContent = content.replace(/```json\n?|\n?```/g, "").trim();
        const translations = JSON.parse(cleanContent);
        return Array.isArray(translations) ? translations : batch;
      } catch {
        console.error("Parse failed:", content.substring(0, 100));
        return batch;
      }
    });

    const results = await Promise.all(batchPromises);
    const allTranslations = results.flat();

    return new Response(
      JSON.stringify({ translations: allTranslations }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Translation error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Translation failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
