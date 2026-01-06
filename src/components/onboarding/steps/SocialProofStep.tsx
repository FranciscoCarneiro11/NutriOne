import React from "react";
import { User, Target, Dumbbell, Flame, CheckCircle2, Sparkles } from "lucide-react";

interface ProfileSummary {
  age: number;
  gender: string | null;
  goal: string | null;
  targetWeight: number;
  currentWeight: number;
  bodyZones: string[];
  activityLevel: string | null;
  workoutDays: number;
}

interface SocialProofStepProps {
  appName: string;
  profileData?: ProfileSummary;
}

const goalLabels: Record<string, string> = {
  "weight-loss": "Perder peso",
  "muscle": "Ganhar massa muscular",
  "fit": "Manter-se em forma",
  "flexibility": "Melhorar flexibilidade",
};

const bodyZoneLabels: Record<string, string> = {
  arms: "Braços",
  abs: "Abdômen",
  glutes: "Glúteos",
  legs: "Pernas",
  fullBody: "Corpo Inteiro",
};

const activityLabels: Record<string, string> = {
  sedentary: "Sedentário",
  light: "Levemente ativo",
  moderate: "Moderadamente ativo",
  very: "Muito ativo",
};

export const SocialProofStep: React.FC<SocialProofStepProps> = ({
  appName,
  profileData,
}) => {
  const weightDiff = profileData 
    ? Math.abs(profileData.currentWeight - profileData.targetWeight) 
    : 0;
  const isWeightLoss = profileData 
    ? profileData.targetWeight < profileData.currentWeight 
    : true;

  return (
    <div className="flex flex-col items-center justify-center min-h-full w-full relative py-4 md:py-8">
      {/* Content - Two column on desktop */}
      <div className="relative z-10 w-full flex flex-col lg:flex-row lg:items-center lg:gap-12 max-w-4xl mx-auto">
        {/* Left Column - Header & Icon */}
        <div className="lg:flex-1 flex flex-col items-center lg:items-start mb-6 lg:mb-0">
          {/* Header Icon with Pulse Animation */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-primary/30 rounded-full animate-ping" style={{ animationDuration: "2s" }} />
            <div className="relative w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/40">
              <Sparkles className="w-8 h-8 lg:w-10 lg:h-10 text-white animate-pulse" style={{ animationDuration: "1.5s" }} />
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white text-center lg:text-left mb-3 leading-tight">
            Estamos prontos para criar seu plano
          </h1>
          <p className="text-white/50 text-center lg:text-left mb-6 lg:mb-8 max-w-xs lg:max-w-sm text-sm lg:text-base">
            Nossa IA irá processar seus dados para gerar um plano 100% personalizado
          </p>

          {/* AI Processing Indicator - Desktop */}
          <div 
            className="hidden lg:flex w-full rounded-xl p-4 items-center gap-3"
            style={{
              background: "linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.05) 100%)",
              border: "1px solid rgba(34, 197, 94, 0.25)",
            }}
          >
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">Dados validados com sucesso</p>
              <p className="text-white/40 text-xs">Pronto para gerar seu plano personalizado</p>
            </div>
          </div>
        </div>

        {/* Right Column - Profile Card */}
        <div className="lg:flex-1 w-full max-w-md lg:max-w-lg mx-auto lg:mx-0">
          {/* Profile Summary Card - Glassmorphism */}
          <div 
            className="w-full rounded-2xl p-5 md:p-6 shadow-2xl"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <div className="flex items-center gap-2 mb-4 md:mb-5">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <User className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              </div>
              <h3 className="text-white font-semibold text-base md:text-lg">Resumo do Perfil</h3>
            </div>

            <div className="space-y-1">
              {/* Age & Gender */}
              <div className="flex items-center justify-between py-3 md:py-4 border-b border-white/10">
                <span className="text-white/60 text-sm md:text-base">Perfil</span>
                <span className="text-white font-medium text-sm md:text-base">
                  {profileData?.age || 28} anos • {profileData?.gender === "male" ? "Masculino" : "Feminino"}
                </span>
              </div>

              {/* Goal */}
              <div className="flex items-center justify-between py-3 md:py-4 border-b border-white/10">
                <span className="text-white/60 text-sm md:text-base flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Objetivo
                </span>
                <span className="text-primary font-semibold text-sm md:text-base">
                  {profileData?.goal ? goalLabels[profileData.goal] || profileData.goal : "Perder peso"}
                </span>
              </div>

              {/* Weight Goal */}
              <div className="flex items-center justify-between py-3 md:py-4 border-b border-white/10">
                <span className="text-white/60 text-sm md:text-base flex items-center gap-2">
                  <Flame className="w-4 h-4" />
                  Meta de peso
                </span>
                <span className="text-white font-medium text-sm md:text-base">
                  {profileData?.currentWeight || 70}kg → {profileData?.targetWeight || 65}kg
                  <span className="text-primary ml-1 font-semibold">
                    ({isWeightLoss ? "-" : "+"}{weightDiff}kg)
                  </span>
                </span>
              </div>

              {/* Focus Areas */}
              <div className="flex items-center justify-between py-3 md:py-4 border-b border-white/10">
                <span className="text-white/60 text-sm md:text-base flex items-center gap-2">
                  <Dumbbell className="w-4 h-4" />
                  Foco
                </span>
                <span className="text-white font-medium text-sm md:text-base">
                  {profileData?.bodyZones && profileData.bodyZones.length > 0
                    ? profileData.bodyZones.map(z => bodyZoneLabels[z] || z).slice(0, 2).join(", ")
                    : "Corpo Inteiro"}
                  {profileData?.bodyZones && profileData.bodyZones.length > 2 && (
                    <span className="text-white/50"> +{profileData.bodyZones.length - 2}</span>
                  )}
                </span>
              </div>

              {/* Activity & Workout Days */}
              <div className="flex items-center justify-between py-3 md:py-4">
                <span className="text-white/60 text-sm md:text-base">Treinos por semana</span>
                <span className="text-white font-medium text-sm md:text-base">
                  {profileData?.workoutDays || 3}x • {profileData?.activityLevel ? activityLabels[profileData.activityLevel] : "Moderado"}
                </span>
              </div>
            </div>
          </div>

          {/* AI Processing Indicator - Mobile */}
          <div 
            className="lg:hidden w-full rounded-xl p-4 flex items-center gap-3 mt-6"
            style={{
              background: "linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.05) 100%)",
              border: "1px solid rgba(34, 197, 94, 0.25)",
            }}
          >
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">Dados validados com sucesso</p>
              <p className="text-white/40 text-xs">Pronto para gerar seu plano personalizado</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badge */}
      <div className="mt-6 md:mt-8 flex items-center gap-2 text-white/40 text-xs md:text-sm">
        <div className="w-4 h-4 rounded-full bg-green-500/30 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        </div>
        <span>Seus dados estão protegidos e seguros</span>
      </div>
    </div>
  );
};
