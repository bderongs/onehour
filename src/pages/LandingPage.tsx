import React, { useState } from 'react';
import { ArrowRight, Bot, Users, Package2, Plus, Clock, Briefcase, Target, CheckCircle, MessageSquare, Calendar, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UseCase {
  icon: React.ReactNode;
  title: string;
  description: string;
  prefillText: string;
}

export function LandingPage() {
  const navigate = useNavigate();
  const [problem, setProblem] = useState('');

  const useCases: UseCase[] = [
    {
      icon: <Package2 className="h-6 w-6" />,
      title: "Choisir un Logiciel",
      description: "Quels logiciels pour mon entreprise ?",
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

  const whyChoose = [
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Rapide",
      description: "Obtenez des conseils en quelques minutes."
    },
    {
      icon: <Briefcase className="h-6 w-6" />,
      title: "Professionnel",
      description: "Des experts qualifiés à votre service."
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Précis",
      description: "Des solutions adaptées à vos besoins."
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Fiable",
      description: "Des conseils de confiance."
    }
  ];

  const howItWorks = [
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Décrivez",
      description: "Expliquez votre problème en détail."
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Planifiez",
      description: "Choisissez un créneau pour votre session."
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Connectez",
      description: "Discutez avec un expert en direct."
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Résolvez",
      description: "Obtenez des solutions concrètes."
    }
  ];

  return (
    <div className="bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Le concentré de conseil expert
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-gray-600">
              Décrivez votre problème et programmez une session de micro-consulting pour le résoudre.
            </p>

            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {useCases.map((useCase, index) => (
                  <button
                    key={index}
                    onClick={() => handleUseCaseClick(useCase.prefillText)}
                    className="p-6 rounded-xl text-left transition-all bg-white hover:bg-gray-50 border border-gray-200 hover:border-blue-200 shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                        {useCase.icon}
                      </div>
                      <h3 className="font-semibold text-gray-900">{useCase.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{useCase.description}</p>
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <textarea
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Décrivez votre défi professionnel..."
                  className="flex-grow p-6 rounded-xl text-gray-900 h-48 text-left border border-gray-200 shadow-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                  required
                />
                <div className="flex items-center lg:justify-end">
                  <button
                    type="submit"
                    className="w-full lg:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    Trouver un Expert
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Pourquoi Choisir ConseilExpress ?
            </h2>
            <p className="text-xl text-gray-600">
              Obtenez les conseils dont vous avez besoin, quand vous en avez besoin
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChoose.map((reason, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all"
              >
                <div className="p-3 bg-blue-50 rounded-lg w-fit mb-4">
                  {React.cloneElement(reason.icon as React.ReactElement, { className: "h-6 w-6 text-blue-600" })}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{reason.title}</h3>
                <p className="text-gray-600">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Comment ça Marche ?
            </h2>
            <p className="text-xl text-gray-600">
              Un processus simple en quatre étapes pour obtenir les conseils dont vous avez besoin
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all"
              >
                <div className="p-3 bg-blue-50 rounded-lg w-fit mb-4">
                  {React.cloneElement(step.icon as React.ReactElement, { className: "h-6 w-6 text-blue-600" })}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}