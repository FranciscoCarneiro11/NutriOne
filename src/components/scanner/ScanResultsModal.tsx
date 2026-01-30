import React, { useState } from "react";
import { X, Plus, Flame, Beef, Wheat, Droplets } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FoodAnalysisResult } from "@/services/foodScanner";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface ScanResultsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: FoodAnalysisResult | null;
  imageUrl: string | null;
  onMealAdded: () => void;
}

const mealTypes = [
  { value: "breakfast", label: "Café da manhã" },
  { value: "lunch", label: "Almoço" },
  { value: "dinner", label: "Jantar" },
  { value: "snack", label: "Lanche" },
];

export const ScanResultsModal: React.FC<ScanResultsModalProps> = ({
  open,
  onOpenChange,
  result,
  imageUrl,
  onMealAdded,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mealName, setMealName] = useState("");
  const [mealType, setMealType] = useState("lunch");

  const handleClose = () => {
    setShowAddForm(false);
    setMealName("");
    setMealType("lunch");
    onOpenChange(false);
  };

  const handleAddToMenu = async () => {
    if (!result) return;

    if (!mealName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, insira um nome para a refeição",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para adicionar refeições",
          variant: "destructive",
        });
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      const currentTime = new Date().toTimeString().slice(0, 5);

      const { error } = await supabase.from("meals").insert({
        user_id: user.id,
        date: today,
        title: mealName.trim(),
        meal_type: mealType,
        calories: result.calories,
        protein: result.protein,
        carbs: result.carbs,
        fat: result.fat,
        time: currentTime,
        items: result.items,
      });

      if (error) {
        console.error("Error adding meal:", error);
        toast({
          title: "Erro",
          description: "Não foi possível adicionar a refeição",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sucesso!",
        description: "Refeição adicionada ao seu menu",
      });

      onMealAdded();
      handleClose();
    } catch (err) {
      console.error("Failed to add meal:", err);
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!result) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-0 max-h-[90vh] overflow-y-auto">
        {/* Header with close button */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-background border-b">
          <h2 className="text-lg font-semibold">Análise Nutricional</h2>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={handleClose}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Scanned Image */}
        {imageUrl && (
          <div className="w-full aspect-video bg-black">
            <img
              src={imageUrl}
              alt="Prato escaneado"
              className="w-full h-full object-contain"
            />
          </div>
        )}

        {/* Nutritional Summary */}
        <div className="p-4 space-y-4">
          {/* Macro Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-orange-500/10 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{result.calories}</p>
                <p className="text-xs text-muted-foreground">kcal</p>
              </div>
            </div>

            <div className="bg-red-500/10 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <Beef className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{result.protein}g</p>
                <p className="text-xs text-muted-foreground">Proteína</p>
              </div>
            </div>

            <div className="bg-amber-500/10 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Wheat className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{result.carbs}g</p>
                <p className="text-xs text-muted-foreground">Carboidratos</p>
              </div>
            </div>

            <div className="bg-blue-500/10 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Droplets className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{result.fat}g</p>
                <p className="text-xs text-muted-foreground">Gordura</p>
              </div>
            </div>
          </div>

          {/* Identified Foods */}
          {result.items && result.items.length > 0 && (
            <div className="bg-muted/50 rounded-xl p-4">
              <p className="text-sm font-medium mb-2">Alimentos identificados:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                {result.items.map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground text-center">
            Os valores são estimativas baseadas em análise visual.
          </p>

          {/* Add to Menu Form */}
          {showAddForm ? (
            <div className="space-y-4 pt-2 border-t">
              <div>
                <Label htmlFor="mealName">Nome da refeição *</Label>
                <Input
                  id="mealName"
                  placeholder="Ex: Almoço de domingo"
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  autoFocus
                />
              </div>

              <div>
                <Label htmlFor="mealType">Tipo de refeição</Label>
                <Select value={mealType} onValueChange={setMealType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mealTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowAddForm(false)}
                  disabled={isSubmitting}
                >
                  Voltar
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleAddToMenu}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Salvando..." : "Adicionar"}
                </Button>
              </div>
            </div>
          ) : (
            <Button
              className="w-full gap-2"
              size="lg"
              onClick={() => setShowAddForm(true)}
            >
              <Plus className="w-5 h-5" />
              Adicionar ao Menu
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
