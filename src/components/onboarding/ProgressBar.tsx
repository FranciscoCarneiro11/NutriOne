import React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
  variant?: "default" | "dark";
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  className,
  variant = "default",
}) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div 
      className={cn(
        "w-full h-1 rounded-full overflow-hidden",
        variant === "dark" ? "bg-white/20" : "bg-border",
        className
      )}
    >
      <div
        className={cn(
          "h-full rounded-full transition-all duration-500 ease-out",
          variant === "dark" ? "bg-primary" : "bg-foreground"
        )}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
