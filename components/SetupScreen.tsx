import React, { useState, useEffect } from 'react';
import { Users, UserX, ArrowRight, Eye, ShieldCheck, Smile, BrainCircuit, Swords, Drama, Ban, Puzzle, Mic, Search, Hand } from 'lucide-react';
import { GameConfig, Difficulty } from '../types';

interface SetupScreenProps {
  onStart: (config: GameConfig) => void;
  initialConfig?: GameConfig;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ onStart, initialConfig }) => {
  const [players, setPlayers] = useState(initialConfig?.playerCount || 4);
  const [impostors, setImpostors] = useState(initialConfig?.impostorCount || 1);
  const [spyMode, setSpyMode] = useState(initialConfig?.spyMode || false);
  const [hasAccomplice, setHasAccomplice] = useState(initialConfig?.hasAccomplice || false);
  const [hasJester, setHasJester] = useState(initialConfig?.hasJester || false);
  const [hasDetective, setHasDetective] = useState(initialConfig?.hasDetective || false);
  const [civilWarMode, setCivilWarMode] = useState(initialConfig?.civilWarMode || false);
  const [roleplayMode, setRoleplayMode] = useState(initialConfig?.roleplayMode || false);
  const [tabooMode, setTabooMode] = useState(initialConfig?.tabooMode || false);
  const [inverseMode, setInverseMode] = useState(initialConfig?.inverseMode || false);
  const [interviewMode, setInterviewMode] = useState(initialConfig?.interviewMode || false);
  const [mimicryMode, setMimicryMode] = useState(initialConfig?.mimicryMode || false);
  const [difficulty, setDifficulty] = useState<Difficulty>(initialConfig?.difficulty || 'NORMAL');

  // Constraints
  useEffect(() => {
    // Impostors constraint
    if (impostors >= players) setImpostors(players - 1);
    
    // Accomplice constraint: Needs at least 5 players (3 civs, 1 imp, 1 accomplice)
    if (players < 5 && hasAccomplice) setHasAccomplice(false);

    // Jester constraint: Needs at least 4 players
    if (players < 4 && hasJester) setHasJester(false);

    // Detective constraint: Needs at least 5 players to be useful
    if (players < 5 && hasDetective) setHasDetective(false);
    
  }, [players, impostors, hasAccomplice, hasJester, hasDetective]);

  return (
    <div className="flex flex-col h-full justify-between animate-in fade-in zoom-in duration-300">
      <div className="space-y-4 mt-2 overflow-y-auto pb-4 custom-scrollbar pr-2">
        
        {/* Player Count */}
        <div className="bg-black/20 backdrop-blur-md p-5 rounded-2xl border border-white/5 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2 text-indigo-300">
              <Users size={20} />
              <span className="font-bold uppercase tracking-wider text-sm">Jugadores</span>
            </div>
            <span className="text-3xl font-black text-white">{players}</span>
          </div>
          <input 
            type="range" min="3" max="12" value={players} 
            onChange={(e) => setPlayers(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
          />
        </div>

        {/* Impostor Count */}
        <div className="bg-black/20 backdrop-blur-md p-5 rounded-2xl border border-white/5 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2 text-red-400">
              <UserX size={20} />
              <span className="font-bold uppercase tracking-wider text-sm">Impostores</span>
            </div>
            <div className="flex items-center gap-4">
                <button onClick={() => setImpostors(Math.max(1, impostors - 1))} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold hover:bg-white/20 transition-colors">-</button>
                <span className="text-3xl font-black text-white">{impostors}</span>
                <button onClick={() => setImpostors(Math.min(players - 1, impostors + 1))} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold hover:bg-white/20 transition-colors">+</button>
            </div>
          </div>
        </div>

        {/* Difficulty Selector */}
        <div className="bg-black/20 backdrop-blur-md p-4 rounded-2xl border border-white/5">
            <div className="flex items-center gap-2 text-emerald-300 mb-3">
              <BrainCircuit size={20} />
              <span className="font-bold uppercase tracking-wider text-sm">Dificultad IA</span>
            </div>
            <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/5">
                <button 
                  onClick={() => setDifficulty('EASY')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${difficulty === 'EASY' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  FÁCIL
                </button>
                <button 
                  onClick={() => setDifficulty('NORMAL')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${difficulty === 'NORMAL' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  NORMAL
                </button>
                <button 
                  onClick={() => setDifficulty('HARD')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${difficulty === 'HARD' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  EXPERTO
                </button>
            </div>
             <p className="text-[10px] text-slate-400 mt-2 text-center h-4">
              {difficulty === 'EASY' && "Palabras sencillas y objetos cotidianos."}
              {difficulty === 'NORMAL' && "Equilibrado. Palabras estándar y variadas."}
              {difficulty === 'HARD' && "Conceptos abstractos y palabras complejas."}
            </p>
        </div>

        {/* --- MODES --- */}
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest pl-2 mt-6 mb-2">Modos de Juego</h3>
        
        {/* Mimicry Mode Toggle */}
        <div 
          onClick={() => setMimicryMode(!mimicryMode)}
          className={`p-4 rounded-2xl border cursor-pointer transition-all flex justify-between items-center group
            ${mimicryMode 
                ? 'bg-lime-600/20 border-lime-500/50 shadow-[0_0_15px_rgba(101,163,13,0.2)]' 
                : 'bg-black/20 border-white/5 hover:bg-white/5 hover:border-white/10'}`}
        >
          <div className="flex items-center gap-4">
            <div className={`p-2.5 rounded-xl transition-colors ${mimicryMode ? 'bg-lime-500 text-white shadow-lg shadow-lime-500/30' : 'bg-slate-800 text-slate-500'}`}>
               <Hand size={20} />
            </div>
            <div>
              <p className={`font-bold transition-colors ${mimicryMode ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>Modo Mímica</p>
              <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                Prohibido hablar. Solo gestos y sonidos.
              </p>
            </div>
          </div>
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${mimicryMode ? 'border-lime-400 bg-lime-500' : 'border-slate-600 group-hover:border-slate-500'}`}>
            {mimicryMode && <div className="w-2.5 h-2.5 bg-white rounded-full shadow-sm" />}
          </div>
        </div>

        {/* Interview Mode Toggle */}
        <div 
          onClick={() => setInterviewMode(!interviewMode)}
          className={`p-4 rounded-2xl border cursor-pointer transition-all flex justify-between items-center group
            ${interviewMode 
                ? 'bg-blue-600/20 border-blue-500/50 shadow-[0_0_15px_rgba(37,99,235,0.2)]' 
                : 'bg-black/20 border-white/5 hover:bg-white/5 hover:border-white/10'}`}
        >
          <div className="flex items-center gap-4">
            <div className={`p-2.5 rounded-xl transition-colors ${interviewMode ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-800 text-slate-500'}`}>
               <Mic size={20} />
            </div>
            <div>
              <p className={`font-bold transition-colors ${interviewMode ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>Modo Entrevista</p>
              <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                La IA propone preguntas temáticas.
              </p>
            </div>
          </div>
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${interviewMode ? 'border-blue-400 bg-blue-500' : 'border-slate-600 group-hover:border-slate-500'}`}>
            {interviewMode && <div className="w-2.5 h-2.5 bg-white rounded-full shadow-sm" />}
          </div>
        </div>

        {/* Spy Mode Toggle */}
        <div 
          onClick={() => setSpyMode(!spyMode)}
          className={`p-4 rounded-2xl border cursor-pointer transition-all flex justify-between items-center group
            ${spyMode 
                ? 'bg-indigo-600/20 border-indigo-500/50 shadow-[0_0_15px_rgba(79,70,229,0.2)]' 
                : 'bg-black/20 border-white/5 hover:bg-white/5 hover:border-white/10'}`}
        >
          <div className="flex items-center gap-4">
            <div className={`p-2.5 rounded-xl transition-colors ${spyMode ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-800 text-slate-500'}`}>
               <Eye size={20} />
            </div>
            <div>
              <p className={`font-bold transition-colors ${spyMode ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>Modo Espía</p>
              <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                El impostor ve una palabra parecida.
              </p>
            </div>
          </div>
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${spyMode ? 'border-indigo-400 bg-indigo-500' : 'border-slate-600 group-hover:border-slate-500'}`}>
            {spyMode && <div className="w-2.5 h-2.5 bg-white rounded-full shadow-sm" />}
          </div>
        </div>

        {/* Inverse Mode Toggle */}
        <div 
          onClick={() => setInverseMode(!inverseMode)}
          className={`p-4 rounded-2xl border cursor-pointer transition-all flex justify-between items-center group
            ${inverseMode 
                ? 'bg-teal-600/20 border-teal-500/50 shadow-[0_0_15px_rgba(13,148,136,0.2)]' 
                : 'bg-black/20 border-white/5 hover:bg-white/5 hover:border-white/10'}`}
        >
          <div className="flex items-center gap-4">
            <div className={`p-2.5 rounded-xl transition-colors ${inverseMode ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30' : 'bg-slate-800 text-slate-500'}`}>
               <Puzzle size={20} />
            </div>
            <div>
              <p className={`font-bold transition-colors ${inverseMode ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>Modo Inverso</p>
              <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                Solo 1 civil sabe la palabra.
              </p>
            </div>
          </div>
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${inverseMode ? 'border-teal-400 bg-teal-500' : 'border-slate-600 group-hover:border-slate-500'}`}>
            {inverseMode && <div className="w-2.5 h-2.5 bg-white rounded-full shadow-sm" />}
          </div>
        </div>

        {/* Taboo Mode Toggle */}
        <div 
          onClick={() => setTabooMode(!tabooMode)}
          className={`p-4 rounded-2xl border cursor-pointer transition-all flex justify-between items-center group
            ${tabooMode 
                ? 'bg-rose-600/20 border-rose-500/50 shadow-[0_0_15px_rgba(225,29,72,0.2)]' 
                : 'bg-black/20 border-white/5 hover:bg-white/5 hover:border-white/10'}`}
        >
          <div className="flex items-center gap-4">
            <div className={`p-2.5 rounded-xl transition-colors ${tabooMode ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' : 'bg-slate-800 text-slate-500'}`}>
               <Ban size={20} />
            </div>
            <div>
              <p className={`font-bold transition-colors ${tabooMode ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>Palabra Tabú</p>
              <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                Una palabra prohibida para los civiles.
              </p>
            </div>
          </div>
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${tabooMode ? 'border-rose-400 bg-rose-500' : 'border-slate-600 group-hover:border-slate-500'}`}>
            {tabooMode && <div className="w-2.5 h-2.5 bg-white rounded-full shadow-sm" />}
          </div>
        </div>

        {/* Civil War Toggle */}
        <div 
          onClick={() => setCivilWarMode(!civilWarMode)}
          className={`p-4 rounded-2xl border cursor-pointer transition-all flex justify-between items-center group
            ${civilWarMode 
                ? 'bg-amber-600/20 border-amber-500/50 shadow-[0_0_15px_rgba(217,119,6,0.2)]' 
                : 'bg-black/20 border-white/5 hover:bg-white/5 hover:border-white/10'}`}
        >
          <div className="flex items-center gap-4">
            <div className={`p-2.5 rounded-xl transition-colors ${civilWarMode ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' : 'bg-slate-800 text-slate-500'}`}>
               <Swords size={20} />
            </div>
            <div>
              <p className={`font-bold transition-colors ${civilWarMode ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>Guerra Civil</p>
              <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                Dos bandos de civiles.
              </p>
            </div>
          </div>
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${civilWarMode ? 'border-amber-400 bg-amber-500' : 'border-slate-600 group-hover:border-slate-500'}`}>
            {civilWarMode && <div className="w-2.5 h-2.5 bg-white rounded-full shadow-sm" />}
          </div>
        </div>

        {/* Roleplay Toggle */}
        <div 
          onClick={() => setRoleplayMode(!roleplayMode)}
          className={`p-4 rounded-2xl border cursor-pointer transition-all flex justify-between items-center group
            ${roleplayMode 
                ? 'bg-pink-600/20 border-pink-500/50 shadow-[0_0_15px_rgba(219,39,119,0.2)]' 
                : 'bg-black/20 border-white/5 hover:bg-white/5 hover:border-white/10'}`}
        >
          <div className="flex items-center gap-4">
            <div className={`p-2.5 rounded-xl transition-colors ${roleplayMode ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30' : 'bg-slate-800 text-slate-500'}`}>
               <Drama size={20} />
            </div>
            <div>
              <p className={`font-bold transition-colors ${roleplayMode ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>Roleplay</p>
              <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                Identidades temáticas.
              </p>
            </div>
          </div>
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${roleplayMode ? 'border-pink-400 bg-pink-500' : 'border-slate-600 group-hover:border-slate-500'}`}>
            {roleplayMode && <div className="w-2.5 h-2.5 bg-white rounded-full shadow-sm" />}
          </div>
        </div>

        {/* --- ROLES --- */}
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest pl-2 mt-6 mb-2">Roles Especiales</h3>

        {/* Accomplice Toggle */}
        <div 
          onClick={() => players >= 5 && setHasAccomplice(!hasAccomplice)}
          className={`p-4 rounded-2xl border transition-all flex justify-between items-center group
            ${players < 5 ? 'opacity-50 cursor-not-allowed border-white/5 bg-black/10' : 'cursor-pointer'}
            ${hasAccomplice 
                ? 'bg-purple-600/20 border-purple-500/50 shadow-[0_0_15px_rgba(147,51,234,0.2)]' 
                : 'bg-black/20 border-white/5 hover:bg-white/5 hover:border-white/10'}
            `}
        >
          <div className="flex items-center gap-4">
             <div className={`p-2.5 rounded-xl transition-colors ${hasAccomplice ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30' : 'bg-slate-800 text-slate-500'}`}>
               <ShieldCheck size={20} />
            </div>
            <div>
              <p className={`font-bold transition-colors ${hasAccomplice ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>Rol Cómplice</p>
              <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                {players < 5 ? "Mínimo 5 jugadores" : "Protege al impostor."}
              </p>
            </div>
          </div>
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${hasAccomplice ? 'border-purple-400 bg-purple-500' : 'border-slate-600 group-hover:border-slate-500'}`}>
            {hasAccomplice && <div className="w-2.5 h-2.5 bg-white rounded-full shadow-sm" />}
          </div>
        </div>

        {/* Detective Toggle */}
        <div 
          onClick={() => players >= 5 && setHasDetective(!hasDetective)}
          className={`p-4 rounded-2xl border transition-all flex justify-between items-center group
            ${players < 5 ? 'opacity-50 cursor-not-allowed border-white/5 bg-black/10' : 'cursor-pointer'}
            ${hasDetective 
                ? 'bg-cyan-600/20 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
                : 'bg-black/20 border-white/5 hover:bg-white/5 hover:border-white/10'}
            `}
        >
          <div className="flex items-center gap-4">
             <div className={`p-2.5 rounded-xl transition-colors ${hasDetective ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' : 'bg-slate-800 text-slate-500'}`}>
               <Search size={20} />
            </div>
            <div>
              <p className={`font-bold transition-colors ${hasDetective ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>Rol Detective</p>
              <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                {players < 5 ? "Mínimo 5 jugadores" : "Conoce a un inocente."}
              </p>
            </div>
          </div>
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${hasDetective ? 'border-cyan-400 bg-cyan-500' : 'border-slate-600 group-hover:border-slate-500'}`}>
            {hasDetective && <div className="w-2.5 h-2.5 bg-white rounded-full shadow-sm" />}
          </div>
        </div>

        {/* Jester Toggle */}
        <div 
          onClick={() => players >= 4 && setHasJester(!hasJester)}
          className={`p-4 rounded-2xl border transition-all flex justify-between items-center group
            ${players < 4 ? 'opacity-50 cursor-not-allowed border-white/5 bg-black/10' : 'cursor-pointer'}
            ${hasJester 
                ? 'bg-orange-600/20 border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.2)]' 
                : 'bg-black/20 border-white/5 hover:bg-white/5 hover:border-white/10'}
            `}
        >
          <div className="flex items-center gap-4">
             <div className={`p-2.5 rounded-xl transition-colors ${hasJester ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-slate-800 text-slate-500'}`}>
               <Smile size={20} />
            </div>
            <div>
              <p className={`font-bold transition-colors ${hasJester ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>Rol Bufón</p>
              <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                {players < 4 ? "Mínimo 4 jugadores" : "Gana si es expulsado."}
              </p>
            </div>
          </div>
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${hasJester ? 'border-orange-400 bg-orange-500' : 'border-slate-600 group-hover:border-slate-500'}`}>
            {hasJester && <div className="w-2.5 h-2.5 bg-white rounded-full shadow-sm" />}
          </div>
        </div>

      </div>

      <button 
        onClick={() => onStart({ 
          playerCount: players, 
          impostorCount: impostors, 
          spyMode, hasAccomplice, hasJester, hasDetective, 
          civilWarMode, roleplayMode, tabooMode, inverseMode, interviewMode, mimicryMode, 
          difficulty, 
          playerSetup: initialConfig?.playerSetup || [] // Pass existing names if available
        })}
        className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-indigo-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
      >
        <span>Siguiente</span>
        <ArrowRight size={20} />
      </button>
    </div>
  );
};