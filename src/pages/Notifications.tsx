import React, { useState, useEffect } from "react";
import { AppShell, AppHeader, AppContent } from "@/components/layout/AppShell";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Mail, Bell } from "lucide-react";

const Notifications: React.FC = () => {
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("email_notifications, push_notifications")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setEmailNotifications(data.email_notifications !== false);
        setPushNotifications(data.push_notifications || false);
      }
      setIsLoading(false);
    };

    fetchSettings();
  }, []);

  const updateSetting = async (field: string, value: boolean) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({ [field]: value })
      .eq("user_id", user.id);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar a configuração.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Preferência salva",
        description: "Suas notificações foram atualizadas.",
      });
    }
  };

  return (
    <AppShell>
      <AppHeader title="Notificações" showBack />

      <AppContent className="pb-8">
        <div className="space-y-4">
          <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="email-notif" className="text-foreground font-medium">
                    Notificações por Email
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receba atualizações e lembretes por email
                  </p>
                </div>
              </div>
              <Switch
                id="email-notif"
                checked={emailNotifications}
                onCheckedChange={(checked) => {
                  setEmailNotifications(checked);
                  updateSetting("email_notifications", checked);
                }}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="push-notif" className="text-foreground font-medium">
                    Notificações Push
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receba alertas diretamente no navegador
                  </p>
                </div>
              </div>
              <Switch
                id="push-notif"
                checked={pushNotifications}
                onCheckedChange={(checked) => {
                  setPushNotifications(checked);
                  updateSetting("push_notifications", checked);
                }}
                disabled={isLoading}
              />
            </div>
          </div>

          <p className="text-sm text-muted-foreground text-center mt-6 px-4">
            As notificações push requerem permissão do navegador. 
            Funcionalidade completa disponível em breve.
          </p>
        </div>
      </AppContent>
    </AppShell>
  );
};

export default Notifications;
