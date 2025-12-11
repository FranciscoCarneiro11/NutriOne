import React from "react";
import { AppShell, AppHeader, AppContent } from "@/components/layout/AppShell";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { Dumbbell, Clock, Flame, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const Workout: React.FC = () => {
  const workouts = [
    {
      title: "Treino de Braços",
      duration: "45 min",
      calories: 320,
      exercises: ["Rosca direta", "Tríceps corda", "Martelo"],
    },
    {
      title: "Core Intenso",
      duration: "30 min",
      calories: 250,
      exercises: ["Prancha", "Abdominal", "Mountain climber"],
    },
    {
      title: "Pernas Power",
      duration: "50 min",
      calories: 400,
      exercises: ["Agachamento", "Leg press", "Extensora"],
    },
  ];

  return (
    <AppShell>
      <AppHeader title="Treinos" />

      <AppContent className="pb-28">
        <p className="text-muted-foreground mb-6">Seus treinos da semana</p>

        <div className="space-y-4">
          {workouts.map((workout, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-4 shadow-card border border-border"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-coral-light flex items-center justify-center">
                    <Dumbbell className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{workout.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {workout.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        {workout.calories} kcal
                      </div>
                    </div>
                  </div>
                </div>
                <Button variant="coral" size="sm" className="rounded-full">
                  <Play className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {workout.exercises.map((exercise, i) => (
                  <span
                    key={i}
                    className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground"
                  >
                    {exercise}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </AppContent>

      <BottomNavigation />
    </AppShell>
  );
};

export default Workout;
