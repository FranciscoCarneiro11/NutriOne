import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppShell, AppHeader, AppContent } from "@/components/layout/AppShell";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { AddMealModal, MealPrefillData } from "@/components/dashboard/AddMealModal";
import { FoodScannerModal } from "@/components/scanner/FoodScannerModal";
import { Clock, Flame, ChevronRight, Check, Plus, Sparkles, Beef, Wheat, Droplet, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { FoodAnalysisResult } from "@/services/foodScanner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Animated meal card component with per-meal macros
interface AnimatedMealCardProps {
  meal: MealItem;
  index: number;
  onToggle: () => void;
  onDelete: () => void;
  isPending: boolean;
  isDeleting: boolean;
}

const AnimatedMealCard: React.FC<AnimatedMealCardProps> = ({ meal, index, onToggle, onDelete, isPending, isDeleting }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const prevCompletedRef = useRef(meal.completed);

  useEffect(() => {
    if (prevCompletedRef.current !== meal.completed) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 400);
      prevCompletedRef.current = meal.completed;
      return () => clearTimeout(timer);
    }
  }, [meal.completed]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 400);
    onToggle();
  };

  return (
    <div
      className={cn(
        "bg-card rounded-2xl shadow-card border border-border transition-all duration-300",
        meal.completed && "opacity-70 bg-muted/50",
        isAnimating && (meal.completed ? "animate-pulse ring-2 ring-primary/50" : "animate-pulse ring-2 ring-muted-foreground/30")
      )}
    >
      <div className="flex items-center gap-4 p-4">
        <button
          onClick={handleToggle}
          disabled={isPending}
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0",
            meal.completed 
              ? "bg-primary text-primary-foreground" 
              : "bg-coral-light text-primary hover:scale-105",
            isAnimating && "scale-110"
          )}
        >
          {meal.completed ? (
            <Check className={cn(
              "w-6 h-6 transition-all duration-300",
              isAnimating ? "scale-110" : "scale-100"
            )} />
          ) : (
            <Clock className="w-6 h-6" />
          )}
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className={cn(
              "font-semibold transition-all duration-300",
              meal.completed ? "text-muted-foreground line-through" : "text-foreground"
            )}>
              {meal.title}
            </h4>
          </div>
          <div className={cn(
            "flex items-center gap-1 mt-0.5",
            meal.completed ? "text-muted-foreground" : "text-primary"
          )}>
            <Flame className="w-4 h-4" />
            <span className="text-sm font-medium">{meal.calories} kcal</span>
          </div>
        </div>
        
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-full hover:bg-muted transition-all"
        >
          <ChevronRight className={cn(
            "w-5 h-5 text-muted-foreground transition-transform duration-200",
            isExpanded && "rotate-90"
          )} />
        </button>
      </div>

      {/* Per-meal macros - always visible */}
      <div className="px-4 pb-3 flex gap-3">
        <div className="flex items-center gap-1 text-xs">
          <Beef className="w-3.5 h-3.5 text-red-500" />
          <span className="text-muted-foreground">{meal.protein}g</span>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <Wheat className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-muted-foreground">{meal.carbs}g</span>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <Droplet className="w-3.5 h-3.5 text-blue-500" />
          <span className="text-muted-foreground">{meal.fat}g</span>
        </div>
      </div>

      {/* Expanded content with items and delete button */}
      <div className={cn(
        "overflow-hidden transition-all duration-300 ease-out",
        isExpanded ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="px-4 pb-4 pt-0 border-t border-border">
          <div className="pt-3">
            <p className="text-sm text-muted-foreground mb-3">
              {meal.items.length > 0 ? meal.items.join(", ") : "Sem itens registados"}
            </p>
            
            {/* Delete button */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button 
                  className="flex items-center gap-1.5 text-xs text-destructive hover:text-destructive/80 transition-colors"
                  disabled={isDeleting}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {isDeleting ? "A eliminar..." : "Eliminar refeição"}
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Eliminar refeição?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja eliminar "{meal.title}"? Esta ação não pode ser revertida.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={onDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
};

interface WeekDay {
  day: number;
  label: string;
  date: string;
  isToday: boolean;
}

interface MealItem {
  id: string;
  title: string;
  time: string | null;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  items: string[];
  completed: boolean;
  meal_type: string;
}

const WEEK_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const Diet: React.FC = () => {
  const queryClient = useQueryClient();
  const [isAddMealOpen, setIsAddMealOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [mealPrefillData, setMealPrefillData] = useState<MealPrefillData | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);
  const [selectedDate, setSelectedDate] = useState(todayStr);

  // Generate dynamic week days based on current date
  const weekDays = useMemo<WeekDay[]>(() => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday
    
    // Start from Monday of current week
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((currentDay + 6) % 7));
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];
      const dayOfWeek = date.getDay();
      
      return {
        day: date.getDate(),
        label: WEEK_LABELS[dayOfWeek],
        date: dateStr,
        isToday: dateStr === todayStr,
      };
    });
  }, [todayStr]);

  // Fetch meals for selected date
  const { data: meals = [], isLoading } = useQuery({
    queryKey: ["meals", selectedDate],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("meals")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", selectedDate)
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
        protein: Number(m.protein) || 0,
        carbs: Number(m.carbs) || 0,
        fat: Number(m.fat) || 0,
        items: m.items || [],
        completed: m.completed || false,
        meal_type: m.meal_type,
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
      queryClient.invalidateQueries({ queryKey: ["meals", selectedDate] });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a refeição",
        variant: "destructive",
      });
    },
  });

  // Delete meal mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("meals")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals", selectedDate] });
      toast({
        title: "Refeição eliminada",
        description: "A refeição foi removida com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível eliminar a refeição",
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

  const handleDeleteMeal = useCallback((id: string) => {
    deleteMutation.mutate(id);
  }, [deleteMutation]);

  const handleMealAdded = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["meals", selectedDate] });
  }, [queryClient, selectedDate]);

  const handleGenerateMealPlan = async () => {
    setIsGeneratingPlan(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-meal-plan', {
        body: { daysToGenerate: 7 },
      });

      if (error) {
        console.error("Edge function error:", error);
        toast({
          title: "Erro",
          description: error.message || "Não foi possível gerar o plano",
          variant: "destructive",
        });
        return;
      }

      if (data?.error) {
        toast({
          title: "Erro",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sucesso!",
        description: data?.message || "Plano alimentar gerado com sucesso!",
      });

      // Refresh meals
      queryClient.invalidateQueries({ queryKey: ["meals"] });
    } catch (err: any) {
      console.error("Failed to generate meal plan:", err);
      toast({
        title: "Erro",
        description: err?.message || "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  // Calculate dynamic values
  const totalCalories = meals.reduce((acc, meal) => acc + meal.calories, 0);
  const consumedCalories = meals.filter((m) => m.completed).reduce((acc, meal) => acc + meal.calories, 0);

  // Format selected date for display
  const selectedDateFormatted = useMemo(() => {
    const date = new Date(selectedDate + 'T12:00:00');
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  }, [selectedDate]);

  const isViewingToday = selectedDate === todayStr;

  return (
    <AppShell>
      <AppHeader title="Plano Alimentar" />

      <AppContent className="pb-28">
        {/* Weekly Calendar Selector */}
        <div className="bg-card rounded-2xl p-4 shadow-card border border-border mb-6">
          <div className="flex justify-between">
            {weekDays.map((day) => (
              <button 
                key={day.date} 
                onClick={() => setSelectedDate(day.date)}
                className="flex flex-col items-center gap-1"
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all",
                    selectedDate === day.date
                      ? "bg-primary text-primary-foreground"
                      : day.isToday
                      ? "border-2 border-primary text-primary"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {day.day}
                </div>
                <span className={cn(
                  "text-xs",
                  selectedDate === day.date || day.isToday ? "text-primary font-semibold" : "text-muted-foreground"
                )}>
                  {day.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Day's Summary */}
        <div className="bg-primary rounded-2xl p-5 shadow-card mb-6">
          <p className="text-primary-foreground/80 text-sm capitalize mb-1">{selectedDateFormatted}</p>
          <div className="flex items-center justify-between">
            <div>
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
              style={{ width: `${totalCalories > 0 ? (consumedCalories / totalCalories) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Meals List */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">
            {isViewingToday ? "Refeições de Hoje" : "Refeições do Dia"}
          </h3>
          {isViewingToday && (
            <button 
              className="text-primary text-sm font-medium flex items-center gap-1"
              onClick={() => setIsAddMealOpen(true)}
            >
              <Plus className="w-4 h-4" />
              Adicionar
            </button>
          )}
        </div>
        
        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">
            Carregando...
          </div>
        ) : meals.length === 0 ? (
          <div className="py-8 text-center bg-muted/30 rounded-2xl">
            <p className="text-muted-foreground">Nenhuma refeição registada</p>
            {isViewingToday && (
              <button 
                className="text-primary text-sm font-medium mt-2"
                onClick={() => setIsAddMealOpen(true)}
              >
                Adicionar sua primeira refeição
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {meals.map((meal, index) => (
              <AnimatedMealCard
                key={meal.id}
                meal={meal}
                index={index + 1}
                onToggle={() => toggleMealComplete(meal.id)}
                onDelete={() => handleDeleteMeal(meal.id)}
                isPending={toggleMutation.isPending}
                isDeleting={deleteMutation.isPending}
              />
            ))}
          </div>
        )}

        {/* Regenerate Weekly Plan Button */}
        <div className="mt-8">
          <Button
            onClick={handleGenerateMealPlan}
            disabled={isGeneratingPlan}
            className="w-full bg-foreground text-background hover:bg-foreground/90"
            size="lg"
          >
            <Sparkles className={cn("w-5 h-5 mr-2", isGeneratingPlan && "animate-spin")} />
            {isGeneratingPlan ? "A gerar plano..." : "Regenerar Plano Semanal"}
          </Button>
        </div>
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