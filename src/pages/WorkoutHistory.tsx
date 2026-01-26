import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Dumbbell, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface ExerciseLog {
  id: string;
  exercise_name: string;
  sets_completed: number;
  weight: number | null;
}

interface WorkoutSession {
  id: string;
  workout_name: string | null;
  session_date: string;
  exercise_logs: ExerciseLog[];
}

const WorkoutHistory: React.FC = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSession, setExpandedSession] = useState<string | null>(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data: sessionsData, error: sessionsError } = await supabase
      .from('workout_sessions')
      .select('id, workout_name, session_date')
      .eq('user_id', user.id)
      .order('session_date', { ascending: false })
      .limit(30);

    if (sessionsError || !sessionsData) {
      setLoading(false);
      return;
    }

    // Fetch exercise logs for all sessions
    const sessionIds = sessionsData.map(s => s.id);
    const { data: logsData } = await supabase
      .from('exercise_logs')
      .select('id, session_id, exercise_name, sets_completed, weight')
      .in('session_id', sessionIds);

    // Combine sessions with their logs
    const sessionsWithLogs = sessionsData.map(session => ({
      ...session,
      exercise_logs: (logsData || []).filter(log => log.session_id === session.id)
    }));

    setSessions(sessionsWithLogs);
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Hoje";
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return "Ontem";
    }
    
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long',
      day: '2-digit', 
      month: 'long'
    });
  };

  const toggleSession = (sessionId: string) => {
    setExpandedSession(expandedSession === sessionId ? null : sessionId);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-4 p-4">
          <button
            onClick={() => navigate("/workout")}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-muted/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Histórico de Treinos</h1>
            <p className="text-sm text-muted-foreground">
              {sessions.length} sessões registradas
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3 pb-24">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Nenhum treino registrado</h3>
            <p className="text-muted-foreground text-sm">
              Seus treinos aparecerão aqui quando você registrar exercícios
            </p>
          </div>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className="bg-card rounded-2xl border border-border overflow-hidden"
            >
              <button
                onClick={() => toggleSession(session.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Dumbbell className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-foreground">
                      {formatDate(session.session_date)}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {session.exercise_logs.length} exercícios
                    </p>
                  </div>
                </div>
                <ChevronRight 
                  className={cn(
                    "w-5 h-5 text-muted-foreground transition-transform",
                    expandedSession === session.id && "rotate-90"
                  )} 
                />
              </button>

              {/* Expanded exercise list */}
              {expandedSession === session.id && (
                <div className="border-t border-border bg-muted/20 p-4 space-y-3">
                  {session.exercise_logs.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-2">
                      Nenhum exercício registrado
                    </p>
                  ) : (
                    session.exercise_logs.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-center justify-between bg-card rounded-xl p-3 border border-border"
                      >
                        <span className="font-medium text-foreground">
                          {log.exercise_name}
                        </span>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            {log.sets_completed} séries
                          </span>
                          {log.weight && (
                            <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                              {log.weight}kg
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WorkoutHistory;