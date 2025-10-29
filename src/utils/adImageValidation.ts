export interface AdImageStandard {
  name: string;
  ratio: string;
  width: number;
  height: number;
  description: string;
  icon: string;
}

export const AD_IMAGE_STANDARDS: AdImageStandard[] = [
  {
    name: "Square",
    ratio: "1:1",
    width: 1080,
    height: 1080,
    description: "Works everywhere - Most popular",
    icon: "⬜"
  },
  {
    name: "Landscape",
    ratio: "16:9",
    width: 1920,
    height: 1080,
    description: "Best for banners & featured ads",
    icon: "🖼️"
  },
  {
    name: "Portrait",
    ratio: "9:16",
    width: 1080,
    height: 1920,
    description: "Perfect for mobile screens",
    icon: "📱"
  }
];

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  warning?: string;
  standard?: AdImageStandard;
}

export const validateAdImage = async (file: File): Promise<ValidationResult> => {
  // Check file type
  if (!ALLOWED_FORMATS.includes(file.type)) {
    return {
      isValid: false,
      error: "Please use JPG, PNG, or WebP format"
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    const sizeMB = (file.size / 1024 / 1024).toFixed(1);
    return {
      isValid: false,
      error: `File too large (${sizeMB}MB). Maximum size is 2MB`
    };
  }

  // Check image dimensions
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const { width, height } = img;
      const aspectRatio = width / height;

      // Find matching standard (with tolerance)
      let matchedStandard: AdImageStandard | undefined;
      let warning: string | undefined;

      for (const standard of AD_IMAGE_STANDARDS) {
        const standardRatio = standard.width / standard.height;
        const ratioDiff = Math.abs(aspectRatio - standardRatio);

        if (ratioDiff < 0.1) { // Allow 10% tolerance
          matchedStandard = standard;
          
          // Check if dimensions are lower than recommended
          if (width < standard.width * 0.8 || height < standard.height * 0.8) {
            warning = `Image is smaller than recommended ${standard.width}x${standard.height}. Quality may be lower.`;
          }
          break;
        }
      }

      if (!matchedStandard) {
        resolve({
          isValid: false,
          error: `Image size ${width}x${height} doesn't match our standards. Please use Square (1:1), Landscape (16:9), or Portrait (9:16).`
        });
        return;
      }

      resolve({
        isValid: true,
        standard: matchedStandard,
        warning
      });
    };

    img.onerror = () => {
      resolve({
        isValid: false,
        error: "Unable to read image file"
      });
    };

    img.src = URL.createObjectURL(file);
  });
};

export const getFileSizeDisplay = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};
