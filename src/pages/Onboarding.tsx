import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { AppShell, AppHeader, AppContent, AppFooter } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/onboarding/ProgressBar";
import { GoalCard } from "@/components/onboarding/GoalCard";
import { MotivationChip } from "@/components/onboarding/MotivationChip";
import { GenderCard } from "@/components/onboarding/GenderCard";
import { AgeScroller } from "@/components/onboarding/AgeScroller";
import { HeightRuler } from "@/components/onboarding/HeightRuler";
import { WeightSlider } from "@/components/onboarding/WeightSlider";
import { ActivityLevelCard } from "@/components/onboarding/ActivityLevelCard";
import { DietaryChips } from "@/components/onboarding/DietaryChips";
import { WorkoutDaysSelector } from "@/components/onboarding/WorkoutDaysSelector";
import { BodyZoneSelector } from "@/components/onboarding/BodyZoneSelector";
import { AILoadingScreen } from "@/components/onboarding/AILoadingScreen";
import { cn } from "@/lib/utils";

type Goal = "weight-loss" | "muscle" | "fit" | "flexibility";
type Motivation = "body" | "appearance" | "health" | "confidence";
type Gender = "male" | "female";
type ActivityLevel = "sedentary" | "light" | "moderate" | "very";
type BodyZone = "arms" | "abs" | "glutes" | "legs" | "fullBody";

const goals: { id: Goal; title: string }[] = [
  { id: "weight-loss", title: "Perder peso" },
  { id: "muscle", title: "Ganhar massa muscular" },
  { id: "fit", title: "Mantenha-se em forma" },
  { id: "flexibility", title: "Melhore sua flexibilidade" },
];

const motivations: { id: Motivation; title: string }[] = [
  { id: "body", title: "Modele seu corpo" },
  { id: "appearance", title: "Melhore sua aparência" },
  { id: "health", title: "Torne-se mais saudável" },
  { id: "confidence", title: "Sinta-se confiante" },
];

const activityLevels: { id: ActivityLevel; title: string; description: string }[] = [
  { id: "sedentary", title: "Sedentário", description: "Pouco ou nenhum exercício" },
  { id: "light", title: "Levemente ativo", description: "1-3 dias por semana" },
  { id: "moderate", title: "Moderadamente ativo", description: "3-5 dias por semana" },
  { id: "very", title: "Muito ativo", description: "6-7 dias por semana" },
];

interface OnboardingData {
  goal: Goal | null;
  motivation: Motivation | null;
  gender: Gender | null;
  age: number;
  height: number;
  weight: number;
  bodyZones: BodyZone[];
  activityLevel: ActivityLevel | null;
  dietaryRestrictions: string[];
  workoutDays: number;
}

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("left");
  const [isAnimating, setIsAnimating] = useState(false);
  const [showAILoading, setShowAILoading] = useState(false);

  const [data, setData] = useState<OnboardingData>({
    goal: null,
    motivation: null,
    gender: null,
    age: 28,
    height: 165,
    weight: 70.3,
    bodyZones: [],
    activityLevel: null,
    dietaryRestrictions: [],
    workoutDays: 3,
  });

  const totalSteps = 10;

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

  const handleGenderSelect = (gender: Gender) => {
    setData({ ...data, gender });
    setTimeout(() => {
      animateTransition("left", () => setStep(step + 1));
    }, 300);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return data.goal !== null;
      case 2:
        return data.motivation !== null;
      case 3:
        return data.gender !== null;
      case 4:
      case 5:
      case 6:
        return true;
      case 7:
        return data.bodyZones.length > 0;
      case 8:
        return data.activityLevel !== null;
      case 9:
        return data.dietaryRestrictions.length > 0;
      case 10:
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
      case 1:
        return (
          <div className={animationClass}>
            <h1 className="text-2xl font-bold text-center text-foreground mb-2">
              Qual é o seu <span className="text-primary">objetivo</span>
            </h1>
            <p className="text-center text-foreground font-bold text-2xl mb-8">principal?</p>
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

      case 2:
        return (
          <div className={animationClass}>
            <h1 className="text-2xl font-bold text-center text-foreground mb-2">
              Qual é a sua maior
            </h1>
            <p className="text-center text-foreground font-bold text-2xl mb-8">motivação?</p>
            <div className="space-y-3">
              {motivations.map((motivation) => (
                <MotivationChip
                  key={motivation.id}
                  title={motivation.title}
                  icon={motivation.id}
                  selected={data.motivation === motivation.id}
                  onClick={() => setData({ ...data, motivation: motivation.id })}
                />
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className={animationClass}>
            <h1 className="text-2xl font-bold text-center text-foreground mb-2">
              Qual é o seu
            </h1>
            <p className="text-center text-foreground font-bold text-2xl mb-12">gênero?</p>
            <div className="grid grid-cols-2 gap-4">
              <GenderCard
                gender="male"
                selected={data.gender === "male"}
                onClick={() => handleGenderSelect("male")}
              />
              <GenderCard
                gender="female"
                selected={data.gender === "female"}
                onClick={() => handleGenderSelect("female")}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className={animationClass}>
            <h1 className="text-2xl font-bold text-center text-foreground mb-2">
              Qual é a sua
            </h1>
            <p className="text-center text-foreground font-bold text-2xl mb-12">idade?</p>
            <AgeScroller
              value={data.age}
              onChange={(age) => setData({ ...data, age })}
            />
          </div>
        );

      case 5:
        return (
          <div className={animationClass}>
            <h1 className="text-2xl font-bold text-center text-foreground mb-8">
              Qual é a sua <span className="text-primary">altura</span>?
            </h1>
            <HeightRuler
              value={data.height}
              onChange={(height) => setData({ ...data, height })}
            />
          </div>
        );

      case 6:
        return (
          <div className={animationClass}>
            <h1 className="text-2xl font-bold text-center text-foreground mb-8">
              Qual é o seu <span className="text-primary">peso ideal</span>?
            </h1>
            <WeightSlider
              value={data.weight}
              onChange={(weight) => setData({ ...data, weight })}
            />
          </div>
        );

      case 7:
        return (
          <div className={animationClass}>
            <h1 className="text-2xl font-bold text-center text-foreground mb-2">
              Em qual parte do corpo você
            </h1>
            <p className="text-center text-foreground font-bold text-2xl mb-8">quer focar?</p>
            <BodyZoneSelector
              gender={data.gender || "female"}
              selected={data.bodyZones}
              onChange={(bodyZones) => setData({ ...data, bodyZones })}
            />
          </div>
        );

      case 8:
        return (
          <div className={animationClass}>
            <h1 className="text-2xl font-bold text-center text-foreground mb-2">
              Quão <span className="text-primary">ativo</span> você é?
            </h1>
            <p className="text-center text-muted-foreground mb-8">
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

      case 9:
        return (
          <div className={animationClass}>
            <h1 className="text-2xl font-bold text-center text-foreground mb-2">
              Restrições <span className="text-primary">alimentares</span>?
            </h1>
            <p className="text-center text-muted-foreground mb-8">
              Selecione todas que se aplicam.
            </p>
            <DietaryChips
              selected={data.dietaryRestrictions}
              onChange={(dietaryRestrictions) => setData({ ...data, dietaryRestrictions })}
            />
          </div>
        );

      case 10:
        return (
          <div className={animationClass}>
            <h1 className="text-2xl font-bold text-center text-foreground mb-2">
              Quantos dias você pode
            </h1>
            <p className="text-center text-foreground font-bold text-2xl mb-12">treinar?</p>
            <WorkoutDaysSelector
              value={data.workoutDays}
              onChange={(workoutDays) => setData({ ...data, workoutDays })}
            />
          </div>
        );

      default:
        return null;
    }
  };

  // Auto-hide footer for gender step (auto-advance)
  const showFooter = step !== 3;

  // Show AI Loading Screen
  if (showAILoading) {
    return <AILoadingScreen onComplete={handleAILoadingComplete} />;
  }

  return (
    <AppShell>
      <AppHeader
        leftAction={
          step > 1 ? (
            <button
              onClick={handleBack}
              className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-foreground" />
            </button>
          ) : null
        }
      >
        <ProgressBar currentStep={step} totalSteps={totalSteps} className="mt-2" />
      </AppHeader>

      <AppContent className="flex-1 overflow-hidden">
        {renderStep()}
      </AppContent>

      {showFooter && (
        <AppFooter>
          <Button
            variant={step >= 4 && step <= 6 ? "dark" : "coral"}
            size="xl"
            fullWidth
            onClick={handleNext}
            disabled={!canProceed()}
          >
            {step === totalSteps ? "Criar meu plano" : "Próximo"}
          </Button>
        </AppFooter>
      )}
    </AppShell>
  );
};

export default Onboarding;
