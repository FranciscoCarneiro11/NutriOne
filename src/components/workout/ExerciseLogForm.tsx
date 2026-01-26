import React, { useState, useEffect } from "react";
import { Dumbbell, Check, History, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ExerciseLogFormProps {
  exerciseName: string;
}

interface ExerciseLog {
  id: string;
  sets_completed: number;
  weight: number | null;
  created_at: string;
  session_date?: string;
}

const ExerciseLogForm: React.FC<ExerciseLogFormProps> = ({ exerciseName }) => {
  const [setsCompleted, setSetsCompleted] = useState(0);
  const [weight, setWeight] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [lastLog, setLastLog] = useState<ExerciseLog | null>(null);
  const [history, setHistory] = useState<ExerciseLog[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, [exerciseName]);

  const fetchHistory = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('exercise_logs')
      .select('id, sets_completed, weight, created_at')
      .eq('user_id', user.id)
      .eq('exercise_name', exerciseName)
      .order('created_at', { ascending: false })
      .limit(10);

    if (data && !error) {
      setHistory(data);
      if (data.length > 0) {
        setLastLog(data[0]);
        // Pre-fill with last values
        setSetsCompleted(data[0].sets_completed);
        if (data[0].weight) {
          setWeight(data[0].weight.toString());
        }
      }
    }
  };

  const handleSave = async () => {
    if (setsCompleted === 0) {
      toast.error("Adicione pelo menos 1 série");
      return;
    }

    setIsSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Você precisa estar logado");
      setIsSaving(false);
      return;
    }

    // First, get or create today's session
    const today = new Date().toISOString().split('T')[0];
    
    let { data: session } = await supabase
      .from('workout_sessions')
      .select('id')
      .eq('user_id', user.id)
      .eq('session_date', today)
      .maybeSingle();

    if (!session) {
      const { data: newSession, error: sessionError } = await supabase
        .from('workout_sessions')
        .insert({
          user_id: user.id,
          session_date: today,
          workout_name: 'Treino do dia'
        })
        .select('id')
        .single();

      if (sessionError) {
        toast.error("Erro ao criar sessão");
        setIsSaving(false);
        return;
      }
      session = newSession;
    }

    // Now save the exercise log
    const { error } = await supabase
      .from('exercise_logs')
      .insert({
        session_id: session.id,
        user_id: user.id,
        exercise_name: exerciseName,
        sets_completed: setsCompleted,
        weight: weight ? parseFloat(weight) : null,
      });

    if (error) {
      toast.error("Erro ao salvar");
    } else {
      toast.success("Treino registrado!");
      fetchHistory();
    }
    setIsSaving(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit',
      year: '2-digit'
    });
  };

  return (
    <div className="bg-card rounded-2xl p-4 border border-border space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-foreground">Registrar treino</h2>
        {history.length > 0 && (
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={cn(
              "flex items-center gap-1.5 text-sm font-medium transition-colors",
              showHistory ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <History className="w-4 h-4" />
            Histórico
          </button>
        )}
      </div>

      {/* Last workout indicator */}
      {lastLog && !showHistory && (
        <div className="bg-muted/50 rounded-lg px-3 py-2 text-sm">
          <span className="text-muted-foreground">Último treino: </span>
          <span className="text-foreground font-medium">
            {lastLog.sets_completed} séries
            {lastLog.weight && ` • ${lastLog.weight}kg`}
          </span>
          <span className="text-muted-foreground"> em {formatDate(lastLog.created_at)}</span>
        </div>
      )}

      {/* History panel */}
      {showHistory && (
        <div className="bg-muted/30 rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto">
          {history.map((log) => (
            <div key={log.id} className="flex items-center justify-between text-sm py-1.5 border-b border-border/50 last:border-0">
              <span className="text-muted-foreground">{formatDate(log.created_at)}</span>
              <span className="font-medium text-foreground">
                {log.sets_completed} séries
                {log.weight && <span className="text-primary ml-2">{log.weight}kg</span>}
              </span>
            </div>
          ))}
          {history.length === 0 && (
            <p className="text-muted-foreground text-sm text-center py-4">
              Nenhum registro ainda
            </p>
          )}
        </div>
      )}

      {/* Input fields */}
      <div className="grid grid-cols-2 gap-3">
        {/* Sets counter */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Séries feitas</label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSetsCompleted(Math.max(0, setsCompleted - 1))}
              className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-foreground hover:bg-muted/80 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="flex-1 text-center text-2xl font-bold text-foreground">
              {setsCompleted}
            </span>
            <button
              onClick={() => setSetsCompleted(setsCompleted + 1)}
              className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Weight input */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Peso (kg)</label>
          <div className="flex items-center gap-1.5 bg-muted/50 rounded-lg px-3 py-2 h-10">
            <Dumbbell className="w-4 h-4 text-muted-foreground" />
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="0"
              className="bg-transparent border-none text-lg font-semibold w-full focus:outline-none text-foreground placeholder:text-muted-foreground"
            />
            <span className="text-sm text-muted-foreground">kg</span>
          </div>
        </div>
      </div>

      {/* Save button */}
      <Button
        onClick={handleSave}
        disabled={isSaving || setsCompleted === 0}
        className="w-full"
      >
        {isSaving ? (
          "Salvando..."
        ) : (
          <>
            <Check className="w-4 h-4 mr-2" />
            Registrar treino
          </>
        )}
      </Button>
    </div>
  );
};

export default ExerciseLogForm;