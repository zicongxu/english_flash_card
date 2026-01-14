export interface FlashcardData {
  id: number;
  term: string; // The English word/phrase
  definition: string; // Chinese meaning
  example: string; // English example sentence
  exampleTranslation?: string; // Optional Chinese translation of example
  relations: string[]; // Related words/phrases
}

export type ViewState = 'HOME' | 'STUDY' | 'SUMMARY';

export type DeckSource = 'DEFAULT' | 'UPLOAD';