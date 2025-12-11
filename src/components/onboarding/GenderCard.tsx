import React from "react";
import { cn } from "@/lib/utils";

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
        "relative flex flex-col items-center justify-between p-4 rounded-3xl border-2 transition-all duration-300 w-full aspect-[3/4] overflow-hidden",
        selected
          ? "border-primary bg-coral-light shadow-card scale-[1.02]"
          : "border-border bg-card hover:border-primary/30 hover:bg-muted/50",
        className
      )}
    >
      {/* Body Silhouette */}
      <div className="flex-1 w-full flex items-center justify-center py-4">
        <svg
          viewBox="0 0 100 160"
          className="h-full max-h-48 w-auto"
          style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.1))" }}
        >
          <defs>
            <linearGradient id={`bodyGradient-${gender}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isMale ? "#E8D4C4" : "#F5E1D0"} />
              <stop offset="100%" stopColor={isMale ? "#D4C0B0" : "#EACED4"} />
            </linearGradient>
          </defs>
          
          {/* Head */}
          <ellipse cx="50" cy="15" rx="12" ry="14" fill={`url(#bodyGradient-${gender})`} />
          
          {/* Neck */}
          <rect x="45" y="28" width="10" height="8" fill={`url(#bodyGradient-${gender})`} />
          
          {/* Torso */}
          <path
            d={isMale 
              ? "M30 36 Q25 36 25 45 L25 75 Q25 82 35 85 L35 95 L65 95 L65 85 Q75 82 75 75 L75 45 Q75 36 70 36 Z"
              : "M32 36 Q22 40 25 50 L23 75 Q25 85 35 88 L35 95 L65 95 L65 88 Q75 85 77 75 L75 50 Q78 40 68 36 Z"
            }
            fill={`url(#bodyGradient-${gender})`}
          />
          
          {/* Arms */}
          <path
            d={isMale
              ? "M25 38 Q15 40 12 55 L10 75 Q8 80 12 82 L18 82 L22 55 L25 45 Z"
              : "M25 40 Q18 42 15 55 L13 72 Q11 77 15 79 L20 79 L24 55 L27 45 Z"
            }
            fill={`url(#bodyGradient-${gender})`}
          />
          <path
            d={isMale
              ? "M75 38 Q85 40 88 55 L90 75 Q92 80 88 82 L82 82 L78 55 L75 45 Z"
              : "M75 40 Q82 42 85 55 L87 72 Q89 77 85 79 L80 79 L76 55 L73 45 Z"
            }
            fill={`url(#bodyGradient-${gender})`}
          />
          
          {/* Legs */}
          <path
            d={isMale
              ? "M35 95 L32 140 Q31 150 38 152 L44 152 L48 95 Z"
              : "M35 95 L30 140 Q29 150 36 152 L44 152 L48 95 Z"
            }
            fill={`url(#bodyGradient-${gender})`}
          />
          <path
            d={isMale
              ? "M65 95 L68 140 Q69 150 62 152 L56 152 L52 95 Z"
              : "M65 95 L70 140 Q71 150 64 152 L56 152 L52 95 Z"
            }
            fill={`url(#bodyGradient-${gender})`}
          />

          {/* Sports Wear */}
          {isMale ? (
            <path d="M35 85 L32 105 L50 108 L68 105 L65 85 Z" fill="#2D3748" />
          ) : (
            <>
              <path d="M32 42 Q30 50 35 55 L65 55 Q70 50 68 42 L60 40 Q50 44 40 40 Z" fill="#2D3748" />
              <path d="M33 85 L30 100 L50 103 L70 100 L67 85 Z" fill="#2D3748" />
            </>
          )}
        </svg>
      </div>
      
      <span className={cn(
        "text-lg font-semibold transition-colors pb-2",
        selected ? "text-primary" : "text-foreground"
      )}>
        {isMale ? "Masculino" : "Feminino"}
      </span>

      {/* Selection Ring */}
      {selected && (
        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center animate-scale-in">
          <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </button>
  );
};
