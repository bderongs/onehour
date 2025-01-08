import React from 'react';
import { Logo } from '../components/Logo';
import { BrandName } from '../components/BrandName';
import { HeaderSimple } from '../components/HeaderSimple';

export function BrandPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <HeaderSimple />
      
      <main className="pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Brand Introduction */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Sparkier Brand Guidelines
            </h1>
            <p className="text-xl text-gray-600">
              Notre identité visuelle reflète notre mission de rendre le conseil plus accessible et efficace.
            </p>
          </div>

          {/* Logo Section */}
          <section className="bg-white rounded-2xl p-8 shadow-sm mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Logo</h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-6">Version standard</h3>
                <div className="bg-white border border-gray-200 rounded-lg p-12 flex items-center justify-center">
                  <BrandName size="lg" color="indigo-900" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-6">Symbole seul</h3>
                <div className="bg-white border border-gray-200 rounded-lg p-12 flex items-center justify-center">
                  <Logo className="h-48 w-48" color="indigo-800" />
                </div>
              </div>
            </div>
          </section>

          {/* Colors Section */}
          <section className="bg-white rounded-2xl p-8 shadow-sm mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Couleurs</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="h-24 bg-indigo-600 rounded-lg mb-2"></div>
                <p className="font-medium">Primary Blue</p>
                <p className="text-sm text-gray-500">#4F46E5</p>
              </div>
              <div>
                <div className="h-24 bg-blue-600 rounded-lg mb-2"></div>
                <p className="font-medium">Secondary Blue</p>
                <p className="text-sm text-gray-500">#2563EB</p>
              </div>
              <div>
                <div className="h-24 bg-gray-900 rounded-lg mb-2"></div>
                <p className="font-medium">Text Dark</p>
                <p className="text-sm text-gray-500">#111827</p>
              </div>
              <div>
                <div className="h-24 bg-gray-100 rounded-lg mb-2"></div>
                <p className="font-medium">Background Light</p>
                <p className="text-sm text-gray-500">#F3F4F6</p>
              </div>
            </div>
          </section>

          {/* Typography Section */}
          <section className="bg-white rounded-2xl p-8 shadow-sm mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Typographie</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-4xl font-bold mb-2">Titre Principal</h3>
                <p className="text-gray-500">Font: Inter - Bold - 36px/2.25rem</p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2">Sous-titre</h3>
                <p className="text-gray-500">Font: Inter - Semibold - 24px/1.5rem</p>
              </div>
              <div>
                <p className="text-base mb-2">Texte de paragraphe</p>
                <p className="text-gray-500">Font: Inter - Regular - 16px/1rem</p>
              </div>
            </div>
          </section>

          {/* Usage Guidelines */}
          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Règles d'Utilisation</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">À Faire</h3>
                <ul className="space-y-3 text-gray-600">
                  <li>✓ Utiliser les couleurs officielles de la marque</li>
                  <li>✓ Maintenir les proportions du logo</li>
                  <li>✓ Respecter l'espace de protection autour du logo</li>
                  <li>✓ Utiliser la typographie recommandée</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">À Ne Pas Faire</h3>
                <ul className="space-y-3 text-gray-600">
                  <li>✗ Modifier les couleurs du logo</li>
                  <li>✗ Déformer ou étirer le logo</li>
                  <li>✗ Ajouter des effets au logo</li>
                  <li>✗ Utiliser le logo sur des fonds complexes</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </main>

    </div>
  );
} 