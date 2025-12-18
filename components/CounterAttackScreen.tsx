import React, { useState, useEffect } from 'react';
import { Target, Check, X, Keyboard, Shuffle } from 'lucide-react';

interface CounterAttackScreenProps {
  secretWord: string;
  decoys: string[]; // If empty, it's manual mode
  onResult: (success: boolean) => void;
}

export const CounterAttackScreen: React.FC<CounterAttackScreenProps> = ({ secretWord, decoys, onResult }) => {
  const [guess, setGuess] = useState('');
  const [options, setOptions] = useState<string[]>([]);

  const isManualMode = decoys.length === 0;

  useEffect(() => {
    if (!isManualMode) {
      // Create pool with Secret Word + Decoys and shuffle
      const pool = [...decoys, secretWord];
      setOptions(pool.sort(() => Math.random() - 0.5));
    }
  }, [secretWord, decoys, isManualMode]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guess.trim()) return;
    
    // Simple normalization check
    const cleanGuess = guess.trim().toUpperCase();
    const cleanSecret = secretWord.trim().toUpperCase();
    
    onResult(cleanGuess === cleanSecret);
  };

  const handleOptionClick = (option: string) => {
    onResult(option === secretWord);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full py-6 animate-in zoom-in duration-500 text-center">
      
      <div className="mb-6">
         <div className="inline-flex items-center justify-center p-4 bg-red-600 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.5)] animate-bounce-slow">
            <Target size={40} className="text-white" />
         </div>
         <h2 className="text-3xl font-black text-white mt-4 uppercase tracking-widest text-red-500 drop-shadow-md">
            ¡Contragolpe!
         </h2>
         <p className="text-slate-300 text-sm max-w-[280px] mx-auto mt-2">
            Te han descubierto... pero si aciertas la palabra secreta, <span className="text-red-400 font-bold">¡robas la victoria!</span>
         </p>
      </div>

      <div className="w-full flex-1 flex flex-col justify-center">
         {isManualMode ? (
             <div className="w-full max-w-xs mx-auto">
                <div className="flex items-center gap-2 text-slate-400 text-xs uppercase font-bold mb-2 justify-center">
                    <Keyboard size={14} /> Escribe la palabra
                </div>
                <form onSubmit={handleManualSubmit} className="space-y-4">
                    <input
                        autoFocus
                        type="text"
                        value={guess}
                        onChange={(e) => setGuess(e.target.value)}
                        placeholder="Palabra Secreta..."
                        className="w-full bg-slate-800 border-2 border-slate-600 focus:border-red-500 rounded-xl py-4 px-6 text-white text-center text-xl font-black placeholder-slate-600 outline-none transition-all uppercase"
                    />
                    <button 
                        type="submit"
                        disabled={!guess.trim()}
                        className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                        <span>Disparar</span>
                        <Target size={20} />
                    </button>
                </form>
             </div>
         ) : (
             <div className="w-full max-w-sm mx-auto">
                <div className="flex items-center gap-2 text-slate-400 text-xs uppercase font-bold mb-4 justify-center">
                    <Shuffle size={14} /> Elige la correcta
                </div>
                <div className="grid grid-cols-1 gap-3">
                    {options.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleOptionClick(option)}
                            className="bg-slate-700/50 hover:bg-red-600/20 border border-slate-600 hover:border-red-500 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] uppercase tracking-wider"
                        >
                            {option}
                        </button>
                    ))}
                </div>
             </div>
         )}
      </div>

    </div>
  );
};