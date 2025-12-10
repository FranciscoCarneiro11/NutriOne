import React from "react";
import { cn } from "@/lib/utils";
import { Sofa, PersonStanding, Bike, Flame } from "lucide-react";

interface ActivityLevelCardProps {
  level: "sedentary" | "light" | "moderate" | "very";
  title: string;
  description: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

const iconMap = {
  sedentary: Sofa,
  light: PersonStanding,
  moderate: Bike,
  very: Flame,
};

const colorMap = {
  sedentary: "text-gray-500",
  light: "text-green-500",
  moderate: "text-orange-500",
  very: "text-red-500",
};

const bgMap = {
  sedentary: "bg-gray-100",
  light: "bg-green-100",
  moderate: "bg-orange-100",
  very: "bg-red-100",
};

export const ActivityLevelCard: React.FC<ActivityLevelCardProps> = ({
  level,
  title,
  description,
  selected = false,
  onClick,
  className,
}) => {
  const Icon = iconMap[level];

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
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all",
        selected ? "bg-primary/20" : bgMap[level]
      )}>
        <Icon className={cn(
          "w-6 h-6 transition-colors",
          selected ? "text-primary" : colorMap[level]
        )} />
      </div>
      
      <div className="flex-1">
        <h3 className="font-semibold text-foreground mb-0.5">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {/* Selection Indicator */}
      {selected && (
        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 animate-scale-in">
          <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </button>
  );
};
