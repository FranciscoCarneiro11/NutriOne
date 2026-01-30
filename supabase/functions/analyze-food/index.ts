import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import OpenAI from 'https://esm.sh/openai@4.20.1';

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
    // Validate authentication
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

    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      console.error("No image provided");
      return new Response(
        JSON.stringify({ error: "Image is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.error("OPENAI_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "OpenAI API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const openai = new OpenAI({ apiKey: openaiApiKey });

    console.log("Analyzing food image with OpenAI gpt-4o-mini...");

    let response;
    try {
      response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an AI specialized in nutritional food analysis from images, focusing on REALISTIC and EVIDENCE-BASED estimates (USDA, EFSA, TACO).

STRICT RULES (DO NOT BREAK):
1. Estimation Only: Always state that values are estimates, not exact weights.
2. Conservative Averages: If in doubt, choose conservative average values.
3. Global Foods: Use simple, globally known foods. Avoid rare or highly regional ingredients.
4. No Fabricated Data: Base every calculation on recognized nutritional databases.

OUTPUT FORMAT: Return ONLY a valid JSON object. No text before or after.
{
  "title": "Nome da refeição em português",
  "calories": number,
  "protein": number (gramas),
  "carbs": number (gramas),
  "fat": number (gramas),
  "mealType": "breakfast" | "lunch" | "dinner" | "snack",
  "items": ["alimento 1 com quantidade estimada", "alimento 2 com quantidade estimada"],
  "identified_foods": [
    { "food": "Nome do alimento", "amount_g": number, "kcal": number }
  ],
  "disclaimer": "Os valores são estimativas baseadas em análise visual. Para precisão total, use uma balança."
}`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analise esta imagem de comida. Identifique os alimentos visíveis e estime suas quantidades em gramas. Calcule calorias e macronutrientes usando dados de tabelas nutricionais reconhecidas (USDA, TACO). Determine se é café da manhã, almoço, jantar ou lanche. Seja conservador nas estimativas.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64.startsWith('data:') ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
        max_tokens: 1200,
      });
    } catch (openaiError: any) {
      console.error("OpenAI API error:", openaiError);
      const status = openaiError?.status || 500;
      const message = openaiError?.message || "OpenAI API error";
      const code = openaiError?.code || "unknown";
      return new Response(
        JSON.stringify({ 
          error: `OpenAI Error (${status}): ${message}`,
          code: code,
          details: openaiError?.error?.message || message
        }),
        { status: status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const content = response.choices?.[0]?.message?.content;

    if (!content) {
      console.error("No content in AI response");
      return new Response(
        JSON.stringify({ error: "No analysis result from AI" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Raw AI response:", content);

    // Parse the JSON response
    let foodData;
    try {
      // Try to extract JSON from the response (in case there's extra text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        foodData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      return new Response(
        JSON.stringify({ error: "Failed to parse AI response", rawContent: content.substring(0, 200) }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Parsed food data:", foodData);

    return new Response(
      JSON.stringify(foodData),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Error in analyze-food function:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "An unexpected error occurred",
        stack: error?.stack?.substring(0, 300)
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
