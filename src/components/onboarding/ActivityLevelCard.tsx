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
        "w-full flex items-center gap-4 p-5 rounded-2xl transition-all duration-200 text-left",
        selected
          ? "bg-primary text-primary-foreground"
          : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        className
      )}
    >
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
        selected ? "bg-white/20" : "bg-white"
      )}>
        <Icon className={cn(
          "w-6 h-6",
          selected ? "text-white" : "text-foreground"
        )} />
      </div>
      
      <div className="flex-1">
        <h3 className="font-semibold mb-0.5">{title}</h3>
        <p className={cn(
          "text-sm",
          selected ? "text-white/70" : "text-muted-foreground"
        )}>{description}</p>
      </div>
    </button>
  );
};
