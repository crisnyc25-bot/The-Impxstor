import React, { useState } from 'react';
import { Player } from '../types';
import { EyeOff, Fingerprint, ShieldAlert, Skull, PartyPopper, Search, Users, Drama, Ban, Lightbulb, Puzzle, Hand } from 'lucide-react';

interface RevealScreenProps {
  player: Player;
  totalPlayers: number;
  currentIndex: number;
  categoryName: string;
  onNext: () => void;
  players?: Player[]; // Passed to find partner names
  isMimicryMode?: boolean;
}

export const RevealScreen: React.FC<RevealScreenProps> = ({ 
  player, 
  totalPlayers, 
  currentIndex, 
  categoryName,
  onNext,
  players = [],
  isMimicryMode
}) => {
  const [isRevealed, setIsRevealed] = useState(false);

  const completeTurn = () => {
    setIsRevealed(false);
    onNext();
  };

  // Phase 1: Pass Device
  if (!isRevealed) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-8 animate-in zoom-in duration-300 text-center">
        <div className="w-24 h-24 rounded-full bg-slate-700 flex items-center justify-center border-4 border-slate-600 shadow-xl">
           <span className="text-5xl">{player.avatar}</span>
        </div>
        
        <div>
          <h2 className="text-3xl font-black text-white mb-2">{player.name}</h2>
          <p className="text-slate-400 text-sm max-w-[200px] mx-auto">
            Pasa el dispositivo a <span className="text-indigo-300 font-bold">{player.name}</span>.
          </p>
        </div>

        <button 
          onClick={() => setIsRevealed(true)}
          className="mt-8 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-12 rounded-full shadow-lg shadow-indigo-500/30 transition-all transform hover:scale-105 active:scale-95 flex flex-col items-center gap-1"
        >
           <Fingerprint size={32} />
           <span>Ver mi Rol</span>
        </button>
        
        <div className="absolute bottom-4 text-xs text-slate-600 font-mono">
           {currentIndex + 1} / {totalPlayers}
        </div>
      </div>
    );
  }

  // Phase 2: Secret Revealed
  
  const isClassicImpostor = player.role === 'IMPOSTOR' && player.word === 'IMPOSTOR';
  const isImpostor = player.role === 'IMPOSTOR';
  const isAccomplice = player.role === 'ACCOMPLICE';
  const isJester = player.role === 'JESTER';
  const isDetective = player.role === 'DETECTIVE';
  const isGuide = player.isGuide;
  const isConfusedCivilian = player.word === '???';

  // Visual Styles
  let containerClass = 'bg-emerald-500/10 border-emerald-500 text-emerald-400';
  let icon = null;
  let helperText = '';

  if (isClassicImpostor) {
    containerClass = 'bg-red-500/10 border-red-500 text-red-500';
    icon = <Skull size={32} className="mb-2 opacity-50" />;
    helperText = 'Finge que sabes la palabra.';
  } else if (isImpostor) {
      // Impostor with knowledge (Spy or Inverse)
      containerClass = 'bg-red-500/10 border-red-500 text-red-500';
      icon = <Skull size={32} className="mb-2 opacity-50" />;
      helperText = isGuide ? 'Sabotea la deducción del Guía.' : 'Finge que eres uno más.';
      // In Inverse mode, impostor is not technically "Guide", but they know the word.
      if (player.word !== 'IMPOSTOR' && !player.context) { // Likely Inverse Mode Impostor
           helperText = "Sabotea la deducción. ¡Confúndelos!";
      }
  } else if (isAccomplice) {
    containerClass = 'bg-purple-500/10 border-purple-500 text-purple-400';
    icon = <ShieldAlert size={32} className="mb-2 opacity-50" />;
    helperText = '¡Protege al impostor sin ser descubierto!';
  } else if (isJester) {
    containerClass = 'bg-orange-500/10 border-orange-500 text-orange-400';
    icon = <PartyPopper size={32} className="mb-2 opacity-50" />;
    helperText = '¡Haz que te expulsen para ganar!';
  } else if (isDetective) {
    containerClass = 'bg-cyan-500/10 border-cyan-500 text-cyan-400';
    icon = <Search size={32} className="mb-2 opacity-50" />;
    helperText = 'Memoriza la palabra y confía en tu contacto.';
  } else if (isGuide) {
    containerClass = 'bg-teal-500/10 border-teal-500 text-teal-400';
    icon = <Puzzle size={32} className="mb-2 opacity-50" />;
    helperText = 'Guía a los civiles sin ser obvio.';
  } else if (isConfusedCivilian) {
    containerClass = 'bg-slate-500/10 border-slate-500 text-slate-400';
    icon = <Puzzle size={32} className="mb-2 opacity-50" />;
    helperText = 'Adivina la palabra con la ayuda del Guía.';
  } else {
    // Standard Civilian
    helperText = 'Memoriza tu palabra secreta.';
  }

  // Logic for extra info
  let extraInfo = null;

  if (isAccomplice && player.impostorIds) {
      const impNames = players.filter(p => player.impostorIds?.includes(p.id)).map(p => p.name).join(', ');
      extraInfo = (
        <div className="w-full bg-red-900/20 border border-red-900/50 p-3 rounded-lg animate-pulse">
            <p className="text-xs text-red-400 uppercase font-bold mb-1">IMPOSTOR A PROTEGER:</p>
            <p className="text-lg font-black text-red-300">{impNames}</p>
        </div>
      );
  }

  if (player.role === 'IMPOSTOR' && player.impostorIds && player.impostorIds.length > 0) {
      const partnerNames = players.filter(p => player.impostorIds?.includes(p.id)).map(p => p.name).join(', ');
      extraInfo = (
        <div className="w-full bg-red-900/20 border border-red-900/50 p-3 rounded-lg flex items-center gap-3">
             <Users size={24} className="text-red-400" />
            <div className="text-left">
                <p className="text-xs text-red-400 uppercase font-bold">TU ALIADO:</p>
                <p className="text-lg font-black text-red-300 leading-none">{partnerNames}</p>
            </div>
        </div>
      );
  }

  if (isDetective && player.detectiveKnownSafeId) {
      const safePlayer = players.find(p => p.id === player.detectiveKnownSafeId);
      if (safePlayer) {
          extraInfo = (
            <div className="w-full bg-cyan-900/20 border border-cyan-900/50 p-3 rounded-lg flex items-center gap-3">
                <div className="text-2xl">{safePlayer.avatar}</div>
                <div className="text-left">
                    <p className="text-xs text-cyan-400 uppercase font-bold">JUGADOR SEGURO:</p>
                    <p className="text-lg font-black text-cyan-300 leading-none">{safePlayer.name} es INOCENTE</p>
                </div>
            </div>
          );
      }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4 animate-in fade-in duration-200 text-center bg-slate-800 rounded-xl p-4 border border-indigo-500/30 overflow-y-auto custom-scrollbar">
        
      <div className="w-full bg-slate-900/50 p-3 rounded-lg shrink-0">
        <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-1">Categoría</p>
        <p className="text-xl text-indigo-300 font-bold">{categoryName}</p>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center w-full">
         
         <div className="mb-2 text-4xl shrink-0">{player.avatar}</div>

         {/* Mimicry Warning */}
         {isMimicryMode && (
             <div className="bg-lime-500/20 border border-lime-500/50 px-4 py-2 rounded-full mb-3 flex items-center gap-2 animate-pulse">
                <Hand size={16} className="text-lime-400" />
                <span className="text-lime-200 font-bold text-xs uppercase tracking-wide">Mímica: Prohibido Hablar</span>
             </div>
         )}

         {isAccomplice && (
            <div className="mb-2 text-purple-300 text-sm font-bold animate-pulse">
                ERES EL CÓMPLICE
            </div>
         )}
         {isJester && (
            <div className="mb-2 text-orange-300 text-sm font-bold animate-pulse">
                ERES EL BUFÓN
            </div>
         )}
         {isDetective && (
            <div className="mb-2 text-cyan-300 text-sm font-bold animate-pulse">
                ERES EL DETECTIVE
            </div>
         )}
         {isGuide && (
            <div className="mb-2 text-teal-300 text-sm font-bold animate-pulse">
                ERES EL GUÍA
            </div>
         )}

         <div className={`p-6 w-full rounded-2xl border-2 shadow-2xl mb-3 transform transition-all flex flex-col items-center justify-center ${containerClass}`}>
            {icon}
            <span className="text-3xl font-black uppercase tracking-wider break-words leading-tight">
                {player.word}
            </span>
         </div>

         {/* Context Card (Definition) */}
         {player.context && (
            <div className="w-full bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-3 flex items-start gap-3 text-left animate-in slide-in-from-bottom duration-500">
               <div className="bg-yellow-500/20 p-1.5 rounded-full text-yellow-400 shrink-0">
                  <Lightbulb size={16} />
               </div>
               <div>
                  <p className="text-[10px] text-yellow-500 uppercase font-bold tracking-wider mb-0.5">¿Qué es esto?</p>
                  <p className="text-yellow-100 text-xs italic leading-snug">
                    "{player.context}"
                  </p>
               </div>
            </div>
         )}

         {/* Vague Hint (Inverse Mode) */}
         {player.vagueHint && (
            <div className="w-full bg-teal-500/10 border border-teal-500/30 rounded-lg p-3 mb-3 flex items-start gap-3 text-left animate-in slide-in-from-bottom duration-500">
               <div className="bg-teal-500/20 p-1.5 rounded-full text-teal-400 shrink-0">
                  <Puzzle size={16} />
               </div>
               <div>
                  <p className="text-[10px] text-teal-500 uppercase font-bold tracking-wider mb-0.5">Pista del Guía</p>
                  <p className="text-teal-100 text-xs italic leading-snug">
                    "{player.vagueHint}"
                  </p>
               </div>
            </div>
         )}
         
         {player.character && (
            <div className="bg-pink-500/20 border border-pink-500/50 px-4 py-2 rounded-full mb-3 flex items-center gap-2">
                <Drama size={16} className="text-pink-400" />
                <span className="text-pink-200 font-bold text-sm">Eres: {player.character}</span>
            </div>
         )}

         {player.forbiddenWord && (
             <div className="bg-rose-500/20 border border-rose-500/50 px-4 py-3 rounded-lg mb-3 flex items-center gap-3 w-full max-w-xs animate-in slide-in-from-bottom duration-500">
                <div className="bg-rose-500 p-1.5 rounded-full text-white">
                    <Ban size={20} />
                </div>
                <div className="text-left">
                    <p className="text-[10px] text-rose-300 font-bold uppercase tracking-wider">PALABRA PROHIBIDA</p>
                    <p className="text-white font-black text-lg leading-none">{player.forbiddenWord}</p>
                </div>
            </div>
         )}

         <p className="text-sm text-slate-400 mb-4">{helperText}</p>

         {extraInfo}
      </div>

      <button 
        onClick={completeTurn}
        className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 shrink-0"
      >
        <EyeOff size={20} />
        <span>Ocultar y Pasar</span>
      </button>
    </div>
  );
};