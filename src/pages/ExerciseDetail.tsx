import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Bookmark, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Dados dos exercícios (mesma estrutura da galeria)
const allExercises: Record<string, { name: string; muscleGroup: string; videoUrl?: string; description?: string }> = {
  // Peito
  "chest-1": { name: "Bench Press", muscleGroup: "Peito", videoUrl: "/videos/supino_reto.mp4", description: "O supino reto é um exercício fundamental para desenvolvimento do peitoral. Deite-se no banco, segure a barra com pegada média, desça até o peito e empurre para cima." },
  "chest-2": { name: "Dumbbell Incline Bench Press", muscleGroup: "Peito", videoUrl: "/videos/supino_inclinado_com_halter.mp4", description: "Focado na parte superior do peitoral, realizado em banco inclinado a 30-45 graus com halteres." },
  "chest-3": { name: "Supino Inclinado", muscleGroup: "Peito", description: "Focado na parte superior do peitoral, realizado em banco inclinado a 30-45 graus." },
  "chest-4": { name: "Crucifixo", muscleGroup: "Peito", description: "Exercício de isolamento para o peitoral, realizado com halteres em movimento de abertura." },
  "chest-5": { name: "Flexão de Braço", muscleGroup: "Peito", description: "Exercício clássico utilizando o peso do corpo para trabalhar peitoral, ombros e tríceps." },
  "chest-6": { name: "Crossover", muscleGroup: "Peito", description: "Exercício realizado em polia cruzada para isolamento do peitoral." },
  "chest-7": { name: "Fly na Máquina", muscleGroup: "Peito", description: "Movimento de abertura na máquina para isolamento do peitoral." },
  
  // Costas
  "back-1": { name: "Pulldown", muscleGroup: "Costas", videoUrl: "/videos/pulldown.mp4", description: "Exercício para dorsais, puxando a barra em direção ao peito." },
  "back-2": { name: "Seated Wide-grip Row", muscleGroup: "Costas", videoUrl: "/videos/remada_aberta_sentado.mp4", description: "Remada sentada com pegada aberta para trabalhar as costas." },
  "back-3": { name: "Puxada Frontal", muscleGroup: "Costas", description: "Exercício para dorsais, puxando a barra em direção ao peito." },
  "back-4": { name: "Remada Curvada", muscleGroup: "Costas", description: "Exercício composto para espessura das costas." },
  "back-5": { name: "Barra Fixa", muscleGroup: "Costas", description: "Exercício clássico para dorsais utilizando o peso corporal." },
  "back-6": { name: "Remada Unilateral", muscleGroup: "Costas", description: "Remada com halter para trabalho unilateral das costas." },
  
  // Ombros
  "shoulder-1": { name: "Lateral Raise", muscleGroup: "Ombros", videoUrl: "/videos/elevacao_lateral.mp4", description: "Isolamento para deltoides laterais com halteres." },
  "shoulder-2": { name: "Seated Shoulder Press", muscleGroup: "Ombros", videoUrl: "/videos/shoulderpress.mp4", description: "Exercício principal para deltoides, empurrando peso acima da cabeça." },
  "shoulder-3": { name: "Desenvolvimento", muscleGroup: "Ombros", description: "Exercício principal para deltoides, empurrando peso acima da cabeça." },
  "shoulder-4": { name: "Elevação Frontal", muscleGroup: "Ombros", description: "Isolamento para deltoides anteriores." },
  "shoulder-5": { name: "Crucifixo Inverso", muscleGroup: "Ombros", description: "Exercício para deltoides posteriores." },
  "shoulder-6": { name: "Encolhimento", muscleGroup: "Ombros", description: "Exercício para trapézio superior." },
  
  // Bíceps
  "biceps-1": { name: "Biceps Curl", muscleGroup: "Bíceps", videoUrl: "/videos/biceps_cabo.mp4", description: "Exercício principal para bíceps no cabo." },
  "biceps-2": { name: "Hammer Curl", muscleGroup: "Bíceps", videoUrl: "/videos/biceps_martelo.mp4", description: "Variação que trabalha bíceps e braquial com pegada neutra." },
  "biceps-3": { name: "Rosca Direta", muscleGroup: "Bíceps", description: "Exercício principal para bíceps com barra." },
  "biceps-4": { name: "Rosca Alternada", muscleGroup: "Bíceps", description: "Rosca com halteres alternando os braços." },
  "biceps-5": { name: "Rosca Concentrada", muscleGroup: "Bíceps", description: "Exercício de isolamento para pico do bíceps." },
  "biceps-6": { name: "Rosca Scott", muscleGroup: "Bíceps", description: "Rosca no banco Scott para máximo isolamento." },
  
  // Tríceps
  "triceps-1": { name: "Triceps Pushdown", muscleGroup: "Tríceps", videoUrl: "/videos/triceps_triangulo.mp4", description: "Exercício na polia para isolamento do tríceps." },
  "triceps-2": { name: "Seated Bench Extension", muscleGroup: "Tríceps", videoUrl: "/videos/triceps_frances.mp4", description: "Extensão de tríceps sentado acima da cabeça." },
  "triceps-3": { name: "Tríceps Pulley", muscleGroup: "Tríceps", description: "Exercício na polia para isolamento do tríceps." },
  "triceps-4": { name: "Tríceps Testa", muscleGroup: "Tríceps", description: "Extensão de tríceps deitado com barra." },
  "triceps-5": { name: "Mergulho", muscleGroup: "Tríceps", description: "Exercício composto para tríceps e peitoral." },
  "triceps-6": { name: "Kickback", muscleGroup: "Tríceps", description: "Extensão de tríceps unilateral com halter." },
  
  // Quadríceps
  "quad-1": { name: "Lever Leg Extension", muscleGroup: "Quadríceps", videoUrl: "/videos/cadeira_extensora.mp4", description: "Isolamento para quadríceps na máquina extensora." },
  "quad-2": { name: "Agachamento", muscleGroup: "Quadríceps", description: "Rei dos exercícios para pernas." },
  "quad-3": { name: "Leg Press", muscleGroup: "Quadríceps", description: "Exercício na máquina para quadríceps." },
  "quad-4": { name: "Agachamento Hack", muscleGroup: "Quadríceps", description: "Variação do agachamento na máquina hack." },
  "quad-5": { name: "Avanço", muscleGroup: "Quadríceps", description: "Exercício unilateral para pernas." },
  "quad-6": { name: "Agachamento Búlgaro", muscleGroup: "Quadríceps", description: "Agachamento unilateral com pé elevado." },
  
  // Abdômen
  "abs-1": { name: "Abdominal Crunch", muscleGroup: "Abdômen", description: "Exercício básico para abdominais." },
  "abs-2": { name: "Prancha", muscleGroup: "Abdômen", description: "Exercício isométrico para core." },
  "abs-3": { name: "Elevação de Pernas", muscleGroup: "Abdômen", description: "Exercício para abdômen inferior." },
  "abs-4": { name: "Abdominal Bicicleta", muscleGroup: "Abdômen", description: "Exercício para oblíquos e reto abdominal." },
  "abs-5": { name: "Prancha Lateral", muscleGroup: "Abdômen", description: "Exercício isométrico para oblíquos." },
  
  // Posterior
  "post-1": { name: "Stiff", muscleGroup: "Posterior", description: "Exercício para posterior de coxa e glúteos." },
  "post-2": { name: "Mesa Flexora", muscleGroup: "Posterior", description: "Isolamento para posterior de coxa." },
  "post-3": { name: "Flexora Deitado", muscleGroup: "Posterior", description: "Flexora na posição deitada." },
  "post-4": { name: "Levantamento Terra", muscleGroup: "Posterior", description: "Exercício composto para posterior." },
  "post-5": { name: "Good Morning", muscleGroup: "Posterior", description: "Exercício para posterior com barra." },
  "post-6": { name: "Cadeira Flexora", muscleGroup: "Posterior", description: "Flexora na posição sentada." },
  
  // Trapézio
  "trap-1": { name: "Encolhimento com Barra", muscleGroup: "Trapézio", description: "Exercício principal para trapézio." },
  "trap-2": { name: "Encolhimento com Halteres", muscleGroup: "Trapézio", description: "Variação com halteres." },
  "trap-3": { name: "Remada Alta", muscleGroup: "Trapézio", description: "Exercício para trapézio e deltoides." },
  "trap-4": { name: "Face Pull", muscleGroup: "Trapézio", description: "Exercício para trapézio médio e deltoides posteriores." },
  "trap-5": { name: "Elevação Posterior", muscleGroup: "Trapézio", description: "Exercício para trapézio médio e inferior." },
};

const ExerciseDetail: React.FC = () => {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  
  const exercise = exerciseId ? allExercises[exerciseId] : null;

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
      title: exercise?.name || "Exercício",
      text: `Confira o exercício ${exercise?.name} - ${exercise?.muscleGroup}`,
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
    <div className="min-h-screen bg-background">
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
            {exercise.muscleGroup}
          </span>
          <h1 className="text-2xl font-bold text-foreground">
            {exercise.name}
          </h1>
        </div>

        {/* Description */}
        {exercise.description && (
          <div className="bg-card rounded-2xl p-4 border border-border">
            <h2 className="font-semibold text-foreground mb-2">Como executar</h2>
            <p className="text-muted-foreground leading-relaxed">
              {exercise.description}
            </p>
          </div>
        )}

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
