import React from "react";
import { cn } from "@/lib/utils";
import { User, UserRound } from "lucide-react";

interface GenderCardProps {
  gender: "male" | "female";
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export const GenderCard: React.FC<GenderCardProps> = ({
  gender,
  selected = false,
  onClick,
  className,
}) => {
  const isMale = gender === "male";

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center justify-center gap-4 p-8 rounded-3xl border-2 transition-all duration-300 w-full aspect-square",
        selected
          ? "border-primary bg-coral-light shadow-card scale-[1.02]"
          : "border-border bg-card hover:border-primary/30 hover:bg-muted/50",
        className
      )}
    >
      <div
        className={cn(
          "w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300",
          selected
            ? isMale ? "bg-blue-100" : "bg-pink-100"
            : "bg-muted"
        )}
      >
        {isMale ? (
          <User className={cn(
            "w-12 h-12 transition-colors",
            selected ? "text-blue-500" : "text-muted-foreground"
          )} />
        ) : (
          <UserRound className={cn(
            "w-12 h-12 transition-colors",
            selected ? "text-pink-500" : "text-muted-foreground"
          )} />
        )}
      </div>
      
      <span className={cn(
        "text-xl font-semibold transition-colors",
        selected ? "text-foreground" : "text-foreground"
      )}>
        {isMale ? "Masculino" : "Feminino"}
      </span>

      {/* Selection Ring */}
      {selected && (
        <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center animate-scale-in">
          <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </button>
  );
};
