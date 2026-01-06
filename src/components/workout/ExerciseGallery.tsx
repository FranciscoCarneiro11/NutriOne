import React, { useState } from "react";
import { ArrowLeft, Play, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface GalleryExercise {
  id: string;
  name: string;
  muscleGroup: string;
  videoUrl?: string;
  thumbnailUrl?: string;
}

// Dados estáticos de exercícios por grupo muscular - será populado depois com vídeos
const exercisesByMuscle: Record<string, GalleryExercise[]> = {
  peito: [
    { id: "chest-1", name: "Supino Reto", muscleGroup: "Peito" },
    { id: "chest-2", name: "Supino Inclinado", muscleGroup: "Peito" },
    { id: "chest-3", name: "Crucifixo", muscleGroup: "Peito" },
    { id: "chest-4", name: "Flexão de Braço", muscleGroup: "Peito" },
    { id: "chest-5", name: "Crossover", muscleGroup: "Peito" },
    { id: "chest-6", name: "Fly na Máquina", muscleGroup: "Peito" },
  ],
  costas: [
    { id: "back-1", name: "Puxada Frontal", muscleGroup: "Costas" },
    { id: "back-2", name: "Remada Curvada", muscleGroup: "Costas" },
    { id: "back-3", name: "Remada Baixa", muscleGroup: "Costas" },
    { id: "back-4", name: "Pull Down", muscleGroup: "Costas" },
    { id: "back-5", name: "Barra Fixa", muscleGroup: "Costas" },
    { id: "back-6", name: "Remada Unilateral", muscleGroup: "Costas" },
  ],
  ombros: [
    { id: "shoulder-1", name: "Desenvolvimento", muscleGroup: "Ombros" },
    { id: "shoulder-2", name: "Elevação Lateral", muscleGroup: "Ombros" },
    { id: "shoulder-3", name: "Elevação Frontal", muscleGroup: "Ombros" },
    { id: "shoulder-4", name: "Crucifixo Inverso", muscleGroup: "Ombros" },
    { id: "shoulder-5", name: "Encolhimento", muscleGroup: "Ombros" },
  ],
  biceps: [
    { id: "biceps-1", name: "Rosca Direta", muscleGroup: "Bíceps" },
    { id: "biceps-2", name: "Rosca Alternada", muscleGroup: "Bíceps" },
    { id: "biceps-3", name: "Rosca Martelo", muscleGroup: "Bíceps" },
    { id: "biceps-4", name: "Rosca Concentrada", muscleGroup: "Bíceps" },
    { id: "biceps-5", name: "Rosca Scott", muscleGroup: "Bíceps" },
  ],
  triceps: [
    { id: "triceps-1", name: "Tríceps Pulley", muscleGroup: "Tríceps" },
    { id: "triceps-2", name: "Tríceps Testa", muscleGroup: "Tríceps" },
    { id: "triceps-3", name: "Tríceps Francês", muscleGroup: "Tríceps" },
    { id: "triceps-4", name: "Mergulho", muscleGroup: "Tríceps" },
    { id: "triceps-5", name: "Kickback", muscleGroup: "Tríceps" },
  ],
  pernas: [
    { id: "legs-1", name: "Agachamento", muscleGroup: "Pernas" },
    { id: "legs-2", name: "Leg Press", muscleGroup: "Pernas" },
    { id: "legs-3", name: "Extensora", muscleGroup: "Pernas" },
    { id: "legs-4", name: "Flexora", muscleGroup: "Pernas" },
    { id: "legs-5", name: "Stiff", muscleGroup: "Pernas" },
    { id: "legs-6", name: "Panturrilha", muscleGroup: "Pernas" },
    { id: "legs-7", name: "Avanço", muscleGroup: "Pernas" },
    { id: "legs-8", name: "Cadeira Adutora", muscleGroup: "Pernas" },
  ],
  abdomen: [
    { id: "abs-1", name: "Abdominal Crunch", muscleGroup: "Abdômen" },
    { id: "abs-2", name: "Prancha", muscleGroup: "Abdômen" },
    { id: "abs-3", name: "Elevação de Pernas", muscleGroup: "Abdômen" },
    { id: "abs-4", name: "Abdominal Bicicleta", muscleGroup: "Abdômen" },
    { id: "abs-5", name: "Prancha Lateral", muscleGroup: "Abdômen" },
  ],
};

const muscleGroups = [
  { id: "peito", name: "Peito", icon: "💪" },
  { id: "costas", name: "Costas", icon: "🔙" },
  { id: "ombros", name: "Ombros", icon: "🎯" },
  { id: "biceps", name: "Bíceps", icon: "💪" },
  { id: "triceps", name: "Tríceps", icon: "💪" },
  { id: "pernas", name: "Pernas", icon: "🦵" },
  { id: "abdomen", name: "Abdômen", icon: "🔥" },
];

const ExerciseGallery: React.FC = () => {
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<GalleryExercise | null>(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  const handleExerciseClick = (exercise: GalleryExercise) => {
    setSelectedExercise(exercise);
    setVideoModalOpen(true);
  };

  if (selectedMuscle) {
    const exercises = exercisesByMuscle[selectedMuscle] || [];
    const muscleInfo = muscleGroups.find(m => m.id === selectedMuscle);

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedMuscle(null)}
            className="w-10 h-10 rounded-full bg-card flex items-center justify-center border border-border"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {muscleInfo?.icon} {muscleInfo?.name}
            </h2>
            <p className="text-muted-foreground text-sm">
              {exercises.length} exercícios
            </p>
          </div>
        </div>

        {/* Exercises Grid */}
        <div className="grid grid-cols-2 gap-4">
          {exercises.map((exercise) => (
            <button
              key={exercise.id}
              onClick={() => handleExerciseClick(exercise)}
              className="bg-card rounded-2xl overflow-hidden border border-border shadow-card hover:shadow-fab transition-all active:scale-[0.98]"
            >
              {/* Thumbnail placeholder */}
              <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center relative">
                {exercise.videoUrl ? (
                  <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center">
                    <Play className="w-7 h-7 text-primary-foreground fill-current ml-1" />
                  </div>
                ) : (
                  <div className="text-center px-4">
                    <div className="w-12 h-12 rounded-full bg-muted-foreground/20 flex items-center justify-center mx-auto mb-2">
                      <Play className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Vídeo em breve
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-3">
                <h3 className="font-semibold text-foreground text-sm text-left">
                  {exercise.name}
                </h3>
                <p className="text-xs text-muted-foreground text-left">
                  {exercise.muscleGroup}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Video Modal */}
        <Dialog open={videoModalOpen} onOpenChange={setVideoModalOpen}>
          <DialogContent className="max-w-lg p-0 overflow-hidden bg-background">
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold text-foreground">
                {selectedExercise?.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {selectedExercise?.muscleGroup}
              </p>
            </div>
            
            <div className="aspect-video bg-muted flex items-center justify-center">
              {selectedExercise?.videoUrl ? (
                <video
                  src={selectedExercise.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-8">
                  <div className="w-16 h-16 rounded-full bg-muted-foreground/20 flex items-center justify-center mx-auto mb-4">
                    <Play className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground font-medium">
                    Vídeo em breve
                  </p>
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    O vídeo demonstrativo deste exercício será adicionado em breve.
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Main muscle groups view
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-foreground">Grupos Musculares</h2>
        <p className="text-muted-foreground text-sm">
          Selecione um grupo para ver os exercícios
        </p>
      </div>

      {/* Muscle Groups Grid */}
      <div className="grid grid-cols-2 gap-4">
        {muscleGroups.map((muscle) => (
          <button
            key={muscle.id}
            onClick={() => setSelectedMuscle(muscle.id)}
            className="bg-card rounded-2xl p-6 border border-border shadow-card hover:shadow-fab transition-all active:scale-[0.98] text-left"
          >
            <span className="text-3xl mb-3 block">{muscle.icon}</span>
            <h3 className="font-semibold text-foreground">{muscle.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {exercisesByMuscle[muscle.id]?.length || 0} exercícios
            </p>
          </button>
        ))}
      </div>

      {/* Info Card */}
      <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
        <h3 className="font-semibold text-foreground mb-2">📹 Vídeos Demonstrativos</h3>
        <p className="text-sm text-muted-foreground">
          Em breve, cada exercício terá um vídeo demonstrativo para te ajudar a executar os movimentos corretamente.
        </p>
      </div>
    </div>
  );
};

export default ExerciseGallery;
