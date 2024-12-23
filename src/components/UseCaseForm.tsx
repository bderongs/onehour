import React from 'react';
import { ArrowRight } from 'lucide-react';

interface UseCase {
    icon: React.ReactNode;
    title: string;
    description: string;
    prefillText: string;
}

interface UseCaseFormProps {
    useCases: UseCase[];
    problem: string;
    setProblem: (problem: string) => void;
    handleSubmit: (e: React.FormEvent, message: string) => void;
    handleUseCaseClick: (prefillText: string) => void;
    handleKeyDown: (e: React.KeyboardEvent) => void;
}

export function UseCaseForm({
    useCases,
    problem,
    setProblem,
    handleSubmit,
    handleUseCaseClick,
    handleKeyDown
}: UseCaseFormProps) {
    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (problem.trim()) {
            handleSubmit(e, problem);
        }
    };

    return (
        <>
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

            <form onSubmit={onSubmit} className="flex flex-col gap-4">
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
                        className="w-full lg:w-auto bg-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-indigo-700 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
                    >
                        Trouver un Expert
                        <ArrowRight className="h-5 w-5" />
                    </button>
                </div>
            </form>
        </>
    );
}