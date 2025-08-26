import { useEffect, useState } from 'react';

interface CopyrightWatermarkProps {
  className?: string;
  variant?: 'subtle' | 'visible';
}

const CopyrightWatermark = ({ 
  className = '', 
  variant = 'subtle' 
}: CopyrightWatermarkProps) => {
  const [currentYear] = useState(new Date().getFullYear());
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show watermark periodically for copyright protection
    const interval = setInterval(() => {
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 3000);
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const baseClasses = "pointer-events-none select-none transition-opacity duration-500";
  const variantClasses = {
    subtle: "text-muted-foreground/10 text-xs",
    visible: "text-muted-foreground/30 text-sm font-medium"
  };

  return (
    <div 
      className={`
        ${baseClasses} 
        ${variantClasses[variant]} 
        ${isVisible ? 'opacity-100' : 'opacity-0'} 
        ${className}
      `}
      aria-hidden="true"
    >
      © {currentYear} B.E.E App Bahamas
    </div>
  );
};

export default CopyrightWatermark;