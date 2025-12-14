import React from "react";
import { cn } from "@/lib/utils";

interface LongTermSuccessStepProps {
  appName?: string;
  className?: string;
}

export const LongTermSuccessStep: React.FC<LongTermSuccessStepProps> = ({
  appName = "NutriOne",
  className,
}) => {
  return (
    <div className={cn("flex flex-col", className)}>
      <h1 className="text-3xl font-bold text-foreground mb-8 leading-tight">
        {appName} cria resultados a longo prazo
      </h1>

      <div className="bg-white rounded-3xl p-6 shadow-card">
        <p className="text-sm text-muted-foreground mb-4">Progresso de Saúde</p>

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

            {/* Y-axis labels */}
            <text x="12" y="25" fontSize="9" fill="#999" textAnchor="middle">90%</text>
            <text x="12" y="75" fontSize="9" fill="#999" textAnchor="middle">60%</text>
            <text x="12" y="123" fontSize="9" fill="#999" textAnchor="middle">40%</text>

            {/* Without App Line (Gray dashed - stagnation) */}
            <path
              d="M 35 100 Q 100 95 150 90 Q 200 88 275 85"
              fill="none"
              stroke="#9CA3AF"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="6,4"
            />

            {/* With App Line (Black - significant progress) with gradient fill */}
            <defs>
              <linearGradient id="appGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#000000" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </linearGradient>
            </defs>
            
            {/* Gradient fill area */}
            <path
              d="M 35 100 Q 80 85 120 60 Q 180 35 275 25 L 275 120 L 35 120 Z"
              fill="url(#appGradient)"
            />
            
            {/* Main app line */}
            <path
              d="M 35 100 Q 80 85 120 60 Q 180 35 275 25"
              fill="none"
              stroke="#000000"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Start point marker (shared) */}
            <circle cx="35" cy="100" r="6" fill="white" stroke="#000" strokeWidth="2" />
            
            {/* End point marker for app line */}
            <circle cx="275" cy="25" r="6" fill="white" stroke="#000" strokeWidth="2" />
            
            {/* End point marker for without app line */}
            <circle cx="275" cy="85" r="5" fill="white" stroke="#9CA3AF" strokeWidth="2" />

            {/* Labels */}
            <text x="245" y="75" fontSize="10" fill="#9CA3AF" fontWeight="500">Sem o App</text>
          </svg>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-full">
            <div className="w-3 h-3 bg-black rounded-full" />
            <span className="text-xs font-medium">Com {appName}</span>
          </div>
          <div className="flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-full">
            <div className="w-3 h-3 border-2 border-gray-400 rounded-full bg-white" style={{ borderStyle: 'dashed' }} />
            <span className="text-xs text-muted-foreground">Sem o App</span>
          </div>
        </div>

        {/* X-axis labels */}
        <div className="flex justify-between text-sm text-muted-foreground px-2">
          <span>Semana 1</span>
          <span>Semana 4</span>
        </div>

        {/* Stats */}
        <p className="text-center text-muted-foreground mt-6 text-sm">
          Usuários do {appName} alcançam <strong className="text-foreground">90% de progresso</strong> em apenas 4 semanas
        </p>
      </div>
    </div>
  );
};
