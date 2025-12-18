

import React, { useState, useEffect } from 'react';
import { GameState, Player, Category, GameConfig, PlayerSetup, VoteMap } from './types';
import { SetupScreen } from './components/SetupScreen';
import { NameSetupScreen } from './components/NameSetupScreen';
import { CategoryScreen } from './components/CategoryScreen';
import { RevealScreen } from './components/RevealScreen';
import { GameLoopScreen } from './components/GameLoopScreen';
import { VotingScreen } from './components/VotingScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { TutorialModal } from './components/TutorialModal';
import { SuddenDeathScreen } from './components/SuddenDeathScreen';
import { CounterAttackScreen } from './components/CounterAttackScreen';
import { generateSecretWord } from './services/geminiService';
import { AlertCircle, Loader2, CircleHelp, Trophy, Skull, PartyPopper, Home } from 'lucide-react';

export const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('SETUP');
  const [gameConfig, setGameConfig] = useState<GameConfig>(() => {
    const saved = localStorage.getItem('impostor_config');
    return saved ? JSON.parse(saved) : {
        playerCount: 4, 
        impostorCount: 1, 
        spyMode: false, 
        hasAccomplice: false,
        hasJester: false,
        hasDetective: false,
        civilWarMode: false,
        roleplayMode: false,
        tabooMode: false,
        inverseMode: false,
        interviewMode: false,
        mimicryMode: false,
        difficulty: 'NORMAL',
        playerSetup: []
    };
  });
  
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [votes, setVotes] = useState<VoteMap>({}); 
  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);
  
  const [secretWordData, setSecretWordData] = useState<any | null>(null);
  const [duelCandidates, setDuelCandidates] = useState<number[]>([]);
  const [isSuddenDeathRound, setIsSuddenDeathRound] = useState(false);
  const [sessionScore, setSessionScore] = useState(() => {
    const saved = localStorage.getItem('impostor_scores');
    return saved ? JSON.parse(saved) : { civilians: 0, impostors: 0, jester: 0 };
  });
  const [counterAttackOutcome, setCounterAttackOutcome] = useState<'SUCCESS' | 'FAIL' | null>(null);

  useEffect(() => {
    localStorage.setItem('impostor_config', JSON.stringify(gameConfig));
  }, [gameConfig]);

  useEffect(() => {
    localStorage.setItem('impostor_scores', JSON.stringify(sessionScore));
  }, [sessionScore]);

  const handleStartSetup = (config: GameConfig) => {
    setGameConfig(prev => ({ ...prev, ...config }));
    setGameState('NAME_SETUP');
  };

  const handleNamesConfirmed = (setup: PlayerSetup[]) => {
    setGameConfig(prev => ({ ...prev, playerSetup: setup }));
    setGameState('CATEGORY_SELECT');
  };

  const assignRoles = (config: GameConfig, wordData: any): Player[] => {
    const total = config.playerCount;
    const roles: Player[] = config.playerSetup.map((p, i) => ({
      id: i + 1,
      name: p.name,
      avatar: p.avatar,
      role: 'CIVILIAN',
      word: wordData.word,
      context: wordData.context,
      revealed: false,
      forbiddenWord: wordData.forbiddenWord
    }));

    // Impostores
    let assignedImpostors = 0;
    while (assignedImpostors < config.impostorCount) {
      const randomIndex = Math.floor(Math.random() * total);
      if (roles[randomIndex].role === 'CIVILIAN') {
        roles[randomIndex].role = 'IMPOSTOR';
        roles[randomIndex].forbiddenWord = undefined;
        if (config.spyMode && wordData.spyWord) {
           roles[randomIndex].word = wordData.spyWord;
           roles[randomIndex].context = wordData.spyContext;
        } else {
           roles[randomIndex].word = 'IMPOSTOR';
        }
        assignedImpostors++;
      }
    }

    // Otros roles (Bufón, Cómplice, Detective)
    const addRole = (roleType: any, minPlayers: number) => {
        if (total >= minPlayers) {
            let assigned = false;
            while (!assigned) {
                const idx = Math.floor(Math.random() * total);
                if (roles[idx].role === 'CIVILIAN') {
                    roles[idx].role = roleType;
                    assigned = true;
                }
            }
        }
    };

    if (config.hasJester) addRole('JESTER', 4);
    if (config.hasAccomplice) addRole('ACCOMPLICE', 5);
    if (config.hasDetective) addRole('DETECTIVE', 5);

    // Modo Inverso
    if (config.inverseMode) {
        const civilians = roles.filter(p => p.role === 'CIVILIAN');
        if (civilians.length > 0) {
            const guide = civilians[Math.floor(Math.random() * civilians.length)];
            roles.forEach(p => {
                if (p.id === guide.id) { p.isGuide = true; }
                else if (p.role !== 'IMPOSTOR') {
                    p.word = "???";
                    p.vagueHint = wordData.vagueHint;
                }
                if (p.role === 'IMPOSTOR') p.word = wordData.word;
            });
        }
    }

    // Guerra Civil
    if (config.civilWarMode && wordData.wordB && !config.inverseMode) {
        const teamable = roles.filter(p => p.role !== 'IMPOSTOR');
        const mid = Math.ceil(teamable.length / 2);
        teamable.slice(mid).forEach(p => {
            const target = roles.find(r => r.id === p.id);
            if (target) { target.word = wordData.wordB; target.context = wordData.wordBContext; }
        });
    }

    // Roleplay
    if (config.roleplayMode && wordData.roles) {
        roles.forEach((p, i) => { if (wordData.roles[i]) p.character = wordData.roles[i]; });
    }
    
    // Conocimiento compartido
    const impIds = roles.filter(p => p.role === 'IMPOSTOR').map(p => p.id);
    roles.forEach(p => {
        if (p.role === 'ACCOMPLICE') p.impostorIds = impIds;
        if (p.role === 'IMPOSTOR') p.impostorIds = impIds.filter(id => id !== p.id);
        if (p.role === 'DETECTIVE') {
            const safe = roles.filter(r => r.role !== 'IMPOSTOR' && r.id !== p.id);
            if (safe.length) p.detectiveKnownSafeId = safe[Math.floor(Math.random() * safe.length)].id;
        }
    });

    return roles;
  };

  const handleCategorySelect = async (category: Category) => {
    setSelectedCategory(category);
    setIsLoading(true);
    try {
      // FIX: Use gameConfig state variable instead of non-existent config
      const data = await generateSecretWord(
          category.name, gameConfig.spyMode, gameConfig.civilWarMode, gameConfig.roleplayMode,
          gameConfig.tabooMode, gameConfig.inverseMode, gameConfig.interviewMode, gameConfig.mimicryMode, gameConfig.difficulty
      );
      setSecretWordData(data);
      setPlayers(assignRoles(gameConfig, data));
      setCurrentPlayerIndex(0);
      setGameState('REVEAL_ROLES');
    } catch (err) {
      setError("Error al preparar la partida.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualStart = (w: string, c?: string, sw?: string, sc?: string, wb?: string, wbc?: string, fw?: string, vh?: string, qs?: string[]) => {
     const data = { word: w, context: c || '', spyWord: sw, spyContext: sc, wordB: wb, wordBContext: wbc, forbiddenWord: fw, vagueHint: vh, questions: qs, decoys: [] };
     setSecretWordData(data);
     setPlayers(assignRoles(gameConfig, data));
     setCurrentPlayerIndex(0);
     setGameState('REVEAL_ROLES');
  };

  const handleGameResult = (winner: 'CIVILIANS' | 'IMPOSTORS' | 'JESTER') => {
    setSessionScore((prev: any) => ({ ...prev, [winner.toLowerCase()]: prev[winner.toLowerCase()] + 1 }));
  };

  const handleResetGame = () => {
    setGameState('SETUP');
    setPlayers([]);
    setVotes({});
    setCounterAttackOutcome(null);
    setIsSuddenDeathRound(false);
  };

  return (
    <div className="min-h-screen text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>
      <div className="glass-panel max-w-md w-full rounded-3xl shadow-2xl border border-white/10 min-h-[600px] flex flex-col relative z-0">
        
        <div className="p-4 bg-slate-900/40 border-b border-white/5 text-center relative flex flex-col items-center backdrop-blur-sm z-10">
          {gameState !== 'SETUP' && (
            <button onClick={() => setShowExitConfirm(true)} className="absolute left-4 top-4 text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full z-50 cursor-pointer">
                <Home size={24} />
            </button>
          )}
          <button onClick={() => setShowTutorial(true)} className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full z-50 cursor-pointer">
            <CircleHelp size={24} />
          </button>

          <div className="py-4">
            <h1 className="text-4xl font-black text-white drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]">The Impxstor</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">¿Eres un verdadero Yévenes?</p>
          </div>
          
          <div className="flex gap-4 mt-2 text-xs font-bold bg-black/30 px-4 py-1 rounded-full border border-white/5">
            <div className="flex items-center gap-1.5 text-emerald-400"><Trophy size={12} /><span>Civs: {sessionScore.civilians}</span></div>
            <div className="w-px h-3 bg-white/10"></div>
            <div className="flex items-center gap-1.5 text-rose-400"><Skull size={12} /><span>Imps: {sessionScore.impostors}</span></div>
            {sessionScore.jester > 0 && <><div className="w-px h-3 bg-white/10"></div><div className="flex items-center gap-1.5 text-orange-400"><PartyPopper size={12} /><span>Bufón: {sessionScore.jester}</span></div></>}
          </div>
        </div>

        <div className="flex-1 flex flex-col p-6 relative z-0">
          {error && <div className="p-3 bg-red-500/20 border-b border-red-500/30 text-red-200 text-xs mb-4 rounded-lg flex justify-between"><span>{error}</span><button onClick={() => setError(null)}>✕</button></div>}
          
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-12 h-12 text-indigo-400 animate-spin" />
              <p className="text-slate-400 text-sm font-bold animate-pulse">Cargando partida...</p>
            </div>
          ) : (
            <>
              {gameState === 'SETUP' && <SetupScreen onStart={handleStartSetup} initialConfig={gameConfig} />}
              {gameState === 'NAME_SETUP' && <NameSetupScreen count={gameConfig.playerCount} initialSetup={gameConfig.playerSetup} onConfirm={handleNamesConfirmed} onBack={() => setGameState('SETUP')} />}
              {gameState === 'CATEGORY_SELECT' && <CategoryScreen onSelect={handleCategorySelect} onManualStart={handleManualStart} onBack={() => setGameState('NAME_SETUP')} interviewMode={gameConfig.interviewMode} civilWarMode={gameConfig.civilWarMode} tabooMode={gameConfig.tabooMode} inverseMode={gameConfig.inverseMode} />}
              {gameState === 'REVEAL_ROLES' && <RevealScreen player={players[currentPlayerIndex]} totalPlayers={players.length} currentIndex={currentPlayerIndex} categoryName={selectedCategory?.name || 'General'} onNext={() => currentPlayerIndex < players.length - 1 ? setCurrentPlayerIndex(v => v + 1) : setGameState('PLAYING')} players={players} isMimicryMode={gameConfig.mimicryMode} />}
              {gameState === 'PLAYING' && <GameLoopScreen players={players} category={selectedCategory?.name || 'General'} onVote={() => { setCurrentPlayerIndex(0); setVotes({}); setGameState('VOTING'); }} interviewQuestions={secretWordData?.questions} onTwist={() => {}} />}
              {gameState === 'VOTING' && <VotingScreen voter={players[currentPlayerIndex]} allPlayers={players} totalPlayers={players.length} currentIndex={currentPlayerIndex} onVote={(id) => { setVotes(v => ({...v, [players[currentPlayerIndex].id]: id})); if (currentPlayerIndex < players.length - 1) setCurrentPlayerIndex(v => v + 1); else setGameState('RESULTS'); }} restrictToIds={isSuddenDeathRound ? duelCandidates : undefined} />}
              {gameState === 'RESULTS' && <ResultsScreen players={players} votes={votes} onRestart={handleResetGame} onResult={!counterAttackOutcome ? handleGameResult : undefined} onTie={(ids) => { setDuelCandidates(ids); setIsSuddenDeathRound(true); setGameState('SUDDEN_DEATH'); }} onCounterAttack={() => setGameState('COUNTERATTACK')} isSuddenDeath={isSuddenDeathRound} counterAttackOutcome={counterAttackOutcome} />}
              {gameState === 'SUDDEN_DEATH' && <SuddenDeathScreen candidates={players.filter(p => duelCandidates.includes(p.id))} onProceed={() => { setCurrentPlayerIndex(0); setVotes({}); setGameState('VOTING'); }} />}
              {gameState === 'COUNTERATTACK' && <CounterAttackScreen secretWord={secretWordData.word} decoys={secretWordData.decoys} onResult={(success) => { handleGameResult(success ? 'IMPOSTORS' : 'CIVILIANS'); setCounterAttackOutcome(success ? 'SUCCESS' : 'FAIL'); setGameState('RESULTS'); }} />}
            </>
          )}
        </div>
      </div>

      <div className="mt-8 text-[10px] text-slate-500/30 font-bold uppercase tracking-widest text-center">The Impxstor | Yévenes Edition | 2025</div>
      {showTutorial && <TutorialModal onClose={() => setShowTutorial(false)} />}
      {showExitConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl max-w-sm w-full text-center">
                <h3 className="text-xl font-bold text-white mb-2">¿Volver al inicio?</h3>
                <p className="text-slate-400 mb-6 text-sm">Se perderá el progreso actual.</p>
                <div className="flex gap-3">
                    <button onClick={() => setShowExitConfirm(false)} className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold">Cancelar</button>
                    <button onClick={() => { handleResetGame(); setShowExitConfirm(false); }} className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold">Salir</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
