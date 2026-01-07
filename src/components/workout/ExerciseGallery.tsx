import React, { useState } from "react";
import { Play, Bookmark, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

// Imagens customizadas de grupos musculares
import peitoImg from "@/assets/muscle-groups/peito.png";
import costasImg from "@/assets/muscle-groups/costas.png";
import tricepsImg from "@/assets/muscle-groups/triceps.png";
import bicepsImg from "@/assets/muscle-groups/biceps.png";
import abdomenImg from "@/assets/muscle-groups/abdomen.png";
import posteriorImg from "@/assets/muscle-groups/posterior.png";
import quadricepsImg from "@/assets/muscle-groups/quadriceps.png";

interface GalleryExercise {
  id: string;
  name: string;
  muscleGroup: string;
  videoUrl?: string;
  thumbnailUrl?: string;
}

// Dados estáticos de exercícios por grupo muscular
const exercisesByMuscle: Record<string, GalleryExercise[]> = {
  todos: [],
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
  quadriceps: [
    { id: "quad-1", name: "Agachamento", muscleGroup: "Quadríceps" },
    { id: "quad-2", name: "Leg Press", muscleGroup: "Quadríceps" },
    { id: "quad-3", name: "Extensora", muscleGroup: "Quadríceps" },
    { id: "quad-4", name: "Agachamento Hack", muscleGroup: "Quadríceps" },
    { id: "quad-5", name: "Avanço", muscleGroup: "Quadríceps" },
    { id: "quad-6", name: "Agachamento Búlgaro", muscleGroup: "Quadríceps" },
  ],
  abdomen: [
    { id: "abs-1", name: "Abdominal Crunch", muscleGroup: "Abdômen" },
    { id: "abs-2", name: "Prancha", muscleGroup: "Abdômen" },
    { id: "abs-3", name: "Elevação de Pernas", muscleGroup: "Abdômen" },
    { id: "abs-4", name: "Abdominal Bicicleta", muscleGroup: "Abdômen" },
    { id: "abs-5", name: "Prancha Lateral", muscleGroup: "Abdômen" },
  ],
  posterior: [
    { id: "post-1", name: "Stiff", muscleGroup: "Posterior" },
    { id: "post-2", name: "Mesa Flexora", muscleGroup: "Posterior" },
    { id: "post-3", name: "Flexora Deitado", muscleGroup: "Posterior" },
    { id: "post-4", name: "Levantamento Terra", muscleGroup: "Posterior" },
    { id: "post-5", name: "Good Morning", muscleGroup: "Posterior" },
    { id: "post-6", name: "Cadeira Flexora", muscleGroup: "Posterior" },
  ],
};

// Gerar lista de todos os exercícios
exercisesByMuscle.todos = Object.entries(exercisesByMuscle)
  .filter(([key]) => key !== "todos")
  .flatMap(([_, exercises]) => exercises);

const muscleGroups = [
  { id: "todos", name: "Todos", highlightZone: "all", customImage: null },
  { id: "peito", name: "Peito", highlightZone: "chest", customImage: peitoImg },
  { id: "costas", name: "Costas", highlightZone: "back", customImage: costasImg },
  { id: "ombros", name: "Ombros", highlightZone: "shoulders", customImage: null },
  { id: "biceps", name: "Bíceps", highlightZone: "biceps", customImage: bicepsImg },
  { id: "triceps", name: "Tríceps", highlightZone: "triceps", customImage: tricepsImg },
  { id: "quadriceps", name: "Quadríceps", highlightZone: "legs", customImage: quadricepsImg },
  { id: "posterior", name: "Posterior", highlightZone: "hamstrings", customImage: posteriorImg },
  { id: "abdomen", name: "Abdômen", highlightZone: "abs", customImage: abdomenImg },
];

// Componente de silhueta do corpo com destaque na zona selecionada
const BodySilhouette: React.FC<{ zone: string; isSelected: boolean }> = ({ zone, isSelected }) => {
  const getHighlightColor = () => isSelected ? "#ef4444" : "#6b7280";
  const baseColor = isSelected ? "#ffffff" : "#9ca3af";
  
  return (
    <svg viewBox="0 0 60 100" className="w-full h-full">
      {/* Cabeça */}
      <ellipse cx="30" cy="12" rx="8" ry="10" fill={baseColor} />
      
      {/* Pescoço */}
      <rect x="27" y="22" width="6" height="6" fill={baseColor} />
      
      {/* Torso */}
      <path
        d={zone === "chest" || zone === "all" 
          ? "M18 28 L42 28 L44 55 L16 55 Z" 
          : "M18 28 L42 28 L44 55 L16 55 Z"}
        fill={zone === "chest" || zone === "abs" || zone === "all" ? getHighlightColor() : baseColor}
      />
      
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
    </svg>
  );
};

const ExerciseGallery: React.FC = () => {
  const [selectedMuscle, setSelectedMuscle] = useState<string>("todos");
  const [selectedExercise, setSelectedExercise] = useState<GalleryExercise | null>(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  const handleExerciseClick = (exercise: GalleryExercise) => {
    setSelectedExercise(exercise);
    setVideoModalOpen(true);
  };

  const exercises = exercisesByMuscle[selectedMuscle] || [];
  const selectedMuscleInfo = muscleGroups.find(m => m.id === selectedMuscle);

  return (
    <div className="space-y-4">
      {/* Muscle Groups Horizontal Scroll */}
      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-3 px-1">
          {muscleGroups.map((muscle) => (
            <button
              key={muscle.id}
              onClick={() => setSelectedMuscle(muscle.id)}
              className={cn(
                "flex-shrink-0 flex flex-col items-center gap-2 transition-all",
              )}
            >
              <div className={cn(
                "w-20 h-20 rounded-2xl border-2 transition-all p-2 flex items-center justify-center",
                selectedMuscle === muscle.id
                  ? "border-primary bg-primary/10 shadow-lg scale-105"
                  : "border-border bg-card/50 hover:border-muted-foreground/50 hover:bg-card"
              )}>
                {muscle.customImage ? (
                  <img 
                    src={muscle.customImage} 
                    alt={muscle.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <BodySilhouette 
                    zone={muscle.highlightZone} 
                    isSelected={selectedMuscle === muscle.id} 
                  />
                )}
              </div>
              <span className={cn(
                "text-xs font-medium transition-colors",
                selectedMuscle === muscle.id 
                  ? "text-primary font-semibold" 
                  : "text-muted-foreground"
              )}>
                {muscle.name}
              </span>
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Section Title */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium text-foreground">
          {selectedMuscle === "todos" ? "Todos os exercícios" : `Exercícios de ${selectedMuscleInfo?.name}`}
        </h3>
        <span className="text-sm text-muted-foreground">
          {exercises.length} exercícios
        </span>
      </div>

      {/* Exercises Grid */}
      <div className="grid grid-cols-2 gap-3">
        {exercises.map((exercise) => (
          <button
            key={exercise.id}
            onClick={() => handleExerciseClick(exercise)}
            className="bg-card rounded-2xl overflow-hidden border border-border shadow-card hover:shadow-fab transition-all active:scale-[0.98] text-left group"
          >
            {/* Thumbnail */}
            <div className="aspect-square bg-gradient-to-br from-muted to-muted/30 relative flex items-center justify-center">
              {/* Bookmark icon */}
              <button 
                className="absolute top-2 left-2 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  // TODO: Implement bookmark functionality
                }}
              >
                <Bookmark className="w-4 h-4 text-white" />
              </button>
              
              {/* Help icon */}
              <button 
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  handleExerciseClick(exercise);
                }}
              >
                <HelpCircle className="w-4 h-4 text-white" />
              </button>

              {/* Placeholder illustration */}
              <div className="flex flex-col items-center justify-center p-4">
                {exercise.videoUrl ? (
                  <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-7 h-7 text-primary-foreground fill-current ml-1" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-muted-foreground/10 flex items-center justify-center">
                    <svg viewBox="0 0 60 100" className="w-12 h-16 opacity-40">
                      <ellipse cx="30" cy="12" rx="8" ry="10" fill="currentColor" />
                      <rect x="27" y="22" width="6" height="6" fill="currentColor" />
                      <path d="M18 28 L42 28 L44 55 L16 55 Z" fill="currentColor" />
                      <ellipse cx="14" cy="32" rx="5" ry="4" fill="currentColor" />
                      <ellipse cx="46" cy="32" rx="5" ry="4" fill="currentColor" />
                      <path d="M9 36 L6 52 L10 52 L14 38 Z" fill="currentColor" />
                      <path d="M6 52 L4 68 L9 68 L10 52 Z" fill="currentColor" />
                      <path d="M51 36 L54 52 L50 52 L46 38 Z" fill="currentColor" />
                      <path d="M54 52 L56 68 L51 68 L50 52 Z" fill="currentColor" />
                      <path d="M16 55 L14 85 L22 85 L25 55 Z" fill="currentColor" />
                      <path d="M44 55 L46 85 L38 85 L35 55 Z" fill="currentColor" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
            
            {/* Exercise info */}
            <div className="p-3 bg-card">
              <h3 className="font-semibold text-foreground text-sm leading-tight">
                {exercise.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
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
};

export default ExerciseGallery;
