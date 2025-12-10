import React, { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";

interface AgeScrollerProps {
  value: number;
  onChange: (value: number) => void;
  minAge?: number;
  maxAge?: number;
  className?: string;
}

export const AgeScroller: React.FC<AgeScrollerProps> = ({
  value,
  onChange,
  minAge = 16,
  maxAge = 80,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const ages = [];
  for (let a = minAge; a <= maxAge; a++) {
    ages.push(a);
  }

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const scrollLeft = container.scrollLeft;
    const itemWidth = 80;
    const centerOffset = container.clientWidth / 2;
    const selectedIndex = Math.round((scrollLeft + centerOffset - container.clientWidth / 2) / itemWidth);
    const newValue = Math.max(minAge, Math.min(maxAge, minAge + selectedIndex));
    if (newValue !== value) {
      onChange(newValue);
    }
  }, [value, onChange, minAge, maxAge]);

  useEffect(() => {
    if (!containerRef.current || isDragging) return;
    const container = containerRef.current;
    const itemWidth = 80;
    const targetScroll = (value - minAge) * itemWidth;
    container.scrollLeft = targetScroll;
  }, [value, minAge, isDragging]);

  return (
    <div className={cn("flex flex-col items-center w-full", className)}>
      {/* Display Value */}
      <div className="flex items-baseline gap-2 mb-8">
        <span className="text-8xl font-bold text-foreground tracking-tight">
          {value}
        </span>
        <span className="text-2xl font-medium text-muted-foreground">
          anos
        </span>
      </div>

      {/* Scroller Container */}
      <div className="relative w-full h-24">
        {/* Center Indicator */}
        <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 z-10 flex flex-col items-center pointer-events-none">
          <div className="w-1 h-full bg-primary rounded-full" />
        </div>

        {/* Age Scroller */}
        <div
          ref={containerRef}
          className="w-full h-full overflow-x-auto hide-scrollbar flex items-center"
          onScroll={handleScroll}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
        >
          <div style={{ minWidth: "50%" }} />
          <div className="flex items-center h-full">
            {ages.map((age) => {
              const isSelected = age === value;
              const distance = Math.abs(age - value);
              const opacity = Math.max(0.3, 1 - distance * 0.15);
              const scale = isSelected ? 1.2 : Math.max(0.7, 1 - distance * 0.1);

              return (
                <div
                  key={age}
                  className="flex flex-col items-center justify-center w-20"
                  style={{ opacity }}
                >
                  <span
                    className={cn(
                      "font-bold transition-all duration-200",
                      isSelected 
                        ? "text-3xl text-primary" 
                        : "text-xl text-muted-foreground"
                    )}
                    style={{ transform: `scale(${scale})` }}
                  >
                    {age}
                  </span>
                  <div
                    className={cn(
                      "w-0.5 rounded-full mt-2 transition-all",
                      isSelected
                        ? "h-4 bg-primary"
                        : age % 5 === 0
                        ? "h-3 bg-foreground/30"
                        : "h-2 bg-foreground/15"
                    )}
                  />
                </div>
              );
            })}
          </div>
          <div style={{ minWidth: "50%" }} />
        </div>
      </div>
    </div>
  );
};
