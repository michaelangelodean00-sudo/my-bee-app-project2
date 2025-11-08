import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, CheckCircle2, AlertCircle, Info, Zap } from "lucide-react";
import { validateAdImage, AD_IMAGE_STANDARDS, getFileSizeDisplay } from "@/utils/adImageValidation";
import { optimizeImage, shouldOptimize, getSizeReduction } from "@/utils/imageOptimization";

interface AdImageUploadProps {
  onImageSelect: (file: File) => void;
  selectedImage?: File | null;
}

export const AdImageUpload = ({ onImageSelect, selectedImage }: AdImageUploadProps) => {
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    error?: string;
    warning?: string;
    standard?: any;
  } | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationInfo, setOptimizationInfo] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsOptimizing(true);
    setOptimizationInfo("");

    try {
      let finalFile = file;
      
      // Optimize image if needed (no flickering - happens before display)
      if (shouldOptimize(file)) {
        const originalSize = file.size;
        finalFile = await optimizeImage(file);
        const reduction = getSizeReduction(originalSize, finalFile.size);
        setOptimizationInfo(`✨ Optimized: ${reduction}% smaller, enhanced quality`);
      }

      // Validate optimized image
      const result = await validateAdImage(finalFile);
      setValidationResult(result);

      if (result.isValid) {
        onImageSelect(finalFile);
        // Create preview from optimized file (prevents flickering)
        setPreview(URL.createObjectURL(finalFile));
      }
    } catch (error) {
      setValidationResult({
        isValid: false,
        error: "Failed to process image. Please try another file."
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Image Standards Guide */}
      <div className="bg-muted/50 p-4 rounded-lg space-y-3">
        <h4 className="font-semibold text-sm flex items-center gap-2">
          <Info className="h-4 w-4" />
          Choose Your Ad Size:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {AD_IMAGE_STANDARDS.map((standard) => (
            <div key={standard.name} className="bg-background p-3 rounded-md border">
              <div className="text-2xl mb-1">{standard.icon}</div>
              <div className="font-semibold text-sm">{standard.name}</div>
              <div className="text-xs text-muted-foreground">{standard.ratio}</div>
              <div className="text-xs text-muted-foreground mt-1">{standard.description}</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Maximum file size: 2MB • Formats: JPG, PNG, WebP
        </p>
      </div>

      {/* Upload Button */}
      <div className="flex flex-col items-center gap-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-24"
          disabled={isOptimizing}
        >
          {isOptimizing ? (
            <>
              <Zap className="mr-2 h-5 w-5 animate-pulse" />
              Optimizing...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-5 w-5" />
              {selectedImage ? "Change Image" : "Upload Ad Image"}
            </>
          )}
        </Button>
      </div>

      {/* Preview */}
      {preview && validationResult?.isValid && (
        <div className="space-y-2">
          <div className="relative rounded-lg overflow-hidden border">
            <img src={preview} alt="Ad preview" className="w-full h-auto" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <span className="font-medium">
                  {validationResult.standard?.name} ({validationResult.standard?.ratio})
                </span>
              </div>
              <span className="text-muted-foreground">
                {selectedImage && getFileSizeDisplay(selectedImage.size)}
              </span>
            </div>
            {optimizationInfo && (
              <div className="flex items-center gap-2 text-xs text-primary animate-fade-in">
                <Zap className="h-3 w-3" />
                {optimizationInfo}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Validation Messages */}
      {validationResult?.warning && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{validationResult.warning}</AlertDescription>
        </Alert>
      )}

      {validationResult?.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{validationResult.error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};
