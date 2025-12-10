import React from "react";
import { cn } from "@/lib/utils";

interface WorkoutDaysSelectorProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export const WorkoutDaysSelector: React.FC<WorkoutDaysSelectorProps> = ({
  value,
  onChange,
  className,
}) => {
  const days = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div className={cn("flex flex-col items-center w-full", className)}>
      {/* Display Value */}
      <div className="flex items-baseline gap-3 mb-8">
        <span className="text-8xl font-bold text-foreground tracking-tight">
          {value}
        </span>
        <span className="text-2xl font-medium text-muted-foreground">
          {value === 1 ? "dia" : "dias"}/semana
        </span>
      </div>

      {/* Day Selector */}
      <div className="flex items-center gap-2 w-full justify-center">
        {days.map((day) => {
          const isSelected = day === value;
          const isLess = day < value;

          return (
            <button
              key={day}
              onClick={() => onChange(day)}
              className={cn(
                "w-12 h-12 rounded-xl font-bold text-lg transition-all duration-300",
                isSelected
                  ? "bg-primary text-primary-foreground scale-110 shadow-button"
                  : isLess
                  ? "bg-coral-light text-primary"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Intensity Labels */}
      <div className="flex justify-between w-full mt-6 px-2">
        <span className="text-xs text-muted-foreground">Leve</span>
        <span className="text-xs text-muted-foreground">Intenso</span>
      </div>

      {/* Recommendation Card */}
      <div className="mt-8 w-full p-4 bg-coral-light rounded-2xl">
        <h4 className="font-semibold text-foreground mb-1">
          {value <= 2 ? "Comece devagar" : value <= 4 ? "Ótimo equilíbrio" : "Atleta dedicado"}
        </h4>
        <p className="text-sm text-muted-foreground">
          {value <= 2
            ? "Perfeito para iniciantes. Vamos construir o hábito juntos!"
            : value <= 4
            ? "Este é o número ideal para resultados consistentes."
            : "Excelente! Seu plano será intensivo e focado."}
        </p>
      </div>
    </div>
  );
};
