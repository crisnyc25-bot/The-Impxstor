import React, { useEffect, useState } from 'react';
import { Player } from '../types';
import { Swords, Timer, Gavel } from 'lucide-react';

interface SuddenDeathScreenProps {
  candidates: Player[];
  onProceed: () => void;
}

export const SuddenDeathScreen: React.FC<SuddenDeathScreenProps> = ({ candidates, onProceed }) => {
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const player1 = candidates[0];
  const player2 = candidates[1];

  return (
    <div className="flex flex-col items-center justify-between h-full py-6 animate-in zoom-in duration-500">
      
      <div className="text-center space-y-2">
         <div className="inline-flex items-center justify-center p-3 bg-red-600 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.5)] animate-pulse">
            <Swords size={32} className="text-white" />
         </div>
         <h2 className="text-3xl font-black text-white uppercase tracking-widest text-red-500 drop-shadow-md">
            ¡Duelo Final!
         </h2>
         <p className="text-slate-400 text-sm max-w-[250px] mx-auto">
            Hay un empate. Tenéis 30 segundos para defenderos.
         </p>
      </div>

      <div className="flex-1 w-full flex items-center justify-center gap-4 relative">
         {/* Player 1 */}
         <div className="flex flex-col items-center animate-in slide-in-from-left duration-700">
            <span className="text-6xl filter drop-shadow-lg">{player1?.avatar || '❓'}</span>
            <span className="text-xl font-bold text-white mt-2">{player1?.name}</span>
         </div>

         {/* VS Badge */}
         <div className="z-10 bg-slate-900 border-2 border-slate-700 rounded-full w-12 h-12 flex items-center justify-center font-black text-slate-500 italic">
            VS
         </div>

         {/* Player 2 */}
         <div className="flex flex-col items-center animate-in slide-in-from-right duration-700">
            <span className="text-6xl filter drop-shadow-lg">{player2?.avatar || '❓'}</span>
            <span className="text-xl font-bold text-white mt-2">{player2?.name}</span>
         </div>
         
         {/* Timer Overlay */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6">
             <div className={`flex items-center gap-2 px-4 py-1 rounded-full border ${timeLeft <= 10 ? 'bg-red-900/50 border-red-500 text-red-400' : 'bg-slate-800 border-slate-600 text-slate-300'}`}>
                <Timer size={14} />
                <span className="font-mono font-bold text-lg">{timeLeft}s</span>
             </div>
         </div>
      </div>

      <div className="w-full">
         <button 
           onClick={onProceed}
           className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
         >
           <Gavel size={24} />
           <span>Repetir Votación</span>
         </button>
         <p className="text-center text-xs text-slate-500 mt-2">
            Solo se podrá votar a uno de los dos.
         </p>
      </div>
    </div>
  );
};