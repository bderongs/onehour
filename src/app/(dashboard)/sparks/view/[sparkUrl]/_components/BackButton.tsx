/**
 * This client component handles the back button functionality
 * It uses client-side navigation to go back to the previous page
 */
'use client'

import { ArrowLeft } from 'lucide-react';

export function BackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="text-gray-500 hover:text-gray-700 transition-colors"
    >
      <ArrowLeft className="h-6 w-6" />
    </button>
  );
} 