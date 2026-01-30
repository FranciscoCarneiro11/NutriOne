import React, { useState, useRef, useEffect } from "react";
import { Camera, X, Loader2, Sparkles, ImageIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { analyzeFoodImage, FoodAnalysisResult } from "@/services/foodScanner";
import { toast } from "@/hooks/use-toast";

interface FoodScannerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAnalysisComplete: (result: FoodAnalysisResult, imageUrl: string) => void;
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

  // Auto-trigger camera when modal opens
  useEffect(() => {
    if (open && !selectedImage) {
      // Small delay to ensure modal is fully rendered
      const timer = setTimeout(() => {
        cameraInputRef.current?.click();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open, selectedImage]);

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
        description: "Veja os resultados nutricionais",
      });
      // Pass the image URL along with the result
      onAnalysisComplete(result, selectedImage!);
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
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-0">
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

        {/* Full-screen camera-style layout */}
        <div className="relative min-h-[70vh] bg-black flex flex-col">
          {/* Top bar with close and gallery buttons */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-white bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full"
              onClick={handleClose}
            >
              <X className="w-5 h-5" />
            </Button>
            
            {/* Gallery button - top right */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full"
              onClick={triggerGalleryInput}
            >
              <ImageIcon className="w-5 h-5" />
            </Button>
          </div>

          {/* Image Preview or Camera View Area */}
          <div className="flex-1 flex items-center justify-center">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Preview"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 text-white/70">
                <div className="w-20 h-20 rounded-full border-2 border-white/30 flex items-center justify-center">
                  <Camera className="w-10 h-10" />
                </div>
                <p className="text-sm">Aponte para o alimento</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 bg-white/10 border-white/30 text-white hover:bg-white/20"
                  onClick={triggerCameraInput}
                >
                  Abrir Câmera
                </Button>
              </div>
            )}
          </div>

          {/* Bottom action area */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            {selectedImage ? (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 bg-white/10 border-white/30 text-white hover:bg-white/20"
                  onClick={() => {
                    setSelectedImage(null);
                    setSelectedFile(null);
                    triggerCameraInput();
                  }}
                  disabled={isAnalyzing}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Nova Foto
                </Button>
                <Button
                  className="flex-1 gap-2"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analisando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Analisar
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <p className="text-xs text-center text-white/60">
                Tire uma foto ou escolha da galeria (ícone no canto superior direito)
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
