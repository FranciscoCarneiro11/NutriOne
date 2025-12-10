import React from "react";
import { cn } from "@/lib/utils";
import { Shirt, Sparkles, Heart, Trophy } from "lucide-react";

interface MotivationChipProps {
  title: string;
  icon: "body" | "appearance" | "health" | "confidence";
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

const iconMap = {
  body: Shirt,
  appearance: Sparkles,
  health: Heart,
  confidence: Trophy,
};

export const MotivationChip: React.FC<MotivationChipProps> = ({
  title,
  icon,
  selected = false,
  onClick,
  className,
}) => {
  const Icon = iconMap[icon];

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-300 text-left",
        selected
          ? "border-primary bg-coral-light"
          : "border-border bg-card hover:border-primary/30",
        className
      )}
    >
      <Icon className={cn(
        "w-6 h-6 transition-colors flex-shrink-0",
        selected ? "text-primary" : "text-muted-foreground"
      )} />
      <span className={cn(
        "font-medium text-base transition-colors",
        selected ? "text-foreground" : "text-foreground"
      )}>
        {title}
      </span>
    </button>
  );
};
