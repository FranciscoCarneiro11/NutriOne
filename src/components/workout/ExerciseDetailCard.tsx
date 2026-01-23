import React, { useState, useMemo, useEffect } from "react";
import { Clock, Play, X, Dumbbell, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { getExerciseMedia } from "@/data/exerciseVideos";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  videoUrl?: string;
}

interface ExerciseDetailCardProps {
  exercise: Exercise;
  index: number;
}

const ExerciseDetailCard: React.FC<ExerciseDetailCardProps> = ({
  exercise,
  index,
}) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [weight, setWeight] = useState<string>("");
  const [lastWeight, setLastWeight] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Get video from the centralized database if not provided
  const exerciseMedia = useMemo(() => {
    if (exercise.videoUrl) {
      return { videoUrl: exercise.videoUrl };
    }
    return getExerciseMedia(exercise.name);
  }, [exercise.name, exercise.videoUrl]);

  const videoUrl = exerciseMedia?.videoUrl;
  const thumbnailUrl = exerciseMedia?.thumbnailUrl;
  const hasVideo = !!videoUrl;
  const hasThumbnail = !!thumbnailUrl;

  // Fetch last used weight for this exercise
  useEffect(() => {
    const fetchLastWeight = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('exercise_weights')
        .select('weight')
        .eq('user_id', user.id)
        .eq('exercise_name', exercise.name)
        .single();

      if (data && !error) {
        setLastWeight(data.weight);
        setWeight(data.weight.toString());
      }
    };

    fetchLastWeight();
  }, [exercise.name]);

  const handleSaveWeight = async () => {
    if (!weight || isNaN(parseFloat(weight))) {
      toast({
        title: "Peso inválido",
        description: "Por favor, insira um peso válido.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para salvar o peso.",
        variant: "destructive",
      });
      setIsSaving(false);
      return;
    }

    const { error } = await supabase
      .from('exercise_weights')
      .upsert({
        user_id: user.id,
        exercise_name: exercise.name,
        weight: parseFloat(weight),
      }, {
        onConflict: 'user_id,exercise_name'
      });

    if (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o peso.",
        variant: "destructive",
      });
    } else {
      setLastWeight(parseFloat(weight));
      toast({
        title: "Peso salvo!",
        description: `${weight}kg registrado para ${exercise.name}`,
      });
    }
    setIsSaving(false);
  };

  return (
    <>
      <div
        className={cn(
          "bg-card rounded-2xl p-4 shadow-card border border-border",
          "transition-all duration-200"
        )}
      >
        <div className="flex items-start gap-4">
          {/* Video Thumbnail / Play Button */}
          <div 
            className={cn(
              "relative w-20 h-20 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden",
              "bg-gradient-to-br from-muted to-muted/50",
              hasVideo && "cursor-pointer hover:opacity-80"
            )}
            onClick={() => hasVideo && setIsVideoOpen(true)}
          >
            {hasThumbnail ? (
              <>
                <img 
                  src={thumbnailUrl} 
                  alt={exercise.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {hasVideo && (
                  <>
                    <div className="absolute inset-0 bg-black/30 rounded-xl" />
                    <div className="relative w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                      <Play className="w-5 h-5 text-primary ml-0.5" fill="currentColor" />
                    </div>
                  </>
                )}
              </>
            ) : hasVideo ? (
              <>
                <div className="absolute inset-0 bg-black/20 rounded-xl" />
                <div className="relative w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                  <Play className="w-5 h-5 text-primary ml-0.5" fill="currentColor" />
                </div>
              </>
            ) : (
              <span className="text-2xl font-bold text-muted-foreground">
                {index + 1}
              </span>
            )}
          </div>

          {/* Exercise Info */}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-foreground text-lg leading-tight">
              {exercise.name}
            </h4>
            
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">
                {exercise.sets} séries
              </span>
              <span className="bg-muted text-muted-foreground text-sm font-medium px-3 py-1 rounded-full">
                {exercise.reps} reps
              </span>
              {exercise.rest && (
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  {exercise.rest}
                </span>
              )}
            </div>

            {/* Weight Input Section */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-muted/50 rounded-lg px-2 py-1.5 flex-1">
                <Dumbbell className="w-4 h-4 text-muted-foreground" />
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder={lastWeight ? `Último: ${lastWeight}kg` : "Peso (kg)"}
                  className="bg-transparent border-none text-sm w-full focus:outline-none text-foreground placeholder:text-muted-foreground"
                />
                <span className="text-xs text-muted-foreground">kg</span>
              </div>
              <button
                onClick={handleSaveWeight}
                disabled={isSaving || !weight}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  weight 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                    : "bg-muted text-muted-foreground"
                )}
              >
                <Check className="w-4 h-4" />
              </button>
            </div>

            {lastWeight && (
              <p className="text-xs text-muted-foreground mt-1.5">
                Último peso registrado: <span className="font-medium text-foreground">{lastWeight}kg</span>
              </p>
            )}

            {hasVideo && (
              <button 
                onClick={() => setIsVideoOpen(true)}
                className="mt-3 text-sm text-primary font-medium flex items-center gap-1 hover:underline"
              >
                <Play className="w-3.5 h-3.5" />
                Ver demonstração
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {isVideoOpen && videoUrl && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setIsVideoOpen(false)}
        >
          <div 
            className="relative w-full max-w-2xl bg-card rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="aspect-video bg-black">
              <video 
                src={videoUrl}
                controls
                autoPlay
                loop
                className="w-full h-full object-contain"
              />
            </div>
            
            <div className="p-4">
              <h4 className="font-semibold text-foreground">{exercise.name}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {exercise.sets} séries × {exercise.reps} repetições
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExerciseDetailCard;
