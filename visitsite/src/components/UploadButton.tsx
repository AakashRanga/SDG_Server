import React from 'react';
import { BoxIcon } from 'lucide-react';
interface UploadButtonProps {
  title: string;
  icon: BoxIcon;
  colorGradient: string;
  onClick: () => void;
}
export function UploadButton({
  title,
  icon: Icon,
  colorGradient,
  onClick
}: UploadButtonProps) {
  return <button onClick={onClick} className={`relative group w-full bg-gradient-to-b ${colorGradient} rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden border-2 border-white/20`} style={{
    boxShadow: '0 6px 12px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(0,0,0,0.2)'
  }}>
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/20 pointer-events-none" />
      <div className="relative px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 flex flex-col items-center justify-center space-y-2 sm:space-y-3">
        <div className="bg-white/20 rounded-full p-2 sm:p-3 md:p-4 shadow-inner backdrop-blur-sm" style={{
        boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.2)'
      }}>
          <Icon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white drop-shadow-lg" strokeWidth={2} />
        </div>
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-white text-center leading-tight px-1" style={{
        textShadow: '0 2px 4px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.2)'
      }}>
          {title}
        </h3>
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </button>;
}