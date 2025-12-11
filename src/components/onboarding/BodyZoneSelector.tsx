import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

type BodyZone = "arms" | "abs" | "glutes" | "legs" | "fullBody";

interface BodyZoneSelectorProps {
  gender: "male" | "female";
  selected: BodyZone[];
  onChange: (zones: BodyZone[]) => void;
  className?: string;
}

const bodyZones: { id: BodyZone; label: string; yPosition: number }[] = [
  { id: "arms", label: "Braços", yPosition: 22 },
  { id: "abs", label: "Abdômen", yPosition: 38 },
  { id: "glutes", label: "Glúteos", yPosition: 52 },
  { id: "legs", label: "Pernas", yPosition: 70 },
  { id: "fullBody", label: "Corpo Inteiro", yPosition: 90 },
];

export const BodyZoneSelector: React.FC<BodyZoneSelectorProps> = ({
  gender,
  selected,
  onChange,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [buttonPositions, setButtonPositions] = useState<{ [key: string]: { x: number; y: number } }>({});
  const [bodyPoints] = useState<{ [key: string]: { x: number; y: number } }>({
    arms: { x: 38, y: 28 },
    abs: { x: 50, y: 42 },
    glutes: { x: 50, y: 55 },
    legs: { x: 42, y: 72 },
    fullBody: { x: 50, y: 50 },
  });

  const toggleZone = (zone: BodyZone) => {
    if (selected.includes(zone)) {
      onChange(selected.filter((z) => z !== zone));
    } else {
      onChange([...selected, zone]);
    }
  };

  useEffect(() => {
    const updatePositions = () => {
      if (!containerRef.current) return;
      const buttons = containerRef.current.querySelectorAll("[data-zone]");
      const newPositions: { [key: string]: { x: number; y: number } } = {};
      
      buttons.forEach((button) => {
        const zone = button.getAttribute("data-zone");
        if (zone) {
          const rect = button.getBoundingClientRect();
          const containerRect = containerRef.current!.getBoundingClientRect();
          newPositions[zone] = {
            x: rect.left - containerRect.left,
            y: rect.top - containerRect.top + rect.height / 2,
          };
        }
      });
      
      setButtonPositions(newPositions);
    };

    updatePositions();
    window.addEventListener("resize", updatePositions);
    return () => window.removeEventListener("resize", updatePositions);
  }, []);

  const isMale = gender === "male";

  return (
    <div ref={containerRef} className={cn("relative flex gap-4 items-center", className)}>
      {/* Body Image Container */}
      <div className="relative flex-shrink-0 w-[45%]">
        {/* Placeholder Body Silhouette */}
        <div className="relative aspect-[3/5] w-full">
          {/* Body Silhouette SVG */}
          <svg
            viewBox="0 0 100 160"
            className="w-full h-full"
            style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.1))" }}
          >
            {/* Body shape - simplified human silhouette */}
            <defs>
              <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isMale ? "#E8D4C4" : "#F5E1D0"} />
                <stop offset="100%" stopColor={isMale ? "#D4C0B0" : "#EACED4"} />
              </linearGradient>
            </defs>
            
            {/* Head */}
            <ellipse cx="50" cy="15" rx="12" ry="14" fill="url(#bodyGradient)" />
            
            {/* Neck */}
            <rect x="45" y="28" width="10" height="8" fill="url(#bodyGradient)" />
            
            {/* Torso */}
            <path
              d={isMale 
                ? "M30 36 Q25 36 25 45 L25 75 Q25 82 35 85 L35 95 L65 95 L65 85 Q75 82 75 75 L75 45 Q75 36 70 36 Z"
                : "M32 36 Q22 40 25 50 L23 75 Q25 85 35 88 L35 95 L65 95 L65 88 Q75 85 77 75 L75 50 Q78 40 68 36 Z"
              }
              fill="url(#bodyGradient)"
            />
            
            {/* Arms */}
            <path
              d={isMale
                ? "M25 38 Q15 40 12 55 L10 75 Q8 80 12 82 L18 82 L22 55 L25 45 Z"
                : "M25 40 Q18 42 15 55 L13 72 Q11 77 15 79 L20 79 L24 55 L27 45 Z"
              }
              fill="url(#bodyGradient)"
            />
            <path
              d={isMale
                ? "M75 38 Q85 40 88 55 L90 75 Q92 80 88 82 L82 82 L78 55 L75 45 Z"
                : "M75 40 Q82 42 85 55 L87 72 Q89 77 85 79 L80 79 L76 55 L73 45 Z"
              }
              fill="url(#bodyGradient)"
            />
            
            {/* Legs */}
            <path
              d={isMale
                ? "M35 95 L32 140 Q31 150 38 152 L44 152 L48 95 Z"
                : "M35 95 L30 140 Q29 150 36 152 L44 152 L48 95 Z"
              }
              fill="url(#bodyGradient)"
            />
            <path
              d={isMale
                ? "M65 95 L68 140 Q69 150 62 152 L56 152 L52 95 Z"
                : "M65 95 L70 140 Q71 150 64 152 L56 152 L52 95 Z"
              }
              fill="url(#bodyGradient)"
            />

            {/* Sports Wear */}
            {isMale ? (
              <>
                {/* Shorts */}
                <path d="M35 85 L32 105 L50 108 L68 105 L65 85 Z" fill="#2D3748" />
              </>
            ) : (
              <>
                {/* Sports Bra */}
                <path d="M32 42 Q30 50 35 55 L65 55 Q70 50 68 42 L60 40 Q50 44 40 40 Z" fill="#2D3748" />
                {/* Shorts */}
                <path d="M33 85 L30 100 L50 103 L70 100 L67 85 Z" fill="#2D3748" />
              </>
            )}
          </svg>

          {/* Glow Overlays for selected zones */}
          {selected.includes("arms") && (
            <>
              <div 
                className="absolute w-8 h-16 rounded-full bg-primary/40 blur-md animate-pulse"
                style={{ left: "8%", top: "22%", transform: "rotate(-15deg)" }}
              />
              <div 
                className="absolute w-8 h-16 rounded-full bg-primary/40 blur-md animate-pulse"
                style={{ right: "8%", top: "22%", transform: "rotate(15deg)" }}
              />
            </>
          )}
          {selected.includes("abs") && (
            <div 
              className="absolute w-14 h-14 rounded-full bg-primary/40 blur-md animate-pulse"
              style={{ left: "50%", top: "35%", transform: "translate(-50%, -50%)" }}
            />
          )}
          {selected.includes("glutes") && (
            <div 
              className="absolute w-16 h-10 rounded-full bg-primary/40 blur-md animate-pulse"
              style={{ left: "50%", top: "52%", transform: "translate(-50%, -50%)" }}
            />
          )}
          {selected.includes("legs") && (
            <>
              <div 
                className="absolute w-8 h-20 rounded-full bg-primary/40 blur-md animate-pulse"
                style={{ left: "28%", top: "65%", transform: "translate(-50%, 0)" }}
              />
              <div 
                className="absolute w-8 h-20 rounded-full bg-primary/40 blur-md animate-pulse"
                style={{ right: "28%", top: "65%", transform: "translate(50%, 0)" }}
              />
            </>
          )}
          {selected.includes("fullBody") && (
            <div 
              className="absolute inset-0 bg-primary/20 blur-lg animate-pulse rounded-full"
              style={{ margin: "10%" }}
            />
          )}

          {/* Connection Points */}
          {selected.map((zone) => {
            const point = bodyPoints[zone];
            if (!point) return null;
            return (
              <div
                key={`point-${zone}`}
                className="absolute w-3 h-3 bg-white border-2 border-primary rounded-full shadow-sm z-10"
                style={{
                  left: `${point.x}%`,
                  top: `${point.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            );
          })}
        </div>
      </div>

      {/* SVG Lines Container */}
      <svg className="absolute inset-0 pointer-events-none overflow-visible" style={{ zIndex: 5 }}>
        {selected.map((zone) => {
          const buttonPos = buttonPositions[zone];
          const bodyPoint = bodyPoints[zone];
          if (!buttonPos || !bodyPoint) return null;

          const containerWidth = containerRef.current?.offsetWidth || 0;
          const containerHeight = containerRef.current?.offsetHeight || 0;
          const bodyWidth = containerWidth * 0.45;
          const bodyHeight = bodyWidth * (5 / 3);
          
          const startX = buttonPos.x;
          const startY = buttonPos.y;
          const endX = bodyWidth * (bodyPoint.x / 100);
          const endY = bodyHeight * (bodyPoint.y / 100);

          return (
            <g key={`line-${zone}`}>
              <line
                x1={startX}
                y1={startY}
                x2={endX}
                y2={endY}
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>
          );
        })}
      </svg>

      {/* Buttons */}
      <div className="flex-1 flex flex-col gap-3">
        {bodyZones.map((zone) => {
          const isSelected = selected.includes(zone.id);
          return (
            <button
              key={zone.id}
              data-zone={zone.id}
              onClick={() => toggleZone(zone.id)}
              className={cn(
                "relative flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all duration-300",
                isSelected
                  ? "border-primary bg-coral-light text-primary"
                  : "border-border bg-card text-foreground hover:border-primary/30"
              )}
            >
              <div
                className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                  isSelected
                    ? "border-primary bg-primary"
                    : "border-muted-foreground/30 bg-transparent"
                )}
              >
                {isSelected && <Check className="w-4 h-4 text-white" />}
              </div>
              <span className="font-medium">{zone.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
