'use client';

import { type UserType } from '@/types/auth';

interface UserTypeSelectorProps {
  onTypeSelect: (type: UserType) => void;
  selectedType: UserType;
}

export function UserTypeSelector({ onTypeSelect, selectedType }: UserTypeSelectorProps) {
  return (
    <div className="space-y-4">
      {!selectedType ? (
        <>
          <button
            onClick={() => onTypeSelect('client')}
            className="w-full flex items-center justify-between p-4 text-left border-2 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
          >
            <div>
              <p className="font-medium text-gray-900 group-hover:text-blue-600">Je suis un client</p>
              <p className="text-sm text-gray-500">Je cherche un expert pour m'accompagner</p>
            </div>
            <span className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
          </button>
          <button
            onClick={() => onTypeSelect('consultant')}
            className="w-full flex items-center justify-between p-4 text-left border-2 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
          >
            <div>
              <p className="font-medium text-gray-900 group-hover:text-blue-600">Je suis un consultant</p>
              <p className="text-sm text-gray-500">Je souhaite proposer mes services</p>
            </div>
            <span className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
          </button>
        </>
      ) : (
        <button
          onClick={() => onTypeSelect(null)}
          className="mt-2 text-sm text-blue-600 hover:text-blue-500"
        >
          ← Changer de profil
        </button>
      )}
    </div>
  );
} 