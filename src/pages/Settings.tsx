import React, { useState, useEffect } from "react";
import { AppShell, AppHeader, AppContent } from "@/components/layout/AppShell";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/useTheme";
import { Moon, Ruler } from "lucide-react";

const Settings: React.FC = () => {
  const { toast } = useToast();
  const { theme, setTheme, isLoading: isThemeLoading } = useTheme();
  const [useMetric, setUseMetric] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("use_metric")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setUseMetric(data.use_metric !== false);
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
        title: "Configuração salva",
        description: "Suas preferências foram atualizadas.",
      });
    }
  };

  const handleDarkModeChange = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
    toast({
      title: "Configuração salva",
      description: "Suas preferências foram atualizadas.",
    });
  };

  const handleMetricChange = (checked: boolean) => {
    setUseMetric(checked);
    updateSetting("use_metric", checked);
  };

  return (
    <AppShell>
      <AppHeader title="Configurações" showBack />

      <AppContent className="pb-8">
        <div className="space-y-4">
          <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="dark-mode" className="text-foreground font-medium">
                    Modo Escuro
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Ativar tema escuro
                  </p>
                </div>
              </div>
              <Switch
                id="dark-mode"
                checked={theme === "dark"}
                onCheckedChange={handleDarkModeChange}
                disabled={isThemeLoading}
              />
            </div>
          </div>

          <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Ruler className="w-5 h-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="metric" className="text-foreground font-medium">
                    Sistema Métrico
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {useMetric ? "kg, cm" : "lb, ft/in"}
                  </p>
                </div>
              </div>
              <Switch
                id="metric"
                checked={useMetric}
                onCheckedChange={handleMetricChange}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      </AppContent>
    </AppShell>
  );
};

export default Settings;
