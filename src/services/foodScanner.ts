/**
 * Food Scanner Service
 * Analyzes food images and returns nutritional data.
 * Currently uses mock data - ready for real AI integration.
 */

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
 * Analyzes a food image and returns nutritional information.
 * @param file - The image file to analyze
 * @returns Promise with the analysis result
 */
export async function analyzeFoodImage(file: File): Promise<FoodAnalysisResult> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Mock responses based on random selection to simulate variety
  const mockResponses: FoodAnalysisResult[] = [
    {
      title: "Frango Grelhado com Salada",
      calories: 350,
      protein: 35,
      carbs: 12,
      fat: 18,
      items: ["Peito de frango", "Alface", "Tomate", "Azeite"],
      mealType: "lunch",
    },
    {
      title: "Açaí com Granola",
      calories: 420,
      protein: 8,
      carbs: 65,
      fat: 15,
      items: ["Açaí", "Granola", "Banana", "Mel"],
      mealType: "snack",
    },
    {
      title: "Omelete de Legumes",
      calories: 280,
      protein: 18,
      carbs: 8,
      fat: 20,
      items: ["Ovos", "Espinafre", "Tomate", "Queijo"],
      mealType: "breakfast",
    },
    {
      title: "Salmão com Batata Doce",
      calories: 480,
      protein: 32,
      carbs: 35,
      fat: 22,
      items: ["Salmão", "Batata doce", "Brócolis", "Limão"],
      mealType: "dinner",
    },
    {
      title: "Sanduíche Natural",
      calories: 320,
      protein: 22,
      carbs: 28,
      fat: 14,
      items: ["Pão integral", "Frango desfiado", "Alface", "Cenoura"],
      mealType: "lunch",
    },
  ];

  // Return a random mock response
  const randomIndex = Math.floor(Math.random() * mockResponses.length);
  return mockResponses[randomIndex];
}
