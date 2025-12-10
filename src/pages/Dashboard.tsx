import React from "react";
import { Camera, Flame, Beef, Wheat, Droplet, Plus, ChevronRight } from "lucide-react";
import { AppShell, AppHeader, AppContent } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";

interface MacroCardProps {
  icon: React.ReactNode;
  label: string;
  current: number;
  goal: number;
  unit: string;
  color: string;
}

const MacroCard: React.FC<MacroCardProps> = ({
  icon,
  label,
  current,
  goal,
  unit,
  color,
}) => {
  const progress = Math.min((current / goal) * 100, 100);

  return (
    <div className="flex flex-col items-center p-3 bg-card rounded-2xl shadow-card">
      <div className={`p-2 rounded-xl mb-2 ${color}`}>{icon}</div>
      <span className="text-xs text-muted-foreground mb-1">{label}</span>
      <div className="flex items-baseline gap-0.5">
        <span className="text-lg font-bold text-foreground">{current}</span>
        <span className="text-xs text-muted-foreground">/{goal}{unit}</span>
      </div>
      <div className="w-full h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color.replace('bg-', 'bg-').replace('/20', '')}`}
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

      <AppContent className="pb-24">
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
            color="bg-primary/20"
          />
          <MacroCard
            icon={<Beef className="w-5 h-5 text-red-500" />}
            label="Proteína"
            current={45}
            goal={120}
            unit="g"
            color="bg-red-500/20"
          />
          <MacroCard
            icon={<Wheat className="w-5 h-5 text-amber-500" />}
            label="Carbos"
            current={130}
            goal={250}
            unit="g"
            color="bg-amber-500/20"
          />
          <MacroCard
            icon={<Droplet className="w-5 h-5 text-blue-500" />}
            label="Gordura"
            current={35}
            goal={65}
            unit="g"
            color="bg-blue-500/20"
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
                className={`flex-1 h-8 rounded-lg transition-all ${
                  i < 5 ? "bg-blue-500" : "bg-blue-200"
                }`}
              />
            ))}
          </div>
        </div>
      </AppContent>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <Button variant="coral" size="fab" className="gap-2">
          <Camera className="w-6 h-6" />
        </Button>
      </div>
    </AppShell>
  );
};

export default Dashboard;
