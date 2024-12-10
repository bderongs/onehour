import React from 'react';
import { Clock, Users, Briefcase, Target, CheckCircle, MessageSquare, Calendar, Zap } from 'lucide-react';

export function Features() {
  const whyChoose = [
    {
      icon: <Clock className="h-8 w-8 text-indigo-600" />,
      title: "Un conseil efficace",
      description: "Allez droit au but avec des sessions de conseil ciblées conçues pour l'efficacité"
    },
    {
      icon: <Target className="h-8 w-8 text-indigo-600" />,
      title: "Des experts qualifiés",
      description: "Nos experts sont sélectionnés pour leur expertise et leur expérience"
    },
    {
      icon: <Briefcase className="h-8 w-8 text-indigo-600" />,
      title: "Pas d'engagement",
      description: "Ne payez que votre session, sans engagement"
    },
    {
      icon: <Users className="h-8 w-8 text-indigo-600" />,
      title: "A la demande",
      description: "Réservez des sessions à votre convenance avec notre système de planification simple"
    }
  ];

  const howItWorks = [
    {
      icon: <MessageSquare className="h-8 w-8 text-indigo-600" />,
      title: "Décrivez Votre Besoin",
      description: "Décrivez votre problème comme il vient, notre site vous proposera une synthèse."
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-indigo-600" />,
      title: "Nous trouvons votre expert",
      description: "Notre système vous met en relation avec le consultant le plus qualifié"
    },
    {
      icon: <Calendar className="h-8 w-8 text-indigo-600" />,
      title: "Planifiez la Session",
      description: "Choisissez un créneau d'une heure qui vous convient"
    },
    {
      icon: <Zap className="h-8 w-8 text-indigo-600" />,
      title: "Obtenez des Solutions",
      description: "Recevez des conseils pratiques et actionnables en une heure"
    }
  ];

  return (
    <>
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
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
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-4">{reason.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{reason.title}</h3>
                <p className="text-gray-600">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
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
                className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}