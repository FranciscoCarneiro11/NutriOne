import React, { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface HeightRulerProps {
  value: number;
  onChange: (value: number) => void;
  minHeight?: number;
  maxHeight?: number;
  unit?: "cm" | "ft";
  className?: string;
}

export const HeightRuler: React.FC<HeightRulerProps> = ({
  value,
  onChange,
  minHeight = 120,
  maxHeight = 220,
  unit = "ft",
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [displayUnit, setDisplayUnit] = useState(unit);

  const cmToFeet = (cm: number) => {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return { feet, inches };
  };

  const formatHeight = (cm: number) => {
    if (displayUnit === "ft") {
      const { feet, inches } = cmToFeet(cm);
      return `${feet}'${inches}"`;
    }
    return `${cm} cm`;
  };

  const rulerMarks = [];
  for (let h = maxHeight; h >= minHeight; h -= 1) {
    const isMajor = h % 10 === 0;
    const isMedium = h % 5 === 0 && !isMajor;
    rulerMarks.push({ height: h, isMajor, isMedium });
  }

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const itemHeight = 12;
    const centerOffset = container.clientHeight / 2;
    const selectedIndex = Math.round((scrollTop + centerOffset - container.clientHeight / 2) / itemHeight);
    const newValue = Math.max(minHeight, Math.min(maxHeight, maxHeight - selectedIndex));
    if (newValue !== value) {
      onChange(newValue);
    }
  }, [value, onChange, minHeight, maxHeight]);

  useEffect(() => {
    if (!containerRef.current || isDragging) return;
    const container = containerRef.current;
    const itemHeight = 12;
    const targetIndex = maxHeight - value;
    const targetScroll = targetIndex * itemHeight;
    container.scrollTop = targetScroll;
  }, [value, maxHeight, isDragging]);

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {/* Unit Toggle */}
      <div className="flex items-center gap-2 mb-6 p-1 bg-muted rounded-full">
        <button
          onClick={() => setDisplayUnit("ft")}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all",
            displayUnit === "ft"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground"
          )}
        >
          ft
        </button>
        <button
          onClick={() => setDisplayUnit("cm")}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all",
            displayUnit === "cm"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground"
          )}
        >
          cm
        </button>
      </div>

      {/* Display Value */}
      <div className="text-6xl font-bold text-foreground mb-8 tracking-tight">
        {formatHeight(value)}
      </div>

      {/* Ruler Container */}
      <div className="relative flex items-center h-64 w-full">
        {/* Center Indicator */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 z-10 flex items-center pointer-events-none">
          <div className="w-2 h-2 rounded-full bg-primary mr-2" />
          <div className="flex-1 h-0.5 bg-primary" />
        </div>

        {/* Ruler */}
        <div
          ref={containerRef}
          className="w-full h-full overflow-y-auto hide-scrollbar"
          onScroll={handleScroll}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
        >
          <div style={{ height: "50%" }} />
          {rulerMarks.map(({ height, isMajor, isMedium }) => (
            <div
              key={height}
              className="flex items-center justify-end h-3 pr-4"
            >
              <span
                className={cn(
                  "text-xs font-medium mr-3 transition-opacity",
                  isMajor ? "opacity-100 text-foreground" : "opacity-0"
                )}
              >
                {isMajor && (displayUnit === "ft" ? Math.round(height / 30.48) : height)}
              </span>
              <div
                className={cn(
                  "h-0.5 rounded-full transition-all",
                  height === value
                    ? "w-16 bg-primary"
                    : isMajor
                    ? "w-12 bg-foreground/40"
                    : isMedium
                    ? "w-8 bg-foreground/20"
                    : "w-4 bg-foreground/10"
                )}
              />
            </div>
          ))}
          <div style={{ height: "50%" }} />
        </div>
      </div>
    </div>
  );
};
