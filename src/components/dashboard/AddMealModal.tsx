import React, { useState, useEffect } from "react";
import { Barcode, Plus } from "lucide-react";
import { z } from "zod";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface MealPrefillData {
  title: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  items: string[];
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
}

interface AddMealModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMealAdded: () => void;
  prefillData?: MealPrefillData | null;
}

const mealTypes = [
  { value: "breakfast", label: "Café da manhã" },
  { value: "lunch", label: "Almoço" },
  { value: "dinner", label: "Jantar" },
  { value: "snack", label: "Lanche" },
];

// Validation schema for meal form
const mealSchema = z.object({
  title: z.string()
    .trim()
    .min(1, "Por favor, insira o nome da refeição")
    .max(200, "O nome da refeição deve ter no máximo 200 caracteres"),
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]),
  calories: z.number().min(0, "Calorias não pode ser negativo").max(99999, "Valor de calorias muito alto"),
  protein: z.number().min(0, "Proteína não pode ser negativo").max(9999, "Valor de proteína muito alto"),
  carbs: z.number().min(0, "Carboidratos não pode ser negativo").max(9999, "Valor de carboidratos muito alto"),
  fat: z.number().min(0, "Gordura não pode ser negativo").max(9999, "Valor de gordura muito alto"),
  time: z.string().optional(),
});

export const AddMealModal: React.FC<AddMealModalProps> = ({
  open,
  onOpenChange,
  onMealAdded,
  prefillData,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    mealType: "breakfast",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    time: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle prefill data from scanner
  useEffect(() => {
    if (prefillData && open) {
      setFormData({
        title: prefillData.title,
        mealType: prefillData.mealType,
        calories: prefillData.calories.toString(),
        protein: prefillData.protein.toString(),
        carbs: prefillData.carbs.toString(),
        fat: prefillData.fat.toString(),
        time: new Date().toTimeString().slice(0, 5), // Current time
      });
    }
  }, [prefillData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Parse and validate form data
    const parsedData = {
      title: formData.title,
      mealType: formData.mealType as "breakfast" | "lunch" | "dinner" | "snack",
      calories: parseFloat(formData.calories) || 0,
      protein: parseFloat(formData.protein) || 0,
      carbs: parseFloat(formData.carbs) || 0,
      fat: parseFloat(formData.fat) || 0,
      time: formData.time || undefined,
    };

    const result = mealSchema.safeParse(parsedData);
    
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      
      // Show first error as toast
      const firstError = result.error.errors[0];
      toast({
        title: "Erro de validação",
        description: firstError.message,
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

      const { error } = await supabase.from("meals").insert({
        user_id: user.id,
        date: today,
        title: formData.title.trim(),
        meal_type: formData.mealType,
        calories: parseInt(formData.calories) || 0,
        protein: parseFloat(formData.protein) || 0,
        carbs: parseFloat(formData.carbs) || 0,
        fat: parseFloat(formData.fat) || 0,
        time: formData.time || null,
        items: [formData.title.trim()],
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
        title: "Sucesso",
        description: "Refeição adicionada com sucesso!",
      });

      // Reset form
      setFormData({
        title: "",
        mealType: "breakfast",
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
        time: "",
      });

      onMealAdded();
      onOpenChange(false);
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

  const handleBarcodeScan = () => {
    // Placeholder for future barcode scanner integration
    toast({
      title: "Em breve",
      description: "O scanner de código de barras estará disponível em breve!",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Adicionar Refeição
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Barcode Scanner Button - For future implementation */}
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center gap-2"
            onClick={handleBarcodeScan}
          >
            <Barcode className="w-5 h-5" />
            Escanear Código de Barras
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                ou insira manualmente
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="title">Nome da refeição *</Label>
              <Input
                id="title"
                placeholder="Ex: Frango grelhado com arroz"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="mealType">Tipo</Label>
                <Select
                  value={formData.mealType}
                  onValueChange={(value) => setFormData({ ...formData, mealType: value })}
                >
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

              <div>
                <Label htmlFor="time">Horário</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="calories">Calorias (kcal)</Label>
                <Input
                  id="calories"
                  type="number"
                  placeholder="0"
                  min="0"
                  value={formData.calories}
                  onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="protein">Proteína (g)</Label>
                <Input
                  id="protein"
                  type="number"
                  placeholder="0"
                  min="0"
                  step="0.1"
                  value={formData.protein}
                  onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="carbs">Carboidratos (g)</Label>
                <Input
                  id="carbs"
                  type="number"
                  placeholder="0"
                  min="0"
                  step="0.1"
                  value={formData.carbs}
                  onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="fat">Gordura (g)</Label>
                <Input
                  id="fat"
                  type="number"
                  placeholder="0"
                  min="0"
                  step="0.1"
                  value={formData.fat}
                  onChange={(e) => setFormData({ ...formData, fat: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Adicionar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
