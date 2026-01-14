import React, { useState, useRef, useEffect } from 'react';
import { Upload, BookOpen, RotateCw, CheckCircle2, FileText, ArrowRight } from 'lucide-react';
import { ViewState, FlashcardData } from './types';
import { DEFAULT_RAW_DATA } from './constants';
import { parseRawText } from './services/parserService';
import Button from './components/Button';
import Flashcard from './components/Flashcard';
import ProgressBar from './components/ProgressBar';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('HOME');
  const [cards, setCards] = useState<FlashcardData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize with default data for instant demo
  useEffect(() => {
    // Only parse if we haven't loaded anything yet
    if (cards.length === 0) {
      const parsed = parseRawText(DEFAULT_RAW_DATA);
      // setCards(parsed); // Don't set automatically to let user choose, or uncomment to auto-load
    }
  }, []);

  const handleStartDefault = () => {
    const parsed = parseRawText(DEFAULT_RAW_DATA);
    setCards(parsed);
    setCurrentIndex(0);
    setIsFlipped(false);
    setView('STUDY');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsed = parseRawText(text);
      if (parsed.length > 0) {
        setCards(parsed);
        setCurrentIndex(0);
        setIsFlipped(false);
        setView('STUDY');
      } else {
        alert("Couldn't find any valid cards in the file. Please check the format.");
      }
    };
    reader.readAsText(file);
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      // Small timeout to allow flip animation reset if we had one (using reveal instead here)
      setTimeout(() => setCurrentIndex(prev => prev + 1), 50);
    } else {
      setView('SUMMARY');
    }
  };

  const handleExit = () => {
    if (confirm("Are you sure you want to quit this session?")) {
      setView('HOME');
    }
  };

  // --- Views ---

  const renderHome = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white max-w-md mx-auto">
      <div className="mb-12 text-center">
        <div className="w-24 h-24 bg-duo-green rounded-[2rem] mx-auto mb-6 flex items-center justify-center shadow-[0_6px_0_#46A302]">
           <BookOpen size={48} className="text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-duo-text mb-3">DuoFlash</h1>
        <p className="text-duo-gray-dark text-lg">Master English vocabulary with sentence-based context.</p>
      </div>

      <div className="w-full space-y-4">
        <Button fullWidth size="lg" onClick={handleStartDefault}>
          <FileText size={20} />
          Try Sample Deck
        </Button>
        
        <div className="relative">
          <input
            type="file"
            accept=".txt"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button 
            fullWidth 
            size="lg" 
            variant="secondary" 
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={20} />
            Upload File
          </Button>
        </div>
      </div>
      
      <p className="mt-8 text-xs text-duo-gray-dark text-center px-8">
        Upload a .txt file formatted with "1. word", "中文含义：", and "实战例句：" to create your own deck.
      </p>
    </div>
  );

  const renderStudy = () => {
    const currentCard = cards[currentIndex];

    return (
      <div className="min-h-screen flex flex-col bg-white">
        <div className="pt-6 pb-2">
          <ProgressBar current={currentIndex + 1} total={cards.length} onExit={handleExit} />
        </div>

        <div className="flex-1 px-4 pb-24 flex flex-col justify-center">
          <Flashcard 
            data={currentCard} 
            isFlipped={isFlipped} 
            onFlip={() => setIsFlipped(true)} 
          />
        </div>

        <div className="fixed bottom-0 left-0 w-full bg-white border-t-2 border-duo-gray p-4 safe-area-bottom z-10">
          <div className="max-w-2xl mx-auto flex gap-4">
            {!isFlipped ? (
              <Button fullWidth size="lg" onClick={() => setIsFlipped(true)}>
                Check
              </Button>
            ) : (
              <Button fullWidth size="lg" variant="primary" onClick={handleNext}>
                Continue
                <ArrowRight size={20} />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderSummary = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <div className="text-center mb-12 animate-in zoom-in duration-500">
        <div className="w-32 h-32 bg-duo-yellow rounded-full mx-auto mb-6 flex items-center justify-center shadow-[0_6px_0_#E5B400] text-white">
          <CheckCircle2 size={64} />
        </div>
        <h2 className="text-3xl font-extrabold text-duo-yellow-dark mb-2">Lesson Complete!</h2>
        <p className="text-xl text-duo-gray-dark font-bold">You reviewed {cards.length} words.</p>
      </div>

      <div className="w-full max-w-xs space-y-4">
        <Button fullWidth size="lg" onClick={() => setView('HOME')}>
          Back to Home
        </Button>
        <Button fullWidth size="lg" variant="secondary" onClick={handleStartDefault}>
          <RotateCw size={20} />
          Review Again
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {view === 'HOME' && renderHome()}
      {view === 'STUDY' && renderStudy()}
      {view === 'SUMMARY' && renderSummary()}
    </div>
  );
};

export default App;