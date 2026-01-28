import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import OpenAI from 'https://esm.sh/openai@4.20.1';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface UserProfile {
  age: number;
  gender: string;
  weight: number;
  height: number;
  target_weight: number | null;
  activity_level: string;
  goal: string;
  dietary_restrictions: string[] | null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authorization required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("Auth error:", userError);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Authenticated user:", user.id);

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("age, gender, weight, height, target_weight, activity_level, goal, dietary_restrictions")
      .eq("user_id", user.id)
      .single();

    if (profileError || !profile) {
      console.error("Profile error:", profileError);
      return new Response(
        JSON.stringify({ error: "Profile not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Limit to 3 days to prevent token truncation and timeout issues
    const { daysToGenerate = 3 } = await req.json().catch(() => ({}));
    const safeDays = Math.min(daysToGenerate, 3); // Cap at 3 to prevent JSON truncation

    // Calculate target calories
    const bmr = profile.gender === "male"
      ? 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5
      : 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161;

    const activityMultipliers: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      very: 1.725,
    };
    const tdee = bmr * (activityMultipliers[profile.activity_level] || 1.2);

    let targetCalories = Math.round(tdee);
    if (profile.goal === "weight-loss") targetCalories -= 500;
    else if (profile.goal === "muscle") targetCalories += 300;

    const restrictions = profile.dietary_restrictions?.join(", ") || "nenhuma";

    // Traditional & Global Sports Nutritionist system prompt
    const systemPrompt = `Você é um Nutricionista Esportivo TRADICIONAL, PRÁTICO e BASEADO EM EVIDÊNCIAS. Seu objetivo é criar planos alimentares SIMPLES, ACESSÍVEIS e UNIVERSAIS. Evite qualquer alimento incomum, regional ou "gourmet".

REGRAS ESTRITAS (NÃO QUEBRE):
- NUNCA crie dietas genéricas ou exóticas
- USE APENAS alimentos universais: Ovos, frango, carne bovina magra, peixes comuns (atum/tilápia), iogurte, leite, arroz, batata, aveia, pão simples, macarrão, azeite, manteiga, amendoim, alface, tomate, cenoura, brócolis, banana, maçã e laranja
- SEM suplementos, medicamentos ou "superfoods" caros
- USE a fórmula Mifflin-St Jeor para todos os cálculos calóricos
- O plano deve parecer algo que um nutricionista experiente realmente prescreveria

ESTILO NUTRICIONAL:
- Foco em praticidade e adesão a longo prazo
- Ingredientes universais fáceis de encontrar em qualquer lugar
- Preparações simples que qualquer pessoa consegue fazer
- Distribuição equilibrada de macros ao longo do dia

ESTRUTURA DAS REFEIÇÕES:
- Café da manhã: proteína + carboidrato complexo + fruta
- Almoço: proteína magra + arroz/batata + legumes + salada
- Lanche: proteína + carboidrato de fácil digestão
- Jantar: proteína + carboidrato moderado + vegetais

Retorne APENAS JSON válido, sem markdown, texto introdutório ou conclusivo.`;

    const goalText = profile.goal === "weight-loss" ? "emagrecer e definir" 
      : profile.goal === "muscle" ? "ganhar massa muscular" 
      : "manter peso e saúde";

    const userPrompt = `Crie um plano alimentar para ${safeDays} dias.

DADOS: Sexo: ${profile.gender === "male" ? "M" : "F"}, ${profile.age} anos, ${profile.weight}kg, ${profile.height}cm, Meta: ${goalText}, Atividade: ${profile.activity_level}, Restrições: ${restrictions}

Meta calórica: ${targetCalories} kcal/dia
Macros: P: ${Math.round(profile.weight * (profile.goal === "muscle" ? 2.0 : 1.6))}g | C: ${Math.round((targetCalories * 0.45) / 4)}g | G: ${Math.round((targetCalories * 0.25) / 9)}g

GERE EXATAMENTE ${safeDays * 4} refeições (${safeDays} dias x 4 refeições: breakfast, lunch, snack, dinner).
Use APENAS: ovos, frango, carne, peixe, arroz, batata, aveia, pão, azeite, amendoim, frutas e vegetais comuns.

RETORNE APENAS JSON (sem texto adicional):
{
  "daily_calories": ${targetCalories},
  "macros": {"protein": "Xg", "carbs": "Xg", "fats": "Xg"},
  "meals": [
    {"day": 1, "meal_type": "breakfast", "title": "Titulo", "time": "07:00", "calories": 450, "protein": 30, "carbs": 45, "fat": 15, "items": ["item1", "item2"]},
    {"day": 1, "meal_type": "lunch", "title": "Titulo", "time": "12:00", "calories": 600, "protein": 40, "carbs": 60, "fat": 20, "items": ["item1", "item2"]},
    {"day": 1, "meal_type": "snack", "title": "Titulo", "time": "16:00", "calories": 300, "protein": 20, "carbs": 30, "fat": 10, "items": ["item1", "item2"]},
    {"day": 1, "meal_type": "dinner", "title": "Titulo", "time": "20:00", "calories": 500, "protein": 35, "carbs": 45, "fat": 18, "items": ["item1", "item2"]}
  ],
  "substitutions": "Trocas simples",
  "shopping_list": "Lista curta",
  "final_tips": "Dicas breves"
}`;

    console.log("Calling OpenAI gpt-4o-mini for meal plan...");
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
        max_tokens: 2500, // Reduced to ensure complete JSON output
        temperature: 0.7,
      });
    } catch (openaiError: any) {
      console.error("OpenAI API error:", JSON.stringify(openaiError, null, 2));
      
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

    const content = response.choices?.[0]?.message?.content;

    if (!content) {
      console.error("No content in AI response");
      return new Response(
        JSON.stringify({ error: "AI returned empty response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Parsing meal plan...");

    let mealPlan;
    try {
      const jsonStr = content.replace(/```json\n?|\n?```/g, "").trim();
      mealPlan = JSON.parse(jsonStr);
    } catch (parseError: any) {
      console.error("JSON parse error:", parseError.message);
      console.error("Raw content (first 500 chars):", content.substring(0, 500));
      return new Response(
        JSON.stringify({ 
          error: "Failed to parse AI response as JSON",
          details: parseError.message,
          preview: content.substring(0, 200)
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate meals array exists
    if (!mealPlan.meals || !Array.isArray(mealPlan.meals) || mealPlan.meals.length === 0) {
      console.error("Invalid meal plan structure:", JSON.stringify(mealPlan).substring(0, 500));
      return new Response(
        JSON.stringify({ error: "Plano inválido gerado. Tente novamente." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Calculate dates for each day
    const today = new Date();
    const mealsToInsert = mealPlan.meals.map((meal: any) => {
      const date = new Date(today);
      date.setDate(today.getDate() + ((meal.day || 1) - 1));
      return {
        user_id: user.id,
        date: date.toISOString().split("T")[0],
        meal_type: meal.meal_type || "snack",
        title: meal.title || "Refeição",
        time: meal.time || "12:00",
        calories: meal.calories || 400,
        protein: meal.protein || 25,
        carbs: meal.carbs || 40,
        fat: meal.fat || 15,
        items: Array.isArray(meal.items) ? meal.items : [],
        completed: false,
      };
    });

    console.log(`Inserting ${mealsToInsert.length} meals...`);

    // Delete existing future meals
    const todayStr = today.toISOString().split("T")[0];
    await supabase
      .from("meals")
      .delete()
      .eq("user_id", user.id)
      .gte("date", todayStr);

    // Insert new meals
    const { error: insertError } = await supabase
      .from("meals")
      .insert(mealsToInsert);

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(
        JSON.stringify({ error: "Erro ao salvar plano. Tente novamente." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Meal plan saved successfully");

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Plano alimentar gerado para ${safeDays} dias!`,
        mealsCount: mealsToInsert.length
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Unexpected error:", error.message);
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
