import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { AppShell, AppHeader, AppContent } from "@/components/layout/AppShell";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { Sparkles, Dumbbell, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import WorkoutGalleryCard from "@/components/workout/WorkoutGalleryCard";
import ExerciseDetailCard from "@/components/workout/ExerciseDetailCard";
import ExerciseGallery from "@/components/workout/ExerciseGallery";

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  videoUrl?: string;
}

interface DaySchedule {
  day: string;
  focus: string;
  exercises: Exercise[];
}

interface WorkoutPlan {
  weekly_schedule: DaySchedule[];
  recommendations: string[];
}

const dayMapping: { [key: string]: string } = {
  "Monday": "Segunda-feira",
  "Tuesday": "Terça-feira",
  "Wednesday": "Quarta-feira",
  "Thursday": "Quinta-feira",
  "Friday": "Sexta-feira",
  "Saturday": "Sábado",
  "Sunday": "Domingo",
  "segunda": "Segunda-feira",
  "terça": "Terça-feira",
  "quarta": "Quarta-feira",
  "quinta": "Quinta-feira",
  "sexta": "Sexta-feira",
  "sábado": "Sábado",
  "domingo": "Domingo",
};

type TabType = "treino" | "galeria";

const Workout: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") === "gallery" ? "galeria" : "treino";
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);

  // Clear the tab param after reading it to keep URL clean
  useEffect(() => {
    if (searchParams.get("tab")) {
      setSearchParams({}, { replace: true });
    }
  }, []);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedDay, setSelectedDay] = useState<DaySchedule | null>(null);

  const today = new Date();
  const dayOfWeek = today.getDay();
  const weekDayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const weekDayNames = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

  useEffect(() => {
    if (user) {
      fetchWorkoutPlan();
    }
  }, [user]);

  const fetchWorkoutPlan = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("workout_plan")
        .eq("user_id", user?.id)
        .single();

      if (error) throw error;
      
      if (data?.workout_plan) {
        setWorkoutPlan(data.workout_plan as unknown as WorkoutPlan);
      }
    } catch (error) {
      console.error("Error fetching workout plan:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateWorkoutPlan = async () => {
    try {
      setGenerating(true);
      
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (profileError) throw profileError;

      const { data, error } = await supabase.functions.invoke("generate-plan", {
        body: { profile },
      });

      if (error) throw error;

      if (data?.workout_plan) {
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ 
            workout_plan: data.workout_plan,
            nutrition_plan: data.nutrition_plan 
          })
          .eq("user_id", user?.id);

        if (updateError) throw updateError;

        setWorkoutPlan(data.workout_plan);
        toast({
          title: "Plano criado!",
          description: "Seu plano de treino personalizado foi gerado com sucesso.",
        });
      }
    } catch (error) {
      console.error("Error generating workout plan:", error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o plano de treino. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const getTodayName = (): string => {
    return weekDayNames[weekDayIndex];
  };

  const isWorkoutToday = (schedule: DaySchedule): boolean => {
    const todayName = getTodayName().toLowerCase();
    const scheduleDay = schedule.day.toLowerCase();
    const normalizedDay = (dayMapping[schedule.day] || schedule.day).toLowerCase();
    
    return scheduleDay.includes(todayName) || 
           normalizedDay.includes(todayName) ||
           todayName.includes(scheduleDay.substring(0, 3));
  };

  const getDayLabel = (day: string): string => {
    return dayMapping[day] || day;
  };

  // Tab Button Component
  const TabButton = ({ tab, label }: { tab: TabType; label: string }) => (
    <button
      onClick={() => {
        setActiveTab(tab);
        setSelectedDay(null); // Reset selected day when switching tabs
      }}
      className={cn(
        "flex-1 py-3 px-6 rounded-full font-semibold text-sm transition-all",
        activeTab === tab
          ? "bg-primary text-primary-foreground shadow-button"
          : "bg-transparent text-muted-foreground hover:text-foreground"
      )}
    >
      {label}
    </button>
  );

  if (loading) {
    return (
      <AppShell>
        <AppHeader title="Treino" />
        <AppContent className="pb-28 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </AppContent>
        <BottomNavigation />
      </AppShell>
    );
  }

  // Exercise Detail View (only for "Seu Treino" tab)
  if (selectedDay && activeTab === "treino") {
    return (
      <AppShell>
        <AppHeader 
          title={selectedDay.focus}
          showBack
          onBack={() => setSelectedDay(null)}
        />
        <AppContent className="pb-28">
          {/* Header Info */}
          <div className="mb-6">
            <p className="text-muted-foreground text-sm">{getDayLabel(selectedDay.day)}</p>
            <h2 className="text-2xl font-bold text-foreground mt-1">{selectedDay.focus}</h2>
            <p className="text-muted-foreground mt-2">
              {selectedDay.exercises?.length || 0} exercícios • Toque para ver a demonstração
            </p>
          </div>

          {/* Exercises List */}
          <div className="space-y-4">
            {selectedDay.exercises?.map((exercise, index) => (
              <ExerciseDetailCard 
                key={index}
                exercise={exercise}
                index={index}
              />
            ))}
          </div>

          {/* Recommendations */}
          {workoutPlan?.recommendations && workoutPlan.recommendations.length > 0 && (
            <div className="mt-8">
              <h3 className="font-semibold text-foreground mb-3">💡 Dicas para este treino</h3>
              <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
                <ul className="space-y-3">
                  {workoutPlan.recommendations.slice(0, 3).map((rec, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </AppContent>
        <BottomNavigation />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <AppHeader title="Treino" />

      <AppContent className="pb-28">
        {/* Tab Switcher */}
        <div className="bg-card rounded-full p-1 flex gap-1 mb-6 border border-border shadow-card">
          <TabButton tab="treino" label="Seu Treino" />
          <TabButton tab="galeria" label="Galeria" />
        </div>

        {/* Tab Content */}
        {activeTab === "treino" ? (
          // "Seu Treino" Content
          <>
            {!workoutPlan ? (
              // No workout plan - show generation prompt
              <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Dumbbell className="w-12 h-12 text-primary" />
                </div>
                
                <h2 className="text-2xl font-bold text-foreground mb-3">
                  Crie Seu Treino Personalizado
                </h2>
                
                <p className="text-muted-foreground mb-8 max-w-sm">
                  Nossa IA vai criar um plano de treino personalizado baseado nas suas informações, objetivos e preferências.
                </p>

                <Button
                  onClick={generateWorkoutPlan}
                  disabled={generating}
                  size="lg"
                  className="gap-2 px-8 py-6 text-lg rounded-2xl"
                >
                  {generating ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Gerando plano...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Gerar Plano com IA
                    </>
                  )}
                </Button>

                {generating && (
                  <p className="text-sm text-muted-foreground mt-4 animate-pulse">
                    Analisando seu perfil e criando treinos personalizados...
                  </p>
                )}
              </div>
            ) : (
              // Has workout plan - show gallery of training days
              <>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Seus Treinos</h2>
                    <p className="text-muted-foreground text-sm">Toque num treino para ver os exercícios</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={generateWorkoutPlan}
                    disabled={generating}
                    className="text-primary"
                  >
                    {generating ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <RefreshCw className="w-5 h-5" />
                    )}
                  </Button>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {workoutPlan.weekly_schedule?.map((schedule, index) => (
                    <WorkoutGalleryCard
                      key={index}
                      title={schedule.focus}
                      exerciseCount={schedule.exercises?.length || 0}
                      isToday={isWorkoutToday(schedule)}
                      dayLabel={getDayLabel(schedule.day)}
                      onClick={() => setSelectedDay(schedule)}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          // "Galeria" Content
          <ExerciseGallery />
        )}
      </AppContent>

      <BottomNavigation />
    </AppShell>
  );
};

export default Workout;
