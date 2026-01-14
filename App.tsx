import React, { useState } from 'react';
import { BookOpen, RotateCw, CheckCircle2, ArrowRight, Play } from 'lucide-react';
import { ViewState, FlashcardData } from './types';
import { TOPICS, Topic } from './src/data';
import Button from './components/Button';
import Flashcard from './components/Flashcard';
import ProgressBar from './components/ProgressBar';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('HOME');
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);
  const [cards, setCards] = useState<FlashcardData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleStartTopic = (topic: Topic) => {
    setCurrentTopic(topic);
    setCards(topic.data);
    setCurrentIndex(0);
    setIsFlipped(false);
    setView('STUDY');
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
      setCurrentTopic(null);
    }
  };

  const handleRestart = () => {
    if (currentTopic) {
      handleStartTopic(currentTopic);
    } else {
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
        <h2 className="text-xl font-bold text-duo-text mb-4 text-center">Choose a Topic</h2>
        <div className="space-y-3">
          {TOPICS.map((topic) => (
            <div 
              key={topic.id}
              className="bg-white border-2 border-duo-gray-light rounded-2xl p-4 hover:border-duo-blue cursor-pointer transition-colors shadow-sm"
              onClick={() => handleStartTopic(topic)}
            >
              <h3 className="font-bold text-lg text-duo-text mb-1">{topic.title}</h3>
              <p className="text-sm text-duo-gray-dark mb-3">{topic.description}</p>
              <Button fullWidth size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); handleStartTopic(topic); }}>
                <Play size={16} />
                Start Lesson
              </Button>
            </div>
          ))}
        </div>
      </div>
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
        <Button fullWidth size="lg" onClick={() => { setView('HOME'); setCurrentTopic(null); }}>
          Back to Topics
        </Button>
        <Button fullWidth size="lg" variant="secondary" onClick={handleRestart}>
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