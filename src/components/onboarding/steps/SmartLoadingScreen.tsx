import React, { useState, useEffect } from "react";
import { Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SmartLoadingScreenProps {
  onComplete: () => void;
  isLoading?: boolean;
  hasError?: boolean;
  errorMessage?: string;
}

const checklistItems = [
  "Calorias",
  "Carboidratos",
  "Proteína",
  "Gorduras",
  "Pontuação de Saúde",
];

const dynamicTexts = [
  "Estimando sua idade metabólica...",
  "Analisando biotipo...",
  "Calculando macros ideais...",
  "Criando estratégia personalizada...",
  "Finalizando seu plano...",
];

export const SmartLoadingScreen: React.FC<SmartLoadingScreenProps> = ({
  onComplete,
  isLoading = true,
  hasError = false,
  errorMessage,
}) => {
  const [percentage, setPercentage] = useState(0);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [checkedItems, setCheckedItems] = useState<number[]>([]);

  useEffect(() => {
    // If still loading, animate to 90% and hold
    // If done loading (success or error), animate to 100%
    const targetPercentage = isLoading ? 90 : 100;
    const duration = isLoading ? 8000 : 500; // 8 seconds to 90%, then quick finish
    const interval = 50;
    const steps = duration / interval;
    const currentTarget = isLoading ? 90 : 100;
    
    const timer = setInterval(() => {
      setPercentage((prev) => {
        if (prev >= currentTarget) {
          clearInterval(timer);
          return currentTarget;
        }
        const remaining = currentTarget - prev;
        const increment = remaining / (steps / 2);
        return Math.min(prev + increment, currentTarget);
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isLoading]);

  // Update dynamic text based on percentage
  useEffect(() => {
    const textIndex = Math.min(
      Math.floor(percentage / 20),
      dynamicTexts.length - 1
    );
    setCurrentTextIndex(textIndex);
  }, [percentage]);

  // Check items progressively
  useEffect(() => {
    const itemsToCheck = Math.floor((percentage / 100) * checklistItems.length);
    const newCheckedItems: number[] = [];
    for (let i = 0; i < itemsToCheck; i++) {
      newCheckedItems.push(i);
    }
    if (percentage >= 100 && !newCheckedItems.includes(checklistItems.length - 1)) {
      newCheckedItems.push(checklistItems.length - 1);
    }
    setCheckedItems(newCheckedItems);
  }, [percentage]);

  // Redirect when complete (100%) - works for both success and error
  useEffect(() => {
    if (percentage >= 100 && !isLoading) {
      const timeout = setTimeout(() => {
        onComplete();
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [percentage, isLoading, onComplete]);

  const displayPercentage = Math.round(percentage);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      {/* Error Banner */}
      {hasError && (
        <div className="absolute top-4 left-4 right-4 bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-destructive">Erro ao gerar plano</p>
            <p className="text-xs text-destructive/80 mt-1">
              {errorMessage || "Não foi possível gerar seu plano personalizado. Tente novamente."}
            </p>
          </div>
        </div>
      )}

      {/* Percentage Counter */}
      <div className="text-7xl font-bold text-foreground mb-4 tabular-nums">
        {displayPercentage}%
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-foreground text-center mb-8">
        Estamos configurando
        <br />
        tudo para você
      </h1>

      {/* Progress Bar */}
      <div className="w-full max-w-sm h-3 bg-secondary rounded-full overflow-hidden mb-4">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-100 ease-linear",
            hasError && "opacity-50"
          )}
          style={{
            width: `${percentage}%`,
            background: hasError 
              ? `hsl(var(--destructive))`
              : `linear-gradient(90deg, 
                hsl(0 84% 60%) 0%, 
                hsl(280 84% 60%) 50%, 
                hsl(220 84% 60%) 100%)`,
          }}
        />
      </div>

      {/* Dynamic Text */}
      <p className="text-muted-foreground text-center mb-12 h-6 transition-opacity duration-300">
        {hasError ? "Redirecionando..." : dynamicTexts[currentTextIndex]}
      </p>

      {/* Checklist */}
      <div className="w-full max-w-sm">
        <h3 className="font-semibold text-foreground mb-4">
          Recomendação diária para
        </h3>
        <ul className="space-y-3">
          {checklistItems.map((item, index) => {
            const isChecked = checkedItems.includes(index);
            return (
              <li
                key={item}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-foreground">•</span>
                  <span className="text-foreground">{item}</span>
                </div>
                <div
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300",
                    isChecked
                      ? "bg-foreground scale-100"
                      : "bg-secondary scale-90 opacity-40"
                  )}
                >
                  <Check
                    className={cn(
                      "w-4 h-4 transition-all duration-300",
                      isChecked
                        ? "text-background opacity-100"
                        : "text-muted-foreground opacity-0"
                    )}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
