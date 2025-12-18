
import { GoogleGenAI, Type } from "@google/genai";
import { Difficulty } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-flash-lite-latest'; 

interface SecretData {
  word: string;
  context: string;
  spyWord?: string;
  spyContext?: string;
  wordB?: string; 
  wordBContext?: string;
  forbiddenWord?: string;
  roles?: string[];
  vagueHint?: string;
  questions?: string[];
  decoys: string[];
}

// BASE DE DATOS OFFLINE MASIVA (Para funcionamiento sin IA en GitHub)
const FALLBACK_DATA: Record<string, SecretData[]> = {
  'Animales': [
    { 
        word: 'PERRO', context: 'El mejor amigo del hombre, fiel y juguetón.',
        wordB: 'LOBO', wordBContext: 'Animal salvaje que vive en manada y aúlla.',
        spyWord: 'ZORRO', spyContext: 'Cánido astuto con cola peluda naranja.',
        forbiddenWord: 'LADRAR', vagueHint: 'Un mamífero doméstico común.',
        questions: ['¿Si fuera un trabajo humano, cuál sería?', '¿Qué película protagonizaría?', '¿Qué olor le define?'],
        decoys: ['GATO', 'OSO', 'COYOTE', 'HIENA', 'CABALLO'],
        roles: ['Veterinario', 'Dueño', 'Paseador', 'Entrenador', 'Gato callejero', 'Cazador', 'Policía K9', 'Niño']
    },
    { 
        word: 'TIGRE', context: 'Gran felino rayado que vive en la selva.',
        wordB: 'LEÓN', wordBContext: 'El rey de la selva con una gran melena.',
        spyWord: 'GATO', spyContext: 'Pequeño felino doméstico.',
        forbiddenWord: 'RAYAS', vagueHint: 'Un felino salvaje y peligroso.',
        questions: ['¿Cuál es su mayor miedo?', '¿En qué continente vive?', '¿Qué color lo representa?'],
        decoys: ['PANTERA', 'GUEPARDO', 'LINCE', 'PUMA'],
        roles: ['Domador', 'Cazador furtivo', 'Cebra asustada', 'Fotógrafo de National Geographic', 'Turista en Safari']
    }
  ],
  'Pelis Disney/Pixar': [
    { 
        word: 'TOY STORY', context: 'Película sobre juguetes que cobran vida.',
        wordB: 'MONSTRUOS S.A.', wordBContext: 'Película sobre monstruos que asustan niños.',
        spyWord: 'CARS', spyContext: 'Película sobre coches de carreras.',
        forbiddenWord: 'WOODY', vagueHint: 'Un clásico de la animación moderna.',
        questions: ['¿A qué sabe esta película?', '¿Qué emoción predomina?', '¿En qué habitación transcurre?'],
        decoys: ['BICHOS', 'COCO', 'UP', 'WALL-E'],
        roles: ['Buzz Lightyear', 'Niño dueño', 'Juguete roto', 'Coleccionista', 'Dinosaurio de plástico']
    }
  ],
  'Harry Potter': [
    { 
        word: 'VARITA MÁGICA', context: 'Instrumento de madera para canalizar hechizos.',
        wordB: 'ESCOBA VOLADORA', wordBContext: 'Vehículo mágico usado para viajar o jugar Quidditch.',
        spyWord: 'CALDERO', spyContext: 'Recipiente para cocinar pociones.',
        forbiddenWord: 'MAGIA', vagueHint: 'Un objeto esencial para un mago.',
        questions: ['¿De qué material está hecho?', '¿Qué sonido hace al usarse?', '¿Dónde se compra?'],
        decoys: ['SOMBRERO', 'CARTA', 'BÚHO', 'POCIÓN'],
        roles: ['Ollivander', 'Estudiante de Gryffindor', 'Elfo doméstico', 'Mortífago', 'Muggle confundido']
    }
  ],
  'Comida Rápida': [
    { 
        word: 'HAMBURGUESA', context: 'Carne picada entre dos panes redondos.',
        wordB: 'PIZZA', wordBContext: 'Masa plana horneada con queso y tomate.',
        spyWord: 'SÁNDWICH', spyContext: 'Pan de molde con relleno variado.',
        forbiddenWord: 'KÉTCHUP', vagueHint: 'Un alimento muy popular y calórico.',
        questions: ['¿Con qué bebida se acompaña siempre?', '¿Qué forma tiene?', '¿A qué hora se suele comer?'],
        decoys: ['TACO', 'PERRITO CALIENTE', 'NUGGETS', 'PATATAS'],
        roles: ['Cocinero', 'Repartidor', 'Cliente con mucha hambre', 'Nutricionista enfadado', 'Crítico de comida']
    }
  ],
  'Superhéroes': [
    { 
        word: 'SPIDERMAN', context: 'Héroe que trepa paredes y lanza telarañas.',
        wordB: 'BATMAN', wordBContext: 'Héroe nocturno multimillonario vestido de murciélago.',
        spyWord: 'VENOM', spyContext: 'Antihéroe simbionte negro enemigo de Spiderman.',
        forbiddenWord: 'ARAÑA', vagueHint: 'Un héroe con máscara.',
        questions: ['¿Cómo se desplaza?', '¿Cuál es su mayor tragedia?', '¿De qué color es su traje?'],
        decoys: ['SUPERMAN', 'IRON MAN', 'THOR', 'HULK'],
        roles: ['Peter Parker', 'Tía May', 'Fotógrafo', 'Villano con risa malvada', 'Ciudadano rescatado']
    }
  ],
  'Lugares': [
    { 
        word: 'PARÍS', context: 'La ciudad del amor y la Torre Eiffel.',
        wordB: 'LONDRES', wordBContext: 'Ciudad del Big Ben y el río Támesis.',
        spyWord: 'ROMA', spyContext: 'Ciudad eterna con el Coliseo.',
        forbiddenWord: 'FRANCIA', vagueHint: 'Una capital europea famosa.',
        questions: ['¿Qué se come allí?', '¿Qué monumento es el más famoso?', '¿Qué idioma hablan?'],
        decoys: ['MADRID', 'BERLÍN', 'NUEVA YORK', 'TOKIO'],
        roles: ['Turista perdido', 'Mimo callejero', 'Chef', 'Guía turístico', 'Carterista']
    }
  ],
  'Harry Potter (Extra)': [
    { 
        word: 'SNITCH DORADA', context: 'Pequeña bola con alas que otorga 150 puntos.',
        wordB: 'QUAFFLE', wordBContext: 'Pelota roja usada para marcar goles en los aros.',
        spyWord: 'BLUDGER', spyContext: 'Pelota pesada que intenta derribar jugadores.',
        forbiddenWord: 'QUIDDITCH', vagueHint: 'Un objeto deportivo mágico.',
        questions: ['¿Es fácil de atrapar?', '¿Quién la busca?', '¿Qué pasa cuando la tocas?'],
        decoys: ['ESCOBA', 'BATE', 'BUSCADOR', 'GOLPEADOR'],
        roles: ['Buscador', 'Comentarista', 'Guardián', 'Harry Potter', 'Draco Malfoy']
    }
  ]
};

// Categorías por defecto si no hay específicas
const DEFAULT_FALLBACK: SecretData[] = [
  { 
      word: 'GUITARRA', context: 'Instrumento de cuerdas para tocar música.',
      wordB: 'PIANO', wordBContext: 'Instrumento de teclas grandes y blancas.',
      spyWord: 'UKELELE', spyContext: 'Pequeña guitarra de cuatro cuerdas.',
      forbiddenWord: 'CUERDAS', vagueHint: 'Un instrumento musical.',
      questions: ['¿Cómo suena?', '¿Quién lo toca profesionalmente?', '¿Es fácil de transportar?'],
      decoys: ['BAJO', 'VIOLÍN', 'ARPA', 'TAMBOR'],
      roles: ['Músico callejero', 'Luthier', 'Rockstar', 'Alumno novato', 'Fan en primera fila']
  }
];

export const generateSecretWord = async (
    category: string, 
    spyMode: boolean, 
    civilWarMode: boolean,
    roleplayMode: boolean,
    tabooMode: boolean,
    inverseMode: boolean,
    interviewMode: boolean,
    mimicryMode: boolean,
    difficulty: Difficulty
): Promise<SecretData> => {
  
  // Intentar con la IA si hay API KEY
  if (process.env.API_KEY && process.env.API_KEY !== 'undefined') {
      try {
        const difficultyInstruction = {
          'EASY': 'Palabras simples y muy conocidas.',
          'NORMAL': 'Palabras estándar.',
          'HARD': 'Conceptos específicos o abstractos.'
        }[difficulty];

        const jsonSchemaProperties: any = {
            word: { type: Type.STRING },
            context: { type: Type.STRING },
            decoys: { type: Type.ARRAY, items: { type: Type.STRING } }
        };
        const requiredFields = ["word", "context", "decoys"];

        if (spyMode) {
            jsonSchemaProperties.spyWord = { type: Type.STRING };
            jsonSchemaProperties.spyContext = { type: Type.STRING };
        }
        if (civilWarMode) {
            jsonSchemaProperties.wordB = { type: Type.STRING };
            jsonSchemaProperties.wordBContext = { type: Type.STRING };
            requiredFields.push("wordB");
        }
        if (roleplayMode) {
            jsonSchemaProperties.roles = { type: Type.ARRAY, items: { type: Type.STRING } };
            requiredFields.push("roles");
        }
        if (tabooMode) {
            jsonSchemaProperties.forbiddenWord = { type: Type.STRING };
            requiredFields.push("forbiddenWord");
        }
        if (inverseMode) {
            jsonSchemaProperties.vagueHint = { type: Type.STRING };
            requiredFields.push("vagueHint");
        }
        if (interviewMode) {
            jsonSchemaProperties.questions = { type: Type.ARRAY, items: { type: Type.STRING } };
            requiredFields.push("questions");
        }

        const prompt = `
            Eres el Game Master de "El Impostor".
            TEMA: "${category}". DIFICULTAD: ${difficulty}. (${difficultyInstruction})
            REGLAS:
            - Solo ESPAÑOL.
            ${mimicryMode ? '- MÍMICA: La palabra debe ser representable físicamente.' : ''}
            ${spyMode ? '- ESPÍA: spyWord semánticamente cercana a word.' : ''}
            ${civilWarMode ? '- GUERRA: wordB similar a word para confusión.' : ''}
            ${tabooMode ? '- TABÚ: forbiddenWord es la palabra más obvia sobre la secreta.' : ''}
            ${roleplayMode ? '- ROLES: 12 personajes para la categoría.' : ''}
            ${interviewMode ? '- PREGUNTAS: 3 preguntas sobre personalidad/contexto del objeto.' : ''}
            ${inverseMode ? '- INVERSO: vagueHint muy genérica.' : ''}
            Genera un JSON con: word, context, decoys (4), y los campos de los modos activos.
        `;

        const response = await ai.models.generateContent({
          model: MODEL_NAME,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: jsonSchemaProperties,
              required: requiredFields
            },
            temperature: 0.9, 
          }
        });

        const data = JSON.parse(response.text || '{}');
        return {
          ...data,
          word: data.word?.toUpperCase(),
          spyWord: data.spyWord?.toUpperCase(),
          wordB: data.wordB?.toUpperCase(),
          forbiddenWord: data.forbiddenWord?.toUpperCase(),
          decoys: data.decoys?.map((d: string) => d.toUpperCase()) || []
        };
      } catch (e) {
        console.error("Fallo IA, usando local...", e);
      }
  }

  // LÓGICA OFFLINE (Garantizada para GitHub)
  const categorySet = FALLBACK_DATA[category] || DEFAULT_FALLBACK;
  const rawData = categorySet[Math.floor(Math.random() * categorySet.length)];
  
  return {
    word: rawData.word,
    context: rawData.context,
    spyWord: spyMode ? (rawData.spyWord || 'ESPÍA') : undefined,
    spyContext: spyMode ? (rawData.spyContext || 'Contexto espía') : undefined,
    wordB: civilWarMode ? (rawData.wordB || 'PALABRA B') : undefined,
    wordBContext: civilWarMode ? (rawData.wordBContext || 'Contexto B') : undefined,
    forbiddenWord: tabooMode ? (rawData.forbiddenWord || 'TABÚ') : undefined,
    roles: roleplayMode ? (rawData.roles || ['Rol A', 'Rol B', 'Rol C']) : undefined,
    vagueHint: inverseMode ? (rawData.vagueHint || 'Algo genérico') : undefined,
    questions: interviewMode ? (rawData.questions || ['¿Cómo es?', '¿A qué huele?', '¿Para qué sirve?']) : undefined,
    decoys: rawData.decoys || ['FALSO 1', 'FALSO 2', 'FALSO 3', 'FALSO 4']
  };
};
