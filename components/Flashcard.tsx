import React, { useState, useEffect } from 'react';
import { Volume2 } from 'lucide-react';
import { FlashcardData } from '../types';
import Button from './Button';

interface FlashcardProps {
  data: FlashcardData;
  isFlipped: boolean;
  onFlip: () => void;
}

const Flashcard: React.FC<FlashcardProps> = ({ data, isFlipped, onFlip }) => {
  // Use speech synthesis for English pronunciation
  const speak = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.cancel(); // Cancel previous
    window.speechSynthesis.speak(utterance);
  };

  // Play audio automatically when card appears
  useEffect(() => {
    if (data.term) {
       // Optional: Auto-play audio on new card
       // const utterance = new SpeechSynthesisUtterance(data.term);
       // utterance.lang = 'en-US';
       // window.speechSynthesis.speak(utterance);
    }
  }, [data]);

  return (
    <div className="w-full max-w-xl mx-auto perspective-1000">
      <div 
        onClick={!isFlipped ? onFlip : undefined}
        className={`
          relative w-full bg-white rounded-3xl border-2 border-duo-gray shadow-md 
          cursor-pointer transition-all duration-300 min-h-[400px] flex flex-col
          ${!isFlipped ? 'hover:border-duo-blue hover:bg-sky-50' : 'cursor-default'}
        `}
      >
        {/* Content Container */}
        <div className="p-8 flex flex-col flex-1 items-center justify-center text-center gap-6">
          
          {/* Term (Always Visible) */}
          <div className="flex flex-col items-center gap-3">
             <div 
              onClick={(e) => speak(data.term, e)}
              className="w-12 h-12 bg-duo-blue text-white rounded-2xl flex items-center justify-center shadow-sm cursor-pointer active:scale-95 transition-transform hover:bg-duo-blue-dark"
            >
              <Volume2 size={24} />
            </div>
            <h2 className="text-4xl font-extrabold text-duo-text tracking-tight">
              {data.term}
            </h2>
            {isFlipped && (
               <p className="text-xl text-duo-gray-dark font-medium">{data.definition}</p>
            )}
          </div>

          {/* Hidden Content (Revealed on Flip) */}
          {isFlipped && (
            <div className="w-full text-left space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
              
              {/* Divider */}
              <div className="h-0.5 w-full bg-gray-100 rounded-full" />

              {/* Example */}
              <div>
                <h3 className="text-sm font-bold text-duo-gray-dark uppercase tracking-wider mb-1">Example</h3>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-lg text-duo-text font-medium leading-relaxed">
                    {data.example}
                  </p>
                </div>
              </div>

              {/* Relations */}
              {data.relations.length > 0 && (
                <div>
                   <h3 className="text-sm font-bold text-duo-gray-dark uppercase tracking-wider mb-1">Related</h3>
                   <div className="flex flex-wrap gap-2">
                     {data.relations.map((rel, idx) => (
                       <span key={idx} className="bg-white border border-duo-gray px-3 py-1.5 rounded-xl text-sm font-bold text-duo-text shadow-sm">
                         {rel}
                       </span>
                     ))}
                   </div>
                </div>
              )}
            </div>
          )}

          {!isFlipped && (
            <div className="absolute bottom-8 text-duo-gray-dark font-bold text-sm uppercase tracking-widest opacity-50">
              Tap to reveal
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Flashcard;