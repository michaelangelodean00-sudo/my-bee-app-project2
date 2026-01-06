import { useState, useCallback, ReactNode, MouseEvent } from "react";
import { cn } from "@/lib/utils";

interface RippleProps {
  children: ReactNode;
  className?: string;
  color?: string;
  disabled?: boolean;
  onClick?: () => void;
}

interface RippleEffect {
  x: number;
  y: number;
  id: number;
}

const Ripple = ({ 
  children, 
  className, 
  color = "hsl(var(--primary) / 0.3)",
  disabled = false,
  onClick 
}: RippleProps) => {
  const [ripples, setRipples] = useState<RippleEffect[]>([]);

  const handleClick = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (disabled) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples(prev => [...prev, { x, y, id }]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 600);

    onClick?.();
  }, [disabled, onClick]);

  return (
    <div
      className={cn(
        "relative overflow-hidden cursor-pointer",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
      onClick={handleClick}
    >
      {children}
      {ripples.map(({ x, y, id }) => (
        <span
          key={id}
          className="absolute rounded-full animate-scale-in pointer-events-none"
          style={{
            left: x,
            top: y,
            width: 200,
            height: 200,
            marginLeft: -100,
            marginTop: -100,
            background: color,
            animation: "scale-in 0.6s ease-out forwards",
            opacity: 0.4
          }}
        />
      ))}
    </div>
  );
};

export default Ripple;
