/**
 * Image optimization utilities for automatic quality enhancement
 */

export interface OptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  targetFormat?: 'webp' | 'jpeg' | 'png';
}

const DEFAULT_OPTIONS: OptimizationOptions = {
  maxWidth: 1920,
  maxHeight: 1920,
  quality: 0.92, // High quality
  targetFormat: 'webp'
};

/**
 * Optimizes an image file by compressing and enhancing quality
 * @param file - The original image file
 * @param options - Optimization options
 * @returns Promise with the optimized file
 */
export const optimizeImage = async (
  file: File,
  options: OptimizationOptions = {}
): Promise<File> => {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { alpha: true });

    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    img.onload = () => {
      try {
        // Calculate new dimensions while maintaining aspect ratio
        let { width, height } = img;
        const aspectRatio = width / height;

        if (width > opts.maxWidth! || height > opts.maxHeight!) {
          if (width > height) {
            width = opts.maxWidth!;
            height = width / aspectRatio;
          } else {
            height = opts.maxHeight!;
            width = height * aspectRatio;
          }
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Enable image smoothing for better quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw image with high quality
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob with specified format and quality
        const mimeType = `image/${opts.targetFormat}`;
        
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to optimize image'));
              return;
            }

            // Create optimized file
            const optimizedFile = new File(
              [blob],
              file.name.replace(/\.[^.]+$/, `.${opts.targetFormat}`),
              { type: mimeType }
            );

            resolve(optimizedFile);
          },
          mimeType,
          opts.quality
        );
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    // Load the image
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Checks if image needs optimization
 */
export const shouldOptimize = (file: File): boolean => {
  // Optimize if file is larger than 500KB or not in WebP format
  return file.size > 500 * 1024 || !file.type.includes('webp');
};

/**
 * Gets file size reduction percentage
 */
export const getSizeReduction = (originalSize: number, newSize: number): number => {
  return Math.round(((originalSize - newSize) / originalSize) * 100);
};
