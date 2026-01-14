import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import OpenAI from 'https://esm.sh/openai@4.20.1';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ProfileData {
  previous_experience: boolean | null;
  gender: string | null;
  age: number;
  height: number;
  weight: number;
  target_weight: number;
  professional_help: boolean | null;
  goal: string | null;
  obstacles: string[];
  body_zones: string[];
  activity_level: string | null;
  dietary_restrictions: string[];
  workout_days: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("No authorization header provided");
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error("Authentication failed:", authError?.message);
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Authenticated user:", user.id);

    const { profile } = await req.json() as { profile: ProfileData };
    
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      console.error("OPENAI_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured. Please add OPENAI_API_KEY." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("OpenAI API key found, length:", openaiApiKey.length);

    const openai = new OpenAI({ apiKey: openaiApiKey });

    // Optimized concise prompt for faster response
    const systemPrompt = `You are a fitness AI. Return a compact JSON with nutrition_plan and workout_plan. Be concise.`;

    const userPrompt = `Create a fitness plan for:
Gender: ${profile.gender || "not specified"}, Age: ${profile.age}, Height: ${profile.height}cm, Weight: ${profile.weight}kg, Target: ${profile.target_weight}kg
Goal: ${profile.goal || "fitness"}, Activity: ${profile.activity_level || "moderate"}, Days: ${profile.workout_days}/week
Focus: ${profile.body_zones?.join(", ") || "full body"}, Restrictions: ${profile.dietary_restrictions?.join(", ") || "none"}

Return JSON:
{
  "nutrition_plan": {
    "daily_calories": number,
    "macros": {"protein_g": number, "carbs_g": number, "fat_g": number},
    "meals": [{"name": string, "time": string, "calories": number}],
    "recommendations": [string, string]
  },
  "workout_plan": {
    "weekly_schedule": [{"day": string, "focus": string, "exercises": [{"name": string, "sets": number, "reps": string}]}],
    "recommendations": [string, string]
  }
}

Keep meals to 4 per day, exercises to 4-5 per workout day. Be brief.`;

    console.log("Calling OpenAI gpt-4o-mini...");
    const startTime = Date.now();

    let response;
    try {
      response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
        max_tokens: 2000,
        temperature: 0.7,
      });
    } catch (openaiError: any) {
      console.error("OpenAI API error:", JSON.stringify(openaiError, null, 2));
      
      // Extract detailed error info
      const status = openaiError?.status || openaiError?.response?.status || 500;
      const errorMessage = openaiError?.error?.message || openaiError?.message || "Unknown OpenAI error";
      const errorCode = openaiError?.error?.code || openaiError?.code || "unknown";
      
      let userFriendlyMessage = `OpenAI Error: ${errorMessage}`;
      if (status === 401) {
        userFriendlyMessage = "Invalid API key. Please check your OPENAI_API_KEY.";
      } else if (status === 429) {
        userFriendlyMessage = "Rate limit exceeded or insufficient credits. Please try again later.";
      } else if (status === 500) {
        userFriendlyMessage = "OpenAI service error. Please try again.";
      }
      
      return new Response(
        JSON.stringify({ 
          error: userFriendlyMessage,
          code: errorCode,
          status: status
        }),
        { status: status >= 400 && status < 600 ? status : 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const elapsed = Date.now() - startTime;
    console.log(`OpenAI response received in ${elapsed}ms`);

    const planText = response.choices?.[0]?.message?.content;
    
    if (!planText) {
      console.error("No content in OpenAI response");
      return new Response(
        JSON.stringify({ error: "AI returned empty response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Parsing plan...");

    let plan;
    try {
      plan = JSON.parse(planText);
    } catch (parseError: any) {
      console.error("JSON parse error:", parseError.message);
      console.error("Raw content (first 500 chars):", planText.substring(0, 500));
      return new Response(
        JSON.stringify({ 
          error: "Failed to parse AI response as JSON",
          details: parseError.message,
          preview: planText.substring(0, 200)
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Plan generated successfully");

    return new Response(
      JSON.stringify({ 
        success: true, 
        nutrition_plan: plan.nutrition_plan,
        workout_plan: plan.workout_plan
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Unexpected error in generate-plan:", error.message);
    console.error("Stack:", error.stack?.substring(0, 500));
    return new Response(
      JSON.stringify({ 
        error: error.message || "Unexpected server error",
        type: "server_error"
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
