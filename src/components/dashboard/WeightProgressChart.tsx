import React, { useMemo, useState } from "react";
import { TrendingDown, TrendingUp, Minus, Scale, Plus } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface WeightProgressChartProps {
  currentWeight: number | null;
  targetWeight: number | null;
  startingWeight: number | null;
  className?: string;
  onWeightLogged?: (newWeight: number) => void;
}

interface WeightLog {
  id: string;
  weight: number;
  logged_at: string;
}

export const WeightProgressChart: React.FC<WeightProgressChartProps> = ({
  currentWeight,
  targetWeight,
  startingWeight,
  className,
  onWeightLogged,
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [weightInput, setWeightInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch weight logs from database
  const { data: weightLogs = [], isLoading } = useQuery({
    queryKey: ["weight-logs", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data, error } = await supabase
        .from("weight_logs")
        .select("*")
        .eq("user_id", user.id)
        .gte("logged_at", thirtyDaysAgo.toISOString().split("T")[0])
        .order("logged_at", { ascending: true });
      
      if (error) throw error;
      return data as WeightLog[];
    },
    enabled: !!user,
  });

  // Mutation for logging weight
  const logWeightMutation = useMutation({
    mutationFn: async (weight: number) => {
      if (!user) throw new Error("User not authenticated");
      
      const today = new Date().toISOString().split("T")[0];
      
      // Upsert - insert or update if exists for today
      const { data, error } = await supabase
        .from("weight_logs")
        .upsert(
          { user_id: user.id, weight, logged_at: today },
          { onConflict: "user_id,logged_at" }
        )
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, newWeight) => {
      queryClient.invalidateQueries({ queryKey: ["weight-logs", user?.id] });
      toast.success("Peso registado com sucesso!");
      setWeightInput("");
      onWeightLogged?.(newWeight);
    },
    onError: () => {
      toast.error("Erro ao registar peso. Tente novamente.");
    },
  });

  const handleSubmitWeight = async (e: React.FormEvent) => {
    e.preventDefault();
    const weight = parseFloat(weightInput);
    
    if (isNaN(weight) || weight < 20 || weight > 300) {
      toast.error("Insira um peso válido (20-300 kg)");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await logWeightMutation.mutateAsync(weight);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate chart data from weight logs or fallback to interpolated data
  const chartData = useMemo(() => {
    if (weightLogs.length > 0) {
      return weightLogs.map((log) => {
        const date = new Date(log.logged_at);
        return {
          day: date.getDate(),
          weight: Number(log.weight),
          date: date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }),
          fullDate: log.logged_at,
        };
      });
    }
    
    // Fallback: generate interpolated data if no logs exist
    const start = startingWeight || currentWeight || 70;
    const current = currentWeight || start;
    const days = 30;
    const data = [];

    for (let i = 0; i < days; i++) {
      const progress = i / (days - 1);
      const baseWeight = start + (current - start) * progress;
      const variation = (Math.random() - 0.5) * 0.6;
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      
      data.push({
        day: date.getDate(),
        weight: Math.round((baseWeight + variation) * 10) / 10,
        date: date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }),
        fullDate: date.toISOString().split("T")[0],
      });
    }
    
    if (data.length > 0) {
      data[data.length - 1].weight = current;
    }

    return data;
  }, [weightLogs, currentWeight, startingWeight]);

  // Calculate latest weight from logs or use currentWeight
  const latestWeight = weightLogs.length > 0 
    ? Number(weightLogs[weightLogs.length - 1].weight)
    : currentWeight;

  const firstLoggedWeight = weightLogs.length > 0 
    ? Number(weightLogs[0].weight)
    : startingWeight || currentWeight;

  const weightChange = (latestWeight || 0) - (firstLoggedWeight || latestWeight || 0);
  const isLosing = weightChange < 0;
  const isGaining = weightChange > 0;

  const TrendIcon = isLosing ? TrendingDown : isGaining ? TrendingUp : Minus;
  const trendColor = isLosing ? "text-emerald-500" : isGaining ? "text-red-500" : "text-muted-foreground";

  // Calculate Y-axis domain including target weight
  const yDomain = useMemo(() => {
    const weights = chartData.map(d => d.weight);
    if (targetWeight) weights.push(targetWeight);
    const min = Math.min(...weights) - 2;
    const max = Math.max(...weights) + 2;
    return [min, max];
  }, [chartData, targetWeight]);

  return (
    <div className={cn("bg-card/80 backdrop-blur-sm rounded-2xl p-5 border border-border/50", className)}>
      {/* Weight Input Form */}
      <form onSubmit={handleSubmitWeight} className="mb-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Input
              type="number"
              step="0.1"
              min="20"
              max="300"
              placeholder="Ex: 75.5"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              className="pr-10 bg-background/50 border-border/50 focus:border-primary/50"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              kg
            </span>
          </div>
          <Button 
            type="submit" 
            disabled={isSubmitting || !weightInput}
            className="gap-2 bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Registar Peso</span>
            <span className="sm:hidden">Registar</span>
          </Button>
        </div>
      </form>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Scale className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Progresso de Peso</h3>
            <span className="text-xs text-muted-foreground">
              {weightLogs.length > 0 ? `${weightLogs.length} registos` : "Últimos 30 dias"}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1">
            <span className="text-lg font-bold text-foreground">{latestWeight || currentWeight || "—"}</span>
            <span className="text-sm text-muted-foreground">kg</span>
          </div>
          {weightChange !== 0 && (
            <div className={cn("flex items-center gap-0.5 text-xs", trendColor)}>
              <TrendIcon className="w-3 h-3" />
              <span>{Math.abs(weightChange).toFixed(1)}kg</span>
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="h-36 -mx-2">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground text-sm">A carregar...</div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="day" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                interval="preserveStartEnd"
              />
              <YAxis 
                domain={yDomain}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                width={35}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value: number) => [`${value} kg`, "Peso"]}
                labelFormatter={(_, payload) => {
                  if (payload && payload[0]) {
                    return payload[0].payload.date;
                  }
                  return "";
                }}
              />
              {/* Target weight reference line */}
              {targetWeight && (
                <ReferenceLine 
                  y={targetWeight} 
                  stroke="hsl(var(--primary))"
                  strokeDasharray="5 5"
                  strokeOpacity={0.6}
                  label={{
                    value: `Meta: ${targetWeight}kg`,
                    position: "right",
                    fill: "hsl(var(--primary))",
                    fontSize: 10,
                    opacity: 0.8,
                  }}
                />
              )}
              <Line
                type="monotone"
                dataKey="weight"
                stroke="hsl(var(--primary))"
                strokeWidth={2.5}
                dot={weightLogs.length <= 10}
                activeDot={{ r: 5, fill: "hsl(var(--primary))", stroke: "hsl(var(--background))", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Target indicator */}
      {targetWeight && (
        <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Meta</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">{targetWeight} kg</span>
            {latestWeight && (
              <span className="text-xs text-muted-foreground">
                ({Math.abs(latestWeight - targetWeight).toFixed(1)}kg restantes)
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
