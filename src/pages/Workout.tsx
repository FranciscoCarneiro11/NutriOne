import React, { useState, useEffect } from "react";
import { AppShell, AppHeader, AppContent } from "@/components/layout/AppShell";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { Clock, Flame, Play, ChevronRight, Check, Sparkles, Dumbbell, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
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

interface WeekDay {
  day: number;
  label: string;
  fullLabel: string;
  completed: boolean;
  isToday: boolean;
}

const dayMapping: { [key: string]: string } = {
  "Monday": "Segunda",
  "Tuesday": "Terça",
  "Wednesday": "Quarta",
  "Thursday": "Quinta",
  "Friday": "Sexta",
  "Saturday": "Sábado",
  "Sunday": "Domingo",
  "segunda": "Segunda",
  "terça": "Terça",
  "quarta": "Quarta",
  "quinta": "Quinta",
  "sexta": "Sexta",
  "sábado": "Sábado",
  "domingo": "Domingo",
};

const dayAbbreviation: { [key: string]: string } = {
  "Segunda": "Seg",
  "Terça": "Ter",
  "Quarta": "Qua",
  "Quinta": "Qui",
  "Sexta": "Sex",
  "Sábado": "Sáb",
  "Domingo": "Dom",
};

const Workout: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedDay, setSelectedDay] = useState<DaySchedule | null>(null);

  const today = new Date();
  const dayOfWeek = today.getDay();
  const weekDayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const [weekDays] = useState<WeekDay[]>([
    { day: 1, label: "Seg", fullLabel: "Segunda", completed: false, isToday: weekDayIndex === 0 },
    { day: 2, label: "Ter", fullLabel: "Terça", completed: false, isToday: weekDayIndex === 1 },
    { day: 3, label: "Qua", fullLabel: "Quarta", completed: false, isToday: weekDayIndex === 2 },
    { day: 4, label: "Qui", fullLabel: "Quinta", completed: false, isToday: weekDayIndex === 3 },
    { day: 5, label: "Sex", fullLabel: "Sexta", completed: false, isToday: weekDayIndex === 4 },
    { day: 6, label: "Sáb", fullLabel: "Sábado", completed: false, isToday: weekDayIndex === 5 },
    { day: 7, label: "Dom", fullLabel: "Domingo", completed: false, isToday: weekDayIndex === 6 },
  ]);

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
      
      // Fetch user profile data
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (profileError) throw profileError;

      // Call the generate-plan edge function
      const { data, error } = await supabase.functions.invoke("generate-plan", {
        body: { profile },
      });

      if (error) throw error;

      if (data?.workout_plan) {
        // Save to profile
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

  const getTodayWorkout = (): DaySchedule | null => {
    if (!workoutPlan?.weekly_schedule) return null;
    
    const todayName = weekDays[weekDayIndex].fullLabel;
    return workoutPlan.weekly_schedule.find(schedule => {
      const normalizedDay = dayMapping[schedule.day] || schedule.day;
      return normalizedDay.toLowerCase().includes(todayName.toLowerCase()) || 
             todayName.toLowerCase().includes(normalizedDay.toLowerCase());
    }) || workoutPlan.weekly_schedule[0];
  };

  const getDayAbbrev = (day: string): string => {
    const normalizedDay = dayMapping[day] || day;
    return dayAbbreviation[normalizedDay] || day.substring(0, 3);
  };

  const todayWorkout = getTodayWorkout();

  if (loading) {
    return (
      <AppShell>
        <AppHeader title="Plano de Treino" />
        <AppContent className="pb-28 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground">Carregando plano...</p>
          </div>
        </AppContent>
        <BottomNavigation />
      </AppShell>
    );
  }

  if (!workoutPlan) {
    return (
      <AppShell>
        <AppHeader title="Plano de Treino" />
        <AppContent className="pb-28">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Dumbbell className="w-12 h-12 text-primary" />
            </div>
            
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Crie Seu Plano de Treino
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
        </AppContent>
        <BottomNavigation />
      </AppShell>
    );
  }

  // Show workout detail
  if (selectedDay) {
    return (
      <AppShell>
        <AppHeader 
          title={selectedDay.focus} 
          showBack 
          onBack={() => setSelectedDay(null)} 
        />
        <AppContent className="pb-28">
          <div className="mb-6">
            <span className="text-muted-foreground">{selectedDay.day}</span>
            <h2 className="text-xl font-bold text-foreground">{selectedDay.focus}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedDay.exercises?.length || 0} exercícios
            </p>
          </div>

          <div className="space-y-3">
            {selectedDay.exercises?.map((exercise, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-4 shadow-card border border-border"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{exercise.name}</h4>
                    <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                      <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        {exercise.sets} séries
                      </span>
                      <span className="bg-muted px-2 py-0.5 rounded-full">
                        {exercise.reps} reps
                      </span>
                      {exercise.rest && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {exercise.rest}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {index + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {workoutPlan.recommendations && workoutPlan.recommendations.length > 0 && (
            <div className="mt-8">
              <h3 className="font-semibold text-foreground mb-3">Dicas</h3>
              <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
                <ul className="space-y-2">
                  {workoutPlan.recommendations.slice(0, 3).map((rec, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {rec}
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

  const completedCount = weekDays.filter(d => d.completed).length;

  return (
    <AppShell>
      <AppHeader title="Plano de Treino" />

      <AppContent className="pb-28">
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">Seu plano personalizado</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={generateWorkoutPlan}
            disabled={generating}
            className="text-primary"
          >
            {generating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Week Progress Card */}
        <div className="bg-card rounded-2xl p-4 shadow-card border border-border mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold text-foreground">Progresso da Semana</span>
            <span className="text-primary font-semibold">{completedCount}/7 treinos</span>
          </div>
          
          <div className="flex justify-between">
            {weekDays.map((day) => (
              <div key={day.day} className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all",
                    day.completed
                      ? "bg-primary text-primary-foreground"
                      : day.isToday
                      ? "border-2 border-primary text-primary"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {day.completed ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    day.day
                  )}
                </div>
                <span className={cn(
                  "text-xs",
                  day.isToday ? "text-primary font-semibold" : "text-muted-foreground"
                )}>
                  {day.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Workout Highlight */}
        {todayWorkout && (
          <div 
            className="bg-primary rounded-2xl p-5 shadow-card mb-8 cursor-pointer active:scale-[0.98] transition-transform"
            onClick={() => setSelectedDay(todayWorkout)}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                <Play className="w-7 h-7 text-primary-foreground" fill="currentColor" />
              </div>
              <div className="flex-1">
                <span className="text-primary-foreground/80 text-sm">Treino de Hoje</span>
                <h3 className="text-xl font-bold text-primary-foreground">{todayWorkout.focus}</h3>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1 text-primary-foreground/80">
                    <Dumbbell className="w-4 h-4" />
                    <span className="text-sm">{todayWorkout.exercises?.length || 0} exercícios</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-primary-foreground/60" />
            </div>
          </div>
        )}

        {/* All Workouts List */}
        <h3 className="font-semibold text-foreground mb-4">Todos os Treinos</h3>
        
        <div className="space-y-3">
          {workoutPlan.weekly_schedule?.map((schedule, index) => {
            const isToday = todayWorkout?.day === schedule.day;
            return (
              <div
                key={index}
                className="bg-card rounded-2xl p-4 shadow-card border border-border flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-transform"
                onClick={() => setSelectedDay(schedule)}
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center font-semibold text-sm",
                  isToday ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                )}>
                  {getDayAbbrev(schedule.day)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-foreground">{schedule.focus}</h4>
                    {isToday && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        Hoje
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {schedule.exercises?.length || 0} exercícios
                  </span>
                </div>
                
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            );
          })}
        </div>
      </AppContent>

      <BottomNavigation />
    </AppShell>
  );
};

export default Workout;
