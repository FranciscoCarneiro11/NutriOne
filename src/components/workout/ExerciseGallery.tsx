import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Bookmark, HelpCircle, Heart, Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/i18n/LanguageContext";

// Imagens customizadas de grupos musculares
import peitoImg from "@/assets/muscle-groups/peito.png";
import costasImg from "@/assets/muscle-groups/costas.png";
import tricepsImg from "@/assets/muscle-groups/triceps.png";
import bicepsImg from "@/assets/muscle-groups/biceps.png";
import abdomenImg from "@/assets/muscle-groups/abdomen.png";
import posteriorImg from "@/assets/muscle-groups/posterior.png";
import quadricepsImg from "@/assets/muscle-groups/quadriceps.png";
import trapezioImg from "@/assets/muscle-groups/trapezio.png";
import ombrosImg from "@/assets/muscle-groups/ombros.png";
import todosImg from "@/assets/muscle-groups/todos.png"; // Will be used for favorites

interface GalleryExercise {
  id: string;
  muscleGroupId: string;
  videoUrl?: string;
  thumbnailUrl?: string;
}

// Placeholder component for when video fails to load
const ExercisePlaceholder: React.FC<{
  name: string;
}> = ({
  name
}) => <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-muted to-muted/50">
    <Dumbbell className="w-10 h-10 text-muted-foreground/40 mb-2" />
    <span className="text-xs text-muted-foreground/60 text-center px-2 line-clamp-2">
      {name}
    </span>
  </div>;

// Video thumbnail with loading state and error fallback
const VideoThumbnail: React.FC<{
  videoUrl: string;
  exerciseName: string;
}> = ({
  videoUrl,
  exerciseName
}) => {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const handleLoadedData = useCallback(() => {
    setStatus('loaded');
  }, []);
  const handleError = useCallback(() => {
    console.warn(`Failed to load video: ${videoUrl}`);
    setStatus('error');
  }, [videoUrl]);
  if (status === 'error') {
    return <ExercisePlaceholder name={exerciseName} />;
  }
  return <>
      {status === 'loading' && <Skeleton className="absolute inset-0 w-full h-full" />}
      <video src={videoUrl} className={cn("w-full h-full object-cover transition-opacity duration-300", status === 'loading' ? 'opacity-0' : 'opacity-100')} muted playsInline preload="metadata" onLoadedData={handleLoadedData} onError={handleError} />
    </>;
};

// Dados estáticos de exercícios por grupo muscular
const exercisesByMuscle: Record<string, GalleryExercise[]> = {
  favoritos: [],
  // Will be populated dynamically
  peito: [{
    id: "chest-1",
    muscleGroupId: "peito",
    videoUrl: "/videos/supino_reto_com_barra.mp4",
    thumbnailUrl: "/images/exercises/supino-reto-com-barra.png"
  }, {
    id: "chest-2",
    muscleGroupId: "peito",
    videoUrl: "/videos/supino_inclinado_com_halter.mp4",
    thumbnailUrl: "/images/exercises/dumbbell-incline-bench-press.jpeg"
  }, {
    id: "chest-8",
    muscleGroupId: "peito",
    videoUrl: "/videos/voador.mp4",
    thumbnailUrl: "/images/exercises/voador-sentado.png"
  }, {
    id: "chest-3",
    muscleGroupId: "peito",
    videoUrl: "/videos/supino_inclinado_barra.mp4",
    thumbnailUrl: "/images/exercises/supino-inclinado-barra.png"
  }, {
    id: "chest-4",
    muscleGroupId: "peito"
  }, {
    id: "chest-5",
    muscleGroupId: "peito"
  }, {
    id: "chest-6",
    muscleGroupId: "peito"
  }, {
    id: "chest-7",
    muscleGroupId: "peito"
  }],
  costas: [{
    id: "back-2",
    muscleGroupId: "costas",
    videoUrl: "/videos/remada_aberta_sentado.mp4",
    thumbnailUrl: "/images/exercises/seated-wide-grip-row.jpeg"
  }, {
    id: "back-3",
    muscleGroupId: "costas"
  }, {
    id: "back-4",
    muscleGroupId: "costas"
  }, {
    id: "back-5",
    muscleGroupId: "costas"
  }, {
    id: "back-6",
    muscleGroupId: "costas"
  }],
  ombros: [{
    id: "shoulder-2",
    muscleGroupId: "ombros",
    videoUrl: "/videos/shoulderpress.mp4",
    thumbnailUrl: "/images/exercises/seated-shoulder-press.jpeg"
  }, {
    id: "shoulder-3",
    muscleGroupId: "ombros"
  }, {
    id: "shoulder-4",
    muscleGroupId: "ombros"
  }, {
    id: "shoulder-5",
    muscleGroupId: "ombros"
  }, {
    id: "shoulder-6",
    muscleGroupId: "ombros"
  }],
  biceps: [{
    id: "biceps-1",
    muscleGroupId: "biceps",
    videoUrl: "/videos/biceps_cabo.mp4",
    thumbnailUrl: "/images/exercises/biceps-curl.jpeg"
  }, {
    id: "biceps-2",
    muscleGroupId: "biceps",
    videoUrl: "/videos/biceps_martelo.mp4",
    thumbnailUrl: "/images/exercises/hammer-curl.jpeg"
  }, {
    id: "biceps-3",
    muscleGroupId: "biceps"
  }, {
    id: "biceps-4",
    muscleGroupId: "biceps"
  }, {
    id: "biceps-5",
    muscleGroupId: "biceps"
  }, {
    id: "biceps-6",
    muscleGroupId: "biceps"
  }],
  triceps: [{
    id: "triceps-2",
    muscleGroupId: "triceps",
    videoUrl: "/videos/triceps_frances.mp4",
    thumbnailUrl: "/images/exercises/seated-bench-extension.jpeg"
  }, {
    id: "triceps-3",
    muscleGroupId: "triceps"
  }, {
    id: "triceps-4",
    muscleGroupId: "triceps"
  }, {
    id: "triceps-5",
    muscleGroupId: "triceps"
  }, {
    id: "triceps-6",
    muscleGroupId: "triceps"
  }],
  quadriceps: [{
    id: "quad-1",
    muscleGroupId: "quadriceps",
    videoUrl: "/videos/cadeira_extensora.mp4",
    thumbnailUrl: "/images/exercises/leg-extension.jpeg"
  }, {
    id: "quad-2",
    muscleGroupId: "quadriceps"
  }, {
    id: "quad-3",
    muscleGroupId: "quadriceps"
  }, {
    id: "quad-4",
    muscleGroupId: "quadriceps"
  }, {
    id: "quad-5",
    muscleGroupId: "quadriceps"
  }, {
    id: "quad-6",
    muscleGroupId: "quadriceps"
  }],
  abdomen: [{
    id: "abs-1",
    muscleGroupId: "abdomen"
  }, {
    id: "abs-2",
    muscleGroupId: "abdomen"
  }, {
    id: "abs-3",
    muscleGroupId: "abdomen"
  }, {
    id: "abs-4",
    muscleGroupId: "abdomen"
  }, {
    id: "abs-5",
    muscleGroupId: "abdomen"
  }],
  posterior: [{
    id: "post-1",
    muscleGroupId: "posterior"
  }, {
    id: "post-2",
    muscleGroupId: "posterior"
  }, {
    id: "post-3",
    muscleGroupId: "posterior"
  }, {
    id: "post-4",
    muscleGroupId: "posterior"
  }, {
    id: "post-5",
    muscleGroupId: "posterior"
  }, {
    id: "post-6",
    muscleGroupId: "posterior"
  }],
  trapezio: [{
    id: "trap-1",
    muscleGroupId: "trapezio"
  }, {
    id: "trap-2",
    muscleGroupId: "trapezio"
  }, {
    id: "trap-3",
    muscleGroupId: "trapezio"
  }, {
    id: "trap-4",
    muscleGroupId: "trapezio"
  }, {
    id: "trap-5",
    muscleGroupId: "trapezio"
  }]
};

// Get all exercises for favorites lookup
const allExercises = Object.entries(exercisesByMuscle).filter(([key]) => key !== "favoritos").flatMap(([_, exercises]) => exercises);
const muscleGroups = [{
  id: "favoritos",
  name: "Favoritos",
  highlightZone: "all",
  customImage: todosImg,
  isFavorites: true
}, {
  id: "peito",
  name: "Peito",
  highlightZone: "chest",
  customImage: peitoImg
}, {
  id: "costas",
  name: "Costas",
  highlightZone: "back",
  customImage: costasImg
}, {
  id: "ombros",
  name: "Ombros",
  highlightZone: "shoulders",
  customImage: ombrosImg
}, {
  id: "biceps",
  name: "Bíceps",
  highlightZone: "biceps",
  customImage: bicepsImg
}, {
  id: "triceps",
  name: "Tríceps",
  highlightZone: "triceps",
  customImage: tricepsImg
}, {
  id: "quadriceps",
  name: "Quadríceps",
  highlightZone: "legs",
  customImage: quadricepsImg
}, {
  id: "posterior",
  name: "Posterior",
  highlightZone: "hamstrings",
  customImage: posteriorImg
}, {
  id: "trapezio",
  name: "Trapézio",
  highlightZone: "traps",
  customImage: trapezioImg
}, {
  id: "abdomen",
  name: "Abdômen",
  highlightZone: "abs",
  customImage: abdomenImg
}];

// Componente de silhueta do corpo com destaque na zona selecionada
const BodySilhouette: React.FC<{
  zone: string;
  isSelected: boolean;
}> = ({
  zone,
  isSelected
}) => {
  const getHighlightColor = () => isSelected ? "#ef4444" : "#6b7280";
  const baseColor = isSelected ? "#ffffff" : "#9ca3af";
  return <svg viewBox="0 0 60 100" className="w-full h-full">
      {/* Cabeça */}
      <ellipse cx="30" cy="12" rx="8" ry="10" fill={baseColor} />
      
      {/* Pescoço */}
      <rect x="27" y="22" width="6" height="6" fill={baseColor} />
      
      {/* Torso */}
      <path d={zone === "chest" || zone === "all" ? "M18 28 L42 28 L44 55 L16 55 Z" : "M18 28 L42 28 L44 55 L16 55 Z"} fill={zone === "chest" || zone === "abs" || zone === "all" ? getHighlightColor() : baseColor} />
      
      {/* Ombros */}
      <ellipse cx="14" cy="32" rx="5" ry="4" fill={zone === "shoulders" || zone === "all" ? getHighlightColor() : baseColor} />
      <ellipse cx="46" cy="32" rx="5" ry="4" fill={zone === "shoulders" || zone === "all" ? getHighlightColor() : baseColor} />
      
      {/* Braço esquerdo */}
      <path d="M9 36 L6 52 L10 52 L14 38 Z" fill={zone === "biceps" || zone === "triceps" || zone === "all" ? getHighlightColor() : baseColor} />
      <path d="M6 52 L4 68 L9 68 L10 52 Z" fill={baseColor} />
      
      {/* Braço direito */}
      <path d="M51 36 L54 52 L50 52 L46 38 Z" fill={zone === "biceps" || zone === "triceps" || zone === "all" ? getHighlightColor() : baseColor} />
      <path d="M54 52 L56 68 L51 68 L50 52 Z" fill={baseColor} />
      
      {/* Pernas */}
      <path d="M16 55 L14 85 L22 85 L25 55 Z" fill={zone === "legs" || zone === "all" ? getHighlightColor() : baseColor} />
      <path d="M44 55 L46 85 L38 85 L35 55 Z" fill={zone === "legs" || zone === "all" ? getHighlightColor() : baseColor} />
      
      {/* Pés */}
      <ellipse cx="18" cy="90" rx="5" ry="4" fill={baseColor} />
      <ellipse cx="42" cy="90" rx="5" ry="4" fill={baseColor} />
    </svg>;
};
const ExerciseGallery: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useLanguage();
  
  // Read muscle filter from URL, defaulting to "favoritos"
  const muscleParam = searchParams.get("muscle");
  const selectedMuscle = muscleParam && muscleGroups.some(m => m.id === muscleParam) 
    ? muscleParam 
    : "favoritos";
  
  // Update muscle selection via URL to preserve state on back navigation
  const setSelectedMuscle = (muscle: string) => {
    setSearchParams({ tab: "galeria", muscle }, { replace: true });
  };
  
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // Load favorites from localStorage
  useEffect(() => {
    const loadFavorites = () => {
      const favorites = JSON.parse(localStorage.getItem("favoriteExercises") || "[]");
      setFavoriteIds(favorites);
    };
    loadFavorites();

    // Listen for storage changes
    const handleStorageChange = () => loadFavorites();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);
  // Helper to get exercise name from translations
  const getExerciseName = (exerciseId: string): string => {
    const exerciseTranslations = t.exercises as Record<string, string>;
    return exerciseTranslations[exerciseId] || exerciseId;
  };

  // Helper to get muscle group name from translations
  const getMuscleGroupName = (muscleGroupId: string): string => {
    const muscleTranslations = t.muscleGroups as Record<string, string>;
    return muscleTranslations[muscleGroupId] || muscleGroupId;
  };

  const toggleFavorite = (exerciseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavorites = favoriteIds.includes(exerciseId) ? favoriteIds.filter(id => id !== exerciseId) : [...favoriteIds, exerciseId];
    localStorage.setItem("favoriteExercises", JSON.stringify(newFavorites));
    setFavoriteIds(newFavorites);
    if (newFavorites.includes(exerciseId)) {
      toast.success(t.workout.addedToFavorites);
    } else {
      toast.success(t.workout.removedFromFavorites);
    }
  };
  const handleExerciseClick = (exercise: GalleryExercise) => {
    navigate(`/exercise/${exercise.id}`);
  };

  // Get exercises based on selection
  const exercises = selectedMuscle === "favoritos" ? allExercises.filter(ex => favoriteIds.includes(ex.id)) : exercisesByMuscle[selectedMuscle] || [];
  const selectedMuscleInfo = muscleGroups.find(m => m.id === selectedMuscle);
  return <div className="space-y-4">
      {/* Muscle Groups Horizontal Scroll */}
      <ScrollArea className="w-full mt-2 [&>div]:overflow-visible">
        <div className="flex gap-6 pt-3 pb-3 px-3">
          {muscleGroups.map(muscle => (
            <button 
              key={muscle.id} 
              onClick={() => setSelectedMuscle(muscle.id)} 
              className="flex-shrink-0 flex flex-col items-center justify-center gap-1.5 min-w-[64px] py-2 px-1 transition-all"
            >
              {/* Icon container - no background, floating look */}
              <div className="w-14 h-14 flex items-center justify-center transition-all duration-300">
                {muscle.customImage ? (
                  <img 
                    src={muscle.customImage} 
                    alt={getMuscleGroupName(muscle.id)} 
                    className={cn(
                      "w-full h-full object-contain transition-all duration-300",
                      selectedMuscle === muscle.id 
                        ? "drop-shadow-[0_0_8px_rgba(255,70,70,0.8)] brightness-110 saturate-[1.3]" 
                        : "opacity-60 hover:opacity-80"
                    )} 
                  />
                ) : (
                  <div className={cn(
                    "w-full h-full transition-all duration-300",
                    selectedMuscle === muscle.id 
                      ? "[filter:drop-shadow(0_0_8px_rgba(255,70,70,0.8))]" 
                      : "opacity-60 hover:opacity-80"
                  )}>
                    <BodySilhouette zone={muscle.highlightZone} isSelected={selectedMuscle === muscle.id} />
                  </div>
                )}
              </div>
              {/* Label */}
              <span className={cn(
                "text-[11px] font-medium transition-all duration-300 text-center", 
                selectedMuscle === muscle.id 
                  ? "text-primary font-bold" 
                  : "text-muted-foreground"
              )}>
                {getMuscleGroupName(muscle.id)}
              </span>
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Section Title */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium text-foreground">
          {selectedMuscle === "favoritos" ? t.workout.yourFavorites : `${t.workout.exercisesOf} ${getMuscleGroupName(selectedMuscle)}`}
        </h3>
        <span className="text-sm text-muted-foreground">
          {exercises.length} {t.workout.exercises}
        </span>
      </div>

      {/* Empty state for favorites */}
      {selectedMuscle === "favoritos" && exercises.length === 0 && <div className="flex flex-col items-center justify-center py-12 text-center">
          <Heart className="w-12 h-12 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">{t.workout.noFavoritesYet}</p>
          <p className="text-sm text-muted-foreground/70 mt-1">
            {t.workout.tapToAddFavorites}
          </p>
        </div>}

      {/* Exercises Grid */}
      <div className="grid grid-cols-2 gap-3">
        {exercises.map(exercise => <button key={exercise.id} onClick={() => handleExerciseClick(exercise)} className="bg-card rounded-2xl overflow-hidden border border-border shadow-card hover:shadow-fab transition-all active:scale-[0.98] text-left group">
            {/* Thumbnail */}
            <div className="aspect-square bg-black relative flex items-center justify-center overflow-hidden">
              {/* Bookmark/Favorite icon */}
              <button className="absolute top-2 left-2 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center z-10" onClick={e => toggleFavorite(exercise.id, e)}>
                <Bookmark className={cn("w-4 h-4 text-white", favoriteIds.includes(exercise.id) && "fill-white")} />
              </button>
              
              {/* Help icon */}
              <button className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center z-10" onClick={e => {
            e.stopPropagation();
            handleExerciseClick(exercise);
          }}>
                <HelpCircle className="w-4 h-4 text-white" />
              </button>

              {/* Thumbnail image, video thumbnail or placeholder */}  
              {exercise.thumbnailUrl ? <img src={exercise.thumbnailUrl} alt={getExerciseName(exercise.id)} className="w-full h-full object-cover object-center" onError={e => {
            e.currentTarget.style.display = 'none';
          }} /> : exercise.videoUrl ? <VideoThumbnail videoUrl={exercise.videoUrl} exerciseName={getExerciseName(exercise.id)} /> : <ExercisePlaceholder name={getExerciseName(exercise.id)} />}
            </div>
            
            {/* Exercise info */}
            <div className="p-3 bg-card">
              <h3 className="font-semibold text-foreground text-sm leading-tight">
                {getExerciseName(exercise.id)}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {getMuscleGroupName(exercise.muscleGroupId)}
              </p>
            </div>
          </button>)}
      </div>

    </div>;
};
export default ExerciseGallery;