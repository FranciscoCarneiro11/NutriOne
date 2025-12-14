import React from "react";
import { cn } from "@/lib/utils";
import { GenderCard } from "../GenderCard";

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
  return (
    <div className={cn("flex flex-col", className)}>
      <h1 className="text-3xl font-bold text-foreground mb-2 leading-tight">
        Qual é o seu gênero?
      </h1>
      <p className="text-muted-foreground mb-8">
        Isso nos ajuda a personalizar sua experiência.
      </p>

      <div className="flex gap-4 justify-center items-end flex-1">
        {/* Male figure */}
        <div
          className={cn(
            "flex-1 max-w-[180px] transition-all duration-300 ease-out cursor-pointer",
            value === "male" ? "scale-105 z-10" : value === "female" ? "scale-95 opacity-60" : "hover:scale-[1.02]"
          )}
        >
          <GenderCard
            gender="male"
            selected={value === "male"}
            onClick={() => onChange("male")}
          />
        </div>

        {/* Female figure */}
        <div
          className={cn(
            "flex-1 max-w-[180px] transition-all duration-300 ease-out cursor-pointer",
            value === "female" ? "scale-105 z-10" : value === "male" ? "scale-95 opacity-60" : "hover:scale-[1.02]"
          )}
        >
          <GenderCard
            gender="female"
            selected={value === "female"}
            onClick={() => onChange("female")}
          />
        </div>
      </div>
    </div>
  );
};
