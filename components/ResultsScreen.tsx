import React, { useMemo, useEffect, useRef } from 'react';
import { Player, VoteMap } from '../types';
import { RotateCcw, Skull, PartyPopper, Meh, Target } from 'lucide-react';

interface ResultsScreenProps {
  players: Player[];
  votes: VoteMap; // VoterId -> SuspectId
  onRestart: () => void;
  onResult?: (winner: 'CIVILIANS' | 'IMPOSTORS' | 'JESTER') => void;
  onTie?: (candidates: number[]) => void;
  onCounterAttack?: () => void;
  isSuddenDeath?: boolean;
  counterAttackOutcome?: 'SUCCESS' | 'FAIL' | null;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ 
  players, 
  votes, 
  onRestart, 
  onResult,
  onTie,
  onCounterAttack,
  isSuddenDeath,
  counterAttackOutcome
}) => {
  const hasResultReported = useRef(false);

  const result = useMemo(() => {
    // Count votes (ignoring -1 skips)
    const voteCounts: Record<number, number> = {};
    Object.values(votes).forEach((val) => {
      if (val !== -1) {
        const suspectId = val as number;
        voteCounts[suspectId] = (voteCounts[suspectId] || 0) + 1;
      }
    });

    // Find player(s) with max votes
    let maxVotes = -1;
    let candidates: number[] = [];

    Object.entries(voteCounts).forEach(([idStr, count]) => {
      const id = parseInt(idStr);
      if (count > maxVotes) {
        maxVotes = count;
        candidates = [id];
      } else if (count === maxVotes) {
        candidates.push(id);
      }
    });

    const isTie = candidates.length > 1;
    const victim = !isTie ? players.find(p => p.id === candidates[0]) : undefined;
    
    // Outcome Logic
    let winner: 'CIVILIANS' | 'IMPOSTORS' | 'JESTER' | null = null;
    let triggerCounterAttack = false;

    if (isTie) {
        if (isSuddenDeath) {
            // Tie in Sudden Death -> Impostors Win
            winner = 'IMPOSTORS';
        } else {
            // Normal Tie -> Trigger Sudden Death
            winner = null; 
        }
    } else {
        // Single victim
        if (victim?.role === 'JESTER') {
            winner = 'JESTER';
        } else if (victim?.role === 'IMPOSTOR') {
            // Impostor caught! 
            // Trigger Counterattack instead of immediate Civilian win
            triggerCounterAttack = true;
            winner = null; // Wait for counterattack
        } else {
            // Victim is Civilian or Accomplice -> Impostors Win
            winner = 'IMPOSTORS';
        }
    }

    return { victim, isTie, tiedIds: candidates, winner, maxVotes, triggerCounterAttack };
  }, [players, votes, isSuddenDeath]);

  // Handle Side Effects
  useEffect(() => {
    if (hasResultReported.current) return;

    if (result.isTie && !isSuddenDeath) {
        if (onTie) {
            hasResultReported.current = true;
            setTimeout(() => onTie(result.tiedIds), 100);
        }
    } else if (result.winner) {
        if (onResult) {
            hasResultReported.current = true;
            onResult(result.winner);
        }
    }
    // Note: We don't auto-trigger Counterattack; user must click the button.
  }, [result, isSuddenDeath, onTie, onResult]);

  // Loading state for Tie calc
  if (result.isTie && !isSuddenDeath) {
      return (
          <div className="flex flex-col items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
              <p className="text-xl font-bold">Calculando desempate...</p>
          </div>
      );
  }

  // Counterattack Interstitial
  // Only show if impostor was caught AND we haven't finished the counterattack yet
  if (result.triggerCounterAttack && !counterAttackOutcome) {
      return (
        <div className="flex flex-col h-full animate-in zoom-in duration-500 items-center justify-center text-center p-6">
            <div className="bg-red-500/20 p-6 rounded-full mb-6 animate-pulse">
                <Target size={64} className="text-red-500" />
            </div>
            
            <h2 className="text-3xl font-black text-white mb-2">¡IMPOSTOR ATRAPADO!</h2>
            <p className="text-xl text-slate-300 mb-8">
                El jugador expulsado es <span className="font-bold text-red-400">{result.victim?.name}</span>.
            </p>

            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 max-w-xs mx-auto mb-8 shadow-xl">
                 <p className="text-sm text-slate-400 mb-2">Pero tiene una última oportunidad...</p>
                 <p className="font-bold text-white leading-tight">
                    Si adivina la palabra secreta, <span className="text-red-400">ROBA LA VICTORIA</span>.
                 </p>
            </div>

            <button 
                onClick={onCounterAttack}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 px-6 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all transform hover:scale-105"
            >
                INICIAR CONTRAGOLPE
            </button>
        </div>
      );
  }

  // Determine final display winner
  // If we have a counterattack outcome, that dictates the winner.
  // Otherwise fall back to the calculated result.
  let displayWinner = result.winner;
  if (counterAttackOutcome === 'SUCCESS') displayWinner = 'IMPOSTORS';
  if (counterAttackOutcome === 'FAIL') displayWinner = 'CIVILIANS';

  // Standard Result View
  return (
    <div className="flex flex-col h-full animate-in zoom-in duration-500">
      
      {/* Header Result */}
      <div className="text-center mb-4 mt-2">
        {displayWinner === 'JESTER' ? (
          <div className="flex flex-col items-center">
             <PartyPopper size={48} className="text-orange-400 mb-2 animate-bounce" />
             <h2 className="text-2xl font-black text-orange-400 uppercase tracking-widest">¡Ganó el Bufón!</h2>
             <p className="text-slate-400 text-sm mt-1">Consiguió que lo expulsaran.</p>
          </div>
        ) : displayWinner === 'CIVILIANS' ? (
          <div className="flex flex-col items-center">
            <PartyPopper size={48} className="text-green-400 mb-2 animate-bounce" />
            <h2 className="text-2xl font-black text-green-400 uppercase tracking-widest">¡Ganaron los Civiles!</h2>
            <p className="text-slate-400 text-sm mt-1">
                {counterAttackOutcome === 'FAIL' ? "El impostor falló el contragolpe." : "Descubrieron al impostor."}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
             <Skull size={48} className="text-red-500 mb-2 animate-pulse" />
             <h2 className="text-2xl font-black text-red-500 uppercase tracking-widest">¡Gana el Impostor!</h2>
             <p className="text-slate-400 text-sm mt-1">
               {counterAttackOutcome === 'SUCCESS' ? "Acertó el contragolpe y robó la victoria." : 
                result.isTie ? "Empate en el duelo final." : "Expulsaron a un inocente."}
             </p>
          </div>
        )}
      </div>

      {/* Execution Box */}
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 text-center mb-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-500 to-transparent opacity-20" />
        <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Resultado Votación</p>
        
        {result.isTie ? (
           <div className="flex flex-col items-center text-slate-300">
              <Meh size={32} className="mb-2" />
              <span className="text-xl font-bold">Empate Definitivo</span>
              <span className="text-xs text-slate-500">Los civiles no se pusieron de acuerdo.</span>
           </div>
        ) : (
           <div className="flex flex-col items-center">
              <span className="text-3xl mb-1">{result.victim?.avatar}</span>
              <p className="text-2xl font-black text-white mb-1">{result.victim?.name}</p>
              
              <div className="flex flex-col items-center">
                <p className={`text-sm font-bold ${
                    result.victim?.role === 'IMPOSTOR' ? 'text-red-400' : 
                    result.victim?.role === 'JESTER' ? 'text-orange-400' :
                    result.victim?.role === 'DETECTIVE' ? 'text-cyan-400' :
                    'text-green-400'
                }`}>
                    Era: {
                        result.victim?.role === 'IMPOSTOR' ? 'EL IMPOSTOR' : 
                        result.victim?.role === 'JESTER' ? 'EL BUFÓN' :
                        result.victim?.role === 'DETECTIVE' ? 'EL DETECTIVE' :
                        'INOCENTE'
                    }
                </p>
              </div>

              {result.victim?.role !== 'IMPOSTOR' && result.victim?.role !== 'JESTER' && (
                  <p className="text-[10px] text-slate-500 mt-1">({result.maxVotes} votos)</p>
              )}
           </div>
        )}
      </div>

      {/* WALL OF BETRAYAL & IDENTITIES */}
      <div className="flex-1 overflow-y-auto pb-4 custom-scrollbar">
        <h3 className="text-xs font-bold text-slate-400 mb-3 px-1 uppercase tracking-wide">Muro de la Traición</h3>
        <div className="space-y-3">
           {players.map(p => {
             // Find who voted for this player
             const voters = players.filter(voter => votes[voter.id] === p.id);
             
             return (
               <div key={p.id} className="bg-slate-700/30 p-3 rounded-lg border border-slate-700 flex flex-col gap-2">
                  {/* Top Row: Identity */}
                  <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">{p.avatar}</span>
                        <span className="font-bold text-slate-200">{p.name}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded
                       ${p.role === 'IMPOSTOR' ? 'bg-red-900/50 text-red-200 border border-red-800' : 
                         p.role === 'ACCOMPLICE' ? 'bg-purple-900/50 text-purple-200 border border-purple-800' :
                         p.role === 'JESTER' ? 'bg-orange-900/50 text-orange-200 border border-orange-800' :
                         p.role === 'DETECTIVE' ? 'bg-cyan-900/50 text-cyan-200 border border-cyan-800' :
                         'bg-green-900/50 text-green-200 border border-green-800'}
                    `}>
                      {p.role === 'IMPOSTOR' ? 'IMPOSTOR' : 
                       p.role === 'ACCOMPLICE' ? 'CÓMPLICE' : 
                       p.role === 'JESTER' ? 'BUFÓN' : 
                       p.role === 'DETECTIVE' ? 'DETECTIVE' :
                       'CIVIL'}
                    </span>
                  </div>
                  
                  {/* Bottom Row: Who voted for them */}
                  <div className="flex items-center gap-2 text-xs">
                     <span className="text-slate-500 w-16">Votado por:</span>
                     {voters.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                            {voters.map(v => (
                                <div key={v.id} className="bg-slate-800 px-2 py-1 rounded-full border border-slate-600 flex items-center gap-1 text-slate-300" title={v.name}>
                                    <span>{v.avatar}</span>
                                    <span className="max-w-[60px] truncate">{v.name}</span>
                                </div>
                            ))}
                        </div>
                     ) : (
                        <span className="text-slate-600 italic">Nadie</span>
                     )}
                  </div>
               </div>
             );
           })}
        </div>
      </div>

      <div className="mt-4">
        <button 
          onClick={onRestart}
          className="w-full bg-indigo-600 hover:bg-indigo-500 border-t border-indigo-400 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw size={20} />
          <span>Jugar Otra Vez</span>
        </button>
      </div>
    </div>
  );
};