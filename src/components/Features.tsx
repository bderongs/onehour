import React from 'react';
import { Clock, Users, Briefcase, Target } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: <Clock className="h-8 w-8 text-indigo-600" />,
      title: "1-Hour Focus Sessions",
      description: "Get straight to the point with targeted consulting sessions designed for efficiency"
    },
    {
      icon: <Target className="h-8 w-8 text-indigo-600" />,
      title: "Expert Matching",
      description: "Our platform matches you with the perfect consultant for your specific needs"
    },
    {
      icon: <Briefcase className="h-8 w-8 text-indigo-600" />,
      title: "Industry Specialists",
      description: "Access a network of experienced professionals across various industries"
    },
    {
      icon: <Users className="h-8 w-8 text-indigo-600" />,
      title: "Flexible Scheduling",
      description: "Book sessions at your convenience with our easy scheduling system"
    }
  ];

  return (
    <div className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose OneHourAdvice?
          </h2>
          <p className="text-xl text-gray-600">
            Get the guidance you need, when you need it
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