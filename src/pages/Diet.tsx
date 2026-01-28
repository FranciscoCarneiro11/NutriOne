import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppShell, AppHeader, AppContent } from "@/components/layout/AppShell";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { AddMealModal, MealPrefillData } from "@/components/dashboard/AddMealModal";
import { FoodScannerModal } from "@/components/scanner/FoodScannerModal";
import { Clock, Flame, ChevronRight, Check, Plus, Sparkles, Beef, Wheat, Droplet, Trash2, SkipForward, Utensils } from "lucide-react";
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
  onSkip: () => void;
  onDelete: () => void;
  isPending: boolean;
  isDeleting: boolean;
}

const AnimatedMealCard: React.FC<AnimatedMealCardProps> = ({ meal, index, onToggle, onSkip, onDelete, isPending, isDeleting }) => {
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
        meal.skipped && "opacity-60 bg-muted/30",
        isAnimating && (meal.completed ? "animate-pulse ring-2 ring-primary/50" : "animate-pulse ring-2 ring-muted-foreground/30")
      )}
    >
      <div className="flex items-center gap-4 p-4">
        <button
          onClick={handleToggle}
          disabled={isPending || meal.skipped}
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0",
            meal.completed 
              ? "bg-primary text-primary-foreground" 
              : meal.skipped
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-coral-light text-primary hover:scale-105",
            isAnimating && "scale-110"
          )}
        >
          {meal.completed ? (
            <Check className={cn(
              "w-6 h-6 transition-all duration-300",
              isAnimating ? "scale-110" : "scale-100"
            )} />
          ) : meal.skipped ? (
            <SkipForward className="w-5 h-5" />
          ) : (
            <Clock className="w-6 h-6" />
          )}
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className={cn(
              "font-semibold transition-all duration-300",
              meal.completed ? "text-muted-foreground line-through" : 
              meal.skipped ? "text-muted-foreground line-through" : "text-foreground"
            )}>
              {meal.title}
            </h4>
            {meal.skipped && (
              <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                Saltada
              </span>
            )}
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
            
            {/* Action buttons */}
            <div className="flex items-center gap-4">
              {/* Skip button - only show if not completed or skipped */}
              {!meal.completed && !meal.skipped && (
                <button 
                  onClick={onSkip}
                  disabled={isPending}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                  Saltar refeição
                </button>
              )}
              
              {/* Delete button */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button 
                    className="flex items-center gap-1.5 text-xs text-destructive hover:text-destructive/80 transition-colors"
                    disabled={isDeleting}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {isDeleting ? "A eliminar..." : "Eliminar"}
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
  skipped: boolean;
  meal_type: string;
}

// Daily Progress Tracker Component
interface DailyProgressTrackerProps {
  meals: MealItem[];
}

const DailyProgressTracker: React.FC<DailyProgressTrackerProps> = ({ meals }) => {
  const completedCount = meals.filter(m => m.completed).length;
  const skippedCount = meals.filter(m => m.skipped).length;
  const remainingCount = meals.length - completedCount - skippedCount;
  const totalMeals = meals.length;

  // Generate motivational message
  const getMessage = () => {
    if (totalMeals === 0) {
      return "Adicione refeições ao seu plano para começar!";
    }
    if (completedCount === totalMeals) {
      return "Incrível! Completaste 100% do teu plano alimentar hoje! 🌟";
    }
    if (completedCount === 0 && skippedCount === 0) {
      return "Bom dia! Pronto para começar o plano de hoje?";
    }
    if (skippedCount > 0 && completedCount < totalMeals) {
      return `Não desistas! Ainda podes completar ${remainingCount} refeição${remainingCount > 1 ? "ões" : ""} hoje.`;
    }
    return `Excelente! Faltam apenas ${remainingCount} refeição${remainingCount > 1 ? "ões" : ""} para bateres a meta.`;
  };

  if (totalMeals === 0) return null;

  return (
    <div className="bg-card rounded-2xl p-4 shadow-card border border-border mb-6">
      {/* Meal Progress Icons */}
      <div className="flex items-center justify-center gap-3 mb-3">
        {meals.map((meal, index) => (
          <div key={meal.id} className="flex flex-col items-center gap-1">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                meal.completed
                  ? "bg-primary text-primary-foreground"
                  : meal.skipped
                  ? "bg-muted text-muted-foreground"
                  : "border-2 border-border bg-background text-muted-foreground"
              )}
            >
              {meal.completed ? (
                <Check className="w-5 h-5" />
              ) : meal.skipped ? (
                <SkipForward className="w-4 h-4" />
              ) : (
                <Utensils className="w-4 h-4" />
              )}
            </div>
            <span className="text-[10px] text-muted-foreground truncate max-w-[48px]">
              {index + 1}
            </span>
          </div>
        ))}
      </div>

      {/* Motivational Message */}
      <p className={cn(
        "text-sm text-center",
        completedCount === totalMeals ? "text-primary font-medium" : "text-muted-foreground"
      )}>
        {getMessage()}
      </p>
    </div>
  );
};

const WEEK_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const Diet: React.FC = () => {
  const queryClient = useQueryClient();
  const [isAddMealOpen, setIsAddMealOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [mealPrefillData, setMealPrefillData] = useState<MealPrefillData | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [isBackgroundGenerating, setIsBackgroundGenerating] = useState(false);
  const [hasPlanError, setHasPlanError] = useState(false);

  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);
  const [selectedDate, setSelectedDate] = useState(todayStr);

  // Check for background generation status
  useEffect(() => {
    const checkBackgroundGeneration = () => {
      const inProgress = localStorage.getItem("planGenerationInProgress") === "true";
      const failed = localStorage.getItem("planGenerationFailed") === "true";
      setIsBackgroundGenerating(inProgress);
      setHasPlanError(failed);
    };

    checkBackgroundGeneration();
    // Poll for updates while generating
    const interval = setInterval(() => {
      checkBackgroundGeneration();
      // Refetch meals if background generation completed
      if (!isBackgroundGenerating) {
        queryClient.invalidateQueries({ queryKey: ["meals"] });
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [isBackgroundGenerating, queryClient]);

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
        skipped: m.skipped || false,
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

  // Skip meal mutation
  const skipMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("meals")
        .update({ skipped: true, completed: false })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals", selectedDate] });
      toast({
        title: "Refeição saltada",
        description: "Não desistas! Foca-te na próxima refeição.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível saltar a refeição",
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

  const handleSkipMeal = useCallback((id: string) => {
    skipMutation.mutate(id);
  }, [skipMutation]);

  const handleDeleteMeal = useCallback((id: string) => {
    deleteMutation.mutate(id);
  }, [deleteMutation]);

  const handleMealAdded = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["meals", selectedDate] });
  }, [queryClient, selectedDate]);

  const [retryCount, setRetryCount] = useState(0);

  const handleGenerateMealPlan = async () => {
    setIsGeneratingPlan(true);
    setHasPlanError(false);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-meal-plan', {
        body: { daysToGenerate: 3 }, // Reduced to 3 days to prevent timeout
      });

      if (error) {
        console.error("Edge function error:", error);
        
        // Friendly retry message instead of red error
        if (retryCount < 2) {
          setRetryCount(prev => prev + 1);
          toast({
            title: "Tentando novamente...",
            description: "A IA está processando. Por favor aguarde.",
          });
          // Auto-retry after 2 seconds
          setTimeout(() => handleGenerateMealPlan(), 2000);
          return;
        }
        
        setHasPlanError(true);
        toast({
          title: "Não foi possível gerar",
          description: "Tente novamente em alguns segundos.",
        });
        return;
      }

      if (data?.error) {
        setHasPlanError(true);
        toast({
          title: "Tente novamente",
          description: data.error,
        });
        return;
      }

      setRetryCount(0);
      toast({
        title: "Sucesso!",
        description: data?.message || "Plano alimentar gerado!",
      });

      // Refresh meals
      queryClient.invalidateQueries({ queryKey: ["meals"] });
    } catch (err: any) {
      console.error("Failed to generate meal plan:", err);
      setHasPlanError(true);
      toast({
        title: "Tente novamente",
        description: "Ocorreu um erro. Clique para tentar novamente.",
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

        {/* Daily Progress Tracker with Motivational Messages */}
        <DailyProgressTracker meals={meals} />

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
        
        {isBackgroundGenerating ? (
          // Background generation in progress
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Gerando seu plano alimentar...</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Nosso IA está criando refeições personalizadas para você. Isso pode levar alguns segundos.
            </p>
          </div>
        ) : isLoading ? (
          <div className="py-8 text-center text-muted-foreground">
            Carregando...
          </div>
        ) : meals.length === 0 ? (
          <div className="py-8 text-center bg-muted/30 rounded-2xl px-4">
            {hasPlanError ? (
              <>
                <p className="text-muted-foreground mb-3">Erro ao gerar seu plano alimentar</p>
                <Button 
                  onClick={handleGenerateMealPlan}
                  disabled={isGeneratingPlan}
                  size="sm"
                  variant="outline"
                  className="gap-2"
                >
                  {isGeneratingPlan ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Tentar novamente
                    </>
                  )}
                </Button>
              </>
            ) : (
              <>
                <p className="text-muted-foreground">Nenhuma refeição registada</p>
                {isViewingToday && (
                  <button 
                    className="text-primary text-sm font-medium mt-2"
                    onClick={() => setIsAddMealOpen(true)}
                  >
                    Adicionar sua primeira refeição
                  </button>
                )}
              </>
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
                onSkip={() => handleSkipMeal(meal.id)}
                onDelete={() => handleDeleteMeal(meal.id)}
                isPending={toggleMutation.isPending || skipMutation.isPending}
                isDeleting={deleteMutation.isPending}
              />
            ))}
          </div>
        )}

        {/* Regenerate Plan Button */}
        <div className="mt-8">
          <Button
            onClick={handleGenerateMealPlan}
            disabled={isGeneratingPlan}
            className="w-full bg-foreground text-background hover:bg-foreground/90"
            size="lg"
          >
            <Sparkles className={cn("w-5 h-5 mr-2", isGeneratingPlan && "animate-spin")} />
            {isGeneratingPlan ? "A gerar... (até 30s)" : "Regenerar Plano (3 dias)"}
          </Button>
          {isGeneratingPlan && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              A IA está a criar o seu plano personalizado. Aguarde...
            </p>
          )}
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