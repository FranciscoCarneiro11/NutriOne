import React from "react";
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

export const BodyZoneSelector: React.FC<BodyZoneSelectorProps> = ({
  gender,
  selected,
  onChange,
  className,
}) => {
  const toggleZone = (zone: BodyZone) => {
    if (selected.includes(zone)) {
      onChange(selected.filter((z) => z !== zone));
    } else {
      onChange([...selected, zone]);
    }
  };

  const isMale = gender === "male";
  const heatmapZones = isMale ? maleHeatmapZones : femaleHeatmapZones;
  const figureImage = isMale ? maleFigure : femaleFigure;

  return (
    <div className={cn("flex flex-col items-center gap-6", className)}>
      {/* Body Figure with Heatmap Overlays */}
      <div className="relative w-full max-w-[280px] mx-auto">
        {/* Background Glow Effect */}
        <div 
          className={cn(
            "absolute inset-0 rounded-[60px] transition-all duration-500",
            selected.length > 0 ? "opacity-100" : "opacity-0"
          )}
          style={{
            background: "radial-gradient(ellipse at center, hsl(var(--primary) / 0.15) 0%, transparent 70%)",
            filter: "blur(30px)",
            transform: "scale(1.1)",
          }}
        />

        {/* Body Figure Container */}
        <div className="relative aspect-[3/5] w-full">
          {/* Base Body Image */}
          <img
            src={figureImage}
            alt={`${gender} body figure`}
            className="w-full h-full object-contain relative z-10 drop-shadow-lg"
            style={{
              filter: selected.length > 0 
                ? "drop-shadow(0 0 20px hsl(var(--primary) / 0.3))" 
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
                    filter: "blur(8px)",
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
                    filter: "blur(4px)",
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
                filter: "blur(15px)",
                animation: "pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              }}
            />
          )}
        </div>
      </div>

      {/* Selection Buttons - Horizontal Pills */}
      <div className="w-full flex flex-wrap justify-center gap-2 mt-2">
        {bodyZones.map((zone) => {
          const isSelected = selected.includes(zone.id);
          return (
            <button
              key={zone.id}
              onClick={() => toggleZone(zone.id)}
              className={cn(
                "relative flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300",
                "text-sm font-medium",
                isSelected
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
              style={{
                boxShadow: isSelected 
                  ? "0 4px 20px hsl(var(--primary) / 0.4)" 
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

      {/* Selection Counter */}
      {selected.length > 0 && (
        <p className="text-sm text-muted-foreground text-center animate-fade-in">
          {selected.length} {selected.length === 1 ? "área selecionada" : "áreas selecionadas"}
        </p>
      )}
    </div>
  );
};
