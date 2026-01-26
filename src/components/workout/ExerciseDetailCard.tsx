import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Play, X, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getExerciseMedia } from "@/data/exerciseVideos";

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

// Mapping from exercise names to gallery IDs for linking
const exerciseNameToId: Record<string, string> = {
  // Peito
  "bench press": "chest-1",
  "supino reto": "chest-1",
  "dumbbell incline bench press": "chest-2",
  "incline dumbbell press": "chest-2",
  "supino inclinado": "chest-3",
  "crucifixo": "chest-4",
  "flexão de braço": "chest-5",
  "push-ups": "chest-5",
  "crossover": "chest-6",
  "fly na máquina": "chest-7",
  // Costas
  "pulldown": "back-1",
  "lat pulldown": "back-1",
  "lat pulldowns": "back-1",
  "seated wide-grip row": "back-2",
  "seated cable rows": "back-2",
  "puxada frontal": "back-3",
  "remada curvada": "back-4",
  "bent-over barbell rows": "back-4",
  "barra fixa": "back-5",
  "remada unilateral": "back-6",
  // Ombros
  "lateral raise": "shoulder-1",
  "dumbbell lateral raises": "shoulder-1",
  "seated shoulder press": "shoulder-2",
  "overhead dumbbell press": "shoulder-2",
  "desenvolvimento": "shoulder-3",
  "elevação frontal": "shoulder-4",
  "crucifixo inverso": "shoulder-5",
  "encolhimento": "shoulder-6",
  "face pulls": "trap-4",
  // Bíceps
  "biceps curl": "biceps-1",
  "bicep curls": "biceps-1",
  "hammer curl": "biceps-2",
  "rosca direta": "biceps-3",
  "rosca alternada": "biceps-4",
  "rosca concentrada": "biceps-5",
  "rosca scott": "biceps-6",
  // Tríceps
  "triceps pushdown": "triceps-1",
  "triceps pushdowns": "triceps-1",
  "seated bench extension": "triceps-2",
  "tríceps pulley": "triceps-3",
  "tríceps testa": "triceps-4",
  "mergulho": "triceps-5",
  "kickback": "triceps-6",
  // Quadríceps
  "lever leg extension": "quad-1",
  "leg press": "quad-3",
  "agachamento": "quad-2",
  "barbell squats": "quad-2",
  "goblet squats": "quad-2",
  "agachamento hack": "quad-4",
  "avanço": "quad-5",
  "dumbbell lunges": "quad-5",
  "agachamento búlgaro": "quad-6",
  // Abdômen
  "abdominal crunch": "abs-1",
  "prancha": "abs-2",
  "plank": "abs-2",
  "elevação de pernas": "abs-3",
  "abdominal bicicleta": "abs-4",
  "prancha lateral": "abs-5",
  // Posterior
  "stiff": "post-1",
  "deadlifts": "post-4",
  "mesa flexora": "post-2",
  "flexora deitado": "post-3",
  "levantamento terra": "post-4",
  "good morning": "post-5",
  "cadeira flexora": "post-6",
  // Trapézio  
  "encolhimento com barra": "trap-1",
  "encolhimento com halteres": "trap-2",
  "remada alta": "trap-3",
  "face pull": "trap-4",
  "elevação posterior": "trap-5",
  "calf raises": "quad-1", // fallback
};

const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\(each leg\)/g, "")
    .trim();
};

const getExerciseId = (name: string): string | null => {
  const normalized = normalizeString(name);
  
  // Try exact match
  if (exerciseNameToId[normalized]) {
    return exerciseNameToId[normalized];
  }
  
  // Try partial match
  for (const [key, id] of Object.entries(exerciseNameToId)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return id;
    }
  }
  
  return null;
};

const ExerciseDetailCard: React.FC<ExerciseDetailCardProps> = ({
  exercise,
  index,
}) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const navigate = useNavigate();

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
  
  const exerciseId = getExerciseId(exercise.name);

  const handleCardClick = () => {
    if (exerciseId) {
      navigate(`/exercise/${exerciseId}`);
    } else {
      // If no gallery match, open video modal as fallback
      if (hasVideo) {
        setIsVideoOpen(true);
      }
    }
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className={cn(
          "bg-card rounded-2xl p-4 shadow-card border border-border",
          "transition-all duration-200 cursor-pointer hover:shadow-fab active:scale-[0.98]"
        )}
      >
        <div className="flex items-start gap-4">
          {/* Video Thumbnail / Play Button */}
          <div 
            className={cn(
              "relative w-20 h-20 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden",
              "bg-gradient-to-br from-muted to-muted/50"
            )}
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

            <div className="mt-3 text-sm text-primary font-medium flex items-center gap-1">
              <Play className="w-3.5 h-3.5" />
              {exerciseId ? "Ver exercício e registrar treino" : hasVideo ? "Ver demonstração" : "Ver detalhes"}
              <ChevronRight className="w-4 h-4 ml-auto" />
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal (fallback for exercises not in gallery) */}
      {isVideoOpen && videoUrl && !exerciseId && (
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
