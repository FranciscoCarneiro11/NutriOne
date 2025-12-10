import React from "react";
import { useNavigate } from "react-router-dom";
import { AppShell, AppContent, AppFooter } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AppShell>
      <AppContent className="flex flex-col items-center justify-center text-center px-8">
        {/* Stats Section */}
        <div className="space-y-6 mb-12 animate-fade-in">
          <div className="space-y-1">
            <h2 className="text-muted-foreground text-base">Mais de 15 milhões</h2>
            <p className="text-sm text-muted-foreground">escolha dos usuários</p>
          </div>

          <div className="space-y-1">
            <h1 className="text-4xl font-bold text-foreground">120.000+</h1>
            <div className="flex items-center justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-primary text-primary" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">Avaliações de 5 estrelas</p>
          </div>

          <div className="space-y-1">
            <h1 className="text-4xl font-bold text-foreground">2000+</h1>
            <p className="text-sm text-muted-foreground">exercícios</p>
          </div>
        </div>

        {/* Illustration Placeholder */}
        <div className="w-full aspect-video bg-coral-light rounded-3xl flex items-center justify-center mb-8 animate-slide-up overflow-hidden">
          <div className="flex items-end justify-center gap-2 p-6">
            {/* Stylized people illustration using simple shapes */}
            <div className="w-12 h-24 bg-amber-600 rounded-t-full rounded-b-lg" />
            <div className="w-10 h-20 bg-pink-400 rounded-t-full rounded-b-lg -mb-2" />
            <div className="w-14 h-28 bg-coral rounded-t-full rounded-b-lg" />
            <div className="w-10 h-22 bg-gray-700 rounded-t-full rounded-b-lg -mb-1" />
            <div className="w-12 h-20 bg-teal-500 rounded-t-full rounded-b-lg" />
          </div>
        </div>
      </AppContent>

      {/* Bottom Section with Coral Background */}
      <div className="bg-coral-light rounded-t-3xl -mx-px px-6 pt-8 pb-4">
        <p className="text-center text-foreground text-lg mb-8 leading-relaxed">
          Vamos começar com algumas perguntas para criar o seu{" "}
          <strong>plano personalizado</strong>
        </p>
        <Button
          variant="coral"
          size="xl"
          fullWidth
          onClick={() => navigate("/onboarding")}
        >
          Continuar
        </Button>
        <div className="h-6" />
      </div>
    </AppShell>
  );
};

export default Welcome;
