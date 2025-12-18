import { LucideIcon } from 'lucide-react';

export type GameState = 
  | 'SETUP' 
  | 'NAME_SETUP'
  | 'CATEGORY_SELECT' 
  | 'REVEAL_ROLES' 
  | 'PLAYING' 
  | 'VOTING' 
  | 'RESULTS' 
  | 'SUDDEN_DEATH' 
  | 'COUNTERATTACK';

export type Role = 'CIVILIAN' | 'IMPOSTOR' | 'ACCOMPLICE' | 'JESTER' | 'DETECTIVE';

export type Difficulty = 'EASY' | 'NORMAL' | 'HARD';

export interface Player {
  id: number;
  name: string;
  avatar: string; // Emoji
  role: Role;
  word: string;
  context?: string; // Definition/Example
  revealed: boolean;
  impostorIds?: number[]; 
  detectiveKnownSafeId?: number;
  character?: string; // Roleplay character
  forbiddenWord?: string; // Taboo Mode
  isGuide?: boolean; // Inverse Mode Guide
  vagueHint?: string; // Inverse Mode Hint for confused civilians
}

export interface Category {
  id: string;
  name: string;
  iconName: string;
}

export interface PlayerSetup {
  name: string;
  avatar: string;
}

export interface GameConfig {
  playerCount: number;
  impostorCount: number;
  spyMode: boolean;
  hasAccomplice: boolean;
  hasJester: boolean;
  hasDetective: boolean;
  civilWarMode: boolean; // Guerra Civil
  roleplayMode: boolean; // Identidades
  tabooMode: boolean; // Palabra Tabú
  inverseMode: boolean; // Modo Inverso
  interviewMode: boolean; // Modo Entrevista (Preguntas IA)
  mimicryMode: boolean; // Modo Mímica (Nuevo)
  difficulty: Difficulty;
  playerSetup: PlayerSetup[]; 
}

export type VoteMap = Record<number, number>; // VoterId -> SuspectId