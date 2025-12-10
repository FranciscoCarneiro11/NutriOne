import React from "react";
import { cn } from "@/lib/utils";
import { Scale, Dumbbell, Heart, Sparkles } from "lucide-react";

interface GoalCardProps {
  title: string;
  icon: "weight-loss" | "muscle" | "fit" | "flexibility";
  selected?: boolean;
  onClick?: () => void;
  className?: string;
  imageUrl?: string;
}

const iconMap = {
  "weight-loss": Scale,
  muscle: Dumbbell,
  fit: Heart,
  flexibility: Sparkles,
};

export const GoalCard: React.FC<GoalCardProps> = ({
  title,
  icon,
  selected = false,
  onClick,
  className,
  imageUrl,
}) => {
  const Icon = iconMap[icon];

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 text-left",
        selected
          ? "border-primary bg-coral-light shadow-card"
          : "border-border bg-card hover:border-primary/30 hover:bg-muted/50",
        className
      )}
    >
      {/* Content */}
      <div className="flex-1">
        <h3 className={cn(
          "font-semibold text-lg transition-colors",
          selected ? "text-foreground" : "text-foreground"
        )}>
          {title}
        </h3>
      </div>

      {/* Image/Icon Area */}
      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-muted flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <Icon className={cn(
            "w-8 h-8 transition-colors",
            selected ? "text-primary" : "text-muted-foreground"
          )} />
        )}
      </div>

      {/* Selection Indicator */}
      {selected && (
        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
          <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </button>
  );
};
