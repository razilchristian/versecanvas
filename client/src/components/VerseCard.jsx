import { Copy, Download } from 'lucide-react';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function VerseCard({ verse, bgClass, customBgUrl, fontClass, themeClass, posterRef, onCopy, onDownload }) {
  if (!verse) return null;

  return (
    <div className="lg:col-span-8 flex justify-center">
      <div className="relative group w-full max-w-2xl">
        {/* Poster Element (This gets downloaded) */}
        <div
          ref={posterRef}
          className={cn(
            "relative w-full aspect-[4/5] sm:aspect-square flex flex-col items-center justify-center p-8 sm:p-16 text-center shadow-2xl rounded-3xl overflow-hidden transition-all duration-500",
            bgClass === 'custom-bg' ? undefined : bgClass,
            fontClass,
            themeClass
          )}
          style={bgClass === 'custom-bg' && customBgUrl ? { backgroundImage: `url("${customBgUrl}")`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
        >
          {/* Add a slight overlay for image backgrounds to make text pop */}
          {(bgClass.includes('bg-[url') || bgClass === 'custom-bg') && (
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] z-0"></div>
          )}
          
          <div className="relative z-10 flex flex-col items-center justify-center h-full max-w-lg mx-auto">
            <p className="text-2xl sm:text-3xl md:text-4xl leading-relaxed sm:leading-relaxed md:leading-relaxed font-medium mb-8">
              "{verse.text}"
            </p>
            <div className="mt-auto pt-8 border-t border-current/20 w-16"></div>
            <p className="mt-6 text-lg sm:text-xl font-bold tracking-wide uppercase opacity-90">
              {verse.reference}
            </p>
            <p className="mt-2 text-sm opacity-70 tracking-widest uppercase">
              {verse.translation}
            </p>
          </div>
        </div>

        {/* Floating Actions */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={onCopy}
            className="p-3 bg-white/90 backdrop-blur-sm text-slate-700 hover:text-indigo-600 rounded-xl shadow-lg hover:shadow-xl transition-all"
            title="Copy Text"
          >
            <Copy className="w-5 h-5" />
          </button>
          <button 
            onClick={onDownload}
            className="p-3 bg-white/90 backdrop-blur-sm text-slate-700 hover:text-indigo-600 rounded-xl shadow-lg hover:shadow-xl transition-all"
            title="Download Poster"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
