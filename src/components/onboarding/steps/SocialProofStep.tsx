import React from "react";
import { Star } from "lucide-react";
interface SocialProofStepProps {
  appName: string;
}
export const SocialProofStep: React.FC<SocialProofStepProps> = ({
  appName
}) => {
  return <div className="flex flex-col items-center text-center">
      {/* Header */}
      <h1 className="text-3xl font-bold text-foreground mb-6 self-start text-left">
        Avalie-nos
      </h1>

      {/* Rating Badge */}
      <div className="bg-amber-50 rounded-2xl px-6 py-4 flex items-center gap-3 mb-8">
        <span className="text-amber-500 text-2xl">🏆</span>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-foreground">4.8</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
            </div>
          </div>
          <span className="text-sm text-muted-foreground">2K+ Avaliações do App</span>
        </div>
        <span className="text-amber-500 text-2xl">🏆</span>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-foreground mb-6">
        {appName} foi feito para pessoas como você
      </h2>

      {/* Avatar Stack */}
      <div className="flex items-center justify-center mb-2">
        <div className="flex -space-x-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-3 border-background flex items-center justify-center text-white font-semibold text-lg">
            M
          </div>
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 border-3 border-background flex items-center justify-center text-white font-semibold text-lg">
            A
          </div>
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 border-3 border-background flex items-center justify-center text-white font-semibold text-lg">
            J
          </div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-8">3k+ Usuários do {appName}</p>

      {/* Testimonial Card */}
      <div className="w-full bg-background border border-border rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white font-semibold">
            JS
          </div>
          <div className="flex flex-col items-start">
            <span className="font-semibold text-foreground">Jake Sullivan</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
            </div>
          </div>
        </div>
        <p className="text-left text-foreground/80 leading-relaxed">
          Perdi 6,8 kg em 2 meses! Eu estava prestes a desistir, mas decidi testar este app e funcionou :)
        </p>
      </div>
    </div>;
};