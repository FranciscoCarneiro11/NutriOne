import React from "react";
import { cn } from "@/lib/utils";

interface RealisticGoalStepProps {
  currentWeight: number;
  targetWeight: number;
  appName?: string;
  className?: string;
}

export const RealisticGoalStep: React.FC<RealisticGoalStepProps> = ({
  currentWeight,
  targetWeight,
  appName = "NutriFit",
  className,
}) => {
  const weightDifference = Math.abs(targetWeight - currentWeight);
  const isLosingWeight = targetWeight < currentWeight;
  const roundedDiff = Math.round(weightDifference * 10) / 10;

  return (
    <div className={cn("flex flex-col items-center justify-center min-h-[60vh]", className)}>
      <h1 className="text-3xl font-bold text-center text-foreground leading-tight mb-2">
        {isLosingWeight ? "Perdendo " : "Ganhando "}
        <span className="text-coral">{roundedDiff} kg</span>
        {" "}é uma meta realista.
      </h1>
      <h2 className="text-3xl font-bold text-center text-foreground mb-8">
        Não é nada difícil!
      </h2>

      <p className="text-center text-muted-foreground max-w-xs">
        90% dos usuários dizem que a mudança é evidente após usar o {appName} e que é difícil voltar ao antigo
      </p>
    </div>
  );
};
