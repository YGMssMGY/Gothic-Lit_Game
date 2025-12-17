import React from 'react';
import { Snowflake, HeartCrack } from 'lucide-react';

interface Props {
  value: number;
}

const ColdHeartMeter: React.FC<Props> = ({ value }) => {
  // Color shifts from blue/white (cold) to deep red if it were a health bar, 
  // but here "Cold Heart" is good. Let's make it icy blue vs dark grey.
  
  return (
    <div className="fixed top-4 left-4 z-50 flex items-center gap-3 bg-charcoal/80 p-3 border border-slate-600 rounded-sm backdrop-blur-sm">
      <div className="relative">
        <HeartCrack className={`w-8 h-8 ${value > 50 ? 'text-blue-200' : 'text-slate-500'}`} />
        <Snowflake className="absolute -top-1 -right-1 w-4 h-4 text-white animate-pulse" />
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-serif uppercase tracking-widest text-slate-400">Cold Heart</span>
        <div className="w-48 h-4 bg-black border border-slate-700 relative overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-slate-600 via-slate-400 to-white transition-all duration-700 ease-out"
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
      <span className="font-mono text-lg text-white">{value}%</span>
    </div>
  );
};

export default ColdHeartMeter;
