import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell, AppHeader, AppContent } from "@/components/layout/AppShell";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { User, Settings, Bell, Shield, HelpCircle, LogOut, ChevronRight, Camera, Flame, TrendingUp, TrendingDown, Globe, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/i18n/LanguageContext";
import { Language } from "@/i18n/translations";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  active_days_count: number | null;
  current_streak: number | null;
  longest_streak: number | null;
}

interface WeightLog {
  weight: number;
  logged_at: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { language, setLanguage, t } = useLanguage();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Fetch profile with React Query for real-time sync
  const { data: profile, refetch: refetchProfile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name, avatar_url, weight, height, target_weight, goal, starting_weight, created_at, active_days_count, current_streak, longest_streak")
        .eq("user_id", user.id)
        .single();
      
      if (error) throw error;
      return data as ProfileData;
    },
    enabled: !!user,
  });

  // Fetch weight logs to get the most recent weight
  const { data: weightLogs } = useQuery({
    queryKey: ["weight_logs", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("weight_logs")
        .select("weight, logged_at")
        .eq("user_id", user.id)
        .order("logged_at", { ascending: true });
      
      if (error) throw error;
      return (data || []) as WeightLog[];
    },
    enabled: !!user,
  });

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
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

  // Stats values
  const currentStreak = profile?.current_streak || 0;

  // Get starting weight (from profile) and most recent weight (from weight_logs or profile)
  const startingWeight = profile?.starting_weight || profile?.weight || 0;
  const mostRecentWeight = weightLogs && weightLogs.length > 0 
    ? weightLogs[weightLogs.length - 1].weight 
    : profile?.weight || 0;
  const targetWeight = profile?.target_weight || 0;
  const userGoal = profile?.goal || "weight-loss";

  // Calculate weight change (positive = gained, negative = lost)
  const weightChange = mostRecentWeight - startingWeight;
  const absoluteChange = Math.abs(weightChange);

  // Determine if this is a gain or loss goal
  const isLossGoal = userGoal === "weight-loss";
  const isGainGoal = userGoal === "muscle" || userGoal === "fit";

  // Format the weight progress display
  const getWeightProgressDisplay = () => {
    if (absoluteChange === 0) {
      return { value: "0.0", label: isLossGoal ? "Perdidos" : "Ganhos", isPositive: true };
    }

    if (isLossGoal) {
      // For weight loss: negative change is good (lost weight)
      if (weightChange < 0) {
        return { value: absoluteChange.toFixed(1), label: "Perdidos", isPositive: true };
      } else {
        return { value: `+${absoluteChange.toFixed(1)}`, label: "Ganhos", isPositive: false };
      }
    } else {
      // For muscle gain: positive change is good (gained weight)
      if (weightChange > 0) {
        return { value: `+${absoluteChange.toFixed(1)}`, label: "Ganhos", isPositive: true };
      } else {
        return { value: absoluteChange.toFixed(1), label: "Perdidos", isPositive: false };
      }
    }
  };

  // Calculate goal progress percentage
  const calculateGoalProgress = () => {
    if (!startingWeight || !targetWeight || startingWeight === targetWeight) {
      return 0;
    }

    const totalChangeNeeded = Math.abs(targetWeight - startingWeight);
    
    if (isLossGoal) {
      // For weight loss: progress = weight lost / total to lose
      const weightLost = startingWeight - mostRecentWeight;
      if (weightLost <= 0) return 0;
      const progress = (weightLost / totalChangeNeeded) * 100;
      return Math.min(100, Math.max(0, Math.round(progress)));
    } else {
      // For muscle gain: progress = weight gained / total to gain
      const weightGained = mostRecentWeight - startingWeight;
      if (weightGained <= 0) return 0;
      const progress = (weightGained / totalChangeNeeded) * 100;
      return Math.min(100, Math.max(0, Math.round(progress)));
    }
  };

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: "pt", label: "Português", flag: "🇧🇷" },
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "es", label: "Español", flag: "🇪🇸" },
  ];

  const currentLanguage = languages.find(l => l.code === language) || languages[0];

  const weightProgressDisplay = getWeightProgressDisplay();
  const goalProgress = calculateGoalProgress();

  const menuItems = [
    { icon: User, label: t.profile?.editProfile || "Editar Perfil", action: () => setIsEditModalOpen(true) },
    { icon: Settings, label: t.profile?.settings || "Configurações", action: () => navigate("/settings") },
    { icon: Bell, label: t.profile?.notifications || "Notificações", action: () => navigate("/notifications") },
    { icon: Shield, label: t.profile?.privacy || "Privacidade", action: () => navigate("/privacy") },
    { icon: HelpCircle, label: t.profile?.helpSupport || "Ajuda & Suporte", action: () => navigate("/help") },
  ];

  return (
    <AppShell>
      <AppHeader title={t.profile?.title || "Perfil"} />

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
          {/* Streak Card */}
          <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl p-4 text-center shadow-card border border-orange-500/20">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Flame className="w-5 h-5 text-orange-500" />
              <p className="text-2xl font-bold text-orange-500">{currentStreak}</p>
            </div>
            <p className="text-xs text-muted-foreground">Sequência</p>
          </div>

          {/* Weight Progress Card */}
          <div className={`rounded-2xl p-4 text-center shadow-card border ${
            weightProgressDisplay.isPositive 
              ? "bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20" 
              : "bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/20"
          }`}>
            <div className="flex items-center justify-center gap-1 mb-1">
              {isLossGoal ? (
                <TrendingDown className={`w-4 h-4 ${weightProgressDisplay.isPositive ? "text-green-500" : "text-red-500"}`} />
              ) : (
                <TrendingUp className={`w-4 h-4 ${weightProgressDisplay.isPositive ? "text-green-500" : "text-red-500"}`} />
              )}
              <p className={`text-2xl font-bold ${weightProgressDisplay.isPositive ? "text-green-500" : "text-red-500"}`}>
                {weightProgressDisplay.value}kg
              </p>
            </div>
            <p className="text-xs text-muted-foreground">{weightProgressDisplay.label}</p>
          </div>

          {/* Goal Progress Card */}
          <div className="bg-gradient-to-br from-primary/10 to-orange-500/10 rounded-2xl p-4 text-center shadow-card border border-primary/20">
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

          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center justify-between p-4 bg-card rounded-2xl shadow-card border border-border hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium text-foreground">{t.profile?.language || "Idioma"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{currentLanguage.flag} {currentLanguage.label}</span>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </span>
                  {language === lang.code && <Check className="w-4 h-4 text-primary" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-between p-4 bg-card rounded-2xl shadow-card border border-border hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors mt-4"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5 text-red-500" />
              <span className="font-medium text-red-500">
                {isLoggingOut ? (t.profile?.loggingOut || "Saindo...") : (t.profile?.logout || "Sair")}
              </span>
            </div>
          </button>
        </div>
      </AppContent>

      <EditProfileModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        profile={profile}
        onSave={() => refetchProfile()}
      />

      <BottomNavigation />
    </AppShell>
  );
};

export default Profile;
