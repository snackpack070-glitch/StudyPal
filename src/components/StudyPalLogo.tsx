import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export default function StudyPalLogo({
  size = 'md',
  showText = true,
  className = ''
}: LogoProps) {
  // Scaled 15% larger from original dimensions
  const sizeClasses = {
    sm: 'w-[32px] h-[32px]',
    md: 'w-[42px] h-[42px] sm:w-[46px] sm:h-[46px]',
    lg: 'w-[55px] h-[55px]',
    xl: 'w-[74px] h-[74px]'
  };

  const textSizes = {
    sm: 'text-[21px] leading-none',
    md: 'text-[27px] sm:text-[28px] leading-none',
    lg: 'text-[35px] leading-none',
    xl: 'text-[42px] leading-none'
  };

  return (
    <div className={`flex items-center space-x-3 select-none ${className}`}>
      {/* Photo Logo with rounded corners, gold border accent, and subtle shadow */}
      <div 
        className={`${sizeClasses[size]} relative rounded-xl overflow-hidden border-2 border-yellow-400 dark:border-yellow-300 shadow-md flex-shrink-0 group bg-slate-900`}
        title="StudyPal - Your AI Study Coach"
      >
        <img
          src="/images/studypal-logo.jpg"
          alt="StudyPal Library Logo"
          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
          loading="eager"
        />
        {/* Subtle glass gloss highlight overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-950/20 via-transparent to-white/20 pointer-events-none" />
      </div>

      {showText && (
        <span className={`font-black tracking-tight text-blue-950 dark:text-yellow-400 ${textSizes[size]}`}>
          StudyPal
        </span>
      )}
    </div>
  );
}
