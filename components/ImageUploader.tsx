import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  previewUrl: string | null;
  onImageSelected: (file: File, base64: string, mimeType: string) => void;
  onClear: () => void;
  disabled?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ previewUrl, onImageSelected, onClear, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Extract base64 data and mime type
      const base64Data = result.split(',')[1];
      const mimeType = result.split(',')[0].split(':')[1].split(';')[0];
      onImageSelected(file, base64Data, mimeType);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  };

  if (previewUrl) {
    return (
      <div className="relative group w-full h-64 md:h-80 bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 shadow-inner">
        <img 
          src={previewUrl} 
          alt="Original Upload" 
          className="w-full h-full object-contain"
        />
        {!disabled && (
          <button 
            onClick={onClear}
            className="absolute top-2 right-2 p-2 bg-black/60 text-white rounded-full hover:bg-red-500/80 transition-colors backdrop-blur-sm"
          >
            <X size={16} />
          </button>
        )}
        <div className="absolute bottom-2 left-2 px-3 py-1 bg-black/60 text-xs text-white rounded-full backdrop-blur-sm">
          Original Image
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => !disabled && fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        w-full h-64 md:h-80 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all duration-300 cursor-pointer relative overflow-hidden
        ${isDragging 
          ? 'border-yellow-500 bg-yellow-500/10' 
          : 'border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800/30 bg-zinc-900/20'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
        disabled={disabled}
      />
      
      <div className="z-10 flex flex-col items-center p-6 text-center">
        <div className={`p-4 rounded-full mb-4 ${isDragging ? 'bg-yellow-500/20 text-yellow-500' : 'bg-zinc-800 text-zinc-400'}`}>
          <ImageIcon size={32} />
        </div>
        <h3 className="text-lg font-medium text-zinc-200 mb-1">
          {isDragging ? 'Drop it like it\'s hot!' : 'Upload an image'}
        </h3>
        <p className="text-sm text-zinc-500 max-w-[200px]">
          Drag and drop or click to select a file to edit
        </p>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-50 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800/20 via-transparent to-transparent" />
    </div>
  );
};

export default ImageUploader;