import React from 'react';
import type { GeneratorState } from '../types/generator';
import { Type, Palette } from 'lucide-react';

interface EditorPanelProps {
  state: GeneratorState;
  onChange: <K extends keyof GeneratorState>(key: K, value: GeneratorState[K]) => void;
}

export const EditorPanel: React.FC<EditorPanelProps> = ({ state, onChange }) => {
  return (
    <div className="w-full win95-window p-1 relative shadow-lg">
      
      {/* Title Bar */}
      <div className="win95-titlebar px-2 py-1 text-xs flex items-center justify-between">
        <span className="flex items-center gap-1.5 font-mono">
          🥀 SETTINGS_CONTROL.EXE
        </span>
        <div className="flex gap-1">
          <button className="win95-button text-[10px] w-4 h-4 p-0 font-mono bg-[#c0c0c0] flex items-center justify-center font-bold active:scale-95">X</button>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-4 md:p-6 bg-[#c0c0c0] space-y-6 text-black">
        
        {/* Controls Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Left Column: Text Fields */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-800 tracking-wider uppercase flex items-center gap-1.5 font-mono border-b border-slate-700 pb-1">
              <Type className="w-3.5 h-3.5 text-blue-950" />
              Entradas de Texto
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="textLine1" className="block text-xs font-bold text-slate-800 mb-1.5 font-sans">Línea 1</label>
                <input 
                  type="text" 
                  id="textLine1" 
                  value={state.textLine1} 
                  onChange={(e) => onChange('textLine1', e.target.value)}
                  className="w-full win95-inset px-2.5 py-1.5 text-sm text-black focus:outline-none font-mono"
                />
              </div>
              <div>
                <label htmlFor="textLine2" className="block text-xs font-bold text-slate-800 mb-1.5 font-sans">Línea 2</label>
                <input 
                  type="text" 
                  id="textLine2" 
                  value={state.textLine2} 
                  onChange={(e) => onChange('textLine2', e.target.value)}
                  className="w-full win95-inset px-2.5 py-1.5 text-sm text-black focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subJapanese" className="block text-xs font-bold text-slate-800 mb-1.5 font-sans">Subtítulo en Japonés</label>
              <input 
                type="text" 
                id="subJapanese" 
                value={state.subJapanese} 
                onChange={(e) => onChange('subJapanese', e.target.value)}
                className="w-full win95-inset px-2.5 py-1.5 text-sm text-black focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Right Column: Quotes & Background */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-800 tracking-wider uppercase flex items-center gap-1.5 font-mono border-b border-slate-700 pb-1">
              <Palette className="w-3.5 h-3.5 text-blue-950" />
              Sinopsis de la Historia
            </h3>
            
            <div>
              <label htmlFor="bottomQuote" className="block text-xs font-bold text-slate-800 mb-1.5 font-sans">Cita en Inglés</label>
              <textarea 
                id="bottomQuote" 
                rows={3}
                value={state.bottomQuote} 
                onChange={(e) => onChange('bottomQuote', e.target.value)}
                className="w-full win95-inset px-2.5 py-1.5 text-xs text-black focus:outline-none leading-normal resize-none font-mono"
              />
            </div>
          </div>

        </div>

        {/* Adjustments row (sliders & pickers) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 border-t border-slate-700/50 pt-4">
          <div>
            <div className="flex justify-between text-xs text-slate-800 mb-1.5 font-mono">
              <span>Tamaño de Letra</span>
              <span>{state.fontSize}px</span>
            </div>
            <input 
              type="range" 
              min="100" 
              max="280" 
              value={state.fontSize} 
              step="5"
              onChange={(e) => onChange('fontSize', parseFloat(e.target.value))}
              className="win95-slider w-full cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-800 mb-1.5 font-mono">
              <span>Espaciado Letras</span>
              <span>{state.letterSpacing}px</span>
            </div>
            <input 
              type="range" 
              min="-10" 
              max="40" 
              value={state.letterSpacing} 
              step="1"
              onChange={(e) => onChange('letterSpacing', parseFloat(e.target.value))}
              className="win95-slider w-full cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-800 mb-1.5 font-mono">
              <span>Tamaño Cita</span>
              <span>{state.quoteFontSize}px</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="45" 
              value={state.quoteFontSize} 
              step="1"
              onChange={(e) => onChange('quoteFontSize', parseFloat(e.target.value))}
              className="win95-slider w-full cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-4 bg-slate-350 p-2.5 border border-slate-400 rounded-none justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-bold text-slate-800 font-sans">Color de Fondo</span>
              <span className="text-[9px] text-slate-600">Default: Azul School Days</span>
            </div>
            <div className="color-picker-wrapper">
              <input 
                type="color" 
                value={state.bgColor} 
                onChange={(e) => onChange('bgColor', e.target.value)}
                className="color-picker-input cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-350 p-2.5 border border-slate-400 rounded-none justify-between select-none">
            <div className="flex flex-col gap-0.5 font-sans">
              <span className="text-xs font-bold text-slate-800">Efecto VHS</span>
              <span className="text-[9px] text-slate-600">Filtro analógico 📼</span>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={state.vhsEffect} 
                onChange={(e) => onChange('vhsEffect', e.target.checked)}
                className="w-4 h-4 cursor-pointer accent-blue-900 border border-slate-700 bg-white"
              />
            </label>
          </div>
        </div>

      </div>
    </div>
  );
};
export default EditorPanel;
