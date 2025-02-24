'use client'

import { Check, ArrowRight } from 'lucide-react';

interface PricingTier {
    name: string;
    price: string;
    currentPrice?: string;
    period: string;
    description: string;
    features: string[];
    cta: string;
    highlight: boolean;
    action: () => void;
}

interface PricingTierCardProps {
    tier: PricingTier;
    index: number;
}

export function PricingTierCard({ tier, index }: PricingTierCardProps) {
    return (
        <div 
            className={`bg-white rounded-2xl shadow-xl p-8 relative flex flex-col ${
                tier.highlight ? 'ring-2 ring-blue-600' : ''
            }`}
        >
            {tier.highlight && (
                <div className="absolute -top-5 left-0 right-0 mx-auto w-fit">
                    <span className="bg-blue-600 text-white text-sm font-medium px-4 py-1 rounded-full">
                        Disponible maintenant
                    </span>
                </div>
            )}
            <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                <p className="text-gray-600 mb-4">{tier.description}</p>
                {index === 0 ? (
                    <>
                        <div className="flex flex-col">
                            <div className="flex items-baseline">
                                <span className="text-4xl font-bold text-gray-900 line-through opacity-50">{tier.price}</span>
                                <span className="text-4xl font-bold text-gray-900 ml-2">{tier.currentPrice}</span>
                            </div>
                            <span className="text-gray-600 text-lg">{tier.period}</span>
                            <div className="bg-green-500 text-white text-sm font-medium px-3 py-1 rounded-full mt-2 w-fit">
                                Offre de lancement 🎉
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col">
                        <span className="text-4xl font-bold text-gray-900">{tier.price}</span>
                        <span className="text-gray-600 text-lg">{tier.period}</span>
                    </div>
                )}
            </div>
            <ul className="space-y-4 mb-8 flex-grow">
                {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                        <Check className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                        <span className="ml-3 text-gray-600">{feature}</span>
                    </li>
                ))}
            </ul>
            <button 
                className={`w-full py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 group ${
                    tier.highlight
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                }`}
                onClick={tier.action}
            >
                {tier.cta}
                {tier.highlight && (
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                )}
            </button>
        </div>
    );
} 