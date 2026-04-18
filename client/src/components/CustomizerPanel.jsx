import { Download, Palette, Image as ImageIcon, Type, Moon, Sun, Upload, Loader2 } from 'lucide-react';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function CustomizerPanel({ 
  bgClass, setBgClass, BACKGROUNDS, 
  customBgUrl, setCustomBgUrl,
  generatedBgs,
  fontClass, setFontClass, FONTS, 
  themeClass, setThemeClass, THEMES, 
  onDownload 
}) {
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomBgUrl(url);
      setBgClass('custom-bg');
    }
  };
  return (
    <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm lg:sticky lg:top-24">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Palette className="w-5 h-5 text-indigo-500" />
        Customize Design
      </h2>

      {/* Backgrounds */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
          <ImageIcon className="w-4 h-4" /> Background
        </label>
        <div className="grid grid-cols-4 gap-2">
          {BACKGROUNDS.map(bg => (
            <button
              key={bg.id}
              onClick={() => {
                setBgClass(bg.class);
                if (bg.class !== 'custom-bg') setCustomBgUrl(null);
              }}
              className={cn(
                "w-full aspect-square rounded-xl shadow-sm border-2 transition-all",
                bg.class,
                bgClass === bg.class ? "border-indigo-500 scale-105" : "border-transparent hover:scale-105"
              )}
              title={bg.name}
            />
          ))}
        </div>
        
        <div className="mt-4 relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            title="Upload custom background"
          />
          <div className={cn(
            "w-full py-3 px-4 border-2 border-dashed rounded-xl flex items-center justify-center gap-2 transition-all",
            bgClass === 'custom-bg' 
              ? "border-indigo-500 bg-indigo-50 text-indigo-700 font-medium" 
              : "border-slate-300 text-slate-500 hover:border-slate-400 hover:bg-slate-50"
          )}>
            <Upload className="w-4 h-4" />
            <span className="text-sm">Upload custom background</span>
          </div>
        </div>
      </div>

      {/* AI Generated Backgrounds */}
      {generatedBgs && generatedBgs.length > 0 && (
        <div className="mb-8">
          <label className="block text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-purple-500" /> AI Generated for this Verse
          </label>
          <div className="grid grid-cols-4 gap-2">
            {generatedBgs.map((bgUrl, i) => (
              <button
                key={`ai-${i}`}
                onClick={() => {
                  setCustomBgUrl(bgUrl);
                  setBgClass('custom-bg');
                }}
                className={cn(
                  "relative w-full aspect-square rounded-xl shadow-sm border-2 transition-all bg-slate-50 flex items-center justify-center overflow-hidden",
                  customBgUrl === bgUrl && bgClass === 'custom-bg' ? "border-indigo-500 scale-105 z-10" : "border-slate-200 hover:scale-105"
                )}
                title="AI Generated Background"
              >
                <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
                <img 
                  src={bgUrl} 
                  alt={`AI Generated ${i}`} 
                  className="absolute inset-0 w-full h-full object-cover z-10 opacity-0 transition-opacity duration-700" 
                  onLoad={(e) => e.target.classList.remove('opacity-0')} 
                  onError={(e) => e.target.style.display = 'none'}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Typography */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
          <Type className="w-4 h-4" /> Typography
        </label>
        <div className="grid grid-cols-2 gap-3">
          {FONTS.map(font => (
            <button
              key={font.id}
              onClick={() => setFontClass(font.class)}
              className={cn(
                "py-3 px-4 rounded-xl border text-sm transition-all flex items-center justify-center",
                font.class,
                fontClass === font.class 
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700 font-medium" 
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              )}
            >
              {font.name}
            </button>
          ))}
        </div>
      </div>

      {/* Theme (Text Color) */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
          {themeClass === 'text-white' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />} 
          Text Color
        </label>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          {THEMES.map(theme => (
            <button
              key={theme.id}
              onClick={() => setThemeClass(theme.class)}
              className={cn(
                "flex-1 py-2 text-sm rounded-lg transition-all font-medium",
                themeClass === theme.class 
                  ? "bg-white shadow-sm text-slate-900" 
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              {theme.name}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100">
        <button
          onClick={onDownload}
          className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
          Download Poster
        </button>
      </div>
    </div>
  );
}
