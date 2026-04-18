import { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';

import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import VerseCard from './components/VerseCard';
import CustomizerPanel from './components/CustomizerPanel';

const BACKGROUNDS = [
  { id: 'grad1', class: 'poster-gradient-1', name: 'Warm Sunrise' },
  { id: 'grad2', class: 'poster-gradient-2', name: 'Ocean Breeze' },
  { id: 'grad3', class: 'poster-gradient-3', name: 'Lavender Dream' },
  { id: 'grad4', class: 'poster-gradient-4', name: 'Cotton Candy' },
  { id: 'grad5', class: 'poster-gradient-5', name: 'Midnight' },
  { id: 'img1', class: 'bg-[url(https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=1000)] bg-cover bg-center', name: 'Nature' },
  { id: 'img2', class: 'bg-[url(https://images.unsplash.com/photo-1513002749550-c59d220b8e42?auto=format&fit=crop&q=80&w=1000)] bg-cover bg-center', name: 'Sky' },
  { id: 'img3', class: 'bg-[url(https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?auto=format&fit=crop&q=80&w=1000)] bg-cover bg-center', name: 'Cross' },
];

const FONTS = [
  { id: 'font-serif', class: 'font-serif', name: 'Playfair Display' },
  { id: 'font-sans', class: 'font-sans', name: 'Inter' },
];

const THEMES = [
  { id: 'light', class: 'text-slate-800', name: 'Dark Text' },
  { id: 'dark', class: 'text-white', name: 'Light Text' },
];

const RAW_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = RAW_API_URL.replace(/\/$/, '');

export default function App() {
  const [query, setQuery] = useState('');
  const [verse, setVerse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Customizer State
  const [bgClass, setBgClass] = useState(BACKGROUNDS[0].class);
  const [customBgUrl, setCustomBgUrl] = useState(null);
  const [generatedBgs, setGeneratedBgs] = useState([]);
  const [fontClass, setFontClass] = useState(FONTS[0].class);
  const [themeClass, setThemeClass] = useState(THEMES[0].class);
  
  const posterRef = useRef(null);

  const generateAIBackgrounds = async (verseText) => {
    try {
      const res = await fetch(`${API_URL}/api/verse/backgrounds`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verseText })
      });
      const data = await res.json();
      if (data.backgrounds) {
        setGeneratedBgs(data.backgrounds);
      }
    } catch (err) {
      console.error('Failed to generate AI backgrounds', err);
    }
  };

  useEffect(() => {
    fetchRandomVerse();
  }, []);

  const fetchRandomVerse = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/verse/random`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setVerse(data);
      generateAIBackgrounds(data.text);
    } catch (err) {
      const errorMessage = err.message === 'Failed to fetch'
        ? 'Could not connect to the server. Please check your connection.'
        : 'Could not load Verse of the Day.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const searchVerse = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/verse?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to fetch');
      setVerse(data);
      generateAIBackgrounds(data.text);
    } catch (err) {
      const errorMessage = err.message === 'Failed to fetch'
        ? 'Could not connect to the server. Please check your connection.'
        : err.message || 'Verse not found.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    const categoryVerses = {
      'Motivation': 'Philippians 4:13',
      'Love': '1 Corinthians 13:4',
      'Faith': 'Hebrews 11:1',
      'Anxiety': 'Philippians 4:6',
      'Peace': 'John 14:27'
    };
    setQuery(categoryVerses[category]);
    searchVerse(categoryVerses[category]);
  };

  const downloadPoster = async () => {
    if (!posterRef.current) return;
    try {
      const canvas = await html2canvas(posterRef.current, {
        scale: 2, // High resolution
        useCORS: true,
        backgroundColor: null,
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `versecanvas-${verse.reference.replace(/\s/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download image:', err);
      alert('Failed to download image. Please try again.');
    }
  };

  const copyVerse = () => {
    if (verse) {
      navigator.clipboard.writeText(`"${verse.text}" - ${verse.reference}`);
      alert('Copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SearchBar 
          query={query}
          setQuery={setQuery}
          onSearch={searchVerse}
          loading={loading}
          onCategoryClick={handleCategoryClick}
        />

        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-center">
            {error}
          </div>
        )}

        {verse && !loading && (
          <div className="grid lg:grid-cols-12 gap-8 items-start animate-in fade-in slide-in-from-bottom-4 duration-700">
            <VerseCard 
              verse={verse}
              bgClass={bgClass}
              customBgUrl={customBgUrl}
              fontClass={fontClass}
              themeClass={themeClass}
              posterRef={posterRef}
              onCopy={copyVerse}
              onDownload={downloadPoster}
            />

            <CustomizerPanel 
              bgClass={bgClass} setBgClass={setBgClass} BACKGROUNDS={BACKGROUNDS}
              customBgUrl={customBgUrl} setCustomBgUrl={setCustomBgUrl}
              generatedBgs={generatedBgs}
              fontClass={fontClass} setFontClass={setFontClass} FONTS={FONTS}
              themeClass={themeClass} setThemeClass={setThemeClass} THEMES={THEMES}
              onDownload={downloadPoster}
            />
          </div>
        )}
      </main>
    </div>
  );
}
