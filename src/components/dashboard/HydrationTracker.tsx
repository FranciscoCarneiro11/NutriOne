import React, { useState, useEffect } from "react";
import { Droplets } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface HydrationTrackerProps {
  goal?: number;
  className?: string;
}

export const HydrationTracker: React.FC<HydrationTrackerProps> = ({ 
  goal = 8,
  className 
}) => {
  const [filled, setFilled] = useState<boolean[]>(Array(goal).fill(false));
  const [isLoading, setIsLoading] = useState(true);

  // Fetch hydration data on mount
  useEffect(() => {
    const fetchHydration = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsLoading(false);
          return;
        }

        const today = new Date().toISOString().split('T')[0];
        
        const { data, error } = await supabase
          .from("hydration_logs")
          .select("cups_filled")
          .eq("user_id", user.id)
          .eq("date", today)
          .maybeSingle();

        if (error) {
          console.error("Error fetching hydration:", error);
        } else if (data) {
          // Set filled state based on cups_filled
          const newFilled = Array(goal).fill(false);
          for (let i = 0; i < Math.min(data.cups_filled, goal); i++) {
            newFilled[i] = true;
          }
          setFilled(newFilled);
        }
      } catch (err) {
        console.error("Failed to fetch hydration:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHydration();
  }, [goal]);

  const saveHydration = async (cupsFilled: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];

      const { error } = await supabase
        .from("hydration_logs")
        .upsert({
          user_id: user.id,
          date: today,
          cups_filled: cupsFilled,
          goal: goal,
        }, {
          onConflict: 'user_id,date'
        });

      if (error) {
        console.error("Error saving hydration:", error);
      }
    } catch (err) {
      console.error("Failed to save hydration:", err);
    }
  };

  const handleCupClick = (index: number) => {
    setFilled((prev) => {
      const newFilled = [...prev];
      let newCount = 0;
      
      // If clicking a filled cup, unfill it and all after
      if (newFilled[index]) {
        for (let i = index; i < goal; i++) {
          newFilled[i] = false;
        }
        newCount = index;
      } else {
        // Fill this cup and all before
        for (let i = 0; i <= index; i++) {
          newFilled[i] = true;
        }
        newCount = index + 1;
      }
      
      // Save to database
      saveHydration(newCount);
      
      return newFilled;
    });
  };

  const filledCount = filled.filter(Boolean).length;
  const liters = (filledCount * 0.25).toFixed(1);
  const goalLiters = (goal * 0.25).toFixed(1);

  if (isLoading) {
    return (
      <div className={cn("p-4 bg-hydration rounded-2xl animate-pulse", className)}>
        <div className="h-20"></div>
      </div>
    );
  }

  return (
    <div className={cn("p-4 bg-hydration rounded-2xl", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Droplets className="w-5 h-5 text-hydration-foreground" />
          <h3 className="font-semibold text-foreground">Hidratação</h3>
        </div>
        <span className="text-sm text-muted-foreground">
          {liters}L / {goalLiters}L
        </span>
      </div>

      <div className="flex gap-2 justify-between">
        {filled.map((isFilled, index) => (
          <button
            key={index}
            onClick={() => handleCupClick(index)}
            className="relative flex-1 aspect-[3/4] max-w-[40px] transition-transform duration-200 hover:scale-110 active:scale-95"
          >
            {/* Cup outline */}
            <svg
              viewBox="0 0 32 40"
              className="w-full h-full"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Cup body outline */}
              <path
                d="M4 8 L6 36 Q6 38 8 38 L24 38 Q26 38 26 36 L28 8"
                stroke="hsl(var(--hydration-foreground))"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                className="opacity-30"
              />
              
              {/* Water fill with animation */}
              <path
                d={isFilled 
                  ? "M5 10 L6.5 34 Q6.5 36 8 36 L24 36 Q25.5 36 25.5 34 L27 10 Q16 14 5 10"
                  : "M5 35 L6 36 Q6 37 8 37 L24 37 Q26 37 26 36 L27 35 Q16 36 5 35"
                }
                fill="hsl(var(--hydration-foreground))"
                className={cn(
                  "transition-all duration-500 ease-out",
                  isFilled ? "opacity-100" : "opacity-20"
                )}
              />

              {/* Cup rim */}
              <path
                d="M3 6 Q3 4 5 4 L27 4 Q29 4 29 6 L29 8 Q29 10 27 10 L5 10 Q3 10 3 8 Z"
                fill={isFilled ? "hsl(var(--hydration-foreground))" : "hsl(var(--muted))"}
                className="transition-colors duration-300"
              />
            </svg>
          </button>
        ))}
      </div>

      {/* Encouragement text */}
      <p className="text-xs text-center text-muted-foreground mt-3">
        {filledCount === 0 && "Toque nos copos para registrar"}
        {filledCount > 0 && filledCount < goal && `Continue assim! Faltam ${goal - filledCount} copos.`}
        {filledCount === goal && "🎉 Meta diária alcançada!"}
      </p>
    </div>
  );
};
