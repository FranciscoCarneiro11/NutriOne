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

// Get recommended training split based on frequency
function getTrainingSplit(days: number): string {
  switch (days) {
    case 2:
      return "Full Body (2x per week)";
    case 3:
      return "Full Body (3x) or Push/Pull/Legs (PPL)";
    case 4:
      return "Upper/Lower Split (2x each) or Push/Pull/Legs + Full Body";
    case 5:
      return "Push/Pull/Legs + Upper/Lower or 5-day Bro Split";
    case 6:
      return "Push/Pull/Legs x2 (each muscle group twice per week)";
    case 7:
      return "PPL x2 + Active Recovery or Daily specialized training";
    default:
      return "Full Body";
  }
}

// Get day names for the schedule
function getDayNames(numDays: number): string[] {
  const allDays = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
  
  if (numDays >= 7) return allDays;
  
  // Spread workout days evenly through the week
  if (numDays === 6) return ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  if (numDays === 5) return ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];
  if (numDays === 4) return ["Segunda", "Terça", "Quinta", "Sexta"];
  if (numDays === 3) return ["Segunda", "Quarta", "Sexta"];
  if (numDays === 2) return ["Segunda", "Quinta"];
  return ["Segunda"];
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

    // SECURITY: Fetch profile from database instead of trusting client-sent data
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("previous_experience, gender, age, height, weight, target_weight, professional_help, goal, obstacles, body_zones, activity_level, dietary_restrictions, workout_days")
      .eq("user_id", user.id)
      .single();

    if (profileError || !profileData) {
      console.error("Failed to fetch profile:", profileError?.message);
      return new Response(
        JSON.stringify({ error: "Profile not found. Please complete onboarding first." }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const profile: ProfileData = {
      previous_experience: profileData.previous_experience,
      gender: profileData.gender,
      age: profileData.age ?? 25,
      height: profileData.height ?? 170,
      weight: profileData.weight ?? 70,
      target_weight: profileData.target_weight ?? 70,
      professional_help: profileData.professional_help,
      goal: profileData.goal,
      obstacles: profileData.obstacles ?? [],
      body_zones: profileData.body_zones ?? [],
      activity_level: profileData.activity_level,
      dietary_restrictions: profileData.dietary_restrictions ?? [],
      workout_days: profileData.workout_days ?? 3,
    };

    // Ensure workout_days is valid (default to 3 if not specified)
    const workoutDays = Math.min(Math.max(profile.workout_days || 3, 1), 7);
    const trainingSplit = getTrainingSplit(workoutDays);
    const dayNames = getDayNames(workoutDays);
    
    console.log(`User selected ${workoutDays} workout days. Recommended split: ${trainingSplit}`);
    console.log(`Days to generate: ${dayNames.join(", ")}`);
    
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

    // Professional personal trainer system prompt
    const systemPrompt = `Você é um personal trainer profissional especializado em hipertrofia e estética corporal, inspirado em metodologias modernas de musculação brasileira. Foco em divisões bem estruturadas, agrupamento muscular e sobrecarga progressiva.

REGRAS OBRIGATÓRIAS (NÃO QUEBRE):
- NUNCA crie treinos Full Body
- NUNCA crie planos genéricos
- NÃO misture todos os grupos musculares no mesmo dia
- SEMPRE use divisões clássicas de treino (ABC, AB, ABCD) adaptadas à frequência semanal
- O treino deve parecer algo que um personal trainer experiente realmente prescreveria

ESTILO DE TREINO:
- Inspirado em bodybuilding para hipertrofia e estética
- Volume de treino adequado (nem excessivo, nem insuficiente)
- Priorize exercícios compostos no início; exercícios de isolamento no final
- Períodos de descanso adequados entre séries (60-90s para compostos, 45-60s para isolamento)

LÓGICA DE FREQUÊNCIA SEMANAL:
- 2x/semana → Divisão AB (Upper/Lower ou Push/Pull)
- 3x/semana → Divisão ABC (ex: Peito/Tríceps, Costas/Bíceps, Pernas/Ombros)
- 4x/semana → ABCD ou Upper/Lower 2x
- 5x/semana → ABCDE ou Push/Pull/Legs + Upper/Lower
- 6x/semana → Push/Pull/Legs 2x (cada grupo 2x por semana)

Responda APENAS em JSON válido. Gere EXATAMENTE ${workoutDays} sessões de treino para os dias: ${dayNames.join(", ")}.`;

    // Get appropriate split based on days
    const getSplitName = (days: number): string => {
      switch (days) {
        case 2: return "AB";
        case 3: return "ABC";
        case 4: return "ABCD";
        case 5: return "ABCDE";
        case 6: return "Push/Pull/Legs x2";
        case 7: return "PPL + ABCD";
        default: return "ABC";
      }
    };

    const splitName = getSplitName(workoutDays);
    const experienceLevel = profile.previous_experience ? "intermediário/avançado" : "iniciante";

    const userPrompt = `Crie um plano de fitness personalizado:

DADOS DO USUÁRIO:
- Sexo: ${profile.gender === "male" ? "Masculino" : profile.gender === "female" ? "Feminino" : "Não especificado"}
- Idade: ${profile.age} anos
- Altura: ${profile.height}cm
- Peso atual: ${profile.weight}kg → Peso meta: ${profile.target_weight}kg
- Objetivo: ${profile.goal || "fitness"}
- Nível de atividade: ${profile.activity_level || "moderado"}
- Experiência prévia: ${experienceLevel}
- Áreas de foco: ${profile.body_zones?.join(", ") || "corpo inteiro"}
- Restrições alimentares: ${profile.dietary_restrictions?.join(", ") || "nenhuma"}
- Obstáculos: ${profile.obstacles?.join(", ") || "nenhum"}

REQUISITOS DO TREINO:
- Frequência: EXATAMENTE ${workoutDays} dias por semana
- Dias: ${dayNames.join(", ")}
- Divisão recomendada: ${splitName}
- 5-7 exercícios por dia (compostos primeiro, isolamento depois)
- Séries: 3-4 por exercício
- Repetições: 8-12 para hipertrofia, 12-15 para definição
- Descanso: 60-90s para compostos, 45-60s para isolamento

EXEMPLO DE DIVISÃO ABC (3 dias):
- Dia A: Peito + Tríceps (Supino Reto, Supino Inclinado, Crucifixo, Tríceps Corda, Tríceps Francês)
- Dia B: Costas + Bíceps (Puxada Frontal, Remada Baixa, Remada Curvada, Rosca Direta, Rosca Martelo)
- Dia C: Pernas + Ombros (Agachamento, Leg Press, Cadeira Extensora, Desenvolvimento, Elevação Lateral)

Retorne JSON no formato:
{
  "nutrition_plan": {
    "daily_calories": number,
    "macros": {"protein_g": number, "carbs_g": number, "fat_g": number},
    "meals": [{"name": "Café da manhã", "time": "07:00", "calories": number}],
    "recommendations": ["dica1", "dica2"]
  },
  "workout_plan": {
    "split_name": "${splitName}",
    "weekly_schedule": [
      {
        "day": "${dayNames[0]}",
        "focus": "Peito + Tríceps",
        "exercises": [
          {"name": "Supino Reto", "sets": 4, "reps": "8-12", "rest": "90s"}
        ]
      }
    ],
    "recommendations": ["Dica de execução e progressão"],
    "pro_tips": "Aumente a carga progressivamente a cada semana mantendo a técnica perfeita."
  }
}`;

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
        max_tokens: 3500, // Increased for more detailed workout plans
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

    // Validate workout plan has correct number of days
    const generatedDays = plan.workout_plan?.weekly_schedule?.length || 0;
    console.log(`Generated ${generatedDays} workout days (expected ${workoutDays})`);
    
    if (generatedDays !== workoutDays) {
      console.warn(`Day count mismatch: got ${generatedDays}, expected ${workoutDays}`);
      // If AI didn't generate enough days, we still return what we got
      // The frontend will display whatever is in weekly_schedule
    }

    console.log("Plan generated successfully with", generatedDays, "workout days");

    return new Response(
      JSON.stringify({ 
        success: true, 
        nutrition_plan: plan.nutrition_plan,
        workout_plan: {
          ...plan.workout_plan,
          split_name: plan.workout_plan?.split_name || splitName,
          pro_tips: plan.workout_plan?.pro_tips || null
        },
        meta: {
          requested_days: workoutDays,
          generated_days: generatedDays,
          training_split: splitName,
          experience_level: experienceLevel
        }
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
