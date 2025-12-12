import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Apple, Mail, Loader2, Sparkles } from "lucide-react";
import { AppShell, AppContent } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasPendingPlan, setHasPendingPlan] = useState(false);

  const trigger = searchParams.get("trigger");

  useEffect(() => {
    // Check for pending quiz data
    const profile = localStorage.getItem("userProfile");
    const nutritionPlan = localStorage.getItem("nutritionPlan");
    const workoutPlan = localStorage.getItem("workoutPlan");
    setHasPendingPlan(!!(profile && nutritionPlan && workoutPlan));
  }, []);

  useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if ((event === "SIGNED_IN" || event === "INITIAL_SESSION") && session?.user) {
          await handlePostAuth(session.user.id);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        handlePostAuth(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handlePostAuth = async (userId: string) => {
    const profileData = localStorage.getItem("userProfile");
    const nutritionPlan = localStorage.getItem("nutritionPlan");
    const workoutPlan = localStorage.getItem("workoutPlan");

    if (profileData && nutritionPlan && workoutPlan) {
      try {
        const profile = JSON.parse(profileData);
        const nutrition = JSON.parse(nutritionPlan);
        const workout = JSON.parse(workoutPlan);

        // Insert profile data into Supabase
        const { error: profileError } = await supabase
          .from("profiles")
          .upsert({
            user_id: userId,
            previous_experience: profile.previous_experience,
            gender: profile.gender,
            age: profile.age,
            height: profile.height,
            weight: profile.weight,
            target_weight: profile.target_weight,
            professional_help: profile.professional_help,
            goal: profile.goal,
            obstacles: profile.obstacles,
            body_zones: profile.body_zones,
            activity_level: profile.activity_level,
            dietary_restrictions: profile.dietary_restrictions,
            workout_days: profile.workout_days,
            nutrition_plan: nutrition,
            workout_plan: workout,
          }, { onConflict: 'user_id' });

        if (profileError) {
          console.error("Error saving profile:", profileError);
          toast({
            title: "Erro ao salvar perfil",
            description: profileError.message,
            variant: "destructive",
          });
        } else {
          // Clear localStorage after successful save
          localStorage.removeItem("userProfile");
          localStorage.removeItem("nutritionPlan");
          localStorage.removeItem("workoutPlan");
          
          toast({
            title: "Bem-vindo!",
            description: "Seu plano personalizado foi salvo com sucesso.",
          });
        }
      } catch (err) {
        console.error("Error processing post-auth:", err);
      }
    }

    navigate("/dashboard", { replace: true });
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });
        if (error) throw error;
        
        toast({
          title: "Conta criada!",
          description: "Verifique seu email para confirmar o cadastro.",
        });
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth?trigger=save_plan`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      console.error("Google auth error:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao conectar com Google.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleAppleAuth = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "apple",
        options: {
          redirectTo: `${window.location.origin}/auth?trigger=save_plan`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      console.error("Apple auth error:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao conectar com Apple.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <AppShell className="bg-background">
      <AppContent className="flex flex-col justify-center px-6 py-8">
        {/* Pending Plan Banner */}
        {hasPendingPlan && (
          <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">
                  Seu plano personalizado está pronto!
                </h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Crie uma conta para salvar e acessar seu plano de nutrição e treino.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {isLogin ? "Bem-vindo de volta" : "Crie sua conta"}
          </h1>
          <p className="text-muted-foreground">
            {isLogin 
              ? "Entre para acessar seu plano personalizado" 
              : "Desbloqueie seu plano personalizado de nutrição e treino"}
          </p>
        </div>

        {/* Social Auth Buttons */}
        <div className="space-y-3 mb-6">
          <Button
            variant="outline"
            size="lg"
            className="w-full h-14 text-base font-medium border-2 hover:bg-secondary/50 transition-all"
            onClick={handleGoogleAuth}
            disabled={isLoading}
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continuar com Google
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full h-14 text-base font-medium border-2 hover:bg-secondary/50 transition-all"
            onClick={handleAppleAuth}
            disabled={isLoading}
          >
            <Apple className="w-5 h-5 mr-3" />
            Continuar com Apple
          </Button>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-background text-muted-foreground">
              ou continue com email
            </span>
          </div>
        </div>

        {/* Email Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-14 text-base border-2 focus:border-primary"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground font-medium">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-14 text-base border-2 focus:border-primary"
              minLength={6}
              required
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full h-14 text-base font-semibold mt-6"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <Mail className="w-5 h-5 mr-2" />
            )}
            {isLogin ? "Entrar" : "Criar conta"}
          </Button>
        </form>

        {/* Toggle Login/Signup */}
        <p className="text-center text-muted-foreground mt-6">
          {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary font-semibold hover:underline"
          >
            {isLogin ? "Criar conta" : "Entrar"}
          </button>
        </p>

        {/* Terms */}
        <p className="text-center text-xs text-muted-foreground mt-8 px-4">
          Ao continuar, você concorda com nossos{" "}
          <span className="underline">Termos de Serviço</span> e{" "}
          <span className="underline">Política de Privacidade</span>.
        </p>
      </AppContent>
    </AppShell>
  );
};

export default Auth;
