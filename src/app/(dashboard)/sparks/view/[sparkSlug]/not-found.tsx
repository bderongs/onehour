/**
 * This file displays a not found page when a spark cannot be found
 */
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function SparkNotFound() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Spark introuvable</h1>
        <p className="text-gray-600 mb-6">
          Le Spark que vous recherchez n'existe pas ou a été supprimé.
        </p>
        <Link 
          href="/sparks/manage"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste des Sparks
        </Link>
      </div>
    </div>
  );
} 