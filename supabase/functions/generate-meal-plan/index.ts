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
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const openai = new OpenAI({ apiKey: openaiApiKey });

    // Get user from authorization header
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

    // Fetch user profile
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

    const { daysToGenerate = 7 } = await req.json().catch(() => ({}));

    // Calculate target calories based on profile
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

    const systemPrompt = `Você é um nutricionista especializado em criar planos alimentares personalizados. 
Gere planos de refeições saudáveis, variados e práticos para a cultura brasileira.
Sempre retorne APENAS um JSON válido, sem markdown ou texto adicional.`;

    const userPrompt = `Crie um plano alimentar para ${daysToGenerate} dias para uma pessoa com as seguintes características:
- Idade: ${profile.age} anos
- Gênero: ${profile.gender === "male" ? "masculino" : "feminino"}
- Peso atual: ${profile.weight}kg
- Altura: ${profile.height}cm
- Peso alvo: ${profile.target_weight || profile.weight}kg
- Nível de atividade: ${profile.activity_level}
- Objetivo: ${profile.goal === "weight-loss" ? "perda de peso" : profile.goal === "muscle" ? "ganho muscular" : "manutenção"}
- Restrições alimentares: ${restrictions}
- Calorias diárias alvo: ${targetCalories}kcal

Retorne APENAS um JSON no seguinte formato (sem markdown):
{
  "meals": [
    {
      "day": 1,
      "meal_type": "breakfast",
      "title": "Nome da refeição",
      "time": "07:30",
      "calories": 400,
      "protein": 25,
      "carbs": 45,
      "fat": 12,
      "items": ["item1", "item2", "item3"]
    }
  ]
}

Inclua 4 refeições por dia: café da manhã (breakfast), almoço (lunch), jantar (dinner) e lanche (snack).
Varie os pratos entre os dias. Use ingredientes comuns no Brasil.`;

    console.log("Calling OpenAI gpt-4o-mini for meal plan generation...");

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 4000,
    });

    const content = response.choices?.[0]?.message?.content;

    if (!content) {
      console.error("No content in AI response");
      return new Response(
        JSON.stringify({ error: "Resposta inválida da IA" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("AI response received, parsing...");

    // Parse the JSON response (remove any potential markdown)
    let mealPlan;
    try {
      const jsonStr = content.replace(/```json\n?|\n?```/g, "").trim();
      mealPlan = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError, content);
      return new Response(
        JSON.stringify({ error: "Erro ao processar resposta da IA" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Calculate dates for each day
    const today = new Date();
    const mealsToInsert = mealPlan.meals.map((meal: any) => {
      const date = new Date(today);
      date.setDate(today.getDate() + (meal.day - 1));
      return {
        user_id: user.id,
        date: date.toISOString().split("T")[0],
        meal_type: meal.meal_type,
        title: meal.title,
        time: meal.time,
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fat: meal.fat,
        items: meal.items,
        completed: false,
      };
    });

    console.log(`Inserting ${mealsToInsert.length} meals...`);

    // Delete existing future meals for the user before inserting new ones
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
        JSON.stringify({ error: "Erro ao salvar plano alimentar" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Meal plan saved successfully");

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Plano alimentar gerado para ${daysToGenerate} dias!`,
        mealsCount: mealsToInsert.length 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro inesperado" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
