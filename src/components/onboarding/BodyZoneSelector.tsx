import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import maleFigure from "@/assets/male-figure.png";
import femaleFigure from "@/assets/female-figure.png";

type BodyZone = "arms" | "abs" | "glutes" | "legs" | "fullBody";

interface BodyZoneSelectorProps {
  gender: "male" | "female";
  selected: BodyZone[];
  onChange: (zones: BodyZone[]) => void;
  className?: string;
}

const bodyZones: { id: BodyZone; label: string }[] = [
  { id: "arms", label: "Braços" },
  { id: "abs", label: "Abdômen" },
  { id: "glutes", label: "Glúteos" },
  { id: "legs", label: "Pernas" },
  { id: "fullBody", label: "Corpo Inteiro" },
];

// Heatmap overlay positions for each body zone (percentage-based)
const maleHeatmapZones: Record<BodyZone, { areas: { top: string; left: string; width: string; height: string; rotate?: string }[] }> = {
  arms: {
    areas: [
      { top: "24%", left: "12%", width: "18%", height: "22%", rotate: "-8deg" },
      { top: "24%", left: "70%", width: "18%", height: "22%", rotate: "8deg" },
    ],
  },
  abs: {
    areas: [
      { top: "32%", left: "35%", width: "30%", height: "18%" },
    ],
  },
  glutes: {
    areas: [
      { top: "48%", left: "32%", width: "36%", height: "12%" },
    ],
  },
  legs: {
    areas: [
      { top: "58%", left: "28%", width: "20%", height: "32%" },
      { top: "58%", left: "52%", width: "20%", height: "32%" },
    ],
  },
  fullBody: {
    areas: [
      { top: "18%", left: "20%", width: "60%", height: "72%" },
    ],
  },
};

const femaleHeatmapZones: Record<BodyZone, { areas: { top: string; left: string; width: string; height: string; rotate?: string }[] }> = {
  arms: {
    areas: [
      { top: "22%", left: "8%", width: "16%", height: "20%", rotate: "-12deg" },
      { top: "22%", left: "76%", width: "16%", height: "20%", rotate: "12deg" },
    ],
  },
  abs: {
    areas: [
      { top: "30%", left: "33%", width: "34%", height: "16%" },
    ],
  },
  glutes: {
    areas: [
      { top: "44%", left: "30%", width: "40%", height: "12%" },
    ],
  },
  legs: {
    areas: [
      { top: "54%", left: "26%", width: "22%", height: "36%" },
      { top: "54%", left: "52%", width: "22%", height: "36%" },
    ],
  },
  fullBody: {
    areas: [
      { top: "16%", left: "18%", width: "64%", height: "76%" },
    ],
  },
};

// Connection points on the body figure (percentage-based)
const maleBodyPoints: Record<BodyZone, { x: number; y: number }> = {
  arms: { x: 75, y: 28 },
  abs: { x: 50, y: 40 },
  glutes: { x: 50, y: 54 },
  legs: { x: 60, y: 72 },
  fullBody: { x: 50, y: 50 },
};

const femaleBodyPoints: Record<BodyZone, { x: number; y: number }> = {
  arms: { x: 80, y: 26 },
  abs: { x: 50, y: 38 },
  glutes: { x: 50, y: 50 },
  legs: { x: 60, y: 70 },
  fullBody: { x: 50, y: 48 },
};

export const BodyZoneSelector: React.FC<BodyZoneSelectorProps> = ({
  gender,
  selected,
  onChange,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const figureRef = useRef<HTMLDivElement>(null);
  const [buttonPositions, setButtonPositions] = useState<Record<string, { x: number; y: number }>>({});

  const toggleZone = (zone: BodyZone) => {
    if (selected.includes(zone)) {
      onChange(selected.filter((z) => z !== zone));
    } else {
      onChange([...selected, zone]);
    }
  };

  const isMale = gender === "male";
  const heatmapZones = isMale ? maleHeatmapZones : femaleHeatmapZones;
  const bodyPoints = isMale ? maleBodyPoints : femaleBodyPoints;
  const figureImage = isMale ? maleFigure : femaleFigure;

  // Update button positions for connecting lines
  useEffect(() => {
    const updatePositions = () => {
      if (!containerRef.current) return;
      const buttons = containerRef.current.querySelectorAll("[data-zone]");
      const newPositions: Record<string, { x: number; y: number }> = {};

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

  return (
    <div ref={containerRef} className={cn("relative flex flex-col md:flex-row items-center gap-4 md:gap-8 lg:gap-12", className)}>
      {/* Body Figure with Heatmap Overlays */}
      <div ref={figureRef} className="relative flex-shrink-0 w-[60%] md:w-[45%] lg:w-[40%] max-w-[280px] md:max-w-[320px]">
        {/* Background Glow Effect */}
        <div 
          className={cn(
            "absolute inset-0 rounded-[60px] transition-all duration-500",
            selected.length > 0 ? "opacity-100" : "opacity-0"
          )}
          style={{
            background: "radial-gradient(ellipse at center, hsl(var(--primary) / 0.15) 0%, transparent 70%)",
            filter: "blur(20px)",
            transform: "scale(1.1)",
          }}
        />

        {/* Body Figure Container */}
        <div className="relative aspect-[3/5] w-full">
          {/* Base Body Image */}
          <img
            src={figureImage}
            alt={`${gender} body figure`}
            className="w-full h-full object-contain relative z-10"
            style={{
              filter: selected.length > 0 
                ? "drop-shadow(0 0 15px hsl(var(--primary) / 0.3))" 
                : "drop-shadow(0 4px 12px rgba(0,0,0,0.1))",
            }}
          />

          {/* Heatmap Overlays */}
          {selected.map((zone) => {
            const zoneData = heatmapZones[zone];
            return zoneData.areas.map((area, index) => (
              <div
                key={`${zone}-${index}`}
                className="absolute z-20 pointer-events-none"
                style={{
                  top: area.top,
                  left: area.left,
                  width: area.width,
                  height: area.height,
                  transform: area.rotate ? `rotate(${area.rotate})` : undefined,
                }}
              >
                {/* Multi-layer glow effect for heatmap */}
                <div
                  className="absolute inset-0 rounded-[50%] animate-pulse"
                  style={{
                    background: `radial-gradient(ellipse at center, 
                      hsl(var(--primary) / 0.8) 0%, 
                      hsl(var(--primary) / 0.5) 30%, 
                      hsl(var(--primary) / 0.2) 60%, 
                      transparent 100%)`,
                    filter: "blur(6px)",
                  }}
                />
                {/* Inner intense glow */}
                <div
                  className="absolute inset-[20%] rounded-[50%]"
                  style={{
                    background: `radial-gradient(ellipse at center, 
                      hsl(var(--primary) / 0.9) 0%, 
                      hsl(var(--primary) / 0.4) 70%, 
                      transparent 100%)`,
                    filter: "blur(3px)",
                    animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                  }}
                />
              </div>
            ));
          })}

          {/* Full body outline glow when selected */}
          {selected.includes("fullBody") && (
            <div
              className="absolute inset-0 z-5 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at center, 
                  hsl(var(--primary) / 0.25) 20%, 
                  hsl(var(--primary) / 0.1) 50%, 
                  transparent 80%)`,
                filter: "blur(12px)",
                animation: "pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              }}
            />
          )}

          {/* Connection Points on Body */}
          {selected.map((zone) => {
            const point = bodyPoints[zone];
            if (!point) return null;
            return (
              <div
                key={`point-${zone}`}
                className="absolute w-3 h-3 bg-background border-2 border-primary rounded-full shadow-md z-30"
                style={{
                  left: `${point.x}%`,
                  top: `${point.y}%`,
                  transform: "translate(-50%, -50%)",
                  boxShadow: "0 0 8px hsl(var(--primary) / 0.5)",
                }}
              />
            );
          })}
        </div>
      </div>

      {/* SVG Lines Container */}
      <svg className="absolute inset-0 pointer-events-none overflow-visible" style={{ zIndex: 25 }}>
        {selected.map((zone) => {
          const buttonPos = buttonPositions[zone];
          const bodyPoint = bodyPoints[zone];
          if (!buttonPos || !bodyPoint || !figureRef.current) return null;

          const figureWidth = figureRef.current.offsetWidth;
          const figureHeight = figureWidth * (5 / 3);

          const startX = buttonPos.x;
          const startY = buttonPos.y;
          const endX = figureWidth * (bodyPoint.x / 100);
          const endY = figureHeight * (bodyPoint.y / 100);

          return (
            <g key={`line-${zone}`}>
              {/* Glow effect line */}
              <line
                x1={startX}
                y1={startY}
                x2={endX}
                y2={endY}
                stroke="hsl(var(--primary))"
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.3"
                style={{ filter: "blur(2px)" }}
              />
              {/* Main line */}
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

      {/* Selection Buttons - Vertical Stack */}
      <div className="flex-1 flex flex-col gap-2.5">
        {bodyZones.map((zone) => {
          const isSelected = selected.includes(zone.id);
          return (
            <button
              key={zone.id}
              data-zone={zone.id}
              onClick={() => toggleZone(zone.id)}
              className={cn(
                "relative flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300",
                "text-sm font-medium",
                isSelected
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
              style={{
                boxShadow: isSelected 
                  ? "0 4px 16px hsl(var(--primary) / 0.35)" 
                  : undefined,
              }}
            >
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                  isSelected
                    ? "border-primary-foreground/50 bg-primary-foreground/20"
                    : "border-muted-foreground/30 bg-transparent"
                )}
              >
                {isSelected && <Check className="w-3 h-3" />}
              </div>
              <span>{zone.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
