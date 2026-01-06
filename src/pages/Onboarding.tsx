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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

const APP_NAME = "NutriOne";

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("left");
  const [isAnimating, setIsAnimating] = useState(false);
  const [showAILoading, setShowAILoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<{ nutrition_plan: any; workout_plan: any } | null>(null);

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

  const handleNext = async () => {
    if (step < totalSteps) {
      animateTransition("left", () => setStep(step + 1));
    } else {
      console.log("Onboarding complete:", data);
      setShowAILoading(true);
      
      // Generate plan using edge function
      try {
        const profileData = {
          previous_experience: data.previousExperience,
          gender: data.gender,
          age: data.age,
          height: data.height,
          weight: data.weight,
          target_weight: data.targetWeight,
          professional_help: data.professionalHelp,
          goal: data.goal,
          obstacles: data.obstacles,
          body_zones: data.bodyZones,
          activity_level: data.activityLevel,
          dietary_restrictions: data.dietaryRestrictions,
          workout_days: data.workoutDays,
        };

        const { data: planData, error } = await supabase.functions.invoke("generate-plan", {
          body: { profile: profileData },
        });

        if (error) {
          console.error("Error generating plan:", error);
          toast({
            title: "Erro ao gerar plano",
            description: "Não foi possível gerar seu plano personalizado. Tente novamente.",
            variant: "destructive",
          });
          return;
        }

        if (planData?.error) {
          console.error("Plan generation error:", planData.error);
          toast({
            title: "Erro ao gerar plano",
            description: planData.error,
            variant: "destructive",
          });
          return;
        }

        setGeneratedPlan({
          nutrition_plan: planData.nutrition_plan,
          workout_plan: planData.workout_plan,
        });

        // Store profile and plan in localStorage for now (until auth is added)
        localStorage.setItem("userProfile", JSON.stringify(profileData));
        localStorage.setItem("nutritionPlan", JSON.stringify(planData.nutrition_plan));
        localStorage.setItem("workoutPlan", JSON.stringify(planData.workout_plan));

        console.log("Plan generated successfully:", planData);
      } catch (err) {
        console.error("Failed to generate plan:", err);
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao processar seus dados.",
          variant: "destructive",
        });
      }
    }
  };

  const handleAILoadingComplete = () => {
    // Redirect to auth page to capture user before showing dashboard
    navigate("/auth?trigger=save_plan", { state: { firstLoad: true, plan: generatedPlan } });
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
          <div className={cn(animationClass, "max-w-2xl mx-auto w-full")}>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 md:text-center">
              Em qual parte do corpo você quer focar?
            </h1>
            <p className="text-muted-foreground mb-8 md:text-center md:text-lg">
              Selecione as áreas que deseja trabalhar.
            </p>
            <BodyZoneSelector
              gender={data.gender === "male" ? "male" : "female"}
              selected={data.bodyZones}
              onChange={(bodyZones) => setData({ ...data, bodyZones })}
              className="md:justify-center"
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
            <SocialProofStep 
              appName={APP_NAME} 
              profileData={{
                age: data.age,
                gender: data.gender,
                goal: data.goal,
                targetWeight: data.targetWeight,
                currentWeight: data.weight,
                bodyZones: data.bodyZones,
                activityLevel: data.activityLevel,
                workoutDays: data.workoutDays,
              }}
            />
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

  // Check if we're on the final step for dark theme
  const isFinalStep = step === totalSteps;

  return (
    <AppShell className={isFinalStep ? "bg-[#0B0F1A]" : "bg-background"} fullWidth={isFinalStep}>
      <AppHeader
        className={isFinalStep ? "bg-[#0B0F1A]/95" : undefined}
        leftAction={
          step > 1 ? (
            <button
              onClick={handleBack}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                isFinalStep 
                  ? "bg-white/10 hover:bg-white/20" 
                  : "bg-secondary hover:bg-secondary/80"
              )}
            >
              <ChevronLeft className={cn("w-5 h-5", isFinalStep ? "text-white" : "text-foreground")} />
            </button>
          ) : (
            <div className="w-10" />
          )
        }
      >
        <ProgressBar 
          currentStep={step} 
          totalSteps={totalSteps} 
          className="mt-2" 
          variant={isFinalStep ? "dark" : "default"}
        />
      </AppHeader>

      <AppContent className={cn("flex-1 overflow-hidden", isFinalStep && "flex items-center justify-center")}>
        {renderStep()}
      </AppContent>

      <AppFooter className={isFinalStep ? "bg-[#0B0F1A]" : undefined}>
        <Button
          variant="default"
          size="xl"
          fullWidth
          onClick={handleNext}
          disabled={!canProceed()}
          className={isFinalStep ? "shadow-lg shadow-primary/30" : undefined}
        >
          {step === totalSteps ? "Criar meu plano" : "Continuar"}
        </Button>
      </AppFooter>
    </AppShell>
  );
};

export default Onboarding;
