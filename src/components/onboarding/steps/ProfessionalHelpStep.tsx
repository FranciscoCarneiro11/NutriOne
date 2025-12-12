import React from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfessionalHelpStepProps {
  value: boolean | null;
  onChange: (value: boolean) => void;
  className?: string;
}

export const ProfessionalHelpStep: React.FC<ProfessionalHelpStepProps> = ({
  value,
  onChange,
  className,
}) => {
  return (
    <div className={cn("flex flex-col", className)}>
      <h1 className="text-3xl font-bold text-foreground mb-12 leading-tight">
        Você trabalha atualmente com um treinador pessoal ou nutricionista?
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
            <Check
              className={cn(
                "w-6 h-6",
                value === true ? "text-white" : "text-foreground"
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
            <X
              className={cn(
                "w-6 h-6",
                value === false ? "text-white" : "text-foreground"
              )}
            />
          </div>
          <span className="text-lg font-semibold">Não</span>
        </button>
      </div>
    </div>
  );
};
