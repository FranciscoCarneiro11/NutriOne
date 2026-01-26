import React, { useState, useEffect } from "react";
import { Dumbbell, Check, History, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ExerciseLogFormProps {
  exerciseName: string;
}

interface SetEntry {
  id?: string;
  weight: string;
  setNumber: number;
}

interface HistoryEntry {
  date: string;
  sets: { weight: number | null; setNumber: number }[];
}

const ExerciseLogForm: React.FC<ExerciseLogFormProps> = ({ exerciseName }) => {
  const [sets, setSets] = useState<SetEntry[]>([{ weight: "", setNumber: 1 }]);
  const [isSaving, setIsSaving] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [lastWorkout, setLastWorkout] = useState<HistoryEntry | null>(null);

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
      .limit(50);

    if (data && !error) {
      // Group logs by date
      const grouped: Record<string, { weight: number | null; setNumber: number }[]> = {};
      
      data.forEach((log) => {
        const date = new Date(log.created_at).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit'
        });
        
        if (!grouped[date]) {
          grouped[date] = [];
        }
        grouped[date].push({
          weight: log.weight,
          setNumber: log.sets_completed
        });
      });

      // Convert to array and sort sets by setNumber
      const historyArray: HistoryEntry[] = Object.entries(grouped).map(([date, sets]) => ({
        date,
        sets: sets.sort((a, b) => a.setNumber - b.setNumber)
      }));

      setHistory(historyArray);
      
      if (historyArray.length > 0) {
        setLastWorkout(historyArray[0]);
        // Pre-fill with last workout's sets
        const prefillSets = historyArray[0].sets.map((s, idx) => ({
          weight: s.weight?.toString() || "",
          setNumber: idx + 1
        }));
        if (prefillSets.length > 0) {
          setSets(prefillSets);
        }
      }
    }
  };

  const addSet = () => {
    setSets([...sets, { weight: "", setNumber: sets.length + 1 }]);
  };

  const removeSet = (index: number) => {
    if (sets.length === 1) {
      toast.error("Precisa ter pelo menos 1 série");
      return;
    }
    const newSets = sets.filter((_, i) => i !== index).map((s, i) => ({
      ...s,
      setNumber: i + 1
    }));
    setSets(newSets);
  };

  const updateSetWeight = (index: number, weight: string) => {
    const newSets = [...sets];
    newSets[index] = { ...newSets[index], weight };
    setSets(newSets);
  };

  const handleSave = async () => {
    if (sets.length === 0) {
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

    // Get or create today's session
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

    // Save each set as a separate log entry
    const logsToInsert = sets.map((set) => ({
      session_id: session.id,
      user_id: user.id,
      exercise_name: exerciseName,
      sets_completed: set.setNumber,
      weight: set.weight ? parseFloat(set.weight) : null,
    }));

    const { error } = await supabase
      .from('exercise_logs')
      .insert(logsToInsert);

    if (error) {
      toast.error("Erro ao salvar");
    } else {
      toast.success("Treino registrado!");
      fetchHistory();
    }
    setIsSaving(false);
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
      {lastWorkout && !showHistory && (
        <div className="bg-muted/50 rounded-lg px-3 py-2 text-sm">
          <span className="text-muted-foreground">Último treino ({lastWorkout.date}): </span>
          <span className="text-foreground font-medium">
            {lastWorkout.sets.length} séries
            {lastWorkout.sets.some(s => s.weight) && (
              <span className="text-primary ml-1">
                ({lastWorkout.sets.map(s => s.weight ? `${s.weight}kg` : '-').join(' | ')})
              </span>
            )}
          </span>
        </div>
      )}

      {/* History panel */}
      {showHistory && (
        <div className="bg-muted/30 rounded-lg p-3 space-y-3 max-h-48 overflow-y-auto">
          {history.map((entry, idx) => (
            <div key={idx} className="border-b border-border/50 last:border-0 pb-2 last:pb-0">
              <div className="text-sm text-muted-foreground mb-1">{entry.date}</div>
              <div className="flex flex-wrap gap-2">
                {entry.sets.map((set, setIdx) => (
                  <span key={setIdx} className="text-sm bg-background px-2 py-1 rounded font-medium">
                    S{set.setNumber}: {set.weight ? `${set.weight}kg` : '-'}
                  </span>
                ))}
              </div>
            </div>
          ))}
          {history.length === 0 && (
            <p className="text-muted-foreground text-sm text-center py-4">
              Nenhum registro ainda
            </p>
          )}
        </div>
      )}

      {/* Sets list */}
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">Séries</label>
        <div className="space-y-2">
          {sets.map((set, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground w-8">
                {set.setNumber}ª
              </span>
              <div className="flex-1 flex items-center gap-1.5 bg-muted/50 rounded-lg px-3 py-2">
                <Dumbbell className="w-4 h-4 text-muted-foreground" />
                <Input
                  type="number"
                  value={set.weight}
                  onChange={(e) => updateSetWeight(index, e.target.value)}
                  placeholder="0"
                  className="bg-transparent border-none text-base font-semibold h-auto p-0 focus-visible:ring-0"
                />
                <span className="text-sm text-muted-foreground">kg</span>
              </div>
              <button
                onClick={() => removeSet(index)}
                className="w-8 h-8 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add set button */}
        <button
          onClick={addSet}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
        >
          <Plus className="w-4 h-4" />
          Adicionar série
        </button>
      </div>

      {/* Save button */}
      <Button
        onClick={handleSave}
        disabled={isSaving || sets.length === 0}
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