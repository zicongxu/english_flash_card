import { FlashcardData } from '../../types';

export interface Topic {
  id: string;
  title: string;
  description: string;
  data: FlashcardData[];
}

// Helper to convert filename to title (e.g., "food_and_diet" -> "Food And Diet")
const formatTitle = (filename: string): string => {
  return filename
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Use Vite's import.meta.glob to load all JSON files in the current directory
const modules = import.meta.glob<FlashcardData[]>('./*.json', { eager: true, import: 'default' });

export const TOPICS: Topic[] = Object.entries(modules).map(([path, data]) => {
  // path is like "./food_and_diet.json"
  const filename = path.split('/').pop()?.replace('.json', '') || 'unknown';
  const id = filename;
  const title = formatTitle(filename);
  
  // Basic description generation - can be improved if we change JSON structure later
  const description = `Learn vocabulary related to ${title}.`;

  return {
    id,
    title,
    description,
    data: data as FlashcardData[]
  };
});
