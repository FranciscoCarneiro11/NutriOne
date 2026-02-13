import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Bookmark, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ExerciseLogForm from "@/components/workout/ExerciseLogForm";
import { useLanguage } from "@/i18n/LanguageContext";

// Dados dos exercícios (mesma estrutura da galeria)
const allExercises: Record<string, { muscleGroupId: string; videoUrl?: string; descriptionKey?: string }> = {
  // Peito
  "chest-1": { muscleGroupId: "peito", videoUrl: "/videos/supino_reto_com_barra.mp4", descriptionKey: "chest-1" },
  "chest-2": { muscleGroupId: "peito", videoUrl: "/videos/supino_inclinado_com_halter.mp4", descriptionKey: "chest-2" },
  "chest-8": { muscleGroupId: "peito", videoUrl: "/videos/voador.mp4", descriptionKey: "chest-8" },
  "chest-3": { muscleGroupId: "peito", videoUrl: "/videos/supino_inclinado_barra.mp4", descriptionKey: "chest-3" },
  "chest-4": { muscleGroupId: "peito", videoUrl: "/videos/barra_paralela.mp4", descriptionKey: "chest-4" },
  "chest-5": { muscleGroupId: "peito", videoUrl: "/videos/flexao_braco.mp4", descriptionKey: "chest-5" },
  "chest-6": { muscleGroupId: "peito", descriptionKey: "chest-6" },
  "chest-7": { muscleGroupId: "peito", descriptionKey: "chest-7" },
  "chest-9": { muscleGroupId: "peito", videoUrl: "/videos/supino_inclinado_smith.mp4", descriptionKey: "chest-9" },
  "chest-10": { muscleGroupId: "peito", videoUrl: "/videos/crucifixo_polia_alta.mp4", descriptionKey: "chest-10" },
  "chest-11": { muscleGroupId: "peito", videoUrl: "/videos/voador_maquina.mp4", descriptionKey: "chest-11" },
  "chest-12": { muscleGroupId: "peito", videoUrl: "/videos/flexao.mp4", descriptionKey: "chest-12" },
  "chest-13": { muscleGroupId: "peito", videoUrl: "/videos/barra_paralela.mp4", descriptionKey: "chest-13" },
  // Costas
  "back-1": { muscleGroupId: "costas", videoUrl: "/videos/pulldown.mp4", descriptionKey: "back-1" },
  "back-2": { muscleGroupId: "costas", videoUrl: "/videos/remada_aberta_sentado.mp4", descriptionKey: "back-2" },
  "back-7": { muscleGroupId: "costas", videoUrl: "/videos/remada_sentado_triangulo.mp4", descriptionKey: "back-7" },
  "back-8": { muscleGroupId: "costas", videoUrl: "/videos/puxada_aberta.mp4", descriptionKey: "back-8" },
  "back-9": { muscleGroupId: "costas", videoUrl: "/videos/barra_livre.mp4", descriptionKey: "back-9" },
  "back-10": { muscleGroupId: "costas", videoUrl: "/videos/remada_livre.mp4", descriptionKey: "back-10" },
  "back-11": { muscleGroupId: "costas", videoUrl: "/videos/puxada_polia_corda.mp4", descriptionKey: "back-11" },
  "back-12": { muscleGroupId: "costas", videoUrl: "/videos/puxada_triangulo.mp4", descriptionKey: "back-12" },
  "back-13": { muscleGroupId: "costas", videoUrl: "/videos/remada_aberta_maquina.mp4", descriptionKey: "back-13" },
  "back-3": { muscleGroupId: "costas", descriptionKey: "back-3" },
  "back-4": { muscleGroupId: "costas", descriptionKey: "back-4" },
  "back-5": { muscleGroupId: "costas", descriptionKey: "back-5" },
  "back-6": { muscleGroupId: "costas", descriptionKey: "back-6" },
  
  // Ombros
  "shoulder-1": { muscleGroupId: "ombros", videoUrl: "/videos/elevacao_lateral.mp4", descriptionKey: "shoulder-1" },
  "shoulder-2": { muscleGroupId: "ombros", videoUrl: "/videos/shoulderpress.mp4", descriptionKey: "shoulder-2" },
  "shoulder-3": { muscleGroupId: "ombros", descriptionKey: "shoulder-3" },
  "shoulder-4": { muscleGroupId: "ombros", descriptionKey: "shoulder-4" },
  "shoulder-5": { muscleGroupId: "ombros", descriptionKey: "shoulder-5" },
  "shoulder-6": { muscleGroupId: "ombros", descriptionKey: "shoulder-6" },
  "shoulder-7": { muscleGroupId: "ombros", videoUrl: "/videos/elevacao_lateral_inclinado.mp4", descriptionKey: "shoulder-7" },
  "shoulder-8": { muscleGroupId: "ombros", videoUrl: "/videos/desenvolvimento_maquina.mp4", descriptionKey: "shoulder-8" },
  "shoulder-9": { muscleGroupId: "ombros", videoUrl: "/videos/elevacao_frontal_polia.mp4", descriptionKey: "shoulder-9" },
  "shoulder-10": { muscleGroupId: "ombros", videoUrl: "/videos/elevacao_lateral_maquina.mp4", descriptionKey: "shoulder-10" },
  "shoulder-11": { muscleGroupId: "ombros", videoUrl: "/videos/desenvolvimento_maquina_inclinado.mp4", descriptionKey: "shoulder-11" },
  "shoulder-12": { muscleGroupId: "ombros", videoUrl: "/videos/elevacao_lateral_invertida.mp4", descriptionKey: "shoulder-12" },
  "shoulder-13": { muscleGroupId: "ombros", videoUrl: "/videos/crucifixo_inverso_cabo.mp4", descriptionKey: "shoulder-13" },
  "shoulder-14": { muscleGroupId: "ombros", videoUrl: "/videos/desenvolvimento_arnold.mp4", descriptionKey: "shoulder-14" },
  "shoulder-15": { muscleGroupId: "ombros", videoUrl: "/videos/crucifixo_invertido_halter.mp4", descriptionKey: "shoulder-15" },
  "shoulder-16": { muscleGroupId: "ombros", videoUrl: "/videos/elevacao_lateral_sentado.mp4", descriptionKey: "shoulder-16" },
  "shoulder-17": { muscleGroupId: "ombros", videoUrl: "/videos/facepull_com_corda.mp4", descriptionKey: "shoulder-17" },
  "shoulder-18": { muscleGroupId: "ombros", videoUrl: "/videos/elevacao_lateral_maquina_2.mp4", descriptionKey: "shoulder-18" },
  "shoulder-19": { muscleGroupId: "ombros", videoUrl: "/videos/desenvolvimento_militar_barra.mp4", descriptionKey: "shoulder-19" },
  "shoulder-20": { muscleGroupId: "ombros", videoUrl: "/videos/desenvolvimento_maquina_2.mp4", descriptionKey: "shoulder-20" },
  "shoulder-21": { muscleGroupId: "ombros", videoUrl: "/videos/elevacao_lateral_cruzada_cabo.mp4", descriptionKey: "shoulder-21" },
  
  // Bíceps
  "biceps-1": { muscleGroupId: "biceps", videoUrl: "/videos/biceps_cabo.mp4", descriptionKey: "biceps-1" },
  "biceps-2": { muscleGroupId: "biceps", videoUrl: "/videos/biceps_martelo.mp4", descriptionKey: "biceps-2" },
  "biceps-3": { muscleGroupId: "biceps", descriptionKey: "biceps-3" },
  "biceps-4": { muscleGroupId: "biceps", descriptionKey: "biceps-4" },
  "biceps-5": { muscleGroupId: "biceps", descriptionKey: "biceps-5" },
  "biceps-6": { muscleGroupId: "biceps", descriptionKey: "biceps-6" },
  
  // Tríceps
  "triceps-1": { muscleGroupId: "triceps", videoUrl: "/videos/triceps_triangulo.mp4", descriptionKey: "triceps-1" },
  "triceps-2": { muscleGroupId: "triceps", videoUrl: "/videos/triceps_frances.mp4", descriptionKey: "triceps-2" },
  "triceps-3": { muscleGroupId: "triceps", descriptionKey: "triceps-3" },
  "triceps-4": { muscleGroupId: "triceps", descriptionKey: "triceps-4" },
  "triceps-5": { muscleGroupId: "triceps", descriptionKey: "triceps-5" },
  "triceps-6": { muscleGroupId: "triceps", descriptionKey: "triceps-6" },
  
  // Quadríceps
  "quad-1": { muscleGroupId: "quadriceps", videoUrl: "/videos/cadeira_extensora.mp4", descriptionKey: "quad-1" },
  "quad-2": { muscleGroupId: "quadriceps", descriptionKey: "quad-2" },
  "quad-3": { muscleGroupId: "quadriceps", descriptionKey: "quad-3" },
  "quad-4": { muscleGroupId: "quadriceps", descriptionKey: "quad-4" },
  "quad-5": { muscleGroupId: "quadriceps", descriptionKey: "quad-5" },
  "quad-6": { muscleGroupId: "quadriceps", descriptionKey: "quad-6" },
  
  // Abdômen
  "abs-1": { muscleGroupId: "abdomen", descriptionKey: "abs-1" },
  "abs-2": { muscleGroupId: "abdomen", descriptionKey: "abs-2" },
  "abs-3": { muscleGroupId: "abdomen", descriptionKey: "abs-3" },
  "abs-4": { muscleGroupId: "abdomen", descriptionKey: "abs-4" },
  "abs-5": { muscleGroupId: "abdomen", descriptionKey: "abs-5" },
  
  // Posterior
  "post-1": { muscleGroupId: "posterior", descriptionKey: "post-1" },
  "post-2": { muscleGroupId: "posterior", descriptionKey: "post-2" },
  "post-3": { muscleGroupId: "posterior", descriptionKey: "post-3" },
  "post-4": { muscleGroupId: "posterior", descriptionKey: "post-4" },
  "post-5": { muscleGroupId: "posterior", descriptionKey: "post-5" },
  "post-6": { muscleGroupId: "posterior", descriptionKey: "post-6" },
  
  // Trapézio
  "trap-1": { muscleGroupId: "trapezio", descriptionKey: "trap-1" },
  "trap-2": { muscleGroupId: "trapezio", descriptionKey: "trap-2" },
  "trap-3": { muscleGroupId: "trapezio", descriptionKey: "trap-3" },
  "trap-4": { muscleGroupId: "trapezio", descriptionKey: "trap-4" },
  "trap-5": { muscleGroupId: "trapezio", descriptionKey: "trap-5" },
};

const ExerciseDetail: React.FC = () => {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const { t } = useLanguage();
  
  const exercise = exerciseId ? allExercises[exerciseId] : null;
  
  // Get translated names
  const exerciseTranslations = t.exercises as Record<string, string>;
  const muscleTranslations = t.muscleGroups as Record<string, string>;
  
  const exerciseName = exerciseId ? (exerciseTranslations[exerciseId] || exerciseId) : "";
  const muscleGroupName = exercise ? (muscleTranslations[exercise.muscleGroupId] || exercise.muscleGroupId) : "";

  // Load favorite status from localStorage
  useEffect(() => {
    if (exerciseId) {
      const favorites = JSON.parse(localStorage.getItem("favoriteExercises") || "[]");
      setIsFavorite(favorites.includes(exerciseId));
    }
  }, [exerciseId]);

  const toggleFavorite = () => {
    if (!exerciseId) return;
    
    const favorites = JSON.parse(localStorage.getItem("favoriteExercises") || "[]");
    let newFavorites: string[];
    
    if (isFavorite) {
      newFavorites = favorites.filter((id: string) => id !== exerciseId);
      toast.success("Removido dos favoritos");
    } else {
      newFavorites = [...favorites, exerciseId];
      toast.success("Adicionado aos favoritos");
    }
    
    localStorage.setItem("favoriteExercises", JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareData = {
      title: exerciseName || "Exercício",
      text: `Confira o exercício ${exerciseName} - ${muscleGroupName}`,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copiado para a área de transferência!");
      }
    } catch (error) {
      // User cancelled share or error occurred
      if ((error as Error).name !== "AbortError") {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copiado para a área de transferência!");
      }
    }
  };

  if (!exercise) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Exercício não encontrado</p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Video Section */}
      <div className="relative aspect-video bg-black">
        {exercise.videoUrl ? (
          <video
            src={exercise.videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <div className="text-center p-8">
              <div className="w-20 h-20 rounded-full bg-muted-foreground/20 flex items-center justify-center mx-auto mb-4">
                <svg viewBox="0 0 60 100" className="w-12 h-16 text-muted-foreground opacity-50">
                  <ellipse cx="30" cy="12" rx="8" ry="10" fill="currentColor" />
                  <rect x="27" y="22" width="6" height="6" fill="currentColor" />
                  <path d="M18 28 L42 28 L44 55 L16 55 Z" fill="currentColor" />
                  <ellipse cx="14" cy="32" rx="5" ry="4" fill="currentColor" />
                  <ellipse cx="46" cy="32" rx="5" ry="4" fill="currentColor" />
                  <path d="M9 36 L6 52 L10 52 L14 38 Z" fill="currentColor" />
                  <path d="M51 36 L54 52 L50 52 L46 38 Z" fill="currentColor" />
                  <path d="M16 55 L14 85 L22 85 L25 55 Z" fill="currentColor" />
                  <path d="M44 55 L46 85 L38 85 L35 55 Z" fill="currentColor" />
                </svg>
              </div>
              <p className="text-muted-foreground font-medium">Vídeo em breve</p>
            </div>
          </div>
        )}
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button 
            onClick={toggleFavorite}
            className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          >
            <Bookmark className={`w-5 h-5 ${isFavorite ? "fill-white" : ""}`} />
          </button>
          <button 
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
            {muscleGroupName}
          </span>
          <h1 className="text-2xl font-bold text-foreground">
            {exerciseName}
          </h1>
        </div>

        {/* Exercise Log Form */}
        <ExerciseLogForm exerciseName={exerciseName} />

        {/* Description - hidden for now since descriptions aren't translated */}
        {/* TODO: Add exercise descriptions to translations */}

        {/* Tips */}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <h2 className="font-semibold text-foreground mb-3">Dicas importantes</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>Mantenha a postura correta durante todo o movimento</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>Controle o peso na fase excêntrica (descida)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>Respire corretamente: expire no esforço, inspire na volta</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetail;
