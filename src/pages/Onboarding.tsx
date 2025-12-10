import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { AppShell, AppHeader, AppContent, AppFooter } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/onboarding/ProgressBar";
import { GoalCard } from "@/components/onboarding/GoalCard";
import { MotivationChip } from "@/components/onboarding/MotivationChip";
import { HeightRuler } from "@/components/onboarding/HeightRuler";
import { WeightSlider } from "@/components/onboarding/WeightSlider";

type Goal = "weight-loss" | "muscle" | "fit" | "flexibility";
type Motivation = "body" | "appearance" | "health" | "confidence";

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

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [selectedMotivation, setSelectedMotivation] = useState<Motivation | null>(null);
  const [height, setHeight] = useState(165);
  const [weight, setWeight] = useState(70.3);

  const totalSteps = 4;

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      navigate("/dashboard");
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return selectedGoal !== null;
      case 2:
        return selectedMotivation !== null;
      case 3:
      case 4:
        return true;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="animate-fade-in">
            <h1 className="text-2xl font-bold text-center text-foreground mb-2">
              Qual é o seu <span className="text-primary">objetivo</span>
            </h1>
            <p className="text-center text-muted-foreground mb-8">principal?</p>
            <div className="space-y-3">
              {goals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  title={goal.title}
                  icon={goal.id}
                  selected={selectedGoal === goal.id}
                  onClick={() => setSelectedGoal(goal.id)}
                />
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="animate-fade-in">
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
                  selected={selectedMotivation === motivation.id}
                  onClick={() => setSelectedMotivation(motivation.id)}
                />
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="animate-fade-in">
            <h1 className="text-2xl font-bold text-center text-foreground mb-8">
              Qual é a sua <span className="text-primary">altura</span>?
            </h1>
            <HeightRuler value={height} onChange={setHeight} />
          </div>
        );
      case 4:
        return (
          <div className="animate-fade-in">
            <h1 className="text-2xl font-bold text-center text-foreground mb-8">
              Qual é o seu <span className="text-primary">peso ideal</span>?
            </h1>
            <WeightSlider value={weight} onChange={setWeight} />
          </div>
        );
      default:
        return null;
    }
  };

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

      <AppContent className="flex-1">
        {renderStep()}
      </AppContent>

      <AppFooter>
        <Button
          variant={step === 3 || step === 4 ? "dark" : "coral"}
          size="xl"
          fullWidth
          onClick={handleNext}
          disabled={!canProceed()}
        >
          {step === totalSteps ? "Começar" : "Próximo"}
        </Button>
      </AppFooter>
    </AppShell>
  );
};

export default Onboarding;
