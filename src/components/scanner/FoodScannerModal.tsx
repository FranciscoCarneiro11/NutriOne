import React, { useState, useRef } from "react";
import { Camera, X, Loader2, Sparkles, ImageIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { analyzeFoodImage, FoodAnalysisResult } from "@/services/foodScanner";
import { toast } from "@/hooks/use-toast";

interface FoodScannerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAnalysisComplete: (result: FoodAnalysisResult) => void;
}

export const FoodScannerModal: React.FC<FoodScannerModalProps> = ({
  open,
  onOpenChange,
  onAnalysisComplete,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Formato inválido",
          description: "Por favor, selecione uma imagem",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    try {
      const result = await analyzeFoodImage(selectedFile);
      toast({
        title: "Análise concluída!",
        description: `Detectado: ${result.title}`,
      });
      onAnalysisComplete(result);
      handleClose();
    } catch (error) {
      toast({
        title: "Erro na análise",
        description: "Não foi possível analisar a imagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClose = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    setIsAnalyzing(false);
    onOpenChange(false);
  };

  const triggerCameraInput = () => {
    cameraInputRef.current?.click();
  };

  const triggerGalleryInput = () => {
    galleryInputRef.current?.click();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary" />
            Scanner de Alimentos
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Hidden file inputs */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Image Preview or Upload Area */}
          {selectedImage ? (
            <div className="relative">
              <img
                src={selectedImage}
                alt="Preview"
                className="w-full h-64 object-cover rounded-xl"
              />
              <Button
                variant="outline"
                size="icon"
                className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
                onClick={() => {
                  setSelectedImage(null);
                  setSelectedFile(null);
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={triggerCameraInput}
                className={cn(
                  "h-40 border-2 border-dashed border-border rounded-xl",
                  "flex flex-col items-center justify-center gap-3",
                  "bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                )}
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Camera className="w-7 h-7 text-primary" />
                </div>
                <p className="font-medium text-foreground text-sm">Câmera</p>
              </button>
              <button
                onClick={triggerGalleryInput}
                className={cn(
                  "h-40 border-2 border-dashed border-border rounded-xl",
                  "flex flex-col items-center justify-center gap-3",
                  "bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                )}
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <ImageIcon className="w-7 h-7 text-primary" />
                </div>
                <p className="font-medium text-foreground text-sm">Galeria</p>
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleClose}
              disabled={isAnalyzing}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1 gap-2"
              onClick={handleAnalyze}
              disabled={!selectedImage || isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analisando...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Analisar Alimento
                </>
              )}
            </Button>
          </div>

          {/* AI Info */}
          <p className="text-xs text-center text-muted-foreground">
            A IA irá identificar os alimentos e estimar os valores nutricionais
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
