import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { AIChatInterface } from './AIChatInterface';

interface HeroProps {
  onConnect: () => void;
}

export function Hero({ onConnect }: HeroProps) {
  const [showChat, setShowChat] = useState(false);
  const [problem, setProblem] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowChat(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          {!showChat ? (
            <>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Conseil Expert,
                <br />
                Une Heure à la Fois
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-50">
                Décrivez votre défi ci-dessous et nous vous mettrons en relation avec l'expert idéal
              </p>

              <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-8">
                <textarea
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Décrivez votre défi professionnel..."
                  className="w-full p-4 rounded-lg text-gray-900 h-32 mb-4"
                  required
                />
                <button
                  type="submit"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center mx-auto"
                >
                  Trouver un Expert
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </form>

              <div className="flex justify-center">
                <a
                  href="/become-consultant"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                >
                  Devenir Consultant
                </a>
              </div>
            </>
          ) : (
            <div className="mb-8">
              <AIChatInterface initialProblem={problem} onConnect={onConnect} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}