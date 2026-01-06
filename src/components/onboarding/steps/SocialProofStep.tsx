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
    <div className="flex flex-col items-center -mx-6 -mt-4 px-6 py-8 min-h-full bg-gradient-to-b from-slate-900 via-slate-900 to-black relative overflow-hidden">
      {/* Subtle orange gradient overlay */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at top center, hsl(var(--primary) / 0.2) 0%, transparent 60%)",
        }}
      />
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-2 h-2 bg-primary/20 rounded-full top-[20%] left-[15%] animate-pulse" />
        <div className="absolute w-1.5 h-1.5 bg-primary/30 rounded-full top-[40%] right-[20%] animate-pulse" style={{ animationDelay: "0.5s" }} />
        <div className="absolute w-2 h-2 bg-primary/15 rounded-full bottom-[30%] left-[25%] animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Header Icon */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mb-6 shadow-lg shadow-primary/30">
          <Sparkles className="w-8 h-8 text-white" />
        </div>

        {/* Main Heading */}
        <h1 className="text-2xl md:text-3xl font-bold text-white text-center mb-3 leading-tight">
          Estamos prontos para criar seu plano
        </h1>
        <p className="text-slate-400 text-center mb-8 max-w-xs">
          Nossa IA irá processar seus dados para gerar um plano 100% personalizado
        </p>

        {/* Profile Summary Card */}
        <div className="w-full bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5 mb-6 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <h3 className="text-white font-semibold">Resumo do Perfil</h3>
          </div>

          <div className="space-y-3">
            {/* Age & Gender */}
            <div className="flex items-center justify-between py-2 border-b border-slate-700/50">
              <span className="text-slate-400 text-sm">Perfil</span>
              <span className="text-white font-medium">
                {profileData?.age || 28} anos • {profileData?.gender === "male" ? "Masculino" : "Feminino"}
              </span>
            </div>

            {/* Goal */}
            <div className="flex items-center justify-between py-2 border-b border-slate-700/50">
              <span className="text-slate-400 text-sm flex items-center gap-2">
                <Target className="w-4 h-4" />
                Objetivo
              </span>
              <span className="text-primary font-medium">
                {profileData?.goal ? goalLabels[profileData.goal] || profileData.goal : "Perder peso"}
              </span>
            </div>

            {/* Weight Goal */}
            <div className="flex items-center justify-between py-2 border-b border-slate-700/50">
              <span className="text-slate-400 text-sm flex items-center gap-2">
                <Flame className="w-4 h-4" />
                Meta de peso
              </span>
              <span className="text-white font-medium">
                {profileData?.currentWeight || 70}kg → {profileData?.targetWeight || 65}kg
                <span className="text-primary ml-1">
                  ({isWeightLoss ? "-" : "+"}{weightDiff}kg)
                </span>
              </span>
            </div>

            {/* Focus Areas */}
            <div className="flex items-center justify-between py-2 border-b border-slate-700/50">
              <span className="text-slate-400 text-sm flex items-center gap-2">
                <Dumbbell className="w-4 h-4" />
                Foco
              </span>
              <span className="text-white font-medium">
                {profileData?.bodyZones && profileData.bodyZones.length > 0
                  ? profileData.bodyZones.map(z => bodyZoneLabels[z] || z).slice(0, 2).join(", ")
                  : "Corpo Inteiro"}
                {profileData?.bodyZones && profileData.bodyZones.length > 2 && (
                  <span className="text-slate-400"> +{profileData.bodyZones.length - 2}</span>
                )}
              </span>
            </div>

            {/* Activity & Workout Days */}
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-400 text-sm">Treinos por semana</span>
              <span className="text-white font-medium">
                {profileData?.workoutDays || 3}x • {profileData?.activityLevel ? activityLabels[profileData.activityLevel] : "Moderado"}
              </span>
            </div>
          </div>
        </div>

        {/* AI Processing Indicator */}
        <div className="w-full bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-white font-medium text-sm">Dados validados com sucesso</p>
            <p className="text-slate-400 text-xs">Pronto para gerar seu plano personalizado</p>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="mt-6 flex items-center gap-2 text-slate-500 text-xs">
          <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-green-500" />
          </div>
          <span>Seus dados estão protegidos e seguros</span>
        </div>
      </div>
    </div>
  );
};
