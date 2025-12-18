/**
 * Food Scanner Service
 * Analyzes food images using OpenAI's gpt-4o-mini vision model.
 */

import { supabase } from "@/integrations/supabase/client";

export interface FoodAnalysisResult {
  title: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  items: string[];
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
}

/**
 * Converts a File to a Base64 string
 */
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Analyzes a food image and returns nutritional information.
 * @param file - The image file to analyze
 * @returns Promise with the analysis result
 */
export async function analyzeFoodImage(file: File): Promise<FoodAnalysisResult> {
  // Convert file to base64
  const imageBase64 = await fileToBase64(file);

  // Call the Edge Function
  const { data, error } = await supabase.functions.invoke('analyze-food', {
    body: { imageBase64 }
  });

  if (error) {
    console.error("Error calling analyze-food function:", error);
    throw new Error(error.message || "Erro ao analisar imagem");
  }

  if (!data || data.error) {
    console.error("Error in analyze-food response:", data?.error);
    throw new Error(data?.error || "Erro ao processar resposta da IA");
  }

  // Validate the response structure
  const result: FoodAnalysisResult = {
    title: data.title || "Refeição não identificada",
    calories: Number(data.calories) || 0,
    protein: Number(data.protein) || 0,
    carbs: Number(data.carbs) || 0,
    fat: Number(data.fat) || 0,
    items: Array.isArray(data.items) ? data.items : [],
    mealType: ["breakfast", "lunch", "dinner", "snack"].includes(data.mealType) 
      ? data.mealType 
      : "snack"
  };

  return result;
}
