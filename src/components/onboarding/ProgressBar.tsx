import React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  className,
}) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className={cn("w-full h-1 bg-muted rounded-full overflow-hidden", className)}>
      <div
        className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
