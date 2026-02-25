import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell, AppHeader, AppContent } from "@/components/layout/AppShell";
import { 
  Plus, X, Play, Pause, Check, Dumbbell, Clock, Flame, Trophy,
  ChevronDown, ChevronUp, Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

// Muscle group images
import peitoImg from "@/assets/muscle-groups/peito.png";
import costasImg from "@/assets/muscle-groups/costas.png";
import tricepsImg from "@/assets/muscle-groups/triceps.png";
import bicepsImg from "@/assets/muscle-groups/biceps.png";
import abdomenImg from "@/assets/muscle-groups/abdomen.png";
import posteriorImg from "@/assets/muscle-groups/posterior.png";
import quadricepsImg from "@/assets/muscle-groups/quadriceps.png";
import trapezioImg from "@/assets/muscle-groups/trapezio.png";
import ombrosImg from "@/assets/muscle-groups/ombros.png";

const muscleGroupImages: Record<string, string> = {
  peito: peitoImg,
  costas: costasImg,
  ombros: ombrosImg,
  biceps: bicepsImg,
  triceps: tricepsImg,
  quadriceps: quadricepsImg,
  posterior: posteriorImg,
  trapezio: trapezioImg,
  abdomen: abdomenImg,
};

interface ExerciseOption {
  id: string;
  muscleGroupId: string;
  thumbnailUrl?: string;
}

// Exercise data (mirrored from ExerciseGallery)
const exerciseOptions: ExerciseOption[] = [
  { id: "chest-1", muscleGroupId: "peito", thumbnailUrl: "/images/exercises/supino-reto-com-barra.png" },
  { id: "chest-2", muscleGroupId: "peito", thumbnailUrl: "/images/exercises/dumbbell-incline-bench-press.jpeg" },
  { id: "chest-3", muscleGroupId: "peito", thumbnailUrl: "/images/exercises/supino-inclinado-barra.png" },
  { id: "chest-9", muscleGroupId: "peito", thumbnailUrl: "/images/exercises/supino-inclinado-smith.png" },
  { id: "chest-10", muscleGroupId: "peito", thumbnailUrl: "/images/exercises/crucifixo-polia-alta.png" },
  { id: "chest-11", muscleGroupId: "peito", thumbnailUrl: "/images/exercises/voador-maquina.png" },
  { id: "chest-12", muscleGroupId: "peito", thumbnailUrl: "/images/exercises/flexao.png" },
  { id: "chest-13", muscleGroupId: "peito", thumbnailUrl: "/images/exercises/barra-paralela.png" },
  { id: "back-2", muscleGroupId: "costas", thumbnailUrl: "/images/exercises/seated-wide-grip-row.jpeg" },
  { id: "back-7", muscleGroupId: "costas", thumbnailUrl: "/images/exercises/remada-sentado-triangulo.png" },
  { id: "back-8", muscleGroupId: "costas", thumbnailUrl: "/images/exercises/puxada-aberta.png" },
  { id: "back-9", muscleGroupId: "costas", thumbnailUrl: "/images/exercises/barra-livre.png" },
  { id: "back-10", muscleGroupId: "costas", thumbnailUrl: "/images/exercises/remada-livre.png" },
  { id: "back-11", muscleGroupId: "costas", thumbnailUrl: "/images/exercises/puxada-polia-corda.png" },
  { id: "back-12", muscleGroupId: "costas", thumbnailUrl: "/images/exercises/puxada-triangulo.png" },
  { id: "back-13", muscleGroupId: "costas", thumbnailUrl: "/images/exercises/remada-aberta-maquina.png" },
  { id: "shoulder-28", muscleGroupId: "ombros", thumbnailUrl: "/images/exercises/elevacao-lateral-halter.png" },
  { id: "shoulder-2", muscleGroupId: "ombros", thumbnailUrl: "/images/exercises/seated-shoulder-press.jpeg" },
  { id: "shoulder-7", muscleGroupId: "ombros", thumbnailUrl: "/images/exercises/elevacao-lateral-inclinado.png" },
  { id: "shoulder-8", muscleGroupId: "ombros", thumbnailUrl: "/images/exercises/desenvolvimento-maquina.png" },
  { id: "shoulder-9", muscleGroupId: "ombros", thumbnailUrl: "/images/exercises/elevacao-frontal-polia.png" },
  { id: "shoulder-10", muscleGroupId: "ombros", thumbnailUrl: "/images/exercises/elevacao-lateral-maquina.png" },
  { id: "shoulder-11", muscleGroupId: "ombros", thumbnailUrl: "/images/exercises/desenvolvimento-maquina-inclinado.png" },
  { id: "shoulder-12", muscleGroupId: "ombros", thumbnailUrl: "/images/exercises/elevacao-lateral-invertida.png" },
  { id: "shoulder-13", muscleGroupId: "ombros", thumbnailUrl: "/images/exercises/crucifixo-inverso-cabo.png" },
  { id: "shoulder-14", muscleGroupId: "ombros", thumbnailUrl: "/images/exercises/desenvolvimento-arnold.png" },
  { id: "shoulder-15", muscleGroupId: "ombros", thumbnailUrl: "/images/exercises/crucifixo-invertido-halter.png" },
  { id: "shoulder-16", muscleGroupId: "ombros", thumbnailUrl: "/images/exercises/elevacao-lateral-sentado.png" },
  { id: "shoulder-17", muscleGroupId: "ombros", thumbnailUrl: "/images/exercises/facepull-com-corda.png" },
  { id: "shoulder-18", muscleGroupId: "ombros", thumbnailUrl: "/images/exercises/elevacao-lateral-maquina-2.png" },
  { id: "shoulder-19", muscleGroupId: "ombros", thumbnailUrl: "/images/exercises/desenvolvimento-militar-barra.png" },
  { id: "shoulder-20", muscleGroupId: "ombros", thumbnailUrl: "/images/exercises/desenvolvimento-maquina-2.png" },
  { id: "shoulder-21", muscleGroupId: "ombros", thumbnailUrl: "/images/exercises/elevacao-lateral-cruzada-cabo.png" },
  { id: "shoulder-22", muscleGroupId: "ombros", thumbnailUrl: "/images/exercises/remada-alta-barra-w.png" },
  { id: "shoulder-23", muscleGroupId: "ombros", thumbnailUrl: "/images/exercises/desenvolvimento-militar-smith.png" },
  { id: "shoulder-24", muscleGroupId: "ombros", thumbnailUrl: "/images/exercises/crucifixo-invertido-maquina.png" },
  { id: "shoulder-25", muscleGroupId: "ombros", thumbnailUrl: "/images/exercises/elevacao-frontal-halter.png" },
  { id: "shoulder-26", muscleGroupId: "ombros", thumbnailUrl: "/images/exercises/desenvolvimento-maquina-3.png" },
  { id: "shoulder-27", muscleGroupId: "ombros", thumbnailUrl: "/images/exercises/elevacao-lateral-unilateral-cabo.png" },
  { id: "biceps-1", muscleGroupId: "biceps", thumbnailUrl: "/images/exercises/biceps-curl.jpeg" },
  { id: "biceps-2", muscleGroupId: "biceps", thumbnailUrl: "/images/exercises/hammer-curl.jpeg" },
  { id: "triceps-2", muscleGroupId: "triceps", thumbnailUrl: "/images/exercises/seated-bench-extension.jpeg" },
  { id: "quad-1", muscleGroupId: "quadriceps", thumbnailUrl: "/images/exercises/leg-extension.jpeg" },
];

const muscleGroupList = [
  { id: "all", label: "Todos" },
  { id: "peito", label: "Peito" },
  { id: "costas", label: "Costas" },
  { id: "ombros", label: "Ombros" },
  { id: "biceps", label: "Bíceps" },
  { id: "triceps", label: "Tríceps" },
  { id: "quadriceps", label: "Quadríceps" },
  { id: "posterior", label: "Posterior" },
  { id: "trapezio", label: "Trapézio" },
  { id: "abdomen", label: "Abdômen" },
];

interface ActiveExercise {
  id: string;
  muscleGroupId: string;
  thumbnailUrl?: string;
  sets: { weight: string; reps: string }[];
  expanded: boolean;
}

type Phase = "picking" | "active" | "summary";

const ActiveWorkout: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const exerciseTranslations = t.exercises as Record<string, string>;
  const muscleTranslations = t.muscleGroups as Record<string, string>;

  // Restore saved state from localStorage
  const STORAGE_KEY = "active_workout_state";

  const loadSavedState = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed;
      }
    } catch {}
    return null;
  };

  const savedState = useRef(loadSavedState());

  const [phase, setPhase] = useState<Phase>(() => savedState.current?.phase || "picking");
  const [exercises, setExercises] = useState<ActiveExercise[]>(() => savedState.current?.exercises || []);
  const [showPicker, setShowPicker] = useState(false);
  const [filterMuscle, setFilterMuscle] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Timer - use wallclock start time for persistence
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(() => savedState.current?.isPaused || false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(savedState.current?.startTime || Date.now());
  const pausedElapsedRef = useRef<number>(savedState.current?.pausedElapsed || 0);

  // Initialize startTimeRef properly (useRef with function doesn't auto-call)
  useEffect(() => {
    if (savedState.current?.startTime) {
      startTimeRef.current = savedState.current.startTime;
      // If was active and not paused, elapsed = now - startTime
      if (savedState.current.phase === "active" && !savedState.current.isPaused) {
        setElapsedSeconds(Math.floor((Date.now() - savedState.current.startTime) / 1000));
      } else if (savedState.current.pausedElapsed) {
        setElapsedSeconds(savedState.current.pausedElapsed);
      }
    }
  }, []);

  // Summary data
  const [summaryData, setSummaryData] = useState<{
    duration: number;
    totalVolume: number;
    muscleGroups: string[];
    exerciseCount: number;
  } | null>(null);

  // Persist state to localStorage on changes
  useEffect(() => {
    if (phase === "summary") {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
    const state = {
      phase,
      exercises,
      isPaused,
      startTime: startTimeRef.current,
      pausedElapsed: isPaused ? elapsedSeconds : undefined,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [phase, exercises, isPaused, elapsedSeconds]);

  // Timer logic
  useEffect(() => {
    if (phase === "active" && !isPaused) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, isPaused]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const togglePause = () => {
    if (isPaused) {
      // Resuming: adjust start time to account for paused duration
      startTimeRef.current = Date.now() - elapsedSeconds * 1000;
    }
    setIsPaused(!isPaused);
  };

  const getName = (id: string) => exerciseTranslations[id] || id;

  const addExercise = (option: ExerciseOption) => {
    if (exercises.find(e => e.id === option.id)) {
      toast.error("Exercício já adicionado");
      return;
    }
    setExercises(prev => [...prev, {
      ...option,
      sets: [{ weight: "", reps: "" }],
      expanded: true,
    }]);
    setShowPicker(false);
  };

  const removeExercise = (id: string) => {
    setExercises(prev => prev.filter(e => e.id !== id));
  };

  const toggleExpand = (id: string) => {
    setExercises(prev => prev.map(e => e.id === id ? { ...e, expanded: !e.expanded } : e));
  };

  const addSet = (exerciseId: string) => {
    setExercises(prev => prev.map(e => 
      e.id === exerciseId 
        ? { ...e, sets: [...e.sets, { weight: "", reps: "" }] }
        : e
    ));
  };

  const removeSet = (exerciseId: string, setIndex: number) => {
    setExercises(prev => prev.map(e => {
      if (e.id !== exerciseId || e.sets.length <= 1) return e;
      return { ...e, sets: e.sets.filter((_, i) => i !== setIndex) };
    }));
  };

  const updateSet = (exerciseId: string, setIndex: number, field: "weight" | "reps", value: string) => {
    setExercises(prev => prev.map(e => {
      if (e.id !== exerciseId) return e;
      const newSets = [...e.sets];
      newSets[setIndex] = { ...newSets[setIndex], [field]: value };
      return { ...e, sets: newSets };
    }));
  };

  const startWorkout = () => {
    if (exercises.length === 0) {
      toast.error("Adicione pelo menos 1 exercício");
      return;
    }
    const now = Date.now();
    startTimeRef.current = now;
    setElapsedSeconds(0);
    setPhase("active");
  };

  const finishWorkout = async () => {
    // Calculate summary
    const muscleGroups = [...new Set(exercises.map(e => e.muscleGroupId))];
    let totalVolume = 0;
    exercises.forEach(e => {
      e.sets.forEach(s => {
        const w = parseFloat(s.weight) || 0;
        const r = parseInt(s.reps) || 0;
        totalVolume += w * r;
      });
    });

    setSummaryData({
      duration: elapsedSeconds,
      totalVolume,
      muscleGroups,
      exerciseCount: exercises.length,
    });

    // Save to database
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");

      const today = new Date().toISOString().split("T")[0];
      
      let { data: session } = await supabase
        .from("workout_sessions")
        .select("id")
        .eq("user_id", user.id)
        .eq("session_date", today)
        .maybeSingle();

      if (!session) {
        const { data: newSession, error: sessionError } = await supabase
          .from("workout_sessions")
          .insert({
            user_id: user.id,
            session_date: today,
            workout_name: "Treino personalizado",
            completed: true,
          })
          .select("id")
          .single();
        if (sessionError) throw sessionError;
        session = newSession;
      } else {
        await supabase.from("workout_sessions").update({ completed: true }).eq("id", session.id);
      }

      const logs = exercises.flatMap(e =>
        e.sets.map((s, idx) => ({
          session_id: session!.id,
          user_id: user.id,
          exercise_name: getName(e.id),
          sets_completed: idx + 1,
          weight: s.weight ? parseFloat(s.weight) : null,
        }))
      );

      if (logs.length > 0) {
        await supabase.from("exercise_logs").insert(logs);
      }
    } catch (err) {
      console.error("Error saving workout:", err);
    }

    if (timerRef.current) clearInterval(timerRef.current);
    setPhase("summary");
  };

  const filteredExercises = exerciseOptions.filter(e => {
    const matchesMuscle = filterMuscle === "all" || e.muscleGroupId === filterMuscle;
    const matchesSearch = searchQuery === "" || getName(e.id).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMuscle && matchesSearch;
  });

  // SUMMARY SCREEN
  if (phase === "summary" && summaryData) {
    return (
      <AppShell>
        <AppContent className="pb-8 flex flex-col items-center justify-center min-h-screen">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-sm text-center space-y-6"
          >
            {/* Trophy */}
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Trophy className="w-10 h-10 text-primary" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-foreground">Treino Concluído! 🎉</h1>
              <p className="text-muted-foreground mt-1">Parabéns pelo esforço!</p>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-card rounded-2xl p-4 border border-border">
                <Clock className="w-5 h-5 text-primary mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground">{formatTime(summaryData.duration)}</p>
                <p className="text-xs text-muted-foreground">Duração</p>
              </div>
              <div className="bg-card rounded-2xl p-4 border border-border">
                <Flame className="w-5 h-5 text-destructive mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground">
                  {summaryData.totalVolume >= 1000 
                    ? `${(summaryData.totalVolume / 1000).toFixed(1)}t` 
                    : `${summaryData.totalVolume}kg`}
                </p>
                <p className="text-xs text-muted-foreground">Volume</p>
              </div>
              <div className="bg-card rounded-2xl p-4 border border-border">
                <Dumbbell className="w-5 h-5 text-primary mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground">{summaryData.exerciseCount}</p>
                <p className="text-xs text-muted-foreground">Exercícios</p>
              </div>
            </div>

            {/* Muscles trained */}
            <div className="bg-card rounded-2xl p-4 border border-border">
              <h3 className="text-sm font-semibold text-foreground mb-3">Músculos treinados</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {summaryData.muscleGroups.map(mg => (
                  <div key={mg} className="flex flex-col items-center gap-1">
                    <div className="w-14 h-14">
                      {muscleGroupImages[mg] ? (
                        <img src={muscleGroupImages[mg]} alt={muscleTranslations[mg] || mg} className="w-full h-full object-contain drop-shadow-[0_0_6px_rgba(255,70,70,0.6)]" />
                      ) : (
                        <div className="w-full h-full rounded-full bg-primary/20 flex items-center justify-center">
                          <Dumbbell className="w-6 h-6 text-primary" />
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">
                      {muscleTranslations[mg] || mg}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Exercises breakdown */}
            <div className="bg-card rounded-2xl p-4 border border-border text-left space-y-2">
              <h3 className="text-sm font-semibold text-foreground mb-2">Resumo dos exercícios</h3>
              {exercises.map(e => {
                const totalWeight = e.sets.reduce((acc, s) => acc + (parseFloat(s.weight) || 0) * (parseInt(s.reps) || 0), 0);
                return (
                  <div key={e.id} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
                    <div className="flex items-center gap-2">
                      {e.thumbnailUrl && (
                        <img src={e.thumbnailUrl} alt="" className="w-8 h-8 rounded-lg object-cover" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-foreground">{getName(e.id)}</p>
                        <p className="text-xs text-muted-foreground">{e.sets.length} séries</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-primary">{totalWeight}kg</span>
                  </div>
                );
              })}
            </div>

            <Button onClick={() => navigate("/workout")} className="w-full" size="lg">
              Voltar ao Treino
            </Button>
          </motion.div>
        </AppContent>
      </AppShell>
    );
  }

  // EXERCISE PICKER MODAL - rendered inline to avoid remount issues
  const exercisePickerContent = showPicker ? (
    <motion.div
      key="exercise-picker"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="fixed inset-0 z-50 bg-background flex flex-col"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h2 className="text-lg font-semibold">Adicionar Exercício</h2>
        <button onClick={() => setShowPicker(false)} className="p-2 rounded-full hover:bg-muted">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar exercício..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="px-4 pb-2 flex gap-2 overflow-x-auto hide-scrollbar">
        {muscleGroupList.map(mg => (
          <button
            key={mg.id}
            onClick={() => setFilterMuscle(mg.id)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
              filterMuscle === mg.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            {mg.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
        {filteredExercises.map(option => {
          const isAdded = exercises.some(e => e.id === option.id);
          return (
            <button
              key={option.id}
              onClick={() => !isAdded && addExercise(option)}
              disabled={isAdded}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl border transition-colors text-left",
                isAdded 
                  ? "bg-primary/5 border-primary/20 opacity-60" 
                  : "bg-card border-border hover:border-primary/50 active:scale-[0.98]"
              )}
            >
              {option.thumbnailUrl ? (
                <img src={option.thumbnailUrl} alt="" className="w-12 h-12 rounded-lg object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1">
                <p className="font-medium text-sm text-foreground">{getName(option.id)}</p>
                <p className="text-xs text-muted-foreground">{muscleTranslations[option.muscleGroupId] || option.muscleGroupId}</p>
              </div>
              {isAdded ? (
                <Check className="w-5 h-5 text-primary" />
              ) : (
                <Plus className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
          );
        })}
      </div>
    </motion.div>
  ) : null;

  // MAIN VIEW (picking + active)
  return (
    <AppShell>
      <AppHeader
        title={phase === "active" ? "Treino em Andamento" : "Novo Treino"}
        showBack
        onBack={() => {
          if (phase === "active") {
            if (confirm("Deseja abandonar o treino?")) {
              localStorage.removeItem(STORAGE_KEY);
              navigate("/workout");
            }
          } else {
            localStorage.removeItem(STORAGE_KEY);
            navigate("/workout");
          }
        }}
        rightAction={
          phase === "active" ? (
            <button onClick={togglePause} className="p-2 rounded-full hover:bg-muted">
              {isPaused ? <Play className="w-5 h-5 text-primary" /> : <Pause className="w-5 h-5 text-muted-foreground" />}
            </button>
          ) : undefined
        }
      />

      <AppContent className="pb-32">
        {/* Timer bar (active phase) */}
        {phase === "active" && (
          <div className="bg-primary/10 rounded-2xl p-4 mb-4 flex items-center justify-center gap-3">
            <Clock className="w-5 h-5 text-primary" />
            <span className="text-2xl font-bold text-primary font-mono tracking-wider">
              {formatTime(elapsedSeconds)}
            </span>
            {isPaused && (
              <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">Pausado</span>
            )}
          </div>
        )}

        {/* Exercise list */}
        <div className="space-y-3">
          {exercises.map((exercise) => (
            <div key={exercise.id} className="bg-card rounded-2xl border border-border overflow-hidden">
              {/* Exercise header */}
              <div
                className="flex items-center gap-3 p-3 cursor-pointer"
                onClick={() => toggleExpand(exercise.id)}
              >
                {exercise.thumbnailUrl ? (
                  <img src={exercise.thumbnailUrl} alt="" className="w-10 h-10 rounded-lg object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <Dumbbell className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground truncate">{getName(exercise.id)}</p>
                  <p className="text-xs text-muted-foreground">{exercise.sets.length} séries</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeExercise(exercise.id); }}
                  className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10"
                >
                  <X className="w-4 h-4" />
                </button>
                {exercise.expanded ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </div>

              {/* Sets (expanded) */}
              {exercise.expanded && (
                <div className="px-3 pb-3 space-y-2">
                  {/* Header row */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground px-1">
                    <span className="w-8">Série</span>
                    <span className="flex-1 text-center">Peso (kg)</span>
                    <span className="flex-1 text-center">Reps</span>
                    <span className="w-8" />
                  </div>
                  
                  {exercise.sets.map((set, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-8 text-xs font-medium text-muted-foreground text-center">
                        {idx + 1}ª
                      </span>
                      <Input
                        type="number"
                        value={set.weight}
                        onChange={e => updateSet(exercise.id, idx, "weight", e.target.value)}
                        placeholder="0"
                        className="flex-1 h-9 text-center text-sm font-semibold"
                      />
                      <Input
                        type="number"
                        value={set.reps}
                        onChange={e => updateSet(exercise.id, idx, "reps", e.target.value)}
                        placeholder="0"
                        className="flex-1 h-9 text-center text-sm font-semibold"
                      />
                      <button
                        onClick={() => removeSet(exercise.id, idx)}
                        className="w-8 h-8 flex items-center justify-center text-destructive/60 hover:text-destructive"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() => addSet(exercise.id)}
                    className="w-full py-1.5 rounded-lg border border-dashed border-border text-xs text-muted-foreground hover:text-foreground hover:border-primary transition-colors flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Adicionar série
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add exercise button */}
        <button
          onClick={() => { setSearchQuery(""); setFilterMuscle("all"); setShowPicker(true); }}
          className="w-full mt-4 py-4 rounded-2xl border-2 border-dashed border-border text-muted-foreground hover:text-primary hover:border-primary transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <Plus className="w-5 h-5" />
          Adicionar Exercício
        </button>

        {exercises.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Dumbbell className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">Comece adicionando exercícios ao seu treino</p>
          </div>
        )}
      </AppContent>

      {/* Bottom action button */}
      {exercises.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border">
          <div className="max-w-md mx-auto">
            {phase === "picking" ? (
              <Button onClick={startWorkout} className="w-full gap-2" size="lg">
                <Play className="w-5 h-5" />
                Iniciar Treino
              </Button>
            ) : (
              <Button onClick={finishWorkout} className="w-full gap-2" size="lg" variant="default">
                <Check className="w-5 h-5" />
                Concluir Treino
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Picker overlay */}
      <AnimatePresence>
        {exercisePickerContent}
      </AnimatePresence>
    </AppShell>
  );
};

export default ActiveWorkout;
