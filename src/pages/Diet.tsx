import React from "react";
import { AppShell, AppHeader, AppContent } from "@/components/layout/AppShell";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { Utensils, Clock, Flame } from "lucide-react";

const Diet: React.FC = () => {
  const meals = [
    {
      title: "Café da manhã",
      time: "07:30",
      calories: 420,
      items: ["Ovos mexidos", "Pão integral", "Café"],
    },
    {
      title: "Almoço",
      time: "12:30",
      calories: 580,
      items: ["Frango grelhado", "Arroz", "Salada"],
    },
    {
      title: "Lanche",
      time: "16:00",
      calories: 180,
      items: ["Banana", "Castanhas"],
    },
    {
      title: "Jantar",
      time: "19:00",
      calories: 450,
      items: ["Salmão", "Legumes", "Batata doce"],
    },
  ];

  return (
    <AppShell>
      <AppHeader title="Plano Alimentar" />

      <AppContent className="pb-28">
        <p className="text-muted-foreground mb-6">Suas refeições de hoje</p>

        <div className="space-y-4">
          {meals.map((meal, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-4 shadow-card border border-border"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-coral-light flex items-center justify-center">
                    <Utensils className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{meal.title}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {meal.time}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-primary">
                  <Flame className="w-4 h-4" />
                  <span className="font-semibold">{meal.calories}</span>
                  <span className="text-xs text-muted-foreground">kcal</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {meal.items.map((item, i) => (
                  <span
                    key={i}
                    className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </AppContent>

      <BottomNavigation />
    </AppShell>
  );
};

export default Diet;
