import React, { useEffect, useRef } from 'react';
import type { GeneratorState } from '../types/generator';

interface CanvasPreviewProps {
  state: GeneratorState;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export const CanvasPreview: React.FC<CanvasPreviewProps> = ({ state, canvasRef }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Rigid high-resolution panoramic dimensions matching the official title card
  const width = 1920;
  const height = 400;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      // 1. Draw solid background color
      ctx.fillStyle = state.bgColor;
      ctx.fillRect(0, 0, width, height);

      // 2. Setup typography for the large English title
      ctx.font = `900 ${state.fontSize}px "${state.fontFamily}", sans-serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';

      // Measure character sizes for exact centering
      const schoolWidth = ctx.measureText(state.textLine1).width;
      const daysWidth = ctx.measureText(state.textLine2).width;
      
      // Proportional spacing gap matching the tight layout of the official anime title card
      const gap = state.fontSize * 0.22 + state.letterSpacing * 2;
      const totalW = schoolWidth + gap + daysWidth;
      
      const startX = (width - totalW) / 2;
      const yPos = height / 2;

      // Draw "School" text (Line 1)
      ctx.fillStyle = state.titleColor;
      ctx.fillText(state.textLine1, startX, yPos);

      // Draw "Days" text (Line 2)
      const daysStartX = startX + schoolWidth + gap;
      ctx.fillText(state.textLine2, daysStartX, yPos);

      // 3. Draw Japanese Subtitle ("スクールデイズ") above "Days" text block right edge
      if (state.subJapanese) {
        ctx.font = `900 ${state.fontSize * 0.24}px "${state.fontFamily}", sans-serif`;
        ctx.fillStyle = state.subtitleColor;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        
        const subX = daysStartX + daysWidth - state.letterSpacing;
        const subY = yPos - state.fontSize * 0.35;
        
        ctx.fillText(state.subJapanese, subX, subY);
      }

      // 4. Draw English Synopsis Quote at the bottom-left edge, perfectly aligned with the left edge of "School"
      if (state.bottomQuote) {
        ctx.font = `bold ${state.quoteFontSize}px "Times New Roman", serif`;
        ctx.fillStyle = state.quoteColor;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        
        const quoteX = startX;
        const quoteY = height - 35;
        
        ctx.fillText(state.bottomQuote, quoteX, quoteY);
      }

      // 5. Apply dynamic VHS overlay directly to the canvas if enabled!
      if (state.vhsEffect) {
        ctx.save();
        
        // Tape static tracking noise lines at the bottom edge
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        for (let i = 0; i < 16; i++) {
          const noiseY = height - 10 - Math.random() * 25;
          const noiseHeight = 1 + Math.random() * 3;
          const noiseWidth = 40 + Math.random() * 200;
          const noiseX = Math.random() * (width - noiseWidth);
          ctx.fillRect(noiseX, noiseY, noiseWidth, noiseHeight);
        }

        // Faint tracking noise lines near the top edge
        for (let i = 0; i < 5; i++) {
          const noiseY = 15 + Math.random() * 30;
          const noiseHeight = 0.5 + Math.random() * 1.5;
          const noiseWidth = 10 + Math.random() * 100;
          const noiseX = Math.random() * (width - noiseWidth);
          ctx.fillRect(noiseX, noiseY, noiseWidth, noiseHeight);
        }

        // Soft VHS-style scanlines
        ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
        ctx.lineWidth = 1;
        for (let scanY = 0; scanY < height; scanY += 3) {
          ctx.beginPath();
          ctx.moveTo(0, scanY);
          ctx.lineTo(width, scanY);
          ctx.stroke();
        }

        ctx.restore();
      }
    };

    draw();

    // Redraw immediately when Google Fonts async download completes
    document.fonts.ready.then(draw);
  }, [state, canvasRef]);

  return (
    <div 
      ref={containerRef}
      className={`w-full win95-window p-1 relative ${state.vhsEffect ? 'vhs-effect vhs-glitch' : ''}`}
    >
      {/* Windows 95 style header for the canvas preview */}
      <div className="win95-titlebar px-2 py-1 text-xs flex items-center justify-between">
        <span className="flex items-center gap-1.5 font-mono">
          🥀 CANVA_PREVIEW.EXE
        </span>
        <div className="flex gap-1">
          <button className="win95-button text-[10px] w-4 h-4 p-0 font-mono bg-[#c0c0c0] flex items-center justify-center font-bold">_</button>
          <button className="win95-button text-[10px] w-4 h-4 p-0 font-mono bg-[#c0c0c0] flex items-center justify-center font-bold">[]</button>
          <button className="win95-button text-[10px] w-4 h-4 p-0 font-mono bg-[#c0c0c0] flex items-center justify-center font-bold">X</button>
        </div>
      </div>

      <div className="p-3 bg-[#c0c0c0]">
        <div className="w-full aspect-[24/5] rounded-none overflow-hidden win95-inset flex items-center justify-center relative shadow-inner">
          <canvas 
            ref={canvasRef}
            width={width} 
            height={height} 
            className="max-w-full max-h-full w-full object-contain cursor-crosshair transition-transform duration-300"
          />
        </div>

        <div className="w-full flex justify-between items-center mt-2 text-[10px] text-slate-700 font-mono px-1">
          <span>Resolution: 1920 × 400 pixels</span>
          <span>VHS_EFFECT: {state.vhsEffect ? 'ACTIVE (📼)' : 'INACTIVE'}</span>
        </div>
      </div>
    </div>
  );
};
export default CanvasPreview;
