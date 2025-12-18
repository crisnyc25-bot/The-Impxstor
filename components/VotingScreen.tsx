import React, { useState } from 'react';
import { Player } from '../types';
import { Gavel, Fingerprint } from 'lucide-react';

interface VotingScreenProps {
  voter: Player;
  allPlayers: Player[];
  totalPlayers: number;
  currentIndex: number;
  onVote: (suspectId: number) => void;
  restrictToIds?: number[]; // For Sudden Death
}

export const VotingScreen: React.FC<VotingScreenProps> = ({
  voter,
  allPlayers,
  totalPlayers,
  currentIndex,
  onVote,
  restrictToIds
}) => {
  const [isReadyToVote, setIsReadyToVote] = useState(false);
  const [selectedSuspect, setSelectedSuspect] = useState<number | null>(null);

  // Phase 1: Pass Device
  if (!isReadyToVote) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-8 animate-in zoom-in duration-300 text-center">
        <div className="w-24 h-24 rounded-full bg-slate-700 flex items-center justify-center border-4 border-slate-600 shadow-xl relative">
           <span className="text-4xl">{voter.avatar}</span>
           <div className="absolute -bottom-2 bg-slate-800 text-xs px-2 py-1 rounded border border-slate-600 text-slate-300">
             Votación
           </div>
        </div>
        
        <div>
          <h2 className="text-3xl font-black text-white mb-2">{voter.name}</h2>
          <p className="text-slate-400 text-sm max-w-[200px] mx-auto">
            {restrictToIds 
                ? "Toma el dispositivo para el desempate." 
                : "Toma el dispositivo para votar en secreto."}
          </p>
        </div>

        <button 
          onClick={() => setIsReadyToVote(true)}
          className="mt-8 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-12 rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95 flex flex-col items-center gap-1"
        >
           <Fingerprint size={32} />
           <span>Votar</span>
        </button>
        
        <div className="absolute bottom-4 text-xs text-slate-600 font-mono">
           Votante {currentIndex + 1} / {totalPlayers}
        </div>
      </div>
    );
  }

  // Filter candidates
  // 1. Exclude self (voter)
  // 2. If restrictToIds is present, only show those ids
  const candidates = allPlayers.filter(p => {
      if (p.id === voter.id) return false;
      if (restrictToIds && !restrictToIds.includes(p.id)) return false;
      return true;
  });

  // Phase 2: Cast Vote
  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom duration-300">
      <div className="flex items-center justify-center gap-2 mb-2">
         <span className="text-2xl">{voter.avatar}</span>
         <h2 className="text-2xl font-bold text-white">{voter.name}, ¿Quién es?</h2>
      </div>
      <p className="text-center text-slate-400 text-sm mb-6">
        {restrictToIds ? "Vota para desempatar el duelo." : "Elige al sospechoso. Nadie verá tu voto."}
      </p>

      <div className="flex-1 overflow-y-auto pb-4 custom-scrollbar space-y-3">
        {candidates.length > 0 ? candidates.map((suspect) => (
          <button
            key={suspect.id}
            onClick={() => setSelectedSuspect(suspect.id)}
            className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all
              ${selectedSuspect === suspect.id 
                ? 'bg-red-600/20 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
                : 'bg-slate-700/30 border-slate-600 hover:bg-slate-700/50'
              }`}
          >
            <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl
                    ${selectedSuspect === suspect.id ? 'bg-red-500/20' : 'bg-slate-600/50'}
                `}>
                    {suspect.avatar}
                </div>
                <span className={`text-lg font-bold ${selectedSuspect === suspect.id ? 'text-red-200' : 'text-slate-200'}`}>
                    {suspect.name}
                </span>
            </div>
            {selectedSuspect === suspect.id && <Gavel size={20} className="text-red-500" />}
          </button>
        )) : (
            <p className="text-center text-slate-500 mt-10">No puedes votar (eres uno de los acusados).</p>
        )}
      </div>

      <button
        disabled={selectedSuspect === null && candidates.length > 0}
        onClick={() => {
            // If candidates is empty (i.e. duelist voting), they might skip or vote null?
            // In this app, we force a vote unless there are no candidates.
            // If no candidates (duelist), we just pass.
            if (candidates.length === 0) {
                onVote(-1); // Special code for "skip" or just logic handling
            } else if (selectedSuspect) {
                onVote(selectedSuspect);
            }
        }}
        className="mt-4 w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all"
      >
        {candidates.length === 0 ? "Saltar (Soy acusado)" : "Confirmar Voto"}
      </button>
    </div>
  );
};