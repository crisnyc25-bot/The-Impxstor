import React, { useState } from 'react';
import { Category } from '../types';
import { 
  Cat, Tv, Apple, MapPin, 
  Briefcase, Music, Car, Dumbbell, 
  Gamepad2, Shuffle, ChevronLeft,
  Film, Cookie, Carrot, Smile, Zap,
  PenTool, Check, Pizza, Shirt, BookOpen, Gift,
  Globe, LayoutGrid, Coffee, Clapperboard, Rocket, Sparkles, UserCog, Lock, Eye, Swords, Ban, Puzzle, Mic,
  Wand2, Shield, Sun, Snowflake, ShoppingBag, Star, HeartPulse, BookHeart, Sword
} from 'lucide-react';

interface CategoryScreenProps {
  onSelect: (category: Category) => void;
  onManualStart: (word: string, context?: string, spyWord?: string, spyContext?: string, wordB?: string, wordBContext?: string, forbiddenWord?: string, vagueHint?: string, questions?: string[]) => void;
  onBack: () => void;
  civilWarMode?: boolean;
  tabooMode?: boolean;
  inverseMode?: boolean;
  interviewMode?: boolean;
}

const CATEGORIES: Category[] = [
  { id: 'custom', name: 'Crear Tema', iconName: 'custom' }, 
  { id: 'manual', name: 'Anfitrión Humano', iconName: 'manual' },
  // Existing
  { id: '1', name: 'Animales', iconName: 'cat' },
  { id: '2', name: 'Series', iconName: 'tv' },
  { id: 'kids-movies', name: 'Pelis Disney/Pixar', iconName: 'film' },
  { id: 'cartoons', name: 'Dibujos Animados', iconName: 'smile' },
  { id: 'toys', name: 'Juguetes', iconName: 'gift' },
  { id: 'fairy-tales', name: 'Cuentos', iconName: 'book' },
  { id: 'fruits', name: 'Frutas y Verduras', iconName: 'carrot' },
  { id: 'sweets', name: 'Dulces y Postres', iconName: 'cookie' },
  { id: 'fast-food', name: 'Comida Rápida', iconName: 'pizza' },
  { id: 'heroes', name: 'Superhéroes', iconName: 'zap' },
  { id: 'clothing', name: 'Ropa / Moda', iconName: 'shirt' },
  { id: '4', name: 'Lugares', iconName: 'map' },
  { id: '5', name: 'Profesiones', iconName: 'job' },
  { id: '6', name: 'Música', iconName: 'music' },
  { id: '7', name: 'Transporte', iconName: 'car' },
  { id: '8', name: 'Deportes', iconName: 'gym' },
  { id: '9', name: 'Videojuegos', iconName: 'game' },
  // New
  { id: 'harry-potter', name: 'Harry Potter', iconName: 'wand' },
  { id: 'marvel', name: 'Marvel', iconName: 'shield' },
  { id: 'fantasy', name: 'Fantasía', iconName: 'sword' },
  { id: 'bible', name: 'Biblia', iconName: 'bible' },
  { id: 'anatomy', name: 'Anatomía', iconName: 'heart' },
  { id: 'brands', name: 'Marcas', iconName: 'bag' },
  { id: 'celebs', name: 'Celebridades', iconName: 'star' },
  { id: 'summer', name: 'Verano', iconName: 'sun' },
  { id: 'christmas', name: 'Navidad', iconName: 'snow' },
];

interface CategoryGroup {
  id: string;
  name: string;
  iconName: string;
  items: Category[];
}

// Grouped Structure for Thematic Mode
const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    id: 'fandom',
    name: 'Fandom',
    iconName: 'wand',
    items: [
      { id: 'harry-potter', name: 'Harry Potter', iconName: 'wand' },
      { id: 'marvel', name: 'Marvel', iconName: 'shield' },
      { id: 'fantasy', name: 'Fantasía', iconName: 'sword' },
      { id: '9', name: 'Videojuegos', iconName: 'game' },
    ]
  },
  {
    id: 'varieties',
    name: 'Variedades',
    iconName: 'star',
    items: [
      { id: 'brands', name: 'Marcas', iconName: 'bag' },
      { id: 'celebs', name: 'Celebridades', iconName: 'star' },
      { id: 'summer', name: 'Verano', iconName: 'sun' },
      { id: 'christmas', name: 'Navidad', iconName: 'snow' },
    ]
  },
  {
    id: 'culture',
    name: 'Cultura y Saber',
    iconName: 'bible',
    items: [
       { id: 'bible', name: 'Biblia', iconName: 'bible' },
       { id: 'anatomy', name: 'Anatomía', iconName: 'heart' },
       { id: '4', name: 'Lugares', iconName: 'map' },
       { id: '1', name: 'Animales', iconName: 'cat' },
    ]
  },
  {
    id: 'entertainment',
    name: 'Cine y TV',
    iconName: 'clapperboard',
    items: [
      { id: '2', name: 'Series', iconName: 'tv' },
      { id: 'kids-movies', name: 'Pelis Disney/Pixar', iconName: 'film' },
      { id: '6', name: 'Música', iconName: 'music' },
    ]
  },
  {
    id: 'kids',
    name: 'Infantil',
    iconName: 'rocket',
    items: [
      { id: 'cartoons', name: 'Dibujos Animados', iconName: 'smile' },
      { id: 'heroes', name: 'Superhéroes', iconName: 'zap' },
      { id: 'toys', name: 'Juguetes', iconName: 'gift' },
      { id: 'fairy-tales', name: 'Cuentos', iconName: 'book' },
    ]
  },
  {
    id: 'food',
    name: 'Gastronomía',
    iconName: 'coffee',
    items: [
      { id: 'fast-food', name: 'Comida Rápida', iconName: 'pizza' },
      { id: 'sweets', name: 'Dulces y Postres', iconName: 'cookie' },
      { id: 'fruits', name: 'Frutas y Verduras', iconName: 'carrot' },
    ]
  },
  {
    id: 'lifestyle',
    name: 'Estilo de Vida',
    iconName: 'shirt',
    items: [
       { id: 'clothing', name: 'Ropa / Moda', iconName: 'shirt' },
       { id: '8', name: 'Deportes', iconName: 'gym' },
       { id: '7', name: 'Transporte', iconName: 'car' },
       { id: '5', name: 'Profesiones', iconName: 'job' },
    ]
  },
];

const IconMap: Record<string, React.ElementType> = {
  'custom': PenTool,
  'manual': UserCog,
  'cat': Cat,
  'tv': Tv,
  'apple': Apple,
  'map': MapPin,
  'job': Briefcase,
  'music': Music,
  'car': Car,
  'gym': Dumbbell,
  'game': Gamepad2,
  'film': Film,
  'cookie': Cookie,
  'carrot': Carrot,
  'smile': Smile,
  'zap': Zap,
  'pizza': Pizza,
  'shirt': Shirt,
  'book': BookOpen,
  'gift': Gift,
  'coffee': Coffee,
  'clapperboard': Clapperboard,
  'rocket': Rocket,
  'globe': Globe,
  'grid': LayoutGrid,
  'sparkles': Sparkles,
  'wand': Wand2,
  'shield': Shield,
  'sword': Sword,
  'bible': BookHeart,
  'heart': HeartPulse,
  'bag': ShoppingBag,
  'star': Star,
  'sun': Sun,
  'snow': Snowflake
};

export const CategoryScreen: React.FC<CategoryScreenProps> = ({ onSelect, onManualStart, onBack, civilWarMode, tabooMode, inverseMode, interviewMode }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isManual, setIsManual] = useState(false);
  const [customText, setCustomText] = useState('');
  
  // Manual state
  const [manualWord, setManualWord] = useState('');
  const [manualContext, setManualContext] = useState('');
  
  const [manualSpyWord, setManualSpyWord] = useState('');
  const [manualSpyContext, setManualSpyContext] = useState('');
  
  const [manualWordB, setManualWordB] = useState('');
  const [manualWordBContext, setManualWordBContext] = useState('');

  const [manualForbiddenWord, setManualForbiddenWord] = useState('');
  const [manualVagueHint, setManualVagueHint] = useState('');

  const [manualQuestion, setManualQuestion] = useState('');
  
  const [selectedGroup, setSelectedGroup] = useState<CategoryGroup | null>(null);

  const handleRandom = () => {
    // Pick a random group, then a random item from that group
    const groups = CATEGORY_GROUPS;
    const randomGroup = groups[Math.floor(Math.random() * groups.length)];
    const randomCat = randomGroup.items[Math.floor(Math.random() * randomGroup.items.length)];
    onSelect(randomCat);
  };

  const handleSelect = (cat: Category) => {
    if (cat.id === 'custom') {
      setIsCreating(true);
    } else if (cat.id === 'manual') {
      setIsManual(true);
    } else {
      onSelect(cat);
    }
  };

  const submitCustom = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (customText.trim().length > 0) {
      onSelect({
        id: `custom-${Date.now()}`,
        name: customText.trim(),
        iconName: 'custom'
      });
    }
  };

  const submitManual = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (manualWord.trim().length > 0) {
      onManualStart(
        manualWord.trim().toUpperCase(), 
        manualContext.trim() || undefined,
        manualSpyWord.trim().toUpperCase() || undefined,
        manualSpyContext.trim() || undefined,
        manualWordB.trim().toUpperCase() || undefined,
        manualWordBContext.trim() || undefined,
        manualForbiddenWord.trim().toUpperCase() || undefined,
        manualVagueHint.trim() || undefined,
        manualQuestion.trim() ? [manualQuestion.trim()] : undefined
      );
    }
  };

  // Custom Topic Screen
  if (isCreating) {
    return (
      <div className="flex flex-col h-full animate-in zoom-in duration-300">
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => setIsCreating(false)} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-xl font-bold text-slate-200">Tema Personalizado</h2>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-full max-w-sm text-center">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Sparkles size={32} className="text-white" />
            </div>
            <label className="block text-slate-300 text-lg mb-4 font-bold">¿Sobre qué queréis jugar?</label>
            <form onSubmit={submitCustom} className="relative">
              <input
                autoFocus
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Ej. Pokemons, Youtubers, Marcas..."
                className="w-full bg-black/30 border border-white/10 focus:border-indigo-500 rounded-xl py-4 px-4 pr-12 text-white placeholder-slate-500 outline-none transition-all text-lg backdrop-blur-sm"
              />
              <button 
                type="submit"
                disabled={!customText.trim()}
                className="absolute right-2 top-2 bottom-2 aspect-square bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white rounded-lg flex items-center justify-center transition-all"
              >
                <Check size={20} />
              </button>
            </form>
            <p className="text-xs text-slate-500 mt-4 px-4">
              La IA generará automáticamente palabras secretas relacionadas con tu tema.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Manual Host Screen
  if (isManual) {
    return (
      <div className="flex flex-col h-full animate-in zoom-in duration-300">
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => setIsManual(false)} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-xl font-bold text-slate-200">Anfitrión Humano</h2>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-full max-w-sm overflow-y-auto custom-scrollbar pr-2 max-h-[70vh]">
            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-emerald-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <UserCog size={32} className="text-white" />
                </div>
                <p className="text-slate-300 font-medium">Escribe la palabra secreta. Tú no jugarás (ya la sabes).</p>
            </div>
            
            <form onSubmit={submitManual} className="space-y-4">
              <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
                    <Lock size={12} /> Palabra Secreta {civilWarMode ? '(Bando A)' : ''}
                 </label>
                 <input
                    autoFocus
                    type="text"
                    value={manualWord}
                    onChange={(e) => setManualWord(e.target.value)}
                    placeholder="Ej. MANZANA"
                    className="w-full bg-black/30 border border-white/10 focus:border-emerald-500 rounded-xl py-3 px-4 text-white placeholder-slate-500 outline-none transition-all font-bold tracking-widest uppercase backdrop-blur-sm"
                 />
                 <input
                    type="text"
                    value={manualContext}
                    onChange={(e) => setManualContext(e.target.value)}
                    placeholder="Definición/Contexto (Opcional)"
                    className="w-full bg-black/20 border border-white/10 rounded-lg py-2 px-3 text-sm text-white placeholder-slate-500 outline-none"
                 />
              </div>

              {interviewMode && (
                <div className="space-y-2">
                    <label className="text-xs font-bold text-blue-400 uppercase flex items-center gap-1">
                        <Mic size={12} /> Pregunta de Entrevista
                    </label>
                    <input
                        type="text"
                        value={manualQuestion}
                        onChange={(e) => setManualQuestion(e.target.value)}
                        placeholder="Ej. ¿Si fuera un color, cuál sería?"
                        className="w-full bg-black/30 border border-white/10 focus:border-blue-500 rounded-xl py-3 px-4 text-white placeholder-slate-500 outline-none transition-all font-bold tracking-wide backdrop-blur-sm"
                    />
                 </div>
              )}

              {civilWarMode && (
                <div className="space-y-2">
                    <label className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1">
                        <Swords size={12} /> Palabra Bando B (Guerra Civil)
                    </label>
                    <input
                        type="text"
                        value={manualWordB}
                        onChange={(e) => setManualWordB(e.target.value)}
                        placeholder="Ej. PERA"
                        className="w-full bg-black/30 border border-white/10 focus:border-amber-500 rounded-xl py-3 px-4 text-white placeholder-slate-500 outline-none transition-all font-bold tracking-widest uppercase backdrop-blur-sm"
                    />
                    <input
                        type="text"
                        value={manualWordBContext}
                        onChange={(e) => setManualWordBContext(e.target.value)}
                        placeholder="Definición B (Opcional)"
                        className="w-full bg-black/20 border border-white/10 rounded-lg py-2 px-3 text-sm text-white placeholder-slate-500 outline-none"
                    />
                 </div>
              )}

              {tabooMode && (
                <div className="space-y-2">
                    <label className="text-xs font-bold text-rose-400 uppercase flex items-center gap-1">
                        <Ban size={12} /> Palabra Tabú (Prohibida)
                    </label>
                    <input
                        type="text"
                        value={manualForbiddenWord}
                        onChange={(e) => setManualForbiddenWord(e.target.value)}
                        placeholder="Ej. ROJA"
                        className="w-full bg-black/30 border border-white/10 focus:border-rose-500 rounded-xl py-3 px-4 text-white placeholder-slate-500 outline-none transition-all font-bold tracking-widest uppercase backdrop-blur-sm"
                    />
                 </div>
              )}

              {inverseMode && (
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-teal-400 uppercase flex items-center gap-1">
                        <Puzzle size={12} /> Pista Vaga (Modo Inverso)
                    </label>
                    <input
                        type="text"
                        value={manualVagueHint}
                        onChange={(e) => setManualVagueHint(e.target.value)}
                        placeholder="Ej. ES UN TIPO DE FRUTA"
                        className="w-full bg-black/30 border border-white/10 focus:border-teal-500 rounded-xl py-3 px-4 text-white placeholder-slate-500 outline-none transition-all font-bold tracking-widest uppercase backdrop-blur-sm"
                    />
                    <p className="text-[10px] text-slate-500">Esto verán los civiles confundidos en lugar de la palabra.</p>
                 </div>
              )}

              <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
                    <Eye size={12} /> Palabra Espía (Opcional)
                 </label>
                 <input
                    type="text"
                    value={manualSpyWord}
                    onChange={(e) => setManualSpyWord(e.target.value)}
                    placeholder="Ej. PLÁTANO"
                    className="w-full bg-black/30 border border-white/10 focus:border-indigo-500 rounded-xl py-3 px-4 text-white placeholder-slate-500 outline-none transition-all font-bold tracking-widest uppercase backdrop-blur-sm"
                 />
                 <input
                    type="text"
                    value={manualSpyContext}
                    onChange={(e) => setManualSpyContext(e.target.value)}
                    placeholder="Definición Espía (Opcional)"
                    className="w-full bg-black/20 border border-white/10 rounded-lg py-2 px-3 text-sm text-white placeholder-slate-500 outline-none"
                 />
              </div>

              <button 
                type="submit"
                disabled={!manualWord.trim() || (civilWarMode && !manualWordB.trim()) || (inverseMode && !manualVagueHint.trim())}
                className="w-full mt-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Empezar Partida</span>
                <Check size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Subcategory View
  if (selectedGroup) {
      return (
        <div className="flex flex-col h-full animate-in slide-in-from-right duration-300">
            <div className="flex items-center gap-2 mb-4">
                <button onClick={() => setSelectedGroup(null)} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition">
                    <ChevronLeft size={24} />
                </button>
                <div className="flex items-center gap-2 text-xl font-bold text-slate-200">
                    {IconMap[selectedGroup.iconName] && React.createElement(IconMap[selectedGroup.iconName], { size: 20, className: "text-indigo-400" })}
                    <h2>{selectedGroup.name}</h2>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 overflow-y-auto pb-4 custom-scrollbar pr-1">
                 {selectedGroup.items.map(cat => {
                     const Icon = IconMap[cat.iconName] || Cat;
                     return (
                        <button
                          key={cat.id}
                          onClick={() => handleSelect(cat)}
                          className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-black/20 hover:bg-white/5 border border-white/5 hover:border-white/20 backdrop-blur-sm transition-all aspect-square group shadow-sm hover:shadow-lg"
                        >
                          <Icon size={32} className="text-slate-400 group-hover:text-indigo-400 transition-colors transform group-hover:scale-110 duration-300" />
                          <span className="text-sm font-medium text-slate-300 group-hover:text-white text-center">
                            {cat.name}
                          </span>
                        </button>
                     );
                 })}
            </div>
        </div>
      );
  }

  // MAIN VIEW (THEMATIC GROUPS ONLY)
  return (
    <div className="flex flex-col h-full animate-in slide-in-from-right duration-300">
        <div className="flex items-center gap-2 mb-4">
             <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition">
                <ChevronLeft size={24} />
             </button>
            <h2 className="text-xl font-bold text-slate-200">
                Selecciona Tema
            </h2>
        </div>
      
      {/* THEMATIC GROUPS GRID */}
      <div className="grid grid-cols-2 gap-3 overflow-y-auto pb-4 custom-scrollbar pr-1">
             {/* Custom & Manual Buttons */}
             <button
                onClick={() => setIsCreating(true)}
                className="col-span-1 flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-indigo-900/40 to-indigo-600/10 border border-indigo-500/30 hover:border-indigo-400/50 backdrop-blur-sm transition-all group aspect-square shadow-sm"
             >
                <PenTool size={28} className="text-indigo-400 mb-2 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-bold text-indigo-200 text-sm">Crear Propio</span>
                <span className="text-[9px] text-indigo-400">IA</span>
             </button>

             <button
                onClick={() => setIsManual(true)}
                className="col-span-1 flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-emerald-900/40 to-emerald-600/10 border border-emerald-500/30 hover:border-emerald-400/50 backdrop-blur-sm transition-all group aspect-square shadow-sm"
             >
                <UserCog size={28} className="text-emerald-400 mb-2 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-bold text-emerald-200 text-sm">Anfitrión</span>
                <span className="text-[9px] text-emerald-400">Manual</span>
             </button>

             {/* Groups */}
             {CATEGORY_GROUPS.map(group => {
                 const Icon = IconMap[group.iconName] || LayoutGrid;
                 return (
                    <button
                        key={group.id}
                        onClick={() => setSelectedGroup(group)}
                        className="flex flex-col items-center justify-center p-4 rounded-2xl bg-black/30 border border-white/5 hover:border-white/20 hover:bg-white/5 backdrop-blur-md transition-all aspect-[4/3] group relative overflow-hidden shadow-sm"
                    >
                        {/* Glass Shine */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <Icon size={28} className="text-slate-400 group-hover:text-indigo-400 mb-2 transition-colors transform group-hover:scale-110 duration-300" />
                        <span className="font-bold text-slate-200 text-sm relative z-10">{group.name}</span>
                        <span className="text-[10px] text-slate-500 mt-1 relative z-10">{group.items.length} opciones</span>
                    </button>
                 );
             })}
      </div>

      <div className="mt-auto pt-4">
        <button 
          onClick={handleRandom}
          className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-600/50 text-slate-200 font-bold py-3 px-6 rounded-xl shadow transition-all flex items-center justify-center gap-2"
        >
          <Shuffle size={18} />
          <span>Aleatorio</span>
        </button>
      </div>
    </div>
  );
};