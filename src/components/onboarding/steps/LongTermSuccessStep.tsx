import React from "react";
import { cn } from "@/lib/utils";

interface LongTermSuccessStepProps {
  appName?: string;
  className?: string;
}

export const LongTermSuccessStep: React.FC<LongTermSuccessStepProps> = ({
  appName = "NutriFit",
  className,
}) => {
  return (
    <div className={cn("flex flex-col", className)}>
      <h1 className="text-3xl font-bold text-foreground mb-8 leading-tight">
        {appName} cria resultados a longo prazo
      </h1>

      <div className="bg-white rounded-3xl p-6 shadow-card">
        <p className="text-sm text-muted-foreground mb-4">Seu peso</p>

        {/* SVG Chart */}
        <div className="relative h-48 w-full">
          <svg viewBox="0 0 300 150" className="w-full h-full">
            {/* Grid lines */}
            <line x1="30" y1="20" x2="30" y2="120" stroke="#E5E5E5" strokeWidth="1" />
            <line x1="30" y1="120" x2="280" y2="120" stroke="#E5E5E5" strokeWidth="1" />
            
            {/* Horizontal dashed lines */}
            <line x1="30" y1="40" x2="280" y2="40" stroke="#E5E5E5" strokeWidth="1" strokeDasharray="4,4" />
            <line x1="30" y1="60" x2="280" y2="60" stroke="#E5E5E5" strokeWidth="1" strokeDasharray="4,4" />
            <line x1="30" y1="80" x2="280" y2="80" stroke="#E5E5E5" strokeWidth="1" strokeDasharray="4,4" />
            <line x1="30" y1="100" x2="280" y2="100" stroke="#E5E5E5" strokeWidth="1" strokeDasharray="4,4" />

            {/* Traditional Diet Line (Red - yo-yo effect) */}
            <path
              d="M 35 50 Q 80 90 120 60 Q 160 30 200 50 Q 240 70 275 30"
              fill="none"
              stroke="#EF9A9A"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* App Line (Black - steady decline) */}
            <path
              d="M 35 50 Q 100 60 150 80 Q 200 95 275 110"
              fill="none"
              stroke="#000000"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Start point marker */}
            <circle cx="35" cy="50" r="6" fill="white" stroke="#000" strokeWidth="2" />
            
            {/* End point marker for app line */}
            <circle cx="275" cy="110" r="6" fill="white" stroke="#000" strokeWidth="2" />

            {/* Labels */}
            <text x="200" y="25" fontSize="11" fill="#EF9A9A" fontWeight="500">Dieta tradicional</text>
          </svg>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-full">
            <div className="w-3 h-3 bg-black rounded-full" />
            <span className="text-xs font-medium">{appName}</span>
          </div>
          <span className="text-xs text-muted-foreground bg-secondary px-3 py-1.5 rounded-full">Peso</span>
        </div>

        {/* X-axis labels */}
        <div className="flex justify-between text-sm text-muted-foreground px-2">
          <span>Mês 1</span>
          <span>Mês 6</span>
        </div>

        {/* Stats */}
        <p className="text-center text-muted-foreground mt-6 text-sm">
          80% dos usuários do {appName} mantêm seu perda de peso mesmo 6 meses depois
        </p>
      </div>
    </div>
  );
};
