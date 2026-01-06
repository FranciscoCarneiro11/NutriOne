import React from "react";
import { ChevronRight, Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkoutGalleryCardProps {
  title: string;
  exerciseCount: number;
  isToday?: boolean;
  onClick: () => void;
  dayLabel?: string;
}

const WorkoutGalleryCard: React.FC<WorkoutGalleryCardProps> = ({
  title,
  exerciseCount,
  isToday = false,
  onClick,
  dayLabel,
}) => {
  // Generate a gradient based on the title for visual variety
  const getGradientClass = (title: string): string => {
    const lowerTitle = title.toLowerCase();
    
    if (lowerTitle.includes("peito") || lowerTitle.includes("chest")) {
      return "from-orange-500 to-red-500";
    }
    if (lowerTitle.includes("costas") || lowerTitle.includes("back")) {
      return "from-blue-500 to-indigo-600";
    }
    if (lowerTitle.includes("perna") || lowerTitle.includes("leg")) {
      return "from-green-500 to-emerald-600";
    }
    if (lowerTitle.includes("ombro") || lowerTitle.includes("shoulder")) {
      return "from-purple-500 to-violet-600";
    }
    if (lowerTitle.includes("braço") || lowerTitle.includes("arm") || lowerTitle.includes("bíceps") || lowerTitle.includes("tríceps")) {
      return "from-pink-500 to-rose-600";
    }
    if (lowerTitle.includes("core") || lowerTitle.includes("abdom") || lowerTitle.includes("abs")) {
      return "from-amber-500 to-orange-600";
    }
    if (lowerTitle.includes("descanso") || lowerTitle.includes("rest")) {
      return "from-slate-400 to-slate-500";
    }
    if (lowerTitle.includes("full") || lowerTitle.includes("corpo todo")) {
      return "from-teal-500 to-cyan-600";
    }
    
    // Default gradient
    return "from-primary to-primary/80";
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative overflow-hidden rounded-2xl cursor-pointer",
        "active:scale-[0.98] transition-all duration-200",
        "shadow-lg hover:shadow-xl"
      )}
    >
      {/* Gradient Background */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br",
        getGradientClass(title)
      )} />
      
      {/* Content */}
      <div className="relative p-5 min-h-[140px] flex flex-col justify-between">
        {/* Top Section */}
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Dumbbell className="w-6 h-6 text-white" />
          </div>
          
          {isToday && (
            <span className="bg-white/25 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
              Hoje
            </span>
          )}
        </div>
        
        {/* Bottom Section */}
        <div className="mt-4">
          {dayLabel && (
            <span className="text-white/70 text-sm">{dayLabel}</span>
          )}
          <h3 className="text-xl font-bold text-white leading-tight">{title}</h3>
          <div className="flex items-center justify-between mt-2">
            <span className="text-white/80 text-sm">
              {exerciseCount} exercícios
            </span>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <ChevronRight className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutGalleryCard;
