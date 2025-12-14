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
        "relative flex flex-col items-center justify-center gap-4 p-6 rounded-3xl border-2 transition-all duration-300 w-full aspect-[3/4]",
        selected
          ? "border-primary bg-primary/10 shadow-[0_0_40px_hsl(var(--primary)/0.4)]"
          : "border-muted bg-secondary hover:border-primary/50",
        className
      )}
    >
      {/* Body Figure SVG */}
      <div className="flex-1 flex items-center justify-center w-full">
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={cn(
            "w-32 h-32 transition-all duration-300",
            selected ? "text-primary" : "text-muted-foreground"
          )}
          style={{
            filter: selected ? "drop-shadow(0 4px 20px hsl(var(--primary) / 0.5))" : "none"
          }}
        >
          {isMale ? (
            <path d="M12 2C10.9 2 10 2.9 10 4s.9 2 2 2 2-.9 2-2-.9-2-2-2zm4 5h-1.5c-.2 0-.4.1-.5.2l-1 1.5c-.3.5-.9.7-1.5.4-.5-.3-.7-.9-.4-1.5l.5-.8C11.8 6.4 12.5 6 13.2 6H16c.6 0 1 .4 1 1v3h1.5c.8 0 1.5.7 1.5 1.5v6c0 .8-.7 1.5-1.5 1.5H17v3c0 .6-.4 1-1 1s-1-.4-1-1v-4h-2v4c0 .6-.4 1-1 1s-1-.4-1-1v-9.5l-1.3 2c-.3.4-.8.5-1.2.2-.4-.3-.5-.8-.2-1.2l2-3c.4-.6 1.1-1 1.7-1H16V7z" />
          ) : (
            <path d="M12 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm3.5 5h-1c-.6 0-1.1.3-1.4.8l-1.1 1.6-1.1-1.6c-.3-.5-.8-.8-1.4-.8h-1c-.8 0-1.5.7-1.5 1.5v3c0 .8.7 1.5 1.5 1.5h.5v6c0 .6.4 1 1 1s1-.4 1-1v-4h2v4c0 .6.4 1 1 1s1-.4 1-1v-6h.5c.8 0 1.5-.7 1.5-1.5v-3c0-.8-.7-1.5-1.5-1.5z" />
          )}
        </svg>
      </div>

      {/* Label */}
      <span className={cn(
        "text-xl font-semibold transition-all duration-300",
        selected ? "text-primary font-bold" : "text-muted-foreground"
      )}>
        {isMale ? "Homem" : "Mulher"}
      </span>

      {/* Selection Checkmark */}
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
