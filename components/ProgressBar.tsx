import React from 'react';
import { X } from 'lucide-react';

interface ProgressBarProps {
  current: number;
  total: number;
  onExit: () => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, onExit }) => {
  const percentage = Math.min(100, (current / total) * 100);

  return (
    <div className="flex items-center gap-4 w-full max-w-2xl mx-auto mb-6 px-4">
      <button 
        onClick={onExit}
        className="text-duo-gray-dark hover:bg-gray-100 p-2 rounded-full transition-colors"
        aria-label="Exit"
      >
        <X size={24} strokeWidth={2.5} />
      </button>
      
      <div className="flex-1 h-4 bg-duo-gray rounded-full overflow-hidden relative">
        <div 
          className="absolute top-0 left-0 h-full bg-duo-green transition-all duration-500 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
        >
          {/* Shine effect on bar */}
          <div className="absolute top-1 right-2 w-1/3 h-1 bg-white/20 rounded-full" />
        </div>
      </div>
      
      <span className="font-bold text-duo-green-dark text-sm whitespace-nowrap">
        {current} / {total}
      </span>
    </div>
  );
};

export default ProgressBar;