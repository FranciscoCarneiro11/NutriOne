import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, Star, Dumbbell, TrendingUp, Target, Flame } from "lucide-react";

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    { icon: Users, value: "+1500k", label: "Usuários" },
    { icon: Star, value: "1200k+", label: "Avaliações 5★" },
    { icon: Dumbbell, value: "2000+", label: "Exercícios" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col relative overflow-hidden">
      {/* Background Gradient Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-coral/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-coral/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Content */}
      <div className="flex-1 flex flex-col px-6 pt-12 pb-8 relative z-10">
        {/* Hero Typography */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-extrabold text-white leading-tight mb-3">
            Transform Your<br />
            <span className="text-coral">Body & Mind</span>
          </h1>
          <p className="text-slate-400 text-base max-w-xs mx-auto">
            AI-powered plans tailored to your unique biology.
          </p>
        </div>

        {/* Glass Stats Cards */}
        <div className="flex gap-3 justify-center mb-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="flex-1 max-w-[100px] backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-3 text-center"
              style={{ animationDelay: `${0.1 + index * 0.1}s` }}
            >
              <stat.icon className="w-5 h-5 text-coral mx-auto mb-1.5" />
              <p className="text-white font-bold text-lg">{stat.value}</p>
              <p className="text-slate-500 text-[10px] uppercase tracking-wide">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Phone Mockup */}
        <div className="flex-1 flex items-center justify-center mb-6">
          <div className="animate-float">
            {/* Phone Frame */}
            <div className="relative w-52 h-[340px] bg-gradient-to-b from-slate-800 to-slate-900 rounded-[2.5rem] p-2 shadow-2xl border border-slate-700/50">
              {/* Phone Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-6 bg-slate-950 rounded-b-2xl" />
              
              {/* Screen Content */}
              <div className="w-full h-full bg-slate-950 rounded-[2rem] p-4 flex flex-col items-center justify-center overflow-hidden relative">
                {/* Glow Effect Inside */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-coral/20 rounded-full blur-2xl" />
                
                {/* Progress Ring */}
                <div className="relative w-28 h-28 mb-4">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    {/* Background Circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-slate-800"
                    />
                    {/* Progress Circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray="264"
                      strokeDashoffset="66"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="hsl(30 100% 70%)" />
                        <stop offset="100%" stopColor="hsl(30 90% 55%)" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-white">75%</span>
                    <span className="text-[10px] text-slate-500 uppercase">Meta</span>
                  </div>
                </div>

                {/* Mini Stats Row */}
                <div className="flex gap-4 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-coral/20 flex items-center justify-center mb-1">
                      <Flame className="w-4 h-4 text-coral" />
                    </div>
                    <span className="text-white text-xs font-semibold">1,234</span>
                    <span className="text-slate-600 text-[8px]">kcal</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center mb-1">
                      <Target className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-white text-xs font-semibold">5/6</span>
                    <span className="text-slate-600 text-[8px]">meals</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mb-1">
                      <TrendingUp className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-white text-xs font-semibold">+12%</span>
                    <span className="text-slate-600 text-[8px]">streak</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-6 pb-8 relative z-10 animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <Button
          variant="coral"
          size="xl"
          fullWidth
          onClick={() => navigate("/onboarding")}
          className="shadow-[0_0_30px_hsl(30_100%_70%/0.4)] hover:shadow-[0_0_40px_hsl(30_100%_70%/0.6)] transition-shadow duration-300"
        >
          Começar Agora
        </Button>
        
        <button
          type="button"
          onClick={() => navigate("/auth?login=true")}
          className="w-full text-center text-slate-500 text-sm font-medium hover:text-slate-300 transition-colors mt-5"
        >
          Já tem uma conta? <span className="text-coral underline underline-offset-2">Entrar</span>
        </button>
      </div>
    </div>
  );
};

export default Welcome;
