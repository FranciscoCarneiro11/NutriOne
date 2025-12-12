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
        "relative w-full flex items-center gap-4 p-5 rounded-2xl transition-all duration-200 text-left",
        selected
          ? "bg-primary text-primary-foreground"
          : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        className
      )}
    >
      {/* Icon Area */}
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
        selected ? "bg-white/20" : "bg-white"
      )}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover rounded-xl"
          />
        ) : (
          <Icon className={cn(
            "w-6 h-6 transition-colors",
            selected ? "text-white" : "text-foreground"
          )} />
        )}
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="font-semibold text-lg">
          {title}
        </h3>
      </div>
    </button>
  );
};
