import React, { useState, useRef, useEffect } from 'react';
import { MessageCircleQuestion, Eye, ShieldCheck, Play, Gavel, PartyPopper, Search, Zap, RefreshCw, Shuffle, X, Mic, RefreshCcw, Loader2 } from 'lucide-react';
import { Player } from '../types';

interface GameLoopScreenProps {
  category: string;
  players: Player[];
  onVote: () => void;
  isSpyMode?: boolean;
  hasAccomplice?: boolean;
  hasJester?: boolean;
  hasDetective?: boolean;
  onTwist: (type: 'NEW_WORD' | 'CHAOS') => void;
  interviewQuestions?: string[];
}

export const GameLoopScreen: React.FC<GameLoopScreenProps> = ({ 
  category, 
  players,
  onVote,
  isSpyMode,
  hasAccomplice,
  hasJester,
  hasDetective,
  onTwist,
  interviewQuestions
}) => {
  const [startingPlayer, setStartingPlayer] = useState<Player | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [showTwistMenu, setShowTwistMenu] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);

  // Clean up interval on unmount just in case
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

  const pickStarter = () => {
    if (isRolling) return;
    setIsRolling(true);
    setStartingPlayer(null);

    let counter = 0;
    const totalShuffles = 15; // Number of times names change
    const speed = 100; // Speed in ms

    intervalRef.current = window.setInterval(() => {
      const randomIndex = Math.floor(Math.random() * players.length);
      setStartingPlayer(players[randomIndex]);
      counter++;

      if (counter >= totalShuffles) {
        if (intervalRef.current) window.clearInterval(intervalRef.current);
        setIsRolling(false);
        // The last one set is the winner
      }
    }, speed);
  };

  const nextQuestion = () => {
      if (interviewQuestions) {
          setQuestionIndex((prev) => (prev + 1) % interviewQuestions.length);
      }
  };

  return (
    <div className="flex flex-col h-full justify-between items-center text-center animate-in zoom-in-50 duration-500 relative">
      
      {/* Header Buttons */}
      <div className="absolute top-0 right-0">
          <button 
            onClick={() => setShowTwistMenu(true)}
            className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 p-2 rounded-full border border-amber-500/50 transition-all shadow-lg shadow-amber-900/20"
            title="Giro Dramático"
          >
              <Zap size={24} className="fill-current" />
          </button>
      </div>

      <div className="mt-4 space-y-4 w-full flex-1 flex flex-col justify-start pt-4">
        <div className="relative mx-auto mb-2">
             <div className="w-24 h-24 bg-indigo-500/10 backdrop-blur-md border border-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-2 animate-float shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                {interviewQuestions ? <Mic size={48} className="text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" /> : <MessageCircleQuestion size={48} className="text-indigo-400 drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]" />}
            </div>
            {/* Mode Indicators */}
            <div className="flex justify-center gap-2 mb-2 flex-wrap max-w-xs mx-auto">
                {isSpyMode && (
                    <div className="bg-indigo-600/80 backdrop-blur text-white px-3 py-1 text-xs font-bold rounded-full shadow-lg border border-white/10 flex items-center gap-1">
                        <Eye size={12} /> Espía
                    </div>
                )}
                {hasAccomplice && (
                    <div className="bg-purple-600/80 backdrop-blur text-white px-3 py-1 text-xs font-bold rounded-full shadow-lg border border-white/10 flex items-center gap-1">
                        <ShieldCheck size={12} /> Cómplice
                    </div>
                )}
                 {hasJester && (
                    <div className="bg-orange-600/80 backdrop-blur text-white px-3 py-1 text-xs font-bold rounded-full shadow-lg border border-white/10 flex items-center gap-1">
                        <PartyPopper size={12} /> Bufón
                    </div>
                )}
                {hasDetective && (
                    <div className="bg-cyan-600/80 backdrop-blur text-white px-3 py-1 text-xs font-bold rounded-full shadow-lg border border-white/10 flex items-center gap-1">
                        <Search size={12} /> Detective
                    </div>
                )}
            </div>
        </div>

        {interviewQuestions && interviewQuestions.length > 0 ? (
            <div className="w-full max-w-sm mx-auto bg-blue-600/10 backdrop-blur-md border border-blue-500/30 p-5 rounded-2xl relative shadow-lg">
                <div className="flex justify-between items-start mb-2">
                     <p className="text-xs text-blue-300 uppercase font-bold flex items-center gap-1">
                        <Mic size={12} /> Pregunta de la Ronda
                     </p>
                     <button onClick={nextQuestion} className="text-slate-400 hover:text-white p-1 hover:bg-white/10 rounded" title="Cambiar pregunta">
                        <RefreshCcw size={14} />
                     </button>
                </div>
                <p className="text-xl font-black text-white leading-tight">
                    {interviewQuestions[questionIndex]}
                </p>
                <p className="text-[10px] text-slate-400 mt-2">
                    Responded a esto para dar vuestras pistas.
                </p>
            </div>
        ) : (
            <div>
                <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 mb-2 drop-shadow-sm">¡A Debatir!</h2>
                <div className="bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-white/10 max-w-xs mx-auto w-full mb-4">
                    <p className="text-xs text-slate-400 uppercase tracking-widest mb-1 font-bold">Categoría</p>
                    <p className="text-2xl font-bold text-indigo-300">{category}</p>
                </div>
            </div>
        )}

        {/* Who Starts Feature */}
        <div className="h-24 flex items-center justify-center">
            {startingPlayer ? (
                <div className={`
                    animate-in fade-in zoom-in duration-300 
                    px-6 py-2 rounded-xl flex items-center gap-4 shadow-lg
                    ${isRolling 
                        ? 'bg-slate-700/50 border border-slate-600' 
                        : 'bg-emerald-500/20 backdrop-blur border border-emerald-500/30 shadow-emerald-500/10'
                    }
                `}>
                    <span className="text-4xl filter drop-shadow-md">{startingPlayer.avatar}</span>
                    <div className="text-left">
                        <p className={`text-[10px] font-bold uppercase tracking-wider ${isRolling ? 'text-slate-400' : 'text-emerald-300'}`}>
                            {isRolling ? 'Sorteando...' : 'Debe empezar'}
                        </p>
                        <p className="text-xl font-black text-white">{startingPlayer.name}</p>
                    </div>
                </div>
            ) : (
                 <button 
                    onClick={pickStarter}
                    disabled={isRolling}
                    className="group bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white px-6 py-3 rounded-full transition-all flex items-center gap-2 text-sm border border-white/10 hover:border-white/20 shadow-lg"
                >
                    {isRolling ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} className="fill-current group-hover:scale-110 transition-transform" />}
                    <span>¿Quién empieza?</span>
                </button>
            )}
        </div>
      </div>

      <div className="w-full space-y-3 pt-4">
        <button 
          onClick={onVote}
          className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-black py-5 px-6 rounded-2xl shadow-[0_0_30px_rgba(220,38,38,0.4)] hover:shadow-[0_0_40px_rgba(220,38,38,0.6)] transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3 animate-pulse"
        >
          <Gavel size={28} className="fill-white/20" />
          <span className="text-lg tracking-wide uppercase">Iniciar Votación</span>
        </button>
      </div>

      {/* Twist Menu Modal */}
      {showTwistMenu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-slate-900/90 rounded-3xl shadow-2xl w-full max-w-sm border border-white/10 p-6 relative overflow-hidden">
                {/* Background glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full pointer-events-none"></div>

                <button 
                    onClick={() => setShowTwistMenu(false)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
                >
                    <X size={24} />
                </button>
                
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-amber-500/20 p-5 rounded-full mb-4 text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                        <Zap size={40} className="fill-current" />
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-wide">Giro Dramático</h3>
                    <p className="text-slate-400 text-sm text-center mt-2 max-w-[200px]">
                        ¿La partida está estancada? ¡Agita las cosas!
                    </p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={() => { setShowTwistMenu(false); onTwist('NEW_WORD'); }}
                        className="w-full bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 p-4 rounded-2xl flex items-center gap-4 transition-all group text-left hover:border-indigo-500/50"
                    >
                        <div className="bg-indigo-500 p-3 rounded-xl text-white group-hover:scale-110 transition-transform shadow-lg shadow-indigo-500/20">
                            <RefreshCw size={24} />
                        </div>
                        <div>
                            <p className="font-bold text-indigo-300 text-lg">Cambio de Tema</p>
                            <p className="text-xs text-slate-400 mt-1">Nueva palabra, <span className="text-white font-bold">MISMOS</span> roles.</p>
                        </div>
                    </button>

                    <button
                        onClick={() => { setShowTwistMenu(false); onTwist('CHAOS'); }}
                        className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 p-4 rounded-2xl flex items-center gap-4 transition-all group text-left hover:border-red-500/50"
                    >
                        <div className="bg-red-500 p-3 rounded-xl text-white group-hover:scale-110 transition-transform shadow-lg shadow-red-500/20">
                            <Shuffle size={24} />
                        </div>
                        <div>
                            <p className="font-bold text-red-400 text-lg">Revolución (Caos)</p>
                            <p className="text-xs text-slate-400 mt-1">Nueva palabra y <span className="text-white font-bold">NUEVOS</span> roles.</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};