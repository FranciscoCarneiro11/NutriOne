import React, { useRef, useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface TargetWeightStepProps {
  value: number;
  onChange: (value: number) => void;
  minWeight?: number;
  maxWeight?: number;
  unit?: "kg" | "lb";
  className?: string;
}

export const TargetWeightStep: React.FC<TargetWeightStepProps> = ({
  value,
  onChange,
  minWeight = 40,
  maxWeight = 150,
  unit = "kg",
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [displayUnit, setDisplayUnit] = useState(unit);

  const kgToLb = (kg: number) => Math.round(kg * 2.205);
  const lbToKg = (lb: number) => Math.round(lb / 2.205);

  const displayValue =
    displayUnit === "lb" ? kgToLb(value) : Math.round(value * 10) / 10;

  const weights = Array.from(
    { length: (maxWeight - minWeight) * 2 + 1 },
    (_, i) => minWeight + i * 0.5
  );

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const scrollLeft = container.scrollLeft;
    const itemWidth = 16;
    const index = Math.round(scrollLeft / itemWidth);
    const newWeight = weights[Math.min(Math.max(index, 0), weights.length - 1)];
    if (newWeight !== value) {
      onChange(newWeight);
    }
  }, [weights, value, onChange]);

  useEffect(() => {
    if (!containerRef.current || isDragging) return;
    const container = containerRef.current;
    const index = weights.indexOf(value);
    if (index !== -1) {
      const itemWidth = 16;
      const scrollPosition = index * itemWidth;
      container.scrollLeft = scrollPosition;
    }
  }, [value, weights, isDragging]);

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <h1 className="text-3xl font-bold text-center text-foreground mb-2 leading-tight">
        Qual é o seu <span className="text-coral">peso ideal</span>?
      </h1>
      <p className="text-center text-muted-foreground mb-8">
        Defina sua meta de peso
      </p>

      {/* Unit Toggle */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setDisplayUnit("kg")}
          className={cn(
            "px-6 py-2 rounded-full text-sm font-medium transition-all",
            displayUnit === "kg"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          )}
        >
          KG
        </button>
        <button
          onClick={() => setDisplayUnit("lb")}
          className={cn(
            "px-6 py-2 rounded-full text-sm font-medium transition-all",
            displayUnit === "lb"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          )}
        >
          LB
        </button>
      </div>

      {/* Weight Display */}
      <div className="text-7xl font-bold text-foreground mb-2">
        {displayUnit === "lb" ? displayValue : value.toFixed(1)}
      </div>
      <div className="text-lg text-muted-foreground mb-8">{displayUnit}</div>

      {/* Ruler */}
      <div className="relative w-full">
        {/* Center indicator */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-1 h-16 bg-primary z-10 rounded-full" />

        {/* Scrollable ruler */}
        <div
          ref={containerRef}
          className="overflow-x-auto hide-scrollbar py-4"
          onScroll={handleScroll}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
        >
          <div
            className="flex items-end gap-[12px]"
            style={{ paddingLeft: "50%", paddingRight: "50%" }}
          >
            {weights.map((weight, index) => {
              const isMajor = weight % 5 === 0;
              const isHalf = weight % 1 === 0 && weight % 5 !== 0;
              return (
                <div
                  key={index}
                  className={cn(
                    "flex-shrink-0 rounded-full transition-all duration-200",
                    isMajor
                      ? "w-1 h-12 bg-foreground"
                      : isHalf
                      ? "w-0.5 h-8 bg-muted-foreground/60"
                      : "w-0.5 h-4 bg-muted-foreground/30"
                  )}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
