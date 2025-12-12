import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SmartLoadingScreenProps {
  onComplete: () => void;
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
}) => {
  const [percentage, setPercentage] = useState(0);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [checkedItems, setCheckedItems] = useState<number[]>([]);

  useEffect(() => {
    const duration = 5500; // 5.5 seconds
    const interval = 50; // Update every 50ms
    const steps = duration / interval;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setPercentage((prev) => {
        const newVal = prev + increment;
        if (newVal >= 100) {
          clearInterval(timer);
          return 100;
        }
        return newVal;
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

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
    // Add the last item when we hit 100%
    if (percentage >= 100 && !newCheckedItems.includes(checklistItems.length - 1)) {
      newCheckedItems.push(checklistItems.length - 1);
    }
    setCheckedItems(newCheckedItems);
  }, [percentage]);

  // Redirect when complete
  useEffect(() => {
    if (percentage >= 100) {
      const timeout = setTimeout(() => {
        onComplete();
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [percentage, onComplete]);

  const displayPercentage = Math.round(percentage);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
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
          className="h-full rounded-full transition-all duration-100 ease-linear"
          style={{
            width: `${percentage}%`,
            background: `linear-gradient(90deg, 
              hsl(0 84% 60%) 0%, 
              hsl(280 84% 60%) 50%, 
              hsl(220 84% 60%) 100%)`,
          }}
        />
      </div>

      {/* Dynamic Text */}
      <p className="text-muted-foreground text-center mb-12 h-6 transition-opacity duration-300">
        {dynamicTexts[currentTextIndex]}
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
