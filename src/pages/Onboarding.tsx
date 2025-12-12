import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { AppShell, AppHeader, AppContent, AppFooter } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/onboarding/ProgressBar";
import { GoalCard } from "@/components/onboarding/GoalCard";
import { AgeScroller } from "@/components/onboarding/AgeScroller";
import { HeightRuler } from "@/components/onboarding/HeightRuler";
import { WeightSlider } from "@/components/onboarding/WeightSlider";
import { ActivityLevelCard } from "@/components/onboarding/ActivityLevelCard";
import { DietaryChips } from "@/components/onboarding/DietaryChips";
import { WorkoutDaysSelector } from "@/components/onboarding/WorkoutDaysSelector";
import { BodyZoneSelector } from "@/components/onboarding/BodyZoneSelector";
import {
  PreviousExperienceStep,
  LongTermSuccessStep,
  GenderStep,
  ProfessionalHelpStep,
  TargetWeightStep,
  RealisticGoalStep,
  MultiplierStep,
  ObstaclesStep,
  SocialProofStep,
  SmartLoadingScreen,
  type Obstacle,
} from "@/components/onboarding/steps";
import { cn } from "@/lib/utils";

type Goal = "weight-loss" | "muscle" | "fit" | "flexibility";
type Gender = "male" | "female" | "other";
type ActivityLevel = "sedentary" | "light" | "moderate" | "very";
type BodyZone = "arms" | "abs" | "glutes" | "legs" | "fullBody";

const goals: { id: Goal; title: string }[] = [
  { id: "weight-loss", title: "Perder peso" },
  { id: "muscle", title: "Ganhar massa muscular" },
  { id: "fit", title: "Mantenha-se em forma" },
  { id: "flexibility", title: "Melhore sua flexibilidade" },
];

const activityLevels: { id: ActivityLevel; title: string; description: string }[] = [
  { id: "sedentary", title: "Sedentário", description: "Pouco ou nenhum exercício" },
  { id: "light", title: "Levemente ativo", description: "1-3 dias por semana" },
  { id: "moderate", title: "Moderadamente ativo", description: "3-5 dias por semana" },
  { id: "very", title: "Muito ativo", description: "6-7 dias por semana" },
];

interface OnboardingData {
  previousExperience: boolean | null;
  gender: Gender | null;
  age: number;
  height: number;
  weight: number;
  targetWeight: number;
  professionalHelp: boolean | null;
  goal: Goal | null;
  obstacles: Obstacle[];
  bodyZones: BodyZone[];
  activityLevel: ActivityLevel | null;
  dietaryRestrictions: string[];
  workoutDays: number;
}

const APP_NAME = "NutriFit";

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("left");
  const [isAnimating, setIsAnimating] = useState(false);
  const [showAILoading, setShowAILoading] = useState(false);

  const [data, setData] = useState<OnboardingData>({
    previousExperience: null,
    gender: null,
    age: 28,
    height: 165,
    weight: 70,
    targetWeight: 65,
    professionalHelp: null,
    goal: null,
    obstacles: [],
    bodyZones: [],
    activityLevel: null,
    dietaryRestrictions: [],
    workoutDays: 3,
  });

  const totalSteps = 17;

  const animateTransition = (direction: "left" | "right", callback: () => void) => {
    setSlideDirection(direction);
    setIsAnimating(true);
    setTimeout(() => {
      callback();
      setIsAnimating(false);
    }, 150);
  };

  const handleBack = () => {
    if (step > 1) {
      animateTransition("right", () => setStep(step - 1));
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      animateTransition("left", () => setStep(step + 1));
    } else {
      console.log("Onboarding complete:", data);
      setShowAILoading(true);
    }
  };

  const handleAILoadingComplete = () => {
    navigate("/dashboard", { state: { firstLoad: true } });
  };

  const canProceed = () => {
    switch (step) {
      case 1: // Previous Experience
        return data.previousExperience !== null;
      case 2: // Long Term Success (info screen)
        return true;
      case 3: // Gender
        return data.gender !== null;
      case 4: // Age
        return true;
      case 5: // Height
        return true;
      case 6: // Weight
        return true;
      case 7: // Professional Help
        return data.professionalHelp !== null;
      case 8: // Main Goal
        return data.goal !== null;
      case 9: // Target Weight
        return true;
      case 10: // Realistic Goal
        return true;
      case 11: // 2x Multiplier
        return true;
      case 12: // Obstacles
        return data.obstacles.length > 0;
      case 13: // Body Zone
        return data.bodyZones.length > 0;
      case 14: // Activity Level
        return data.activityLevel !== null;
      case 15: // Dietary
        return data.dietaryRestrictions.length > 0;
      case 16: // Workout Days
        return true;
      case 17: // Social Proof
        return true;
      default:
        return false;
    }
  };

  const renderStep = () => {
    const animationClass = cn(
      "transition-all duration-300 ease-out",
      isAnimating
        ? slideDirection === "left"
          ? "opacity-0 translate-x-8"
          : "opacity-0 -translate-x-8"
        : "opacity-100 translate-x-0"
    );

    switch (step) {
      case 1: // Previous Experience
        return (
          <div className={animationClass}>
            <PreviousExperienceStep
              value={data.previousExperience}
              onChange={(value) => setData({ ...data, previousExperience: value })}
            />
          </div>
        );

      case 2: // Long Term Success
        return (
          <div className={animationClass}>
            <LongTermSuccessStep appName={APP_NAME} />
          </div>
        );

      case 3: // Gender
        return (
          <div className={animationClass}>
            <GenderStep
              value={data.gender}
              onChange={(gender) => setData({ ...data, gender })}
            />
          </div>
        );

      case 4: // Age
        return (
          <div className={animationClass}>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Qual é a sua idade?
            </h1>
            <p className="text-muted-foreground mb-12">
              Isso será usado para calibrar seu plano personalizado.
            </p>
            <AgeScroller
              value={data.age}
              onChange={(age) => setData({ ...data, age })}
            />
          </div>
        );

      case 5: // Height
        return (
          <div className={animationClass}>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Qual é a sua altura?
            </h1>
            <p className="text-muted-foreground mb-8">
              Isso será usado para calibrar seu plano personalizado.
            </p>
            <HeightRuler
              value={data.height}
              onChange={(height) => setData({ ...data, height })}
            />
          </div>
        );

      case 6: // Current Weight
        return (
          <div className={animationClass}>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Qual é o seu peso atual?
            </h1>
            <p className="text-muted-foreground mb-8">
              Isso será usado para calibrar seu plano personalizado.
            </p>
            <WeightSlider
              value={data.weight}
              onChange={(weight) => setData({ ...data, weight })}
            />
          </div>
        );

      case 7: // Professional Help
        return (
          <div className={animationClass}>
            <ProfessionalHelpStep
              value={data.professionalHelp}
              onChange={(value) => setData({ ...data, professionalHelp: value })}
            />
          </div>
        );

      case 8: // Main Goal
        return (
          <div className={animationClass}>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Qual é o seu objetivo principal?
            </h1>
            <p className="text-muted-foreground mb-8">
              Isso será usado para calibrar seu plano personalizado.
            </p>
            <div className="space-y-3">
              {goals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  title={goal.title}
                  icon={goal.id}
                  selected={data.goal === goal.id}
                  onClick={() => setData({ ...data, goal: goal.id })}
                />
              ))}
            </div>
          </div>
        );

      case 9: // Target Weight
        return (
          <div className={animationClass}>
            <TargetWeightStep
              value={data.targetWeight}
              onChange={(targetWeight) => setData({ ...data, targetWeight })}
            />
          </div>
        );

      case 10: // Realistic Goal
        return (
          <div className={animationClass}>
            <RealisticGoalStep
              currentWeight={data.weight}
              targetWeight={data.targetWeight}
              appName={APP_NAME}
            />
          </div>
        );

      case 11: // 2x Multiplier
        return (
          <div className={animationClass}>
            <MultiplierStep appName={APP_NAME} />
          </div>
        );

      case 12: // Obstacles
        return (
          <div className={animationClass}>
            <ObstaclesStep
              selected={data.obstacles}
              onChange={(obstacles) => setData({ ...data, obstacles })}
            />
          </div>
        );

      case 13: // Body Zone
        return (
          <div className={animationClass}>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Em qual parte do corpo você quer focar?
            </h1>
            <p className="text-muted-foreground mb-8">
              Selecione as áreas que deseja trabalhar.
            </p>
            <BodyZoneSelector
              gender={data.gender === "male" ? "male" : "female"}
              selected={data.bodyZones}
              onChange={(bodyZones) => setData({ ...data, bodyZones })}
            />
          </div>
        );

      case 14: // Activity Level
        return (
          <div className={animationClass}>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Quão ativo você é?
            </h1>
            <p className="text-muted-foreground mb-8">
              Seu nível de atividade nos ajuda a calcular suas necessidades.
            </p>
            <div className="space-y-3">
              {activityLevels.map((level) => (
                <ActivityLevelCard
                  key={level.id}
                  level={level.id}
                  title={level.title}
                  description={level.description}
                  selected={data.activityLevel === level.id}
                  onClick={() => setData({ ...data, activityLevel: level.id })}
                />
              ))}
            </div>
          </div>
        );

      case 15: // Dietary Restrictions
        return (
          <div className={animationClass}>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Restrições alimentares?
            </h1>
            <p className="text-muted-foreground mb-8">
              Selecione todas que se aplicam.
            </p>
            <DietaryChips
              selected={data.dietaryRestrictions}
              onChange={(dietaryRestrictions) => setData({ ...data, dietaryRestrictions })}
            />
          </div>
        );

      case 16: // Workout Days
        return (
          <div className={animationClass}>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Quantos dias você pode treinar?
            </h1>
            <p className="text-muted-foreground mb-12">
              Isso será usado para calibrar seu plano personalizado.
            </p>
            <WorkoutDaysSelector
              value={data.workoutDays}
              onChange={(workoutDays) => setData({ ...data, workoutDays })}
            />
          </div>
        );

      case 17: // Social Proof
        return (
          <div className={animationClass}>
            <SocialProofStep appName={APP_NAME} />
          </div>
        );

      default:
        return null;
    }
  };

  // Show Smart Loading Screen
  if (showAILoading) {
    return <SmartLoadingScreen onComplete={handleAILoadingComplete} />;
  }

  return (
    <AppShell className="bg-background">
      <AppHeader
        leftAction={
          step > 1 ? (
            <button
              onClick={handleBack}
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
          ) : (
            <div className="w-10" />
          )
        }
      >
        <ProgressBar currentStep={step} totalSteps={totalSteps} className="mt-2" />
      </AppHeader>

      <AppContent className="flex-1 overflow-hidden">
        {renderStep()}
      </AppContent>

      <AppFooter>
        <Button
          variant="default"
          size="xl"
          fullWidth
          onClick={handleNext}
          disabled={!canProceed()}
        >
          {step === totalSteps ? "Criar meu plano" : "Continuar"}
        </Button>
      </AppFooter>
    </AppShell>
  );
};

export default Onboarding;
