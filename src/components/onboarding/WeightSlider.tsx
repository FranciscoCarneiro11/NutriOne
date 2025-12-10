import React, { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";

interface WeightSliderProps {
  value: number;
  onChange: (value: number) => void;
  minWeight?: number;
  maxWeight?: number;
  step?: number;
  unit?: "kg" | "lb";
  className?: string;
}

export const WeightSlider: React.FC<WeightSliderProps> = ({
  value,
  onChange,
  minWeight = 40,
  maxWeight = 150,
  step = 0.1,
  unit = "kg",
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [displayUnit, setDisplayUnit] = useState(unit);

  const kgToLb = (kg: number) => Math.round(kg * 2.205 * 10) / 10;
  const displayValue = displayUnit === "lb" ? kgToLb(value) : value;

  const marks = [];
  for (let w = minWeight; w <= maxWeight; w += step) {
    const rounded = Math.round(w * 10) / 10;
    const isMajor = rounded % 5 === 0;
    const isMedium = rounded % 1 === 0 && !isMajor;
    marks.push({ weight: rounded, isMajor, isMedium });
  }

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const scrollLeft = container.scrollLeft;
    const itemWidth = 8;
    const centerOffset = container.clientWidth / 2;
    const rawValue = minWeight + (scrollLeft + centerOffset - container.clientWidth / 2) / itemWidth * step;
    const newValue = Math.max(minWeight, Math.min(maxWeight, Math.round(rawValue * 10) / 10));
    if (Math.abs(newValue - value) >= step) {
      onChange(newValue);
    }
  }, [value, onChange, minWeight, maxWeight, step]);

  useEffect(() => {
    if (!containerRef.current || isDragging) return;
    const container = containerRef.current;
    const itemWidth = 8;
    const targetScroll = ((value - minWeight) / step) * itemWidth;
    container.scrollLeft = targetScroll;
  }, [value, minWeight, step, isDragging]);

  return (
    <div className={cn("flex flex-col items-center w-full", className)}>
      {/* Unit Toggle */}
      <div className="flex items-center gap-2 mb-6 p-1 bg-muted rounded-full">
        <button
          onClick={() => setDisplayUnit("kg")}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all",
            displayUnit === "kg"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground"
          )}
        >
          kg
        </button>
        <button
          onClick={() => setDisplayUnit("lb")}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all",
            displayUnit === "lb"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground"
          )}
        >
          lb
        </button>
      </div>

      {/* Display Value */}
      <div className="flex items-baseline gap-2 mb-8">
        <span className="text-7xl font-bold text-foreground tracking-tight">
          {displayValue.toFixed(1)}
        </span>
        <span className="text-2xl font-medium text-muted-foreground">
          {displayUnit}
        </span>
      </div>

      {/* Slider Container */}
      <div className="relative w-full h-20">
        {/* Center Indicator */}
        <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 z-10 flex flex-col items-center pointer-events-none">
          <div className="w-0.5 h-full bg-primary" />
          <div className="absolute top-0 w-3 h-3 rounded-full bg-primary -translate-y-1" />
        </div>

        {/* Ruler */}
        <div
          ref={containerRef}
          className="w-full h-full overflow-x-auto hide-scrollbar flex items-end"
          onScroll={handleScroll}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
        >
          <div style={{ minWidth: "50%" }} />
          <div className="flex items-end h-full">
            {marks.map(({ weight, isMajor, isMedium }) => (
              <div
                key={weight}
                className="flex flex-col items-center w-2"
              >
                <span
                  className={cn(
                    "text-xs font-medium mb-1 transition-opacity whitespace-nowrap",
                    isMajor ? "opacity-100 text-muted-foreground" : "opacity-0"
                  )}
                >
                  {isMajor && Math.round(weight)}
                </span>
                <div
                  className={cn(
                    "w-0.5 rounded-full transition-all",
                    Math.abs(weight - value) < step / 2
                      ? "h-10 bg-primary"
                      : isMajor
                      ? "h-8 bg-foreground/40"
                      : isMedium
                      ? "h-5 bg-foreground/20"
                      : "h-3 bg-foreground/10"
                  )}
                />
              </div>
            ))}
          </div>
          <div style={{ minWidth: "50%" }} />
        </div>
      </div>

      {/* Goal Info Card */}
      <div className="mt-8 w-full p-4 bg-coral-light rounded-2xl">
        <h4 className="font-semibold text-foreground mb-1">Objetivo razoável</h4>
        <p className="text-sm text-muted-foreground">
          Você vai perder 11% do seu peso. Há evidências científicas de que algumas condições
          relacionadas à obesidade melhoram com uma perda de peso igual ou superior a 10%.
        </p>
      </div>
    </div>
  );
};
