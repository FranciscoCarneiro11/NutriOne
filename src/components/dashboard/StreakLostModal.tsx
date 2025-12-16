import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Flame, HeartCrack, Zap } from "lucide-react";

interface StreakLostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  previousStreak: number;
}

export const StreakLostModal: React.FC<StreakLostModalProps> = ({
  open,
  onOpenChange,
  previousStreak,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm mx-auto text-center">
        <DialogHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center animate-pulse">
                <HeartCrack className="w-10 h-10 text-red-500" />
              </div>
              <div className="absolute -top-2 -right-2 bg-muted rounded-full p-2">
                <Flame className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>
          </div>
          
          <DialogTitle className="text-xl font-bold text-foreground">
            Ops! Você perdeu sua sequência
          </DialogTitle>
          
          <DialogDescription className="space-y-3">
            <p className="text-muted-foreground">
              Você estava com uma sequência de{" "}
              <span className="font-bold text-primary">{previousStreak} dias</span>!
            </p>
            
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-4 border border-primary/20">
              <div className="flex items-center gap-2 justify-center mb-2">
                <Zap className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">Não desista!</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Cada dia é uma nova chance de recomeçar. O mais importante é a consistência a longo prazo.
                Volte amanhã e comece uma nova sequência ainda maior!
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <p className="text-xs text-muted-foreground font-medium">💪 Lembre-se:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Pequenos passos levam a grandes resultados</li>
                <li>• A consistência supera a perfeição</li>
                <li>• Você já provou que consegue!</li>
              </ul>
            </div>
          </DialogDescription>
        </DialogHeader>

        <Button 
          onClick={() => onOpenChange(false)} 
          className="w-full mt-4"
        >
          <Flame className="w-4 h-4 mr-2" />
          Começar Nova Sequência
        </Button>
      </DialogContent>
    </Dialog>
  );
};
