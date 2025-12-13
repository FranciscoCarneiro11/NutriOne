import React, { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppShell, AppHeader, AppContent } from "@/components/layout/AppShell";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { AddMealModal, MealPrefillData } from "@/components/dashboard/AddMealModal";
import { FoodScannerModal } from "@/components/scanner/FoodScannerModal";
import { Clock, Flame, ChevronRight, Check, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { FoodAnalysisResult } from "@/services/foodScanner";

interface WeekDay {
  day: number;
  label: string;
  date: string;
  completed: boolean;
  isToday: boolean;
}

interface MealItem {
  id: string;
  title: string;
  time: string | null;
  calories: number;
  items: string[];
  completed: boolean;
}

const WEEK_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const Diet: React.FC = () => {
  const queryClient = useQueryClient();
  const [isAddMealOpen, setIsAddMealOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [mealPrefillData, setMealPrefillData] = useState<MealPrefillData | null>(null);

  // Generate dynamic week days based on current date
  const weekDays = useMemo<WeekDay[]>(() => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday
    const todayStr = today.toISOString().split("T")[0];
    
    // Start from Monday of current week
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((currentDay + 6) % 7));
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];
      const dayOfWeek = date.getDay();
      
      return {
        day: i + 1,
        label: WEEK_LABELS[dayOfWeek],
        date: dateStr,
        completed: false, // Will be updated based on meals data
        isToday: dateStr === todayStr,
      };
    });
  }, []);

  const todayDate = useMemo(() => new Date().toISOString().split("T")[0], []);

  // Fetch meals for today
  const { data: meals = [], isLoading } = useQuery({
    queryKey: ["meals", todayDate],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("meals")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", todayDate)
        .order("time", { ascending: true });

      if (error) {
        console.error("Error fetching meals:", error);
        return [];
      }

      return (data || []).map((m) => ({
        id: m.id,
        title: m.title,
        time: m.time,
        calories: m.calories,
        items: m.items || [],
        completed: m.completed || false,
      })) as MealItem[];
    },
  });

  // Toggle meal completion mutation
  const toggleMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const { error } = await supabase
        .from("meals")
        .update({ completed })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals", todayDate] });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a refeição",
        variant: "destructive",
      });
    },
  });

  const toggleMealComplete = useCallback((id: string) => {
    const meal = meals.find((m) => m.id === id);
    if (meal) {
      toggleMutation.mutate({ id, completed: !meal.completed });
    }
  }, [meals, toggleMutation]);

  const handleMealAdded = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["meals", todayDate] });
  }, [queryClient, todayDate]);

  // Calculate dynamic values
  const completedCount = weekDays.filter((d) => d.isToday && meals.some((m) => m.completed)).length || 
    weekDays.filter((d) => d.completed).length;
  const totalCalories = meals.reduce((acc, meal) => acc + meal.calories, 0);
  const consumedCalories = meals.filter((m) => m.completed).reduce((acc, meal) => acc + meal.calories, 0);

  return (
    <AppShell>
      <AppHeader title="Plano Alimentar" />

      <AppContent className="pb-28">
        <p className="text-muted-foreground mb-6">Semana 1 de 12</p>

        {/* Week Progress Card */}
        <div className="bg-card rounded-2xl p-4 shadow-card border border-border mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold text-foreground">Progresso da Semana</span>
            <span className="text-primary font-semibold">{completedCount}/7 dias</span>
          </div>
          
          <div className="flex justify-between">
            {weekDays.map((day) => (
              <div key={day.day} className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all",
                    day.completed
                      ? "bg-primary text-primary-foreground"
                      : day.isToday
                      ? "border-2 border-primary text-primary"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {day.completed ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    day.day
                  )}
                </div>
                <span className={cn(
                  "text-xs",
                  day.isToday ? "text-primary font-semibold" : "text-muted-foreground"
                )}>
                  {day.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Summary */}
        <div className="bg-primary rounded-2xl p-5 shadow-card mb-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-primary-foreground/80 text-sm">Consumo de Hoje</span>
              <h3 className="text-2xl font-bold text-primary-foreground">
                {consumedCalories} <span className="text-lg font-normal">/ {totalCalories} kcal</span>
              </h3>
            </div>
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
              <Flame className="w-7 h-7 text-primary-foreground" />
            </div>
          </div>
          <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white rounded-full transition-all"
              style={{ width: `${(consumedCalories / totalCalories) * 100}%` }}
            />
          </div>
        </div>

        {/* Meals List */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Refeições de Hoje</h3>
          <button 
            className="text-primary text-sm font-medium flex items-center gap-1"
            onClick={() => setIsAddMealOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Adicionar
          </button>
        </div>
        
        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">
            Carregando...
          </div>
        ) : meals.length === 0 ? (
          <div className="py-8 text-center bg-muted/30 rounded-2xl">
            <p className="text-muted-foreground">Nenhuma refeição registada hoje</p>
            <button 
              className="text-primary text-sm font-medium mt-2"
              onClick={() => setIsAddMealOpen(true)}
            >
              Adicionar sua primeira refeição
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {meals.map((meal) => (
              <div
                key={meal.id}
                className={cn(
                  "bg-card rounded-2xl p-4 shadow-card border border-border flex items-center gap-4 transition-opacity",
                  meal.completed && "opacity-60"
                )}
              >
                <button
                  onClick={() => toggleMealComplete(meal.id)}
                  disabled={toggleMutation.isPending}
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                    meal.completed 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-coral-light text-primary"
                  )}
                >
                  {meal.completed ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <Clock className="w-6 h-6" />
                  )}
                </button>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className={cn(
                      "font-semibold",
                      meal.completed ? "text-muted-foreground line-through" : "text-foreground"
                    )}>
                      {meal.title}
                    </h4>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {meal.time || "--:--"} · {meal.calories} kcal
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {meal.items.slice(0, 3).map((item, i) => (
                      <span key={i} className="text-xs text-muted-foreground">
                        {item}{i < Math.min(meal.items.length, 3) - 1 && ","}
                      </span>
                    ))}
                    {meal.items.length > 3 && (
                      <span className="text-xs text-muted-foreground">+{meal.items.length - 3}</span>
                    )}
                  </div>
                </div>
                
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            ))}
          </div>
        )}
      </AppContent>

      <BottomNavigation onScanClick={() => setIsScannerOpen(true)} />

      <AddMealModal
        open={isAddMealOpen}
        onOpenChange={(open) => {
          setIsAddMealOpen(open);
          if (!open) setMealPrefillData(null);
        }}
        onMealAdded={handleMealAdded}
        prefillData={mealPrefillData}
      />

      <FoodScannerModal
        open={isScannerOpen}
        onOpenChange={setIsScannerOpen}
        onAnalysisComplete={(result: FoodAnalysisResult) => {
          setMealPrefillData({
            title: result.title,
            calories: result.calories,
            protein: result.protein,
            carbs: result.carbs,
            fat: result.fat,
            items: result.items,
            mealType: result.mealType,
          });
          setIsAddMealOpen(true);
        }}
      />
    </AppShell>
  );
};

export default Diet;
