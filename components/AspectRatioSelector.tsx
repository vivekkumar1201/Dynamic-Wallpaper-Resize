import React from 'react';
import { AspectRatio } from '../types';
import { Smartphone, Monitor, Square, Tv, Tablet } from 'lucide-react';

interface AspectRatioSelectorProps {
  selectedRatio: AspectRatio;
  onSelect: (ratio: AspectRatio) => void;
  disabled?: boolean;
}

const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ selectedRatio, onSelect, disabled }) => {
  
  const options = [
    { value: AspectRatio.SQUARE, label: '1:1', icon: <Square size={18} />, desc: 'Square' },
    { value: AspectRatio.PORTRAIT_4_3, label: '3:4', icon: <Tablet size={18} />, desc: 'Portrait' },
    { value: AspectRatio.LANDSCAPE_4_3, label: '4:3', icon: <Monitor size={18} />, desc: 'Standard' },
    { value: AspectRatio.PORTRAIT_16_9, label: '9:16', icon: <Smartphone size={18} />, desc: 'Mobile' },
    { value: AspectRatio.LANDSCAPE_16_9, label: '16:9', icon: <Tv size={18} />, desc: 'Wallpaper' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onSelect(option.value)}
          disabled={disabled}
          className={`
            flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200
            ${selectedRatio === option.value 
              ? 'border-yellow-500 bg-yellow-500/10 text-yellow-400 shadow-sm shadow-yellow-500/20' 
              : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-800'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <div className="mb-2">{option.icon}</div>
          <span className="text-xs font-semibold">{option.label}</span>
          <span className="text-[10px] text-zinc-500 mt-0.5">{option.desc}</span>
        </button>
      ))}
    </div>
  );
};

export default AspectRatioSelector;