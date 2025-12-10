import React from "react";
import { Camera, Flame, Beef, Wheat, Droplet, Plus, ChevronRight } from "lucide-react";
import { AppShell, AppHeader, AppContent } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MacroCardProps {
  icon: React.ReactNode;
  label: string;
  current: number;
  goal: number;
  unit: string;
  colorClass: string;
  bgClass: string;
}

const MacroCard: React.FC<MacroCardProps> = ({
  icon,
  label,
  current,
  goal,
  unit,
  colorClass,
  bgClass,
}) => {
  const progress = Math.min((current / goal) * 100, 100);

  return (
    <div className="flex flex-col items-center p-3 bg-card rounded-2xl shadow-card">
      <div className={cn("p-2 rounded-xl mb-2", bgClass)}>{icon}</div>
      <span className="text-xs text-muted-foreground mb-1">{label}</span>
      <div className="flex items-baseline gap-0.5">
        <span className="text-lg font-bold text-foreground">{current}</span>
        <span className="text-xs text-muted-foreground">/{goal}{unit}</span>
      </div>
      <div className="w-full h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", colorClass)}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

interface MealCardProps {
  title: string;
  time: string;
  calories: number;
  items: string[];
}

const MealCard: React.FC<MealCardProps> = ({ title, time, calories, items }) => {
  return (
    <button className="w-full flex items-center gap-4 p-4 bg-card rounded-2xl shadow-card hover:shadow-lg transition-shadow text-left">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <span className="text-xs text-muted-foreground">{time}</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-1">
          {items.join(", ")}
        </p>
        <div className="flex items-center gap-1 mt-2 text-primary">
          <Flame className="w-4 h-4" />
          <span className="text-sm font-medium">{calories} kcal</span>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
    </button>
  );
};

const Dashboard: React.FC = () => {
  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <AppShell>
      <AppHeader title="Hoje" />

      <AppContent className="pb-32">
        {/* Date */}
        <p className="text-sm text-muted-foreground capitalize mb-6">{today}</p>

        {/* Macro Cards */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          <MacroCard
            icon={<Flame className="w-5 h-5 text-primary" />}
            label="Calorias"
            current={1240}
            goal={2000}
            unit=""
            colorClass="bg-primary"
            bgClass="bg-coral-light"
          />
          <MacroCard
            icon={<Beef className="w-5 h-5 text-red-500" />}
            label="Proteína"
            current={45}
            goal={120}
            unit="g"
            colorClass="bg-red-500"
            bgClass="bg-red-100"
          />
          <MacroCard
            icon={<Wheat className="w-5 h-5 text-amber-500" />}
            label="Carbos"
            current={130}
            goal={250}
            unit="g"
            colorClass="bg-amber-500"
            bgClass="bg-amber-100"
          />
          <MacroCard
            icon={<Droplet className="w-5 h-5 text-blue-500" />}
            label="Gordura"
            current={35}
            goal={65}
            unit="g"
            colorClass="bg-blue-500"
            bgClass="bg-blue-100"
          />
        </div>

        {/* Meals Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Refeições de Hoje</h2>
            <button className="text-primary text-sm font-medium flex items-center gap-1">
              <Plus className="w-4 h-4" />
              Adicionar
            </button>
          </div>

          <div className="space-y-3">
            <MealCard
              title="Café da manhã"
              time="07:30"
              calories={420}
              items={["Ovos mexidos", "Pão integral", "Café"]}
            />
            <MealCard
              title="Almoço"
              time="12:30"
              calories={580}
              items={["Frango grelhado", "Arroz", "Salada"]}
            />
            <MealCard
              title="Jantar"
              time="19:00"
              calories={240}
              items={["Salmão", "Legumes", "Batata doce"]}
            />
          </div>
        </div>

        {/* Water Intake */}
        <div className="p-4 bg-blue-50 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">Hidratação</h3>
            <span className="text-sm text-muted-foreground">1.5L / 2.5L</span>
          </div>
          <div className="flex gap-2">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  "flex-1 h-8 rounded-lg transition-all",
                  i < 5 ? "bg-blue-500" : "bg-blue-200"
                )}
              />
            ))}
          </div>
        </div>
      </AppContent>

      {/* Prominent Floating Scan Button */}
      <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
        <div className="max-w-md mx-auto px-6 pb-8 flex flex-col items-center pointer-events-auto">
          {/* Glow Effect */}
          <div className="absolute bottom-6 w-20 h-20 bg-primary/30 rounded-full blur-xl" />
          
          {/* Main FAB */}
          <Button 
            variant="coral" 
            className="relative h-20 w-20 rounded-full shadow-fab hover:scale-105 transition-transform"
          >
            <Camera className="w-8 h-8" />
          </Button>
          
          {/* Label */}
          <span className="mt-2 text-sm font-medium text-foreground">
            Escanear comida
          </span>
        </div>
      </div>
    </AppShell>
  );
};

export default Dashboard;
