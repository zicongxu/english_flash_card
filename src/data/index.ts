import { FlashcardData } from '../../types';
import foodAndDietData from './food_and_diet.json';
import travelData from './travel.json';

export interface Topic {
  id: string;
  title: string;
  description: string;
  data: FlashcardData[];
}

export const TOPICS: Topic[] = [
  {
    id: 'food_and_diet',
    title: 'Food & Diet',
    description: 'Vocabulary related to healthy eating, cooking, and dining habits.',
    data: foodAndDietData as FlashcardData[]
  },
  {
    id: 'travel',
    title: 'Travel',
    description: 'Essential words and phrases for navigating airports, hotels, and sightseeing.',
    data: travelData as FlashcardData[]
  }
];
