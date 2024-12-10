import React from 'react';
import { Clock, Users, Briefcase, Target } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: <Clock className="h-8 w-8 text-indigo-600" />,
      title: "Sessions de Conseil d'1 Heure",
      description: "Allez droit au but avec des sessions de conseil ciblées conçues pour l'efficacité"
    },
    {
      icon: <Target className="h-8 w-8 text-indigo-600" />,
      title: "Mise en Relation Expert",
      description: "Notre plateforme vous met en relation avec le consultant parfait pour vos besoins spécifiques"
    },
    {
      icon: <Briefcase className="h-8 w-8 text-indigo-600" />,
      title: "Spécialistes par Secteur",
      description: "Accédez à un réseau de professionnels expérimentés dans divers secteurs"
    },
    {
      icon: <Users className="h-8 w-8 text-indigo-600" />,
      title: "Planification Flexible",
      description: "Réservez des sessions à votre convenance avec notre système de planification simple"
    }
  ];

  return (
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
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}