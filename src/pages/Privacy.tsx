import React from "react";
import { AppShell, AppHeader, AppContent } from "@/components/layout/AppShell";

const Privacy: React.FC = () => {
  return (
    <AppShell>
      <AppHeader title="Privacidade" showBack />

      <AppContent className="pb-8">
        <div className="space-y-6">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Política de Privacidade
            </h2>
            <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
              <p className="text-muted-foreground text-sm leading-relaxed">
                A sua privacidade é importante para nós. Esta política descreve como 
                coletamos, usamos e protegemos suas informações pessoais.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-base font-semibold text-foreground mb-2">
              Dados Coletados
            </h3>
            <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
              <ul className="text-muted-foreground text-sm space-y-2">
                <li>• Informações de perfil (nome, email, foto)</li>
                <li>• Dados de saúde (peso, altura, metas)</li>
                <li>• Histórico de refeições e exercícios</li>
                <li>• Preferências de configuração</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-base font-semibold text-foreground mb-2">
              Como Usamos
            </h3>
            <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
              <ul className="text-muted-foreground text-sm space-y-2">
                <li>• Personalizar sua experiência no app</li>
                <li>• Gerar planos de nutrição e treino</li>
                <li>• Acompanhar seu progresso</li>
                <li>• Melhorar nossos serviços</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-base font-semibold text-foreground mb-2">
              Seus Direitos
            </h3>
            <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
              <p className="text-muted-foreground text-sm leading-relaxed">
                Você pode solicitar acesso, correção ou exclusão dos seus dados 
                a qualquer momento entrando em contato conosco.
              </p>
            </div>
          </section>
        </div>
      </AppContent>
    </AppShell>
  );
};

export default Privacy;
