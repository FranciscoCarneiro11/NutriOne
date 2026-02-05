import React from "react";
import { AppShell, AppHeader, AppContent } from "@/components/layout/AppShell";
import { MessageCircle, Mail, FileText } from "lucide-react";

const Help: React.FC = () => {
  const helpItems = [
    {
      icon: FileText,
      title: "Perguntas Frequentes",
      description: "Encontre respostas para dúvidas comuns",
      action: () => {},
    },
    {
      icon: MessageCircle,
      title: "Chat de Suporte",
      description: "Converse com nossa equipe (em breve)",
      action: () => {},
    },
    {
      icon: Mail,
      title: "Email de Suporte",
      description: "helpnutrione@gmail.com",
      action: () => window.location.href = "mailto:helpnutrione@gmail.com",
    },
  ];

  return (
    <AppShell>
      <AppHeader title="Ajuda & Suporte" showBack />

      <AppContent className="pb-8">
        <div className="space-y-4 mb-8">
          {helpItems.map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className="w-full text-left bg-card rounded-2xl p-4 shadow-card border border-border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Perguntas Frequentes
          </h2>
          
          <div className="space-y-4">
            <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
              <h3 className="font-medium text-foreground mb-2">
                Como altero meu plano de nutrição?
              </h3>
              <p className="text-sm text-muted-foreground">
                Você pode gerar um novo plano a qualquer momento na aba Dieta, 
                clicando em "Gerar Plano com IA".
              </p>
            </div>

            <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
              <h3 className="font-medium text-foreground mb-2">
                Como registro minhas refeições?
              </h3>
              <p className="text-sm text-muted-foreground">
                No Dashboard, clique em "Adicionar Refeição" para registrar 
                manualmente suas refeições do dia.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
              <h3 className="font-medium text-foreground mb-2">
                Posso alterar meus dados pessoais?
              </h3>
              <p className="text-sm text-muted-foreground">
                Sim! Acesse Perfil {">"} Editar Perfil para atualizar suas 
                informações a qualquer momento.
              </p>
            </div>
          </div>
        </section>
      </AppContent>
    </AppShell>
  );
};

export default Help;
