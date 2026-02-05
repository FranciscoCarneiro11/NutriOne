import React from "react";
import { useState } from "react";
import { AppShell, AppHeader, AppContent } from "@/components/layout/AppShell";
import { MessageCircle, Mail, FileText, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

const Help: React.FC = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const helpItems = [
    {
      icon: FileText,
      title: "Perguntas Frequentes",
      description: "Encontre respostas para dúvidas comuns",
      action: () => {},
    },
    {
      icon: Mail,
      title: "Email de Suporte",
      description: "helpnutrione@gmail.com",
      action: () => window.location.href = "mailto:helpnutrione@gmail.com",
    },
  ];

  const faqs: FAQItem[] = [
    {
      question: "Como funciona o plano de nutrição com IA?",
      answer: "Nossa inteligência artificial analisa seus dados pessoais (peso, altura, objetivo, restrições alimentares) e cria um plano de refeições personalizado. O plano inclui café da manhã, almoço, jantar e lanches, com valores nutricionais calculados para atingir suas metas."
    },
    {
      question: "Como altero meu plano de nutrição?",
      answer: "Você pode gerar um novo plano a qualquer momento na aba Dieta, clicando em 'Gerar Plano com IA'. Cada novo plano será adaptado às suas preferências e objetivos atuais."
    },
    {
      question: "Como registro minhas refeições?",
      answer: "No Dashboard, clique em 'Adicionar Refeição' para registrar manualmente suas refeições do dia. Você também pode marcar as refeições do seu plano como concluídas ou puladas."
    },
    {
      question: "Posso alterar meus dados pessoais?",
      answer: "Sim! Acesse Perfil > Editar Perfil para atualizar suas informações como nome, peso, altura, objetivo e foto a qualquer momento."
    },
    {
      question: "Como funciona o rastreamento de hidratação?",
      answer: "No Dashboard, você encontra o contador de copos de água. Toque nos copos para registrar sua ingestão diária. A meta padrão é 8 copos, mas você pode ajustar conforme suas necessidades."
    },
    {
      question: "Como uso a galeria de exercícios?",
      answer: "Na aba Treino > Galeria, você encontra exercícios organizados por grupo muscular. Cada exercício possui vídeo demonstrativo e instruções detalhadas. Você pode favoritar exercícios para acesso rápido."
    },
    {
      question: "Como registro meus treinos?",
      answer: "Ao clicar em um exercício na galeria, você pode registrar séries, repetições e peso utilizado. Todo histórico fica salvo para você acompanhar sua evolução."
    },
    {
      question: "O que é a sequência (streak)?",
      answer: "A sequência mostra quantos dias consecutivos você utilizou o app e completou atividades. Manter sua sequência ajuda na motivação e consistência dos seus hábitos saudáveis."
    },
    {
      question: "Como mudo o idioma do app?",
      answer: "Acesse Perfil e toque em 'Idioma'. Você pode escolher entre Português, English e Español. Toda a interface será traduzida automaticamente."
    },
    {
      question: "Meus dados estão seguros?",
      answer: "Sim! Todos os seus dados são armazenados de forma segura e criptografada. Não compartilhamos suas informações pessoais com terceiros. Você pode excluir sua conta e dados a qualquer momento."
    },
    {
      question: "Como entro em contato com o suporte?",
      answer: "Você pode nos enviar um email para helpnutrione@gmail.com. Respondemos em até 24 horas úteis. Descreva seu problema detalhadamente para agilizar o atendimento."
    },
    {
      question: "O app funciona offline?",
      answer: "Algumas funcionalidades básicas funcionam offline, mas para sincronizar seus dados, gerar planos com IA e acessar todas as features, é necessário conexão com a internet."
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

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
            {faqs.map((faq, index) => (
              <button
                key={index}
                onClick={() => toggleFAQ(index)}
                className="w-full text-left bg-card rounded-2xl p-4 shadow-card border border-border hover:bg-muted/50 transition-all"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-medium text-foreground">{faq.question}</h3>
                  <ChevronDown 
                    className={cn(
                      "w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-200",
                      openFAQ === index && "rotate-180"
                    )} 
                  />
                </div>
                <div 
                  className={cn(
                    "overflow-hidden transition-all duration-200",
                    openFAQ === index ? "max-h-96 mt-3" : "max-h-0"
                  )}
                >
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </AppContent>
    </AppShell>
  );
};

export default Help;
