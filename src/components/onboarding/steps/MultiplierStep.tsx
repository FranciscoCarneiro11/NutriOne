import React from "react";
import { cn } from "@/lib/utils";

interface MultiplierStepProps {
  appName?: string;
  className?: string;
}

export const MultiplierStep: React.FC<MultiplierStepProps> = ({
  appName = "NutriFit",
  className,
}) => {
  return (
    <div className={cn("flex flex-col", className)}>
      <h1 className="text-3xl font-bold text-foreground mb-8 leading-tight">
        Ganhar duas vezes mais perda de peso com {appName} sozinho
      </h1>

      <div className="bg-white rounded-3xl p-8 shadow-card">
        {/* Bar Chart */}
        <div className="flex justify-center gap-8 mb-6">
          {/* Without App */}
          <div className="flex flex-col items-center">
            <p className="text-sm font-medium text-muted-foreground mb-4 text-center">
              Sem<br />{appName}
            </p>
            <div className="relative w-24 h-48 bg-secondary rounded-2xl flex flex-col justify-end items-center pb-4">
              <div className="bg-secondary rounded-xl w-16 h-8 flex items-center justify-center">
                <span className="text-sm font-semibold text-muted-foreground">20%</span>
              </div>
            </div>
          </div>

          {/* With App */}
          <div className="flex flex-col items-center">
            <p className="text-sm font-medium text-muted-foreground mb-4 text-center">
              Com<br />{appName}
            </p>
            <div className="relative w-24 h-48 bg-secondary rounded-2xl flex flex-col justify-end items-center overflow-hidden">
              <div className="absolute bottom-0 w-full h-3/4 bg-primary rounded-2xl flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-foreground">2X</span>
              </div>
            </div>
          </div>
        </div>

        {/* Caption */}
        <p className="text-center text-muted-foreground text-sm">
          {appName} facilita e mantém responsabilize você.
        </p>
      </div>
    </div>
  );
};
