import { KeyboardKey } from './keyboardMapping';

export type KeyboardTab = 'layout' | 'letters' | 'niqqud' | 'punctuation' | 'numbers';

export type NotebookTheme = 'classic' | 'warm-cream' | 'dark-slate' | 'minimal-white';

export type NotebookFont = 'sans' | 'serif' | 'handwriting' | 'mono';

export interface TextStats {
  characters: number;
  words: number;
  hebrewLetters: number;
  niqqudCount: number;
  lines: number;
}

export interface KeyClickPayload {
  char: string;
  type?: KeyboardKey['type'];
}
