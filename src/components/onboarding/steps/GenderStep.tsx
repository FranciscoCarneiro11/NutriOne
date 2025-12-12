import React from "react";
import { cn } from "@/lib/utils";

type Gender = "male" | "female" | "other";

interface GenderStepProps {
  value: Gender | null;
  onChange: (gender: Gender) => void;
  className?: string;
}

export const GenderStep: React.FC<GenderStepProps> = ({
  value,
  onChange,
  className,
}) => {
  const options: { id: Gender; label: string }[] = [
    { id: "male", label: "Masculino" },
    { id: "female", label: "Feminino" },
    { id: "other", label: "Outro" },
  ];

  return (
    <div className={cn("flex flex-col", className)}>
      <h1 className="text-3xl font-bold text-foreground mb-2 leading-tight">
        Escolha seu gênero
      </h1>
      <p className="text-muted-foreground mb-12">
        Isso será usado para calibrar seu plano personalizado.
      </p>

      <div className="space-y-3 mt-auto">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={cn(
              "w-full flex items-center justify-center p-5 rounded-2xl transition-all duration-200 text-lg font-semibold",
              value === option.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};
