// Centralized mapping of exercise names to their video URLs and thumbnails
// This allows the AI-generated workout plans to display the correct videos

export interface ExerciseMedia {
  videoUrl: string;
  thumbnailUrl?: string;
}

// Normalize exercise names for matching (lowercase, remove accents, etc.)
const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9\s]/g, "") // Remove special chars
    .trim();
};

// Exercise video database - maps exercise names to their media
const exerciseVideoDatabase: Record<string, ExerciseMedia> = {
  // Peito / Chest
  "bench press": { videoUrl: "/videos/supino_reto.mp4", thumbnailUrl: "/images/exercises/supino-reto.jpeg" },
  "supino reto": { videoUrl: "/videos/supino_reto.mp4", thumbnailUrl: "/images/exercises/supino-reto.jpeg" },
  "supino": { videoUrl: "/videos/supino_reto.mp4", thumbnailUrl: "/images/exercises/supino-reto.jpeg" },
  "barbell bench press": { videoUrl: "/videos/supino_reto.mp4", thumbnailUrl: "/images/exercises/supino-reto.jpeg" },
  "flat bench press": { videoUrl: "/videos/supino_reto.mp4", thumbnailUrl: "/images/exercises/supino-reto.jpeg" },
  
  "dumbbell incline bench press": { videoUrl: "/videos/supino_inclinado_com_halter.mp4", thumbnailUrl: "/images/exercises/dumbbell-incline-bench-press.jpeg" },
  "incline dumbbell press": { videoUrl: "/videos/supino_inclinado_com_halter.mp4", thumbnailUrl: "/images/exercises/dumbbell-incline-bench-press.jpeg" },
  "supino inclinado com halter": { videoUrl: "/videos/supino_inclinado_com_halter.mp4", thumbnailUrl: "/images/exercises/dumbbell-incline-bench-press.jpeg" },
  "supino inclinado halteres": { videoUrl: "/videos/supino_inclinado_com_halter.mp4", thumbnailUrl: "/images/exercises/dumbbell-incline-bench-press.jpeg" },
  "incline bench press": { videoUrl: "/videos/supino_inclinado_com_halter.mp4", thumbnailUrl: "/images/exercises/dumbbell-incline-bench-press.jpeg" },
  "incline press": { videoUrl: "/videos/supino_inclinado_com_halter.mp4", thumbnailUrl: "/images/exercises/dumbbell-incline-bench-press.jpeg" },
  
  // Costas / Back
  "pulldown": { videoUrl: "/videos/pulldown.mp4", thumbnailUrl: "/images/exercises/pulldown.jpeg" },
  "lat pulldown": { videoUrl: "/videos/pulldown.mp4", thumbnailUrl: "/images/exercises/pulldown.jpeg" },
  "puxada frontal": { videoUrl: "/videos/pulldown.mp4", thumbnailUrl: "/images/exercises/pulldown.jpeg" },
  "puxada alta": { videoUrl: "/videos/pulldown.mp4", thumbnailUrl: "/images/exercises/pulldown.jpeg" },
  "cable pulldown": { videoUrl: "/videos/pulldown.mp4", thumbnailUrl: "/images/exercises/pulldown.jpeg" },
  
  "seated wide grip row": { videoUrl: "/videos/remada_aberta_sentado.mp4", thumbnailUrl: "/images/exercises/seated-wide-grip-row.jpeg" },
  "seated wide-grip row": { videoUrl: "/videos/remada_aberta_sentado.mp4", thumbnailUrl: "/images/exercises/seated-wide-grip-row.jpeg" },
  "remada aberta sentado": { videoUrl: "/videos/remada_aberta_sentado.mp4", thumbnailUrl: "/images/exercises/seated-wide-grip-row.jpeg" },
  "remada sentada": { videoUrl: "/videos/remada_aberta_sentado.mp4", thumbnailUrl: "/images/exercises/seated-wide-grip-row.jpeg" },
  "seated row": { videoUrl: "/videos/remada_aberta_sentado.mp4", thumbnailUrl: "/images/exercises/seated-wide-grip-row.jpeg" },
  "cable row": { videoUrl: "/videos/remada_aberta_sentado.mp4", thumbnailUrl: "/images/exercises/seated-wide-grip-row.jpeg" },
  "remada cabo": { videoUrl: "/videos/remada_aberta_sentado.mp4", thumbnailUrl: "/images/exercises/seated-wide-grip-row.jpeg" },
  
  // Ombros / Shoulders
  "lateral raise": { videoUrl: "/videos/elevacao_lateral.mp4", thumbnailUrl: "/images/exercises/lateral-raise.jpeg" },
  "elevacao lateral": { videoUrl: "/videos/elevacao_lateral.mp4", thumbnailUrl: "/images/exercises/lateral-raise.jpeg" },
  "elevação lateral": { videoUrl: "/videos/elevacao_lateral.mp4", thumbnailUrl: "/images/exercises/lateral-raise.jpeg" },
  "dumbbell lateral raise": { videoUrl: "/videos/elevacao_lateral.mp4", thumbnailUrl: "/images/exercises/lateral-raise.jpeg" },
  "side raise": { videoUrl: "/videos/elevacao_lateral.mp4", thumbnailUrl: "/images/exercises/lateral-raise.jpeg" },
  
  "seated shoulder press": { videoUrl: "/videos/shoulderpress.mp4", thumbnailUrl: "/images/exercises/seated-shoulder-press.jpeg" },
  "shoulder press": { videoUrl: "/videos/shoulderpress.mp4", thumbnailUrl: "/images/exercises/seated-shoulder-press.jpeg" },
  "desenvolvimento": { videoUrl: "/videos/shoulderpress.mp4", thumbnailUrl: "/images/exercises/seated-shoulder-press.jpeg" },
  "desenvolvimento ombros": { videoUrl: "/videos/shoulderpress.mp4", thumbnailUrl: "/images/exercises/seated-shoulder-press.jpeg" },
  "overhead press": { videoUrl: "/videos/shoulderpress.mp4", thumbnailUrl: "/images/exercises/seated-shoulder-press.jpeg" },
  "military press": { videoUrl: "/videos/shoulderpress.mp4", thumbnailUrl: "/images/exercises/seated-shoulder-press.jpeg" },
  "dumbbell shoulder press": { videoUrl: "/videos/shoulderpress.mp4", thumbnailUrl: "/images/exercises/seated-shoulder-press.jpeg" },
  
  // Bíceps
  "biceps curl": { videoUrl: "/videos/biceps_cabo.mp4", thumbnailUrl: "/images/exercises/biceps-curl.jpeg" },
  "bicep curl": { videoUrl: "/videos/biceps_cabo.mp4", thumbnailUrl: "/images/exercises/biceps-curl.jpeg" },
  "cable biceps curl": { videoUrl: "/videos/biceps_cabo.mp4", thumbnailUrl: "/images/exercises/biceps-curl.jpeg" },
  "rosca direta": { videoUrl: "/videos/biceps_cabo.mp4", thumbnailUrl: "/images/exercises/biceps-curl.jpeg" },
  "rosca biceps": { videoUrl: "/videos/biceps_cabo.mp4", thumbnailUrl: "/images/exercises/biceps-curl.jpeg" },
  "curl": { videoUrl: "/videos/biceps_cabo.mp4", thumbnailUrl: "/images/exercises/biceps-curl.jpeg" },
  
  "hammer curl": { videoUrl: "/videos/biceps_martelo.mp4", thumbnailUrl: "/images/exercises/hammer-curl.jpeg" },
  "rosca martelo": { videoUrl: "/videos/biceps_martelo.mp4", thumbnailUrl: "/images/exercises/hammer-curl.jpeg" },
  "biceps martelo": { videoUrl: "/videos/biceps_martelo.mp4", thumbnailUrl: "/images/exercises/hammer-curl.jpeg" },
  "dumbbell hammer curl": { videoUrl: "/videos/biceps_martelo.mp4", thumbnailUrl: "/images/exercises/hammer-curl.jpeg" },
  
  // Tríceps
  "triceps pushdown": { videoUrl: "/videos/triceps_triangulo.mp4", thumbnailUrl: "/images/exercises/triceps-pushdown.jpeg" },
  "tricep pushdown": { videoUrl: "/videos/triceps_triangulo.mp4", thumbnailUrl: "/images/exercises/triceps-pushdown.jpeg" },
  "triceps pulley": { videoUrl: "/videos/triceps_triangulo.mp4", thumbnailUrl: "/images/exercises/triceps-pushdown.jpeg" },
  "cable triceps pushdown": { videoUrl: "/videos/triceps_triangulo.mp4", thumbnailUrl: "/images/exercises/triceps-pushdown.jpeg" },
  "pushdown": { videoUrl: "/videos/triceps_triangulo.mp4", thumbnailUrl: "/images/exercises/triceps-pushdown.jpeg" },
  "triceps rope pushdown": { videoUrl: "/videos/triceps_triangulo.mp4", thumbnailUrl: "/images/exercises/triceps-pushdown.jpeg" },
  
  "seated bench extension": { videoUrl: "/videos/triceps_frances.mp4", thumbnailUrl: "/images/exercises/seated-bench-extension.jpeg" },
  "triceps frances": { videoUrl: "/videos/triceps_frances.mp4", thumbnailUrl: "/images/exercises/seated-bench-extension.jpeg" },
  "triceps francês": { videoUrl: "/videos/triceps_frances.mp4", thumbnailUrl: "/images/exercises/seated-bench-extension.jpeg" },
  "overhead triceps extension": { videoUrl: "/videos/triceps_frances.mp4", thumbnailUrl: "/images/exercises/seated-bench-extension.jpeg" },
  "triceps extension": { videoUrl: "/videos/triceps_frances.mp4", thumbnailUrl: "/images/exercises/seated-bench-extension.jpeg" },
  "skull crusher": { videoUrl: "/videos/triceps_frances.mp4", thumbnailUrl: "/images/exercises/seated-bench-extension.jpeg" },
  "triceps testa": { videoUrl: "/videos/triceps_frances.mp4", thumbnailUrl: "/images/exercises/seated-bench-extension.jpeg" },
  
  // Quadríceps / Legs
  "lever leg extension": { videoUrl: "/videos/cadeira_extensora.mp4", thumbnailUrl: "/images/exercises/leg-extension.jpeg" },
  "leg extension": { videoUrl: "/videos/cadeira_extensora.mp4", thumbnailUrl: "/images/exercises/leg-extension.jpeg" },
  "cadeira extensora": { videoUrl: "/videos/cadeira_extensora.mp4", thumbnailUrl: "/images/exercises/leg-extension.jpeg" },
  "extensora": { videoUrl: "/videos/cadeira_extensora.mp4", thumbnailUrl: "/images/exercises/leg-extension.jpeg" },
  "machine leg extension": { videoUrl: "/videos/cadeira_extensora.mp4", thumbnailUrl: "/images/exercises/leg-extension.jpeg" },
  
  // Posterior / Hamstrings
  "flexao de perna reversa assistida": { videoUrl: "/videos/flexao_perna_reversa_assistida.mp4", thumbnailUrl: "/images/exercises/flexao-perna-reversa-assistida.png" },
  "flexão de perna reversa assistida": { videoUrl: "/videos/flexao_perna_reversa_assistida.mp4", thumbnailUrl: "/images/exercises/flexao-perna-reversa-assistida.png" },
  "assisted reverse leg curl": { videoUrl: "/videos/flexao_perna_reversa_assistida.mp4", thumbnailUrl: "/images/exercises/flexao-perna-reversa-assistida.png" },
  
  "cadeira flexora unilateral": { videoUrl: "/videos/cadeira_flexora_unilateral.mp4", thumbnailUrl: "/images/exercises/cadeira-flexora-unilateral.png" },
  "unilateral leg curl": { videoUrl: "/videos/cadeira_flexora_unilateral.mp4", thumbnailUrl: "/images/exercises/cadeira-flexora-unilateral.png" },
  "unilateral leg curl machine": { videoUrl: "/videos/cadeira_flexora_unilateral.mp4", thumbnailUrl: "/images/exercises/cadeira-flexora-unilateral.png" },
  "single leg curl": { videoUrl: "/videos/cadeira_flexora_unilateral.mp4", thumbnailUrl: "/images/exercises/cadeira-flexora-unilateral.png" },
  
  "mesa flexora": { videoUrl: "/videos/mesa_flexora.mp4", thumbnailUrl: "/images/exercises/mesa-flexora.png" },
  "lying leg curl": { videoUrl: "/videos/mesa_flexora.mp4", thumbnailUrl: "/images/exercises/mesa-flexora.png" },
  "prone leg curl": { videoUrl: "/videos/mesa_flexora.mp4", thumbnailUrl: "/images/exercises/mesa-flexora.png" },
  "flexora deitado": { videoUrl: "/videos/mesa_flexora.mp4", thumbnailUrl: "/images/exercises/mesa-flexora.png" },
  
  "stiff": { videoUrl: "/videos/stiff_verdadeiro.mp4", thumbnailUrl: "/images/exercises/stiff-verdadeiro.png" },
  "stiff-legged deadlift": { videoUrl: "/videos/stiff_verdadeiro.mp4", thumbnailUrl: "/images/exercises/stiff-verdadeiro.png" },
  "stiff legged deadlift": { videoUrl: "/videos/stiff_verdadeiro.mp4", thumbnailUrl: "/images/exercises/stiff-verdadeiro.png" },
  "peso muerto rumano": { videoUrl: "/videos/stiff_verdadeiro.mp4", thumbnailUrl: "/images/exercises/stiff-verdadeiro.png" },
  
  "levantamento terra com kettlebell": { videoUrl: "/videos/kettlebell_swing.mp4", thumbnailUrl: "/images/exercises/kettlebell-swing.png" },
  "kettlebell swing": { videoUrl: "/videos/kettlebell_swing.mp4", thumbnailUrl: "/images/exercises/kettlebell-swing.png" },
  "swing con kettlebell": { videoUrl: "/videos/kettlebell_swing.mp4", thumbnailUrl: "/images/exercises/kettlebell-swing.png" },
  
  "flexora em pe": { videoUrl: "/videos/flexora_em_pe.mp4", thumbnailUrl: "/images/exercises/flexora-em-pe.png" },
  "flexora em pé": { videoUrl: "/videos/flexora_em_pe.mp4", thumbnailUrl: "/images/exercises/flexora-em-pe.png" },
  "standing leg curl": { videoUrl: "/videos/flexora_em_pe.mp4", thumbnailUrl: "/images/exercises/flexora-em-pe.png" },
  "curl de piernas de pie": { videoUrl: "/videos/flexora_em_pe.mp4", thumbnailUrl: "/images/exercises/flexora-em-pe.png" },
};

// Function to find video for an exercise name
export const getExerciseMedia = (exerciseName: string): ExerciseMedia | null => {
  const normalized = normalizeString(exerciseName);
  
  // Try exact match first
  if (exerciseVideoDatabase[normalized]) {
    return exerciseVideoDatabase[normalized];
  }
  
  // Try partial match - check if exercise name contains any key
  for (const [key, media] of Object.entries(exerciseVideoDatabase)) {
    const normalizedKey = normalizeString(key);
    if (normalized.includes(normalizedKey) || normalizedKey.includes(normalized)) {
      return media;
    }
  }
  
  // Try word-by-word matching for compound names
  const words = normalized.split(/\s+/);
  for (const [key, media] of Object.entries(exerciseVideoDatabase)) {
    const keyWords = normalizeString(key).split(/\s+/);
    // Check if most key words are present in the exercise name
    const matchCount = keyWords.filter(kw => words.some(w => w.includes(kw) || kw.includes(w))).length;
    if (matchCount >= keyWords.length * 0.7) { // 70% match threshold
      return media;
    }
  }
  
  return null;
};

// Get just the video URL for an exercise
export const getExerciseVideoUrl = (exerciseName: string): string | undefined => {
  const media = getExerciseMedia(exerciseName);
  return media?.videoUrl;
};

// Get just the thumbnail URL for an exercise
export const getExerciseThumbnailUrl = (exerciseName: string): string | undefined => {
  const media = getExerciseMedia(exerciseName);
  return media?.thumbnailUrl;
};
