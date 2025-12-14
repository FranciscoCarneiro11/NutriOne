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
          ? "border-primary bg-primary/10 shadow-[0_0_40px_hsl(var(--primary)/0.4)]"
          : "border-muted bg-secondary hover:border-primary/50",
        className
      )}
    >
      {/* 3D Anatomy Body Model */}
      <div className="flex-1 w-full flex items-center justify-center py-2">
        <svg
          viewBox="0 0 120 200"
          className={cn(
            "h-full max-h-56 w-auto transition-all duration-300",
            selected ? "brightness-100" : "brightness-75 grayscale"
          )}
          style={{ filter: selected ? "drop-shadow(0 8px 24px hsl(var(--primary) / 0.5))" : "drop-shadow(0 8px 24px rgba(0,0,0,0.5))" }}
        >
          <defs>
            {/* Realistic skin/muscle gradient */}
            <linearGradient id={`skinGradient-${gender}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C9A88C" />
              <stop offset="50%" stopColor="#B89B7A" />
              <stop offset="100%" stopColor="#9A8268" />
            </linearGradient>
            
            {/* Muscle definition gradient */}
            <linearGradient id={`muscleGradient-${gender}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B7355" />
              <stop offset="50%" stopColor="#A18B6E" />
              <stop offset="100%" stopColor="#8B7355" />
            </linearGradient>
            
            {/* Shadow for depth */}
            <linearGradient id={`shadowGradient-${gender}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(0,0,0,0.1)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.3)" />
            </linearGradient>

            {/* Highlight */}
            <radialGradient id={`highlight-${gender}`} cx="40%" cy="30%" r="60%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
          </defs>
          
          {/* Head */}
          <ellipse cx="60" cy="18" rx="14" ry="16" fill={`url(#skinGradient-${gender})`} />
          {/* Face features subtle */}
          <ellipse cx="60" cy="20" rx="10" ry="12" fill={`url(#highlight-${gender})`} />
          
          {/* Neck */}
          <rect x="52" y="32" width="16" height="10" rx="2" fill={`url(#skinGradient-${gender})`} />
          
          {/* Trapezius */}
          <path
            d={isMale 
              ? "M52 42 Q30 44 25 52 L30 56 Q45 48 52 50 Z"
              : "M52 42 Q35 44 30 50 L34 54 Q45 48 52 50 Z"
            }
            fill={`url(#muscleGradient-${gender})`}
          />
          <path
            d={isMale 
              ? "M68 42 Q90 44 95 52 L90 56 Q75 48 68 50 Z"
              : "M68 42 Q85 44 90 50 L86 54 Q75 48 68 50 Z"
            }
            fill={`url(#muscleGradient-${gender})`}
          />

          {/* Shoulders/Deltoids */}
          <ellipse 
            cx={isMale ? "26" : "30"} 
            cy="56" 
            rx={isMale ? "10" : "8"} 
            ry="12" 
            fill={`url(#skinGradient-${gender})`} 
          />
          <ellipse 
            cx={isMale ? "94" : "90"} 
            cy="56" 
            rx={isMale ? "10" : "8"} 
            ry="12" 
            fill={`url(#skinGradient-${gender})`} 
          />
          
          {/* Torso - Pectorals */}
          <path
            d={isMale 
              ? "M35 50 Q30 55 32 70 L45 75 Q60 78 75 75 L88 70 Q90 55 85 50 Q70 45 60 45 Q50 45 35 50 Z"
              : "M38 50 Q32 58 36 72 L48 78 Q60 82 72 78 L84 72 Q88 58 82 50 Q70 46 60 46 Q50 46 38 50 Z"
            }
            fill={`url(#skinGradient-${gender})`}
          />
          
          {/* Chest definition lines */}
          {isMale ? (
            <>
              <path d="M45 55 Q52 62 60 60 Q68 62 75 55" stroke="#8B7355" strokeWidth="1" fill="none" opacity="0.6"/>
              <line x1="60" y1="52" x2="60" y2="72" stroke="#8B7355" strokeWidth="0.5" opacity="0.4"/>
            </>
          ) : (
            <>
              <ellipse cx="48" cy="62" rx="8" ry="10" fill={`url(#muscleGradient-${gender})`} opacity="0.3"/>
              <ellipse cx="72" cy="62" rx="8" ry="10" fill={`url(#muscleGradient-${gender})`} opacity="0.3"/>
            </>
          )}
          
          {/* Abs - Core */}
          <path
            d={isMale 
              ? "M45 75 L45 110 Q52 115 60 115 Q68 115 75 110 L75 75 Q68 78 60 78 Q52 78 45 75 Z"
              : "M48 78 L48 108 Q54 112 60 112 Q66 112 72 108 L72 78 Q66 82 60 82 Q54 82 48 78 Z"
            }
            fill={`url(#skinGradient-${gender})`}
          />
          
          {/* Ab definition */}
          {isMale && (
            <>
              <line x1="60" y1="78" x2="60" y2="108" stroke="#8B7355" strokeWidth="0.8" opacity="0.5"/>
              <path d="M48 84 Q60 86 72 84" stroke="#8B7355" strokeWidth="0.6" fill="none" opacity="0.4"/>
              <path d="M48 92 Q60 94 72 92" stroke="#8B7355" strokeWidth="0.6" fill="none" opacity="0.4"/>
              <path d="M49 100 Q60 102 71 100" stroke="#8B7355" strokeWidth="0.6" fill="none" opacity="0.4"/>
            </>
          )}
          
          {/* Obliques */}
          <path
            d={isMale
              ? "M35 70 L32 75 L30 100 L35 108 L45 110 L45 75 Z"
              : "M38 72 L35 78 L34 100 L40 108 L48 108 L48 78 Z"
            }
            fill={`url(#muscleGradient-${gender})`}
            opacity="0.7"
          />
          <path
            d={isMale
              ? "M85 70 L88 75 L90 100 L85 108 L75 110 L75 75 Z"
              : "M82 72 L85 78 L86 100 L80 108 L72 108 L72 78 Z"
            }
            fill={`url(#muscleGradient-${gender})`}
            opacity="0.7"
          />
          
          {/* Upper Arms - Biceps */}
          <path
            d={isMale
              ? "M18 58 Q12 65 10 80 L14 82 Q20 68 26 62 Z"
              : "M24 56 Q18 62 16 75 L20 77 Q24 66 30 58 Z"
            }
            fill={`url(#skinGradient-${gender})`}
          />
          <path
            d={isMale
              ? "M102 58 Q108 65 110 80 L106 82 Q100 68 94 62 Z"
              : "M96 56 Q102 62 104 75 L100 77 Q96 66 90 58 Z"
            }
            fill={`url(#skinGradient-${gender})`}
          />
          
          {/* Forearms */}
          <path
            d={isMale
              ? "M10 82 Q6 95 8 115 L14 116 Q16 96 14 82 Z"
              : "M16 77 Q12 88 14 105 L18 106 Q20 90 20 77 Z"
            }
            fill={`url(#skinGradient-${gender})`}
          />
          <path
            d={isMale
              ? "M110 82 Q114 95 112 115 L106 116 Q104 96 106 82 Z"
              : "M104 77 Q108 88 106 105 L102 106 Q100 90 100 77 Z"
            }
            fill={`url(#skinGradient-${gender})`}
          />
          
          {/* Hands */}
          <ellipse cx={isMale ? "11" : "16"} cy={isMale ? "120" : "110"} rx="4" ry="6" fill={`url(#skinGradient-${gender})`} />
          <ellipse cx={isMale ? "109" : "104"} cy={isMale ? "120" : "110"} rx="4" ry="6" fill={`url(#skinGradient-${gender})`} />
          
          {/* Hip/Pelvis area */}
          <path
            d={isMale
              ? "M35 108 Q30 115 32 125 L45 130 Q60 132 75 130 L88 125 Q90 115 85 108 Q70 112 60 112 Q50 112 35 108 Z"
              : "M38 108 Q28 118 32 130 L48 136 Q60 140 72 136 L88 130 Q92 118 82 108 Q70 114 60 114 Q50 114 38 108 Z"
            }
            fill={`url(#skinGradient-${gender})`}
          />
          
          {/* Upper Legs - Quads */}
          <path
            d={isMale
              ? "M38 125 L35 160 Q38 168 45 170 L50 130 Q45 128 38 125 Z"
              : "M40 130 L36 165 Q40 172 48 174 L52 136 Q46 134 40 130 Z"
            }
            fill={`url(#skinGradient-${gender})`}
          />
          <path
            d={isMale
              ? "M82 125 L85 160 Q82 168 75 170 L70 130 Q75 128 82 125 Z"
              : "M80 130 L84 165 Q80 172 72 174 L68 136 Q74 134 80 130 Z"
            }
            fill={`url(#skinGradient-${gender})`}
          />
          
          {/* Inner Thighs */}
          <path
            d={isMale
              ? "M50 130 L52 168 L58 170 L58 132 Q54 132 50 130 Z"
              : "M52 136 L54 172 L58 174 L58 138 Q55 138 52 136 Z"
            }
            fill={`url(#muscleGradient-${gender})`}
            opacity="0.7"
          />
          <path
            d={isMale
              ? "M70 130 L68 168 L62 170 L62 132 Q66 132 70 130 Z"
              : "M68 136 L66 172 L62 174 L62 138 Q65 138 68 136 Z"
            }
            fill={`url(#muscleGradient-${gender})`}
            opacity="0.7"
          />
          
          {/* Lower Legs - Calves */}
          <path
            d={isMale
              ? "M40 170 L38 195 Q42 198 48 195 L50 170 Z"
              : "M42 174 L40 195 Q44 198 50 195 L52 174 Z"
            }
            fill={`url(#skinGradient-${gender})`}
          />
          <path
            d={isMale
              ? "M80 170 L82 195 Q78 198 72 195 L70 170 Z"
              : "M78 174 L80 195 Q76 198 70 195 L68 174 Z"
            }
            fill={`url(#skinGradient-${gender})`}
          />
          
          {/* Highlight overlay */}
          <rect x="30" y="40" width="60" height="80" fill={`url(#highlight-${gender})`} />
        </svg>
      </div>
      
      <span className={cn(
        "text-lg font-semibold transition-all duration-300 pb-2",
        selected ? "text-primary font-bold scale-105" : "text-muted-foreground"
      )}>
        {isMale ? "Homem" : "Mulher"}
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
