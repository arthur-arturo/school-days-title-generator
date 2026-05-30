import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  const [timeStr, setTimeStr] = useState('12:00 PM');

  // Simple clock updating to give the genuine OS taskbar feel
  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      let hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      const minutesStr = minutes < 10 ? '0' + minutes : minutes;
      setTimeStr(`${hours}:${minutesStr} ${ampm}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full bg-[#c0c0c0] border-b-2 border-white px-2 py-1 flex items-center justify-between shrink-0 z-35 shadow-md text-black font-sans text-xs">
      
      {/* Start Button & Title */}
      <div className="flex items-center gap-2">
        <button className="win95-button px-2 py-1 flex items-center gap-1 font-bold text-xs active:scale-95">
          <span className="text-sm">🥀</span>
          <span className="font-sans font-black tracking-wide">Start</span>
        </button>
        
        {/* Separator block */}
        <div className="h-5 w-[2px] bg-slate-600 border-r border-white mx-1"></div>
        
        <div className="flex items-center gap-1 text-[11px] font-bold font-mono text-slate-800">
          <Sparkles className="w-3.5 h-3.5 text-blue-900" />
          SchoolDays_Generator.lnk
        </div>
      </div>

      {/* Taskbar Clock Area (Sunken Inset) */}
      <div className="win95-inset px-3 py-1 text-[11px] font-mono font-bold flex items-center gap-2 bg-[#dcdcdc] border-l-2 border-t-2 border-slate-600 shadow-inner select-none">
        <span className="text-xs">🔊</span>
        <span>{timeStr}</span>
      </div>
      
    </header>
  );
};
