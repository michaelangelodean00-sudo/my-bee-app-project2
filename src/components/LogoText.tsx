
import React from 'react';

interface LogoTextProps {
  className?: string;
}

const LogoText = ({ className }: LogoTextProps) => {
  return (
    <span className={`font-bold text-bee-blue sm:hidden font-bebas-neue ${className ?? 'text-4xl'}`}>
      B.E.E App
    </span>
  );
};

export default LogoText;
