import React from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface PreviousExperienceStepProps {
  value: boolean | null;
  onChange: (value: boolean) => void;
  className?: string;
}

export const PreviousExperienceStep: React.FC<PreviousExperienceStepProps> = ({
  value,
  onChange,
  className,
}) => {
  return (
    <div className={cn("flex flex-col", className)}>
      <h1 className="text-3xl font-bold text-foreground mb-12 leading-tight">
        Você já tentou outros apps de contagem de calorias?
      </h1>

      <div className="space-y-3 mt-auto">
        <button
          onClick={() => onChange(true)}
          className={cn(
            "w-full flex items-center gap-4 p-5 rounded-2xl transition-all duration-200",
            value === true
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          <div
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center",
              value === true ? "bg-white/20" : "bg-white"
            )}
          >
            <ThumbsUp
              className={cn(
                "w-6 h-6",
                value === true ? "text-white" : "text-gray-900"
              )}
            />
          </div>
          <span className="text-lg font-semibold">Sim</span>
        </button>

        <button
          onClick={() => onChange(false)}
          className={cn(
            "w-full flex items-center gap-4 p-5 rounded-2xl transition-all duration-200",
            value === false
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          <div
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center",
              value === false ? "bg-white/20" : "bg-white"
            )}
          >
            <ThumbsDown
              className={cn(
                "w-6 h-6",
                value === false ? "text-white" : "text-gray-900"
              )}
            />
          </div>
          <span className="text-lg font-semibold">Não</span>
        </button>
      </div>
    </div>
  );
};
