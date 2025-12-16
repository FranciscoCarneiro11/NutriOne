import React, { useState } from "react";
import { Flame, ChevronRight, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface MealCardProps {
  title: string;
  index: number;
  calories: number;
  items: string[];
  protein?: number;
  carbs?: number;
  fat?: number;
  locked?: boolean;
  completed?: boolean;
  onComplete?: () => void;
}

export const MealCard: React.FC<MealCardProps> = ({ 
  title,
  index,
  calories, 
  items,
  protein,
  carbs,
  fat,
  locked = false,
  completed = false,
  onComplete
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCompleted, setIsCompleted] = useState(completed);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (locked) return;
    
    setIsAnimating(true);
    setIsCompleted(!isCompleted);
    
    setTimeout(() => {
      setIsAnimating(false);
      if (!isCompleted && onComplete) {
        onComplete();
      }
    }, 300);
  };

  const handleExpand = () => {
    if (locked) return;
    setIsExpanded(!isExpanded);
  };

  return (
    <div 
      className={cn(
        "relative w-full bg-card rounded-2xl shadow-card transition-all duration-300 overflow-hidden",
        locked && "blur-[2px] opacity-60",
        isCompleted && "opacity-60 bg-muted"
      )}
    >
      {/* Lock overlay */}
      {locked && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex items-center gap-4 p-4">
        {/* Complete button */}
        <button
          onClick={handleComplete}
          disabled={locked}
          className={cn(
            "flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300",
            isCompleted 
              ? "bg-primary border-primary" 
              : "border-border hover:border-primary",
            isAnimating && "scale-125",
            locked && "pointer-events-none"
          )}
        >
          {isCompleted && (
            <Check 
              className={cn(
                "w-4 h-4 text-primary-foreground transition-transform duration-300",
                isAnimating && "scale-110"
              )} 
            />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-semibold text-foreground transition-all",
            isCompleted && "line-through text-muted-foreground"
          )}>
            Refeição {index}
          </h3>
          <div className="flex items-center gap-1 mt-1 text-primary">
            <Flame className="w-4 h-4" />
            <span className="text-sm font-medium">{calories} kcal</span>
          </div>
        </div>
        
        <button 
          onClick={handleExpand}
          disabled={locked}
          className={cn(
            "p-2 rounded-full hover:bg-muted transition-colors",
            locked && "pointer-events-none"
          )}
        >
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          )}
        </button>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-0 border-t border-border mt-0">
          <div className="pt-3">
            <p className="text-sm font-medium text-foreground mb-2">{title}</p>
            <p className="text-sm text-muted-foreground mb-3">
              {items.join(", ")}
            </p>
            
            {/* Macros */}
            <div className="flex gap-4 text-xs">
              {protein !== undefined && (
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Proteína:</span>
                  <span className="font-medium text-foreground">{protein}g</span>
                </div>
              )}
              {carbs !== undefined && (
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Carbs:</span>
                  <span className="font-medium text-foreground">{carbs}g</span>
                </div>
              )}
              {fat !== undefined && (
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Gordura:</span>
                  <span className="font-medium text-foreground">{fat}g</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
