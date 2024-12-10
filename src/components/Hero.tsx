import React, { useState } from 'react';
import { ArrowRight, Search, Bot, Users, Package2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UseCase {
  icon: React.ReactNode;
  title: string;
  description: string;
  prefillText: string;
}

export function Hero() {
  const navigate = useNavigate();
  const [problem, setProblem] = useState('');

  const useCases: UseCase[] = [
    {
      icon: <Package2 className="h-6 w-6" />,
      title: "Choisir un Logiciel",
      description: "Quel SaaS choisir pour mon entreprise ?",
      prefillText: "Je cherche à choisir un logiciel pour mon entreprise. J'ai besoin d'aide pour comparer les solutions du marché et identifier celle qui correspond le mieux à mes besoins spécifiques."
    },
    {
      icon: <Bot className="h-6 w-6" />,
      title: "IA & Entreprise",
      description: "Comment l'IA peut m'aider ?",
      prefillText: "Je souhaite comprendre comment l'intelligence artificielle pourrait être utile dans mon entreprise. J'aimerais identifier les opportunités concrètes d'application et les bénéfices potentiels."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Recrutement",
      description: "Évaluer des candidats",
      prefillText: "Je dois recruter des profils techniques et j'ai besoin d'un expert pour m'aider à évaluer les compétences des candidats lors des entretiens."
    },
    {
      icon: <Plus className="h-6 w-6" />,
      title: "Autre Sujet",
      description: "J'ai une autre problématique",
      prefillText: ""
    }
  ];

  const handleUseCaseClick = (prefillText: string) => {
    setProblem(prefillText);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/chat', { state: { problem } });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Le concentré de conseil expert
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-50">
            Décrivez votre problème et programmez une session de micro-consulting pour le résoudre.
          </p>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {useCases.map((useCase, index) => (
                <button
                  key={index}
                  onClick={() => handleUseCaseClick(useCase.prefillText)}
                  className={`p-4 rounded-lg text-left transition-all ${problem === useCase.prefillText
                    ? 'bg-white text-blue-600 shadow-lg scale-105'
                    : 'bg-white/10 hover:bg-white/20'
                    }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    {useCase.icon}
                    <h3 className="font-semibold">{useCase.title}</h3>
                  </div>
                  <p className="text-sm opacity-90">{useCase.description}</p>
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-4">
              <textarea
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Décrivez votre défi professionnel..."
                className="flex-grow p-4 rounded-lg text-gray-900 h-48 lg:h-40 text-left"
                required
              />
              <div className="lg:flex lg:items-center">
                <button
                  type="submit"
                  className="w-full lg:w-auto bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center lg:justify-start whitespace-nowrap"
                >
                  Trouver un Expert
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}