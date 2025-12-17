export type GamePhase = 
  | 'INTRO'
  | 'HOME'
  | 'WOODS_CHOICE'
  | 'AMBUSH'
  | 'TRANSFORMATION'
  | 'COTTAGE'
  | 'GAME_OVER'
  | 'ENDING';

export interface Item {
  id: string;
  name: string;
  description: string;
  icon: string;
  isTransformed?: boolean;
}

export interface Choice {
  id: string;
  text: string;
  coldHeartImpact: number;
  narrativePrompt: string; // Sent to Gemini to generate outcome
  fallbackText: string; // Used if API fails
}

export interface GameState {
  phase: GamePhase;
  coldHeart: number; // 0 to 100
  inventory: Item[];
  distance: number; // 0 to 5 miles
  history: { turn: number; coldHeart: number }[]; 
  claimedItems: string[]; 
  lastChoice?: string;
  isLoadingNarrative: boolean;
}

export enum ActionType {
  START_GAME = 'START_GAME',
  COLLECT_ITEM = 'COLLECT_ITEM',
  LEAVE_HOME = 'LEAVE_HOME',
  MAKE_CHOICE = 'MAKE_CHOICE',
  ATTACK_SLASH = 'ATTACK_SLASH',
  ATTACK_KICK = 'ATTACK_KICK',
  STRIKE_LIMB = 'STRIKE_LIMB',
  UNWRAP_HAND = 'UNWRAP_HAND',
  CHOICE_MERCY = 'CHOICE_MERCY',
  CHOICE_RUTHLESS = 'CHOICE_RUTHLESS',
  CLAIM_ITEM = 'CLAIM_ITEM',
  RESTART = 'RESTART'
}
