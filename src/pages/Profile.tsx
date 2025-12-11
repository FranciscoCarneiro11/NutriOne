import React from "react";
import { AppShell, AppHeader, AppContent } from "@/components/layout/AppShell";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { User, Settings, Bell, Shield, HelpCircle, LogOut, ChevronRight } from "lucide-react";

const Profile: React.FC = () => {
  const menuItems = [
    { icon: User, label: "Editar Perfil" },
    { icon: Settings, label: "Configurações" },
    { icon: Bell, label: "Notificações" },
    { icon: Shield, label: "Privacidade" },
    { icon: HelpCircle, label: "Ajuda & Suporte" },
  ];

  return (
    <AppShell>
      <AppHeader title="Perfil" />

      <AppContent className="pb-28">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-coral-light flex items-center justify-center mb-4">
            <User className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Usuário</h2>
          <p className="text-muted-foreground">usuario@email.com</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-card rounded-2xl p-4 text-center shadow-card border border-border">
            <p className="text-2xl font-bold text-primary">12</p>
            <p className="text-xs text-muted-foreground">Dias ativos</p>
          </div>
          <div className="bg-card rounded-2xl p-4 text-center shadow-card border border-border">
            <p className="text-2xl font-bold text-primary">2.4kg</p>
            <p className="text-xs text-muted-foreground">Perdidos</p>
          </div>
          <div className="bg-card rounded-2xl p-4 text-center shadow-card border border-border">
            <p className="text-2xl font-bold text-primary">85%</p>
            <p className="text-xs text-muted-foreground">Meta</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className="w-full flex items-center justify-between p-4 bg-card rounded-2xl shadow-card border border-border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-foreground">{item.label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          ))}
          
          <button className="w-full flex items-center justify-between p-4 bg-card rounded-2xl shadow-card border border-border hover:bg-red-50 transition-colors mt-4">
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5 text-red-500" />
              <span className="font-medium text-red-500">Sair</span>
            </div>
          </button>
        </div>
      </AppContent>

      <BottomNavigation />
    </AppShell>
  );
};

export default Profile;
