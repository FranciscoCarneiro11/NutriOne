import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell, AppHeader, AppContent } from "@/components/layout/AppShell";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { User, Settings, Bell, Shield, HelpCircle, LogOut, ChevronRight, Camera } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface ProfileData {
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  weight: number | null;
  height: number | null;
  target_weight: number | null;
  goal: string | null;
  starting_weight: number | null;
  created_at: string | null;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("first_name, last_name, avatar_url, weight, height, target_weight, goal, starting_weight, created_at")
      .eq("user_id", user.id)
      .single();

    if (!error && data) {
      setProfile(data);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear any local state
      localStorage.clear();
      
      navigate("/auth", { replace: true });
    } catch (error: any) {
      toast({
        title: "Erro ao sair",
        description: error.message || "Tente novamente.",
        variant: "destructive",
      });
      setIsLoggingOut(false);
    }
  };

  // Calculate display name
  const displayName = profile?.first_name 
    ? `${profile.first_name}${profile.last_name ? ` ${profile.last_name}` : ""}`
    : "Sem Nome";

  // Calculate stats
  const activeDays = profile?.created_at
    ? Math.floor((Date.now() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const kgLost = profile?.starting_weight && profile?.weight
    ? Math.max(0, profile.starting_weight - profile.weight)
    : 0;

  const goalProgress = profile?.starting_weight && profile?.weight && profile?.target_weight
    ? (() => {
        const totalToLose = profile.starting_weight - profile.target_weight;
        if (totalToLose <= 0) return 100;
        const lost = profile.starting_weight - profile.weight;
        return Math.min(100, Math.max(0, Math.round((lost / totalToLose) * 100)));
      })()
    : 0;

  const menuItems = [
    { icon: User, label: "Editar Perfil", action: () => setIsEditModalOpen(true) },
    { icon: Settings, label: "Configurações", action: () => navigate("/settings") },
    { icon: Bell, label: "Notificações", action: () => navigate("/notifications") },
    { icon: Shield, label: "Privacidade", action: () => navigate("/privacy") },
    { icon: HelpCircle, label: "Ajuda & Suporte", action: () => navigate("/help") },
  ];

  return (
    <AppShell>
      <AppHeader title="Perfil" />

      <AppContent className="pb-28">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-8">
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="w-24 h-24 rounded-full bg-coral-light flex items-center justify-center mb-4 overflow-hidden relative cursor-pointer hover:opacity-80 transition-opacity group"
          >
            {profile?.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-12 h-12 text-primary" />
            )}
            {/* Camera overlay on hover */}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
              <Camera className="w-8 h-8 text-white" />
            </div>
          </button>
          <h2 className="text-xl font-bold text-foreground">{displayName}</h2>
          <p className="text-muted-foreground">{user?.email || "usuario@email.com"}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-card rounded-2xl p-4 text-center shadow-card border border-border">
            <p className="text-2xl font-bold text-primary">{activeDays}</p>
            <p className="text-xs text-muted-foreground">Dias ativos</p>
          </div>
          <div className="bg-card rounded-2xl p-4 text-center shadow-card border border-border">
            <p className="text-2xl font-bold text-primary">{kgLost.toFixed(1)}kg</p>
            <p className="text-xs text-muted-foreground">Perdidos</p>
          </div>
          <div className="bg-card rounded-2xl p-4 text-center shadow-card border border-border">
            <p className="text-2xl font-bold text-primary">{goalProgress}%</p>
            <p className="text-xs text-muted-foreground">Meta</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className="w-full flex items-center justify-between p-4 bg-card rounded-2xl shadow-card border border-border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-foreground">{item.label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          ))}
          
          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-between p-4 bg-card rounded-2xl shadow-card border border-border hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors mt-4"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5 text-red-500" />
              <span className="font-medium text-red-500">
                {isLoggingOut ? "Saindo..." : "Sair"}
              </span>
            </div>
          </button>
        </div>
      </AppContent>

      <EditProfileModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        profile={profile}
        onSave={fetchProfile}
      />

      <BottomNavigation />
    </AppShell>
  );
};

export default Profile;
