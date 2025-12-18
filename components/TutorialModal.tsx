import React from 'react';
import { X, User, Skull, ShieldCheck, Eye, PartyPopper, Search, Users, Swords, Drama, Target, Ban, Puzzle, Mic, Hand } from 'lucide-react';

interface TutorialModalProps {
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/95 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full h-full max-w-md mx-auto flex flex-col relative bg-slate-900/50">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-slate-900/50">
          <h2 className="text-xl font-black text-white uppercase tracking-wide">Cómo Jugar</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition cursor-pointer">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {/* General Concept */}
          <section>
            <h3 className="text-lg font-bold text-indigo-400 mb-2">1. El Objetivo</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Todos reciben una <span className="text-white font-bold">palabra secreta</span>, excepto el <span className="text-red-400 font-bold">Impostor</span>. 
              Debéis describir vuestra palabra sin ser muy obvios para no dar pistas al impostor, pero lo suficiente para demostrar que sois inocentes.
            </p>
          </section>

          {/* Special Mechanics */}
          <section className="space-y-4">
             <h3 className="text-lg font-bold text-slate-200 border-b border-slate-700 pb-2">Nuevas Mecánicas</h3>

             <div className="flex gap-4 items-start">
               <div className="bg-lime-500/10 p-2 rounded-lg text-lime-400 mt-1">
                 <Hand size={20} />
               </div>
               <div>
                 <h4 className="text-white font-bold text-sm">Modo Mímica <span className="text-[10px] bg-lime-500/20 text-lime-300 px-1.5 py-0.5 rounded ml-2 border border-lime-500/30">Nuevo</span></h4>
                 <p className="text-slate-400 text-xs mt-1">
                   <span className="text-lime-300 font-bold">PROHIBIDO HABLAR.</span> Solo puedes usar gestos y sonidos para describir tu palabra.
                 </p>
               </div>
            </div>

             <div className="flex gap-4 items-start">
               <div className="bg-blue-500/10 p-2 rounded-lg text-blue-400 mt-1">
                 <Mic size={20} />
               </div>
               <div>
                 <h4 className="text-white font-bold text-sm">Modo Entrevista <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded ml-2 border border-blue-500/30">Modo</span></h4>
                 <p className="text-slate-400 text-xs mt-1">
                   La IA actúa como entrevistador y os hace 3 <span className="text-blue-300">preguntas abstractas</span> (ej. "¿Si fuera una película?"). Todos debéis responder a esa pregunta para dar vuestra pista.
                 </p>
               </div>
            </div>

             <div className="flex gap-4 items-start">
               <div className="bg-teal-500/10 p-2 rounded-lg text-teal-400 mt-1">
                 <Puzzle size={20} />
               </div>
               <div>
                 <h4 className="text-white font-bold text-sm">Modo Inverso <span className="text-[10px] bg-teal-500/20 text-teal-300 px-1.5 py-0.5 rounded ml-2 border border-teal-500/30">Modo</span></h4>
                 <p className="text-slate-400 text-xs mt-1">
                   Solo el <span className="text-teal-300">Guía</span> y el Impostor saben la palabra. El resto solo tiene una pista vaga. Los civiles deben adivinarla, el impostor debe confundirlos.
                 </p>
               </div>
            </div>

             <div className="flex gap-4 items-start">
               <div className="bg-amber-500/10 p-2 rounded-lg text-amber-400 mt-1">
                 <Swords size={20} />
               </div>
               <div>
                 <h4 className="text-white font-bold text-sm">Guerra Civil <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded ml-2 border border-amber-500/30">Modo</span></h4>
                 <p className="text-slate-400 text-xs mt-1">
                   La IA reparte <span className="text-amber-300">DOS palabras distintas</span> entre los civiles. Esto crea confusión porque vuestras descripciones no encajarán.
                 </p>
               </div>
            </div>

            <div className="flex gap-4 items-start">
               <div className="bg-pink-500/10 p-2 rounded-lg text-pink-400 mt-1">
                 <Drama size={20} />
               </div>
               <div>
                 <h4 className="text-white font-bold text-sm">Roleplay <span className="text-[10px] bg-pink-500/20 text-pink-300 px-1.5 py-0.5 rounded ml-2 border border-pink-500/30">Modo</span></h4>
                 <p className="text-slate-400 text-xs mt-1">
                   Recibes un <span className="text-pink-300">Personaje</span> temático (ej. "El Cirujano"). Debes actuar como él mientras juegas.
                 </p>
               </div>
            </div>

            <div className="flex gap-4 items-start">
               <div className="bg-rose-500/10 p-2 rounded-lg text-rose-400 mt-1">
                 <Ban size={20} />
               </div>
               <div>
                 <h4 className="text-white font-bold text-sm">Palabra Tabú <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded ml-2 border border-rose-500/30">Modo</span></h4>
                 <p className="text-slate-400 text-xs mt-1">
                   Hay una palabra <span className="text-rose-300">PROHIBIDA</span> muy relacionada con la secreta. Los civiles NO pueden decirla, pero el Impostor NO sabe cuál es.
                 </p>
               </div>
            </div>

            <div className="flex gap-4 items-start">
               <div className="bg-red-500/10 p-2 rounded-lg text-red-400 mt-1">
                 <Target size={20} />
               </div>
               <div>
                 <h4 className="text-white font-bold text-sm">Contragolpe</h4>
                 <p className="text-slate-400 text-xs mt-1">
                   Si el impostor es descubierto, tiene una <span className="text-red-300">última oportunidad</span>. Si adivina la palabra secreta, roba la victoria.
                 </p>
               </div>
            </div>
             
             <div className="flex gap-4 items-start">
               <div className="bg-red-500/10 p-2 rounded-lg text-red-400 mt-1">
                 <Users size={20} />
               </div>
               <div>
                 <h4 className="text-white font-bold text-sm">Sinergia Impostora</h4>
                 <p className="text-slate-400 text-xs mt-1">
                   Si hay más de un impostor, <span className="text-red-300">se conocen entre ellos</span> para poder cooperar.
                 </p>
               </div>
            </div>
          </section>

          {/* Roles */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-slate-200 border-b border-slate-700 pb-2">Roles Clásicos</h3>
            
            <div className="flex gap-4 items-start">
               <div className="bg-indigo-500/10 p-2 rounded-lg text-indigo-400 mt-1">
                 <Eye size={20} />
               </div>
               <div>
                 <h4 className="text-white font-bold text-sm">Modo Espía</h4>
                 <p className="text-slate-400 text-xs mt-1">
                   El impostor ve una palabra <span className="text-indigo-300">muy parecida</span> a la real (ej. "Manzana" vs "Pera").
                 </p>
               </div>
            </div>

            <div className="flex gap-4 items-start">
               <div className="bg-purple-500/10 p-2 rounded-lg text-purple-400 mt-1">
                 <ShieldCheck size={20} />
               </div>
               <div>
                 <h4 className="text-white font-bold text-sm">Cómplice</h4>
                 <p className="text-slate-400 text-xs mt-1">
                   Es un civil que <span className="text-purple-300">sabe quién es el impostor</span>. Debe ayudarle.
                 </p>
               </div>
            </div>

            <div className="flex gap-4 items-start">
               <div className="bg-orange-500/10 p-2 rounded-lg text-orange-400 mt-1">
                 <PartyPopper size={20} />
               </div>
               <div>
                 <h4 className="text-white font-bold text-sm">Bufón</h4>
                 <p className="text-slate-400 text-xs mt-1">
                   Su único objetivo es parecer sospechoso y <span className="text-orange-300">ser expulsado</span> para ganar.
                 </p>
               </div>
            </div>

            <div className="flex gap-4 items-start">
               <div className="bg-cyan-500/10 p-2 rounded-lg text-cyan-400 mt-1">
                 <Search size={20} />
               </div>
               <div>
                 <h4 className="text-white font-bold text-sm">Detective</h4>
                 <p className="text-slate-400 text-xs mt-1">
                   Un civil que conoce a <span className="text-cyan-300">un jugador 100% INOCENTE</span> desde el inicio.
                 </p>
               </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-slate-900/50">
          <button 
            onClick={onClose}
            className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-xl transition-colors cursor-pointer"
          >
            ¡Entendido!
          </button>
        </div>
      </div>
    </div>
  );
};