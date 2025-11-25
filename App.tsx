import React, { useState } from 'react';
import { AspectRatio, ImageUploadState, LoadingState } from './types';
import { generateEditedImage } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import AspectRatioSelector from './components/AspectRatioSelector';
import { Wand2, Download, AlertCircle, RefreshCw, Zap } from 'lucide-react';

const App: React.FC = () => {
  const [inputImage, setInputImage] = useState<ImageUploadState>({
    file: null,
    previewUrl: null,
    base64Data: null,
    mimeType: '',
  });

  const [prompt, setPrompt] = useState<string>('');
  const [targetRatio, setTargetRatio] = useState<AspectRatio>(AspectRatio.LANDSCAPE_16_9);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleImageSelected = (file: File, base64: string, mimeType: string) => {
    setInputImage({
      file,
      previewUrl: URL.createObjectURL(file),
      base64Data: base64,
      mimeType,
    });
    setResultImage(null);
    setErrorMsg(null);
  };

  const handleClearImage = () => {
    setInputImage({
      file: null,
      previewUrl: null,
      base64Data: null,
      mimeType: '',
    });
    setResultImage(null);
    setPrompt('');
    setErrorMsg(null);
  };

  const handleGenerate = async () => {
    if (!inputImage.base64Data) return;

    setLoadingState('generating');
    setErrorMsg(null);

    try {
      // If prompt is empty, use a smart default based on the action
      const effectivePrompt = prompt.trim() || "Extend and enhance this image to fit the new aspect ratio naturally.";
      
      const result = await generateEditedImage(
        inputImage.base64Data,
        inputImage.mimeType,
        effectivePrompt,
        targetRatio
      );

      if (result.imageUrl) {
        setResultImage(result.imageUrl);
        setLoadingState('success');
      } else {
        throw new Error("No image data received from the model.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to generate image. Please try again.");
      setLoadingState('error');
    }
  };

  const handleDownload = () => {
    if (resultImage) {
      const link = document.createElement('a');
      link.href = resultImage;
      link.download = `nano-banana-edit-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const isGenerating = loadingState === 'generating';

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center py-8 px-4 sm:px-6">
      
      {/* Header */}
      <header className="w-full max-w-5xl mb-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-500 p-2 rounded-xl text-black">
            <Zap size={24} fill="currentColor" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
              Nano Banana
            </h1>
            <p className="text-zinc-500 text-xs uppercase tracking-wider font-semibold">Wallpaper Studio</p>
          </div>
        </div>
        <div className="hidden md:block text-right">
          <div className="text-sm font-medium text-zinc-400">Powered by Gemini 2.5</div>
          <div className="text-xs text-zinc-600">Flash Image Model</div>
        </div>
      </header>

      <main className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        
        {/* LEFT COLUMN: Controls & Input */}
        <div className="space-y-8">
          
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">1. Source Image</h2>
            </div>
            <ImageUploader 
              previewUrl={inputImage.previewUrl}
              onImageSelected={handleImageSelected}
              onClear={handleClearImage}
              disabled={isGenerating}
            />
          </section>

          <section>
             <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">2. Target Ratio</h2>
            </div>
            <AspectRatioSelector 
              selectedRatio={targetRatio}
              onSelect={setTargetRatio}
              disabled={isGenerating}
            />
          </section>

          <section>
             <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">3. Edit Prompt (Optional)</h2>
            </div>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="E.g. 'Add a cyberpunk city background', 'Make it look like a vintage painting', 'Remove the text'"
                disabled={isGenerating}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all resize-none h-32"
              />
              <div className="absolute bottom-3 right-3 text-zinc-600 text-xs">
                AI can be creative!
              </div>
            </div>
          </section>

          <button
            onClick={handleGenerate}
            disabled={!inputImage.file || isGenerating}
            className={`
              w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all duration-300
              ${!inputImage.file || isGenerating
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-yellow-500 to-amber-500 text-black hover:scale-[1.02] hover:shadow-yellow-500/20'}
            `}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="animate-spin" size={20} />
                Dreaming up pixels...
              </>
            ) : (
              <>
                <Wand2 size={20} />
                Generate Wallpaper
              </>
            )}
          </button>

          {errorMsg && (
            <div className="p-4 bg-red-950/30 border border-red-900/50 rounded-xl flex items-start gap-3 text-red-400">
              <AlertCircle size={20} className="mt-0.5 shrink-0" />
              <p className="text-sm">{errorMsg}</p>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Results */}
        <div className="flex flex-col h-full">
           <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">Result</h2>
            </div>
          
          <div className={`
            flex-1 min-h-[400px] bg-zinc-900 rounded-2xl border border-zinc-800 flex flex-col items-center justify-center relative overflow-hidden transition-all
            ${isGenerating ? 'animate-pulse' : ''}
          `}>
            
            {resultImage ? (
              <div className="relative w-full h-full group">
                {/* Image Display */}
                <div className="w-full h-full flex items-center justify-center bg-zinc-950/50 p-4">
                  <img 
                    src={resultImage} 
                    alt="Generated Result" 
                    className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
                  />
                </div>
                
                {/* Overlay Action */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                   <button
                    onClick={handleDownload}
                    className="bg-white/90 hover:bg-white text-black px-4 py-2 rounded-full font-medium shadow-xl flex items-center gap-2 backdrop-blur-sm"
                  >
                    <Download size={18} />
                    Download
                  </button>
                </div>
              </div>
            ) : (
              // Empty State
              <div className="text-center p-8 text-zinc-600">
                {isGenerating ? (
                   <div className="flex flex-col items-center gap-4">
                     <div className="relative w-16 h-16">
                        <div className="absolute inset-0 rounded-full border-4 border-zinc-800"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-yellow-500 border-t-transparent animate-spin"></div>
                     </div>
                     <p className="text-zinc-400 animate-pulse">Consulting the Banana Nano...</p>
                   </div>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-zinc-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Wand2 size={32} className="opacity-50" />
                    </div>
                    <p className="text-lg font-medium text-zinc-500">Ready to Create</p>
                    <p className="text-sm max-w-xs mx-auto mt-2 opacity-60">
                      Upload an image and select your target ratio to see the magic happen here.
                    </p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Info footer for result area */}
          {resultImage && (
            <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
               <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs text-zinc-400 whitespace-nowrap">
                 Generated by Gemini 2.5 Flash
               </span>
               <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs text-zinc-400 whitespace-nowrap">
                 Ratio: {Object.keys(AspectRatio).find(k => AspectRatio[k as keyof typeof AspectRatio] === targetRatio)}
               </span>
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default App;