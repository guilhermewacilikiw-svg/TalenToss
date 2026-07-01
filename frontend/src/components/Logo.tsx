import React from 'react';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function Logo({ className = "", width = 160, height = 45 }: LogoProps) {
  return (
    <div className={`flex items-center justify-center ${className}`} style={{ width, height }}>
      <svg 
        viewBox="0 0 260 56" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Left Person (Lighter Blue) */}
        <circle cx="18" cy="14" r="6" fill="#60A5FA" />
        <path d="M 8 26 H 26 V 34 H 30 V 52 C 30 54 28 56 26 56 H 12 C 10 56 8 54 8 52 Z" fill="#60A5FA" />
        
        {/* Right Person (Darker Blue) */}
        <circle cx="46" cy="14" r="6" fill="#3B82F6" />
        <path d="M 56 26 H 38 V 34 H 34 V 52 C 34 54 36 56 38 56 H 52 C 54 56 56 54 56 52 Z" fill="#3B82F6" />

        {/* Text */}
        <text 
          x="70" 
          y="44" 
          fontFamily="system-ui, -apple-system, sans-serif" 
          fontSize="34" 
          fontWeight="800" 
          fill="#111827"
          letterSpacing="-0.03em"
        >
          TalenToss
        </text>
      </svg>
    </div>
  );
}
