import { FlashcardData } from '../types';

export const parseRawText = (text: string): FlashcardData[] => {
  const cards: FlashcardData[] = [];
  
  // Normalize line endings and split by "number. " pattern to find blocks
  // The regex (?=\d+\.) is a positive lookahead to split before the number starts
  const blocks = text.trim().split(/(?=\b\d+\.\s)/g);

  blocks.forEach((block) => {
    if (!block.trim()) return;

    const lines = block.split('\n').map(l => l.trim()).filter(l => l);
    if (lines.length < 2) return;

    // 1. Parse Term (first line, remove number)
    const firstLine = lines[0];
    const termMatch = firstLine.match(/^\d+\.\s*(.+)/);
    const term = termMatch ? termMatch[1].trim() : firstLine;

    // Initialize object
    const card: FlashcardData = {
      id: cards.length + 1,
      term,
      definition: '',
      example: '',
      relations: []
    };

    let currentSection: 'definition' | 'example' | 'relations' | null = null;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];

      if (line.startsWith('中文含义：') || line.startsWith('中文含义:')) {
        card.definition = line.replace(/中文含义[:：]/, '').trim();
        currentSection = 'definition';
      } else if (line.startsWith('实战例句：') || line.startsWith('实战例句:')) {
        card.example = line.replace(/实战例句[:：]/, '').trim();
        currentSection = 'example';
      } else if (line.startsWith('关联表达：') || line.startsWith('关联表达:') || line.startsWith('关联表达')) {
        currentSection = 'relations';
        const content = line.replace(/关联表达[:：]?/, '').trim();
        if(content) card.relations.push(content);
      } else {
        // Continuation of previous section
        if (currentSection === 'relations') {
          card.relations.push(line);
        } else if (currentSection === 'definition') {
          card.definition += ' ' + line;
        } else if (currentSection === 'example') {
          card.example += ' ' + line;
        }
      }
    }

    if (card.term && (card.definition || card.example)) {
      cards.push(card);
    }
  });

  return cards;
};