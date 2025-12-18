import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, UserPen, RefreshCw, Trash2 } from 'lucide-react';
import { PlayerSetup } from '../types';

interface NameSetupScreenProps {
  count: number;
  initialSetup?: PlayerSetup[];
  onConfirm: (setup: PlayerSetup[]) => void;
  onBack: () => void;
}

const EMOJIS = [
  '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', 
  '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🦆', '🦅', 
  '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', 
  '🐞', '🐜', '🕷', '🦂', '🐢', '🐍', '🦎', '🦖', '🐙', '🦑', 
  '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🦈', '🐊',
  '👻', '👽', '🤖', '💩', '💀', '🤡', '👹', '👺', '🎃', '😺'
];

export const NameSetupScreen: React.FC<NameSetupScreenProps> = ({ count, initialSetup, onConfirm, onBack }) => {
  const [setupData, setSetupData] = useState<PlayerSetup[]>([]);

  // Initialize with merged data from persistence + defaults
  useEffect(() => {
    const defaults = Array.from({ length: count }, (_, i) => ({
      name: `Jugador ${i + 1}`,
      avatar: EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
    }));

    if (initialSetup && initialSetup.length > 0) {
      // Merge: Take existing, fill rest with defaults, or slice if too many
      const merged = [...defaults];
      initialSetup.forEach((p, i) => {
        if (i < count) {
          merged[i] = p;
        }
      });
      setSetupData(merged);
    } else {
      setSetupData(defaults);
    }
  }, [count, initialSetup]);

  const handleNameChange = (index: number, value: string) => {
    const newData = [...setupData];
    newData[index] = { ...newData[index], name: value };
    setSetupData(newData);
  };

  const cycleAvatar = (index: number, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent focus loss
    const currentAvatar = setupData[index].avatar;
    let newIndex = Math.floor(Math.random() * EMOJIS.length);
    // Ensure it changes
    while (EMOJIS[newIndex] === currentAvatar) {
        newIndex = Math.floor(Math.random() * EMOJIS.length);
    }
    const newData = [...setupData];
    newData[index] = { ...newData[index], avatar: EMOJIS[newIndex] };
    setSetupData(newData);
  };

  const handleClearMemory = () => {
    if (confirm('¿Borrar nombres guardados?')) {
        localStorage.removeItem('impostor_player_setup');
        const defaults = Array.from({ length: count }, (_, i) => ({
            name: `Jugador ${i + 1}`,
            avatar: EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
        }));
        setSetupData(defaults);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Fill empty names with defaults if user clears them
    const finalData = setupData.map((p, i) => ({
      ...p,
      name: p.name.trim() === '' ? `Jugador ${i + 1}` : p.name
    }));
    onConfirm(finalData);
  };

  if (setupData.length === 0) return null;

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-right duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
            <button onClick={onBack} className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition">
            <ChevronLeft size={24} />
            </button>
            <h2 className="text-xl font-bold text-slate-200">Personalizar</h2>
        </div>
        <button 
            onClick={handleClearMemory}
            className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-700/50 rounded-lg transition"
            title="Borrar memoria"
        >
            <Trash2 size={18} />
        </button>
      </div>

      <p className="text-sm text-slate-400 mb-4 px-1">
        Elige nombre y avatar para cada jugador.
      </p>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto pb-4 custom-scrollbar space-y-3 pr-2">
          {setupData.map((player, index) => (
            <div key={index} className="flex items-center gap-3 bg-slate-700/30 p-2 pr-3 rounded-xl border border-slate-700 focus-within:border-indigo-500 focus-within:bg-slate-700/50 transition-all">
              
              <button 
                type="button"
                onClick={(e) => cycleAvatar(index, e)}
                className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-xl hover:bg-slate-500 transition-colors shadow-inner relative group"
                title="Cambiar avatar"
              >
                {player.avatar}
                <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                    <RefreshCw size={12} />
                </div>
              </button>

              <div className="flex-1 flex flex-col justify-center">
                 <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider pl-1">Jugador {index + 1}</span>
                 <input
                    type="text"
                    value={player.name}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                    placeholder={`Nombre`}
                    className="bg-transparent border-none outline-none text-white w-full font-medium placeholder-slate-500 h-6"
                    maxLength={15}
                />
              </div>
              <UserPen size={16} className="text-slate-500" />
            </div>
          ))}
        </div>

        <button 
          type="submit"
          className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
        >
          <span>Elegir Categoría</span>
          <ArrowRight size={20} />
        </button>
      </form>
    </div>
  );
};