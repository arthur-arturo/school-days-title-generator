import React, { useState, useRef } from 'react';
import type { GeneratorState } from './types/generator';
import { Header } from './components/Header';
import { CanvasPreview } from './components/CanvasPreview';
import { EditorPanel } from './components/EditorPanel';
import { Download, RotateCcw } from 'lucide-react';
import './App.css';

// Default state configured to match the Official Anime Title Card style exactly on first load
const defaultState: GeneratorState = {
  textLine1: "School",
  textLine2: "Days",
  subJapanese: "スクールデイズ",
  bottomQuote: "In the school, the three guys met. Their relation had been changed in the season, and turned into three love stories.",
  fontFamily: "Gothic A1",
  fontSize: 235,
  letterSpacing: 2,
  fillColor: "#ffffff",
  bgColor: "#002d62", // Official School Days solid deep blue background color
  vhsEffect: false,
  quoteFontSize: 21
};

export const App: React.FC = () => {
  const [state, setState] = useState<GeneratorState>(defaultState);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleChange = <K extends keyof GeneratorState>(key: K, value: GeneratorState[K]) => {
    setState(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleReset = () => {
    setState(defaultState);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dateStr = new Date().toISOString().slice(0, 10);
    const filename = `school-days-card-${dateStr}.png`;

    const link = document.createElement("a");
    link.download = filename;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="win95-desktop min-h-screen flex flex-col select-none overflow-x-hidden text-black pb-8">
      {/* Retro Styled startbar Header */}
      <Header />

      {/* Center Unified Single-Column Workspace Container */}
      <main className="flex-1 w-full max-w-[1000px] mx-auto p-4 md:p-6 lg:p-8 flex flex-col gap-6 items-stretch justify-center">
        
        {/* Canvas Preview in Windows 95 Bevel Frame */}
        <CanvasPreview state={state} canvasRef={canvasRef} />

        {/* Minimalist Editor Control Panel in Windows 95 Frame */}
        <EditorPanel state={state} onChange={handleChange} />

        {/* Windows 95 Bevel Buttons Row */}
        <div className="w-full flex flex-col sm:flex-row gap-4 pt-2">
          <button 
            onClick={handleDownload}
            className="win95-button flex-1 py-3 px-6 text-sm active:scale-95 flex items-center justify-center gap-2 cursor-pointer font-mono font-bold"
          >
            <Download className="w-4 h-4" />
            SAVE_IMAGE.EXE
          </button>
          <button 
            onClick={handleReset}
            className="win95-button py-3 px-8 text-sm active:scale-95 flex items-center justify-center gap-2 cursor-pointer font-mono font-bold"
          >
            <RotateCcw className="w-4 h-4" />
            RESET.EXE
          </button>
        </div>

      </main>

      {/* Retro Desktop taskbar Footer */}
      <footer className="w-full py-2 px-6 bg-[#c0c0c0] border-t-2 border-white text-center text-xs text-slate-700 shrink-0 z-30 font-mono shadow-md mt-auto">
        © 2026 school-days-title-generator.lnk • vaporwave_edition.sys
      </footer>
    </div>
  );
};

export default App;
