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

    const { daysToGenerate = 7 } = await req.json().catch(() => ({}));

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

    const userPrompt = `Crie um plano alimentar TOTALMENTE PERSONALIZADO para ${daysToGenerate} dias.

DADOS DO USUÁRIO:
- Sexo: ${profile.gender === "male" ? "Masculino" : "Feminino"}
- Idade: ${profile.age} anos
- Peso: ${profile.weight}kg
- Altura: ${profile.height}cm
- Peso meta: ${profile.target_weight || profile.weight}kg
- Objetivo: ${goalText}
- Nível de atividade: ${profile.activity_level}
- Restrições alimentares: ${restrictions}

CÁLCULOS (Mifflin-St Jeor):
- TMB: ${Math.round(bmr)} kcal
- TDEE: ${Math.round(tdee)} kcal
- Meta calórica diária: ${targetCalories} kcal

DISTRIBUIÇÃO DE MACROS RECOMENDADA:
- Proteína: ${Math.round(profile.weight * (profile.goal === "muscle" ? 2.0 : 1.6))}g (${profile.goal === "muscle" ? "2.0" : "1.6"}g/kg)
- Carboidratos: ${Math.round((targetCalories * 0.45) / 4)}g (~45% das calorias)
- Gorduras: ${Math.round((targetCalories * 0.25) / 9)}g (~25% das calorias)

REQUISITOS:
- 4 refeições por dia: breakfast (Café da manhã), lunch (Almoço), snack (Lanche), dinner (Jantar)
- USE APENAS alimentos universais listados nas regras
- Variar ingredientes entre os dias para evitar monotonia
- Horários realistas para rotina comum

FORMATO JSON OBRIGATÓRIO:
{
  "daily_calories": ${targetCalories},
  "macros": {
    "protein": "${Math.round(profile.weight * (profile.goal === "muscle" ? 2.0 : 1.6))}g",
    "carbs": "${Math.round((targetCalories * 0.45) / 4)}g",
    "fats": "${Math.round((targetCalories * 0.25) / 9)}g"
  },
  "meals": [
    {
      "day": 1,
      "meal_type": "breakfast",
      "name": "Refeição 1",
      "title": "Café da Manhã Proteico",
      "description": "Ex: 3 ovos cozidos e 1 banana com aveia.",
      "time": "07:00",
      "calories": 450,
      "protein": 30,
      "carbs": 45,
      "fat": 15,
      "macros": "P: 30g | C: 45g | G: 15g",
      "items": ["3 ovos cozidos", "1 banana", "40g aveia", "café sem açúcar"]
    }
  ],
  "substitutions": "Lista de trocas simples e equivalentes.",
  "shopping_list": "Lista de compras universal e barata.",
  "final_tips": "Dicas práticas de adesão e consistência."
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
        max_tokens: 4000, // Increased for more detailed meal plans
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
        JSON.stringify({ error: "Failed to save meal plan to database" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Meal plan saved successfully");

    // Log additional plan metadata for debugging
    console.log("Plan metadata:", {
      daily_calories: mealPlan.daily_calories,
      macronutrients: mealPlan.macronutrients,
      has_substitutions: !!mealPlan.substitutions,
      has_shopping_list: !!mealPlan.shopping_list
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Plano alimentar gerado para ${daysToGenerate} dias!`,
        mealsCount: mealsToInsert.length,
        meta: {
          daily_calories: mealPlan.daily_calories || targetCalories,
          macronutrients: mealPlan.macronutrients || null,
          substitutions: mealPlan.substitutions || null,
          shopping_list: mealPlan.shopping_list || null,
          final_tips: mealPlan.final_tips || null
        }
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
