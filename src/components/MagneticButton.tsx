import { useRef, useEffect, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  onClick?: () => void;
  magnetic?: boolean;
}

const MagneticButton = ({ 
  children, 
  className, 
  variant = "default",
  size = "default",
  onClick,
  magnetic = true,
  ...props 
}: MagneticButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!magnetic || !buttonRef.current) return;

    const button = buttonRef.current;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const distance = Math.sqrt(x * x + y * y);
      const maxDistance = 50;
      
      if (distance < maxDistance) {
        const force = (maxDistance - distance) / maxDistance;
        const moveX = (x / distance) * force * 8;
        const moveY = (y / distance) * force * 8;
        
        button.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
      }
    };

    const handleMouseLeave = () => {
      button.style.transform = 'translate(0px, 0px) scale(1)';
    };

    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [magnetic]);

  return (
    <Button
      ref={buttonRef}
      variant={variant}
      size={size}
      className={cn(
        "transition-all duration-300 ease-out relative overflow-hidden",
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/20 before:to-secondary/20",
        "before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-500",
        "after:absolute after:inset-0 after:bg-white/10 after:rounded-full after:scale-0",
        "hover:after:scale-100 after:transition-transform after:duration-300",
        className
      )}
      onClick={onClick}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </Button>
  );
};

export default MagneticButton;