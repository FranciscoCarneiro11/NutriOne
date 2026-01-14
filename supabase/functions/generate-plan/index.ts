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
    // Validate authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("No authorization header provided");
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client and verify the user
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
      throw new Error("OPENAI_API_KEY is not configured");
    }

    const openai = new OpenAI({ apiKey: openaiApiKey });

    const systemPrompt = `You are a professional nutritionist and personal trainer. Generate a personalized fitness and nutrition plan based on the user's profile data. Return a JSON object with two keys: "nutrition_plan" and "workout_plan".

The nutrition_plan should include:
- daily_calories: number
- macros: { protein_g: number, carbs_g: number, fat_g: number }
- meals: array of { name: string, time: string, calories: number, description: string }
- recommendations: array of strings with dietary tips

The workout_plan should include:
- weekly_schedule: array of { day: string, focus: string, exercises: array of { name: string, sets: number, reps: string, rest: string } }
- recommendations: array of strings with workout tips

Be realistic and base recommendations on the user's goals, activity level, and restrictions.`;

    const userPrompt = `Generate a personalized plan for this user:
- Gender: ${profile.gender || "not specified"}
- Age: ${profile.age} years
- Height: ${profile.height} cm
- Current Weight: ${profile.weight} kg
- Target Weight: ${profile.target_weight} kg
- Goal: ${profile.goal || "general fitness"}
- Activity Level: ${profile.activity_level || "moderate"}
- Workout Days Available: ${profile.workout_days} days/week
- Body Zones to Focus: ${profile.body_zones?.join(", ") || "full body"}
- Obstacles: ${profile.obstacles?.join(", ") || "none mentioned"}
- Dietary Restrictions: ${profile.dietary_restrictions?.join(", ") || "none"}
- Has Professional Help: ${profile.professional_help ? "Yes" : "No"}
- Previous App Experience: ${profile.previous_experience ? "Yes" : "No"}

Please generate a complete, practical plan in JSON format.`;

    console.log("Calling OpenAI gpt-4o-mini to generate plan for user:", user.id);

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      max_tokens: 4000,
    });

    const planText = response.choices?.[0]?.message?.content;
    
    if (!planText) {
      throw new Error("No plan generated from AI");
    }

    console.log("AI response received, parsing plan...");

    let plan;
    try {
      plan = JSON.parse(planText);
    } catch (e) {
      console.error("Failed to parse AI response as JSON:", planText);
      throw new Error("Failed to parse generated plan");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        nutrition_plan: plan.nutrition_plan,
        workout_plan: plan.workout_plan
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in generate-plan function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
