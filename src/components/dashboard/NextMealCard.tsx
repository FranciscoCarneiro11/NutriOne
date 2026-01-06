import React from "react";
import { Clock, Utensils, ChevronRight, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";

interface Meal {
  id: string;
  title: string;
  time: string | null;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  items: string[];
  completed: boolean;
  skipped?: boolean;
  meal_type: string;
}

interface NextMealCardProps {
  meal: Meal | null;
  onComplete?: () => void;
  onSkip?: () => void;
  onViewAll?: () => void;
  className?: string;
  allMealsCompleted?: boolean;
}

export const NextMealCard: React.FC<NextMealCardProps> = ({
  meal,
  onComplete,
  onSkip,
  onViewAll,
  className,
  allMealsCompleted = false,
}) => {
  if (!meal) {
    return (
      <div className={cn("bg-card rounded-2xl p-5 border border-border/50", className)}>
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Utensils className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">Próxima Refeição</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          {allMealsCompleted 
            ? "Incrível! Completaste todas as refeições de hoje! 🎉" 
            : "Nenhuma refeição pendente."}
        </p>
      </div>
    );
  }

  const formatTime = (time: string | null) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes}`;
  };

  return (
    <div className={cn("bg-card rounded-2xl p-5 border border-border/50 shadow-sm", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Utensils className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Próxima Refeição</h3>
            {meal.time && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{formatTime(meal.time)}</span>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={onViewAll}
          className="text-primary text-sm font-medium flex items-center gap-0.5 hover:underline"
        >
          Ver todas
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-muted/30 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-foreground">{meal.title}</h4>
          <span className="text-sm font-semibold text-primary">{meal.calories} kcal</span>
        </div>

        {/* Macro pills */}
        <div className="flex gap-2 mb-4">
          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
            P: {meal.protein}g
          </span>
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
            C: {meal.carbs}g
          </span>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            G: {meal.fat}g
          </span>
        </div>

        {/* Items preview */}
        {meal.items && meal.items.length > 0 && (
          <p className="text-xs text-muted-foreground line-clamp-1 mb-4">
            {meal.items.slice(0, 3).join(" • ")}
            {meal.items.length > 3 && ` +${meal.items.length - 3}`}
          </p>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={onComplete}
            className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:bg-primary/90 transition-colors"
          >
            Concluída
          </button>
          <button
            onClick={onSkip}
            className="px-4 py-2.5 bg-muted text-muted-foreground rounded-xl font-medium text-sm hover:bg-muted/80 transition-colors flex items-center gap-1.5"
          >
            <SkipForward className="w-4 h-4" />
            Saltar
          </button>
        </div>
      </div>
    </div>
  );
};
