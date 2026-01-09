import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, Star, Dumbbell, TrendingUp, Target, Flame } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";

const testimonials = {
  pt: [
    { text: "Perdi 5kg em apenas 3 semanas sem passar fome! O plano adapta-se mesmo à minha rotina.", name: "Sofia M." },
    { text: "Finalmente consegui organizar as minhas macros. A NutriOne mudou completamente o meu treino.", name: "Tiago R." },
    { text: "A melhor app de nutrição que já usei. Simples, direta e os resultados aparecem.", name: "Ana P." },
    { text: "Sinto-me com muito mais energia durante o dia. Recomendo a toda a gente!", name: "Pedro S." },
    { text: "O acompanhamento diário faz toda a diferença. Nunca foi tão fácil ser saudável.", name: "Beatriz L." }
  ],
  en: [
    { text: "I lost 5kg in just 3 weeks without starving! The plan really adapts to my routine.", name: "Sophie M." },
    { text: "I finally managed to organize my macros. NutriOne completely changed my training.", name: "James R." },
    { text: "The best nutrition app I've ever used. Simple, direct, and the results show.", name: "Anna P." },
    { text: "I feel so much more energetic during the day. I recommend it to everyone!", name: "Peter S." },
    { text: "The daily tracking makes all the difference. It's never been easier to be healthy.", name: "Beth L." }
  ],
  es: [
    { text: "¡Perdí 5kg en solo 3 semanas sin pasar hambre! El plan realmente se adapta a mi rutina.", name: "Sofía M." },
    { text: "Finalmente logré organizar mis macros. NutriOne cambió completamente mi entrenamiento.", name: "Diego R." },
    { text: "La mejor app de nutrición que he usado. Simple, directa y los resultados se notan.", name: "Ana P." },
    { text: "¡Me siento con mucha más energía durante el día. Lo recomiendo a todos!", name: "Pedro S." },
    { text: "El seguimiento diario hace toda la diferencia. Nunca fue tan fácil ser saludable.", name: "Beatriz L." }
  ]
};

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  const currentTestimonials = testimonials[language];

  const stats = [
    { icon: Users, value: "+1500k", label: t.welcome.stats.users },
    { icon: Star, value: "+1200k", label: t.welcome.stats.reviews },
    { icon: Dumbbell, value: "120+", label: t.welcome.stats.exercises },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col relative overflow-hidden">
      {/* Background Gradient Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-coral/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-coral/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Header with Language Selector */}
      <header className="absolute top-0 left-0 right-0 z-50 px-6 md:px-12 lg:px-16 py-4">
        <div className="flex justify-end max-w-7xl mx-auto">
          <LanguageSelector />
        </div>
      </header>
      
      {/* Content Container */}
      <div className="flex-1 flex flex-col relative z-10 max-w-7xl mx-auto w-full">
        {/* Hero Section */}
        <div className="flex-1 flex flex-col lg:flex-row lg:items-center lg:gap-12 px-6 md:px-12 lg:px-16 pt-16 lg:pt-0 pb-4">
          {/* Left Column - Text & Stats */}
          <div className="lg:flex-1 lg:max-w-xl">
            {/* Hero Typography */}
            <div className="text-center lg:text-left mb-6 lg:mb-10 animate-fade-in">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-tight mb-3 lg:mb-5">
                <span className="text-coral">{t.welcome.headline}</span> {t.welcome.headlineRest}<br />
                <span className="text-coral">NutriOne</span>.
              </h1>
              <p className="text-slate-400 text-sm sm:text-base lg:text-lg max-w-sm lg:max-w-lg mx-auto lg:mx-0 leading-relaxed">
                {t.welcome.subheadline}
              </p>
            </div>

            {/* Glass Stats Cards - Side by side on all screens */}
            <div className="flex gap-3 lg:gap-4 justify-center lg:justify-start mb-6 lg:mb-10 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="flex-1 max-w-[100px] lg:max-w-[140px] backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-3 lg:p-4 text-center"
                  style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                >
                  <stat.icon className="w-5 h-5 lg:w-6 lg:h-6 text-coral mx-auto mb-1.5" />
                  <p className="text-white font-bold text-lg lg:text-xl">{stat.value}</p>
                  <p className="text-slate-500 text-[10px] lg:text-xs uppercase tracking-wide">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* CTA Section - Desktop */}
            <div className="hidden lg:block animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Button
                variant="coral"
                size="xl"
                onClick={() => navigate("/onboarding")}
                className="shadow-[0_0_30px_hsl(30_100%_70%/0.4)] hover:shadow-[0_0_40px_hsl(30_100%_70%/0.6)] transition-shadow duration-300 min-w-[280px]"
              >
                {t.welcome.cta}
              </Button>
              
              <button
                type="button"
                onClick={() => navigate("/auth?login=true")}
                className="block text-slate-500 text-sm font-medium hover:text-slate-300 transition-colors mt-5"
              >
                {t.welcome.login} <span className="text-coral underline underline-offset-2">{t.welcome.loginLink}</span>
              </button>
            </div>
          </div>

          {/* Right Column - Phone Mockup */}
          <div className="flex-1 flex items-center justify-center mb-4 lg:mb-0">
            <div className="animate-float">
              {/* Phone Frame */}
              <div className="relative w-48 h-[300px] lg:w-64 lg:h-[400px] bg-gradient-to-b from-slate-800 to-slate-900 rounded-[2.5rem] lg:rounded-[3rem] p-2 lg:p-3 shadow-2xl border border-slate-700/50">
                {/* Phone Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 lg:w-24 h-6 lg:h-7 bg-slate-950 rounded-b-2xl" />
                
                {/* Screen Content */}
                <div className="w-full h-full bg-slate-950 rounded-[2rem] lg:rounded-[2.5rem] p-4 lg:p-6 flex flex-col items-center justify-center overflow-hidden relative">
                  {/* Glow Effect Inside */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 lg:w-40 h-32 lg:h-40 bg-coral/20 rounded-full blur-2xl" />
                  
                  {/* Progress Ring */}
                  <div className="relative w-24 h-24 lg:w-32 lg:h-32 mb-3 lg:mb-5">
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
                      <span className="text-xl lg:text-2xl font-bold text-white">75%</span>
                      <span className="text-[9px] lg:text-[11px] text-slate-500 uppercase">Meta</span>
                    </div>
                  </div>

                  {/* Mini Stats Row */}
                  <div className="flex gap-3 lg:gap-5 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 lg:w-9 lg:h-9 rounded-full bg-coral/20 flex items-center justify-center mb-1">
                        <Flame className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-coral" />
                      </div>
                      <span className="text-white text-[10px] lg:text-xs font-semibold">1,234</span>
                      <span className="text-slate-600 text-[7px] lg:text-[9px]">kcal</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 lg:w-9 lg:h-9 rounded-full bg-emerald-500/20 flex items-center justify-center mb-1">
                        <Target className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-emerald-400" />
                      </div>
                      <span className="text-white text-[10px] lg:text-xs font-semibold">5/6</span>
                      <span className="text-slate-600 text-[7px] lg:text-[9px]">meals</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 lg:w-9 lg:h-9 rounded-full bg-blue-500/20 flex items-center justify-center mb-1">
                        <TrendingUp className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-blue-400" />
                      </div>
                      <span className="text-white text-[10px] lg:text-xs font-semibold">+12%</span>
                      <span className="text-slate-600 text-[7px] lg:text-[9px]">streak</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Marquee */}
        <div className="relative z-10 overflow-hidden py-4 mb-2">
          <div className="flex animate-marquee">
            {[...currentTestimonials, ...currentTestimonials].map((testimonial, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-72 lg:w-80 mx-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4"
              >
                <div className="flex gap-0.5 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-coral text-coral" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm mb-3 leading-relaxed">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <p className="text-coral font-semibold text-sm">— {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section - Mobile Only */}
        <div className="lg:hidden px-6 pb-8 relative z-10 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <Button
            variant="coral"
            size="xl"
            fullWidth
            onClick={() => navigate("/onboarding")}
            className="shadow-[0_0_30px_hsl(30_100%_70%/0.4)] hover:shadow-[0_0_40px_hsl(30_100%_70%/0.6)] transition-shadow duration-300"
          >
            {t.welcome.cta}
          </Button>
          
          <button
            type="button"
            onClick={() => navigate("/auth?login=true")}
            className="w-full text-center text-slate-500 text-sm font-medium hover:text-slate-300 transition-colors mt-5"
          >
            {t.welcome.login} <span className="text-coral underline underline-offset-2">{t.welcome.loginLink}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
