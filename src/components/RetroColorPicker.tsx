import React, { useState, useEffect, useRef } from 'react';

interface RetroColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
}

// Convert Hex to RGB helper
const hexToRgb = (hex: string) => {
  const cleanHex = hex.startsWith('#') ? hex.slice(1) : hex;
  // Handle short hex like #fff
  const expandedHex = cleanHex.length === 3 
    ? cleanHex.split('').map(char => char + char).join('') 
    : cleanHex;
  
  const num = parseInt(expandedHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
};

// Convert RGB to Hex helper
const rgbToHex = (r: number, g: number, b: number) => {
  const clamp = (val: number) => Math.max(0, Math.min(255, Math.round(val)));
  return '#' + [clamp(r), clamp(g), clamp(b)].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

// Standard classic Windows 95 color grid
const PRESET_COLORS = [
  '#000000', '#808080', '#c0c0c0', '#ffffff',
  '#800000', '#ff0000', '#808000', '#ffff00',
  '#008000', '#00ff00', '#008080', '#00ffff',
  '#000080', '#0000ff', '#800080', '#ff00ff',
  '#002d62' // School Days deep blue
];

export const RetroColorPicker: React.FC<RetroColorPickerProps> = ({ color, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rgb, setRgb] = useState({ r: 255, g: 255, b: 255 });
  const [hexInput, setHexInput] = useState(color);
  
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Sync state with color prop
  useEffect(() => {
    try {
      setRgb(hexToRgb(color));
      setHexInput(color);
    } catch (e) {
      // Avoid crash on malformed hex
    }
  }, [color]);

  // Click outside listener to close popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current && 
        !popoverRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleRgbChange = (channel: 'r' | 'g' | 'b', val: number) => {
    const nextRgb = { ...rgb, [channel]: val };
    setRgb(nextRgb);
    const nextHex = rgbToHex(nextRgb.r, nextRgb.g, nextRgb.b);
    setHexInput(nextHex);
    onChange(nextHex);
  };

  const handleHexInputChange = (val: string) => {
    setHexInput(val);
    if (/^#[0-9A-F]{6}$/i.test(val)) {
      onChange(val);
      setRgb(hexToRgb(val));
    }
  };

  const handlePresetSelect = (preset: string) => {
    onChange(preset);
    setHexInput(preset);
    setRgb(hexToRgb(preset));
  };

  return (
    <div className="relative inline-block w-full">
      {/* Trigger Button: Styled as Windows 95 button with a color block */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="win95-button w-full px-2 py-1 flex items-center justify-between text-xs active:scale-98 cursor-pointer select-none"
      >
        <span className="truncate font-sans font-bold text-slate-800">{label || color}</span>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="font-mono text-[10px] text-slate-600">{color.toUpperCase()}</span>
          <div 
            className="w-5 h-4 border border-black/40 shadow-inner"
            style={{ backgroundColor: color }}
          />
        </div>
      </button>

      {/* Retro Floating Popover Window */}
      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute z-50 right-0 sm:left-0 mt-1 w-64 win95-window p-1 shadow-2xl font-sans text-black"
          style={{ top: 'calc(100% + 2px)' }}
        >
          {/* Popover Title Bar */}
          <div className="win95-titlebar px-1.5 py-0.5 text-[10px] flex items-center justify-between font-mono font-bold">
            <span>🎨 COLOR.EXE</span>
            <button 
              type="button"
              onClick={() => setIsOpen(false)}
              className="win95-button text-[8px] w-3.5 h-3.5 p-0 bg-[#c0c0c0] flex items-center justify-center font-bold font-mono active:scale-95"
            >
              X
            </button>
          </div>

          <div className="p-2 bg-[#c0c0c0] space-y-3">
            {/* 16 Standard Windows 95 Color Palette */}
            <div>
              <span className="block text-[10px] font-bold text-slate-800 mb-1">Standard Palette:</span>
              <div className="grid grid-cols-6 gap-1 bg-[#dfdfdf] p-1.5 border border-white border-b-slate-600 border-r-slate-600 shadow-inner">
                {PRESET_COLORS.map(preset => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handlePresetSelect(preset)}
                    className={`w-6 h-5 cursor-pointer border active:scale-95 transition-transform ${color.toLowerCase() === preset.toLowerCase() ? 'border-2 border-black scale-105' : 'border-black/30'}`}
                    style={{ backgroundColor: preset }}
                    title={preset}
                  />
                ))}
              </div>
            </div>

            {/* Custom RGB Sliders (Styled in retro win95 bevel design) */}
            <div className="space-y-1.5">
              <span className="block text-[10px] font-bold text-slate-800">Adjust Custom Color:</span>
              
              {/* Red Slider */}
              <div className="flex items-center gap-2 text-[10px] font-mono">
                <span className="w-3 text-red-700 font-bold">R</span>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={rgb.r}
                  onChange={(e) => handleRgbChange('r', parseInt(e.target.value))}
                  className="win95-slider flex-1 cursor-pointer"
                />
                <span className="w-6 text-right font-bold">{rgb.r}</span>
              </div>

              {/* Green Slider */}
              <div className="flex items-center gap-2 text-[10px] font-mono">
                <span className="w-3 text-green-700 font-bold">G</span>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={rgb.g}
                  onChange={(e) => handleRgbChange('g', parseInt(e.target.value))}
                  className="win95-slider flex-1 cursor-pointer"
                />
                <span className="w-6 text-right font-bold">{rgb.g}</span>
              </div>

              {/* Blue Slider */}
              <div className="flex items-center gap-2 text-[10px] font-mono">
                <span className="w-3 text-blue-700 font-bold">B</span>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={rgb.b}
                  onChange={(e) => handleRgbChange('b', parseInt(e.target.value))}
                  className="win95-slider flex-1 cursor-pointer"
                />
                <span className="w-6 text-right font-bold">{rgb.b}</span>
              </div>
            </div>

            {/* HEX Input and Current Color Preview Box */}
            <div className="flex items-center gap-3 pt-1 border-t border-slate-700/30">
              <div className="flex-1">
                <span className="block text-[9px] font-bold text-slate-800 mb-0.5">Hex Code:</span>
                <input
                  type="text"
                  value={hexInput}
                  onChange={(e) => handleHexInputChange(e.target.value)}
                  className="w-full win95-inset px-1.5 py-0.5 text-xs text-black focus:outline-none font-mono"
                  placeholder="#FFFFFF"
                  maxLength={7}
                />
              </div>

              <div className="flex flex-col items-center">
                <span className="block text-[9px] font-bold text-slate-800 mb-0.5">Preview:</span>
                <div 
                  className="w-12 h-8 win95-inset shadow-inner border border-black/40"
                  style={{ backgroundColor: color }}
                />
              </div>
            </div>

            {/* Close Button */}
            <div className="pt-1 flex justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="win95-button px-4 py-1 text-[10px] font-bold active:scale-95 cursor-pointer"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
