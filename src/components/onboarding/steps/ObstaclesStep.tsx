import React from "react";
import { BarChart3, UtensilsCrossed, Heart, Calendar, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

export type Obstacle = 
  | "consistency" 
  | "unhealthy-habits" 
  | "lack-support" 
  | "busy-schedule" 
  | "no-inspiration";

interface ObstacleOption {
  id: Obstacle;
  title: string;
  icon: React.ReactNode;
}

const obstacles: ObstacleOption[] = [
  { id: "consistency", title: "Falta de consistência", icon: <BarChart3 className="w-6 h-6" /> },
  { id: "unhealthy-habits", title: "Hábitos alimentares não saudáveis", icon: <UtensilsCrossed className="w-6 h-6" /> },
  { id: "lack-support", title: "Falta de apoio", icon: <Heart className="w-6 h-6" /> },
  { id: "busy-schedule", title: "Agenda lotada", icon: <Calendar className="w-6 h-6" /> },
  { id: "no-inspiration", title: "Falta de inspiração para refeições", icon: <Lightbulb className="w-6 h-6" /> },
];

interface ObstaclesStepProps {
  selected: Obstacle[];
  onChange: (selected: Obstacle[]) => void;
  className?: string;
}

export const ObstaclesStep: React.FC<ObstaclesStepProps> = ({
  selected,
  onChange,
  className,
}) => {
  const toggleObstacle = (id: Obstacle) => {
    if (selected.includes(id)) {
      onChange(selected.filter((o) => o !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className={cn("flex flex-col", className)}>
      <h1 className="text-3xl font-bold text-foreground mb-8 leading-tight">
        O que está impedindo você de atingir seus objetivos?
      </h1>

      <div className="space-y-3">
        {obstacles.map((obstacle) => {
          const isSelected = selected.includes(obstacle.id);
          return (
            <button
              key={obstacle.id}
              onClick={() => toggleObstacle(obstacle.id)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200",
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  isSelected ? "bg-white/20" : "bg-white"
                )}
              >
                <span className={isSelected ? "text-white" : "text-foreground"}>
                  {obstacle.icon}
                </span>
              </div>
              <span className="text-base font-medium text-left">{obstacle.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
