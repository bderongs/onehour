import { Logo } from '../components/Logo';
import { BrandName } from '../components/BrandName';
import { ArrowRight, CheckCircle, Linkedin, Twitter, Globe, Instagram, Facebook, Youtube, FileText, BookOpen, Sparkles, Package2, Clock, Store, Upload, PenSquare, Loader2, AlertCircle, ArrowLeft, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export function BrandPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <main className="pt-24 pb-16">
        <motion.div 
          className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* Brand Introduction */}
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Sparkier Brand Guidelines
            </h1>
            <p className="text-xl text-gray-600">
              Notre identité visuelle reflète notre mission de rendre le conseil plus accessible et efficace.
            </p>
          </motion.div>

          {/* Logo Section */}
          <motion.section 
            className="bg-white rounded-2xl p-8 shadow-sm mb-8"
            variants={fadeInUp}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Logo</h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-6">Version standard</h3>
                <div className="bg-white border border-gray-200 rounded-lg p-12 flex flex-col items-center justify-center gap-4">
                  <div className="relative w-[320px] h-[132px] border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <div className="brandname-download absolute inset-0 flex items-center justify-center scale-150">
                      <BrandName size="lg" color="indigo-900" />
                    </div>
                    <div className="absolute -top-6 left-0 right-0 text-xs text-gray-500 text-center">320px</div>
                    <div className="absolute -right-6 top-0 bottom-0 text-xs text-gray-500 flex items-center justify-center" style={{ writingMode: 'vertical-rl' }}>132px</div>
                  </div>
                  <a 
                    href="/images/brand-logo.png" 
                    download="sparkier-logo.png"
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Télécharger PNG
                  </a>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-6">Symbole seul</h3>
                <div className="bg-white border border-gray-200 rounded-lg p-12 flex flex-col items-center justify-center gap-4">
                  <Logo className="h-48 w-48" color="indigo-800" />
                  <a 
                    href="/images/brand-symbol.png" 
                    download="sparkier-symbol.png"
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Télécharger PNG
                  </a>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Colors Section */}
          <motion.section 
            className="bg-white rounded-2xl p-8 shadow-sm mb-8"
            variants={fadeInUp}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Couleurs</h2>
            <div className="space-y-8">
              {/* Primary Colors */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Couleurs principales</h3>
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
              </div>

              {/* Gradients */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Dégradés</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="h-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg mb-2"></div>
                    <p className="font-medium">Background Gradient</p>
                    <p className="text-sm text-gray-500">from-blue-50 to-indigo-50</p>
                  </div>
                  <div>
                    <div className="h-24 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg mb-2"></div>
                    <p className="font-medium">Accent Gradient</p>
                    <p className="text-sm text-gray-500">from-indigo-500 to-blue-500</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Typography Section */}
          <motion.section 
            className="bg-white rounded-2xl p-8 shadow-sm mb-8"
            variants={fadeInUp}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Typographie</h2>
            <div className="space-y-8">
              {/* Headings */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Titres</h3>
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
              </div>

              {/* Text Styles */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Styles de texte</h3>
                <div className="space-y-4">
                  <div>
                    <span className="highlight">Text Highlight</span>
                    <p className="text-sm text-gray-500 mt-1">Classe: highlight</p>
                  </div>
                  <div>
                    <span className="text-blue-600 hover:text-blue-700 transition-colors">Interactive Text</span>
                    <p className="text-sm text-gray-500 mt-1">text-blue-600 hover:text-blue-700</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* UI Components Section */}
          <motion.section 
            className="bg-white rounded-2xl p-8 shadow-sm mb-8"
            variants={fadeInUp}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Composants UI</h2>
            <div className="space-y-8">
              {/* Buttons */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Boutons</h3>
                <div className="space-y-8">
                  {/* Primary Buttons */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Boutons Primaires</h4>
                    <div className="flex flex-wrap gap-4">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2">
                        <span>Primary Button</span>
                        <ArrowRight className="h-5 w-5" />
                      </button>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 group">
                        <Sparkles className="h-5 w-5 transition-transform group-hover:scale-110" />
                        <span>Primary with Icon Animation</span>
                      </button>
                      <button className="w-full sm:w-auto bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center gap-2 group">
                        <span className="whitespace-nowrap">Full Width Responsive</span>
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </button>
                      <button className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                        <span>Form Submit Button</span>
                      </button>
                    </div>
                  </div>

                  {/* Secondary Buttons */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Boutons Secondaires</h4>
                    <div className="flex flex-wrap gap-4">
                      <button className="bg-white text-blue-600 border-2 border-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2">
                        <span>Secondary Button</span>
                        <ArrowRight className="h-5 w-5" />
                      </button>
                      <button className="bg-gray-50 text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center">
                        Secondary Plain
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors">
                        <Upload className="h-5 w-5" />
                        <span>Action Button</span>
                      </button>
                    </div>
                  </div>

                  {/* Text Buttons */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Boutons Texte</h4>
                    <div className="flex flex-wrap gap-4">
                      <button className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg transition-colors">
                        Text Button
                      </button>
                      <button className="font-medium text-blue-600 hover:text-blue-500">
                        Link Style Button
                      </button>
                      <button className="text-gray-500 hover:text-gray-700 transition-colors">
                        <ArrowLeft className="h-6 w-6" />
                      </button>
                    </div>
                  </div>

                  {/* Special Buttons */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Boutons Spéciaux</h4>
                    <div className="flex flex-wrap gap-4">
                      <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-lg hover:shadow-xl border border-gray-200 text-gray-700 hover:text-blue-600 transition-all duration-200">
                        <PenSquare className="h-5 w-5" />
                        <span className="font-medium">Edit Button</span>
                      </button>
                      <button className="w-full flex items-center justify-between p-4 text-left border-2 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group">
                        <div>
                          <p className="font-medium text-gray-900 group-hover:text-blue-600">Selection Button</p>
                          <p className="text-sm text-gray-500">With description text</p>
                        </div>
                        <span className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                      </button>
                    </div>
                  </div>

                  {/* Loading States */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">États de Chargement</h4>
                    <div className="flex flex-wrap gap-4">
                      <button className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                          <div className="h-5 w-5 border-t-2 border-white border-solid rounded-full animate-spin"></div>
                        </span>
                        Loading State
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors" disabled>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Loading...</span>
                      </button>
                    </div>
                  </div>

                  {/* Status Buttons */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Boutons de Statut</h4>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 text-green-700">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">Success Status</span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-50 text-amber-700">
                        <AlertCircle className="h-5 w-5" />
                        <span className="font-medium">Warning Status</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cards */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Cartes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Package2 className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold">Feature Card</h3>
                    </div>
                    <p className="text-gray-600">Description de la fonctionnalité avec un style de carte standard.</p>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-blue-100 shadow-md">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Store className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold">Glassmorphic Card</h3>
                    </div>
                    <p className="text-gray-600">Carte avec effet de verre dépoli pour un style moderne.</p>
                  </div>
                </div>
              </div>

              {/* Form Elements */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Éléments de formulaire</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Input Field
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Placeholder text"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Textarea
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="Placeholder text"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Field
                    </label>
                    <div className="relative">
                      <select
                        className="block w-full pl-4 pr-10 py-2.5 text-sm bg-white border border-gray-300 rounded-lg shadow-sm 
                        text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                        hover:border-blue-300 transition-colors cursor-pointer appearance-none"
                      >
                        <option value="option1" className="py-2">Option 1</option>
                        <option value="option2" className="py-2">Option 2</option>
                        <option value="option3" className="py-2">Option 3</option>
                        <option value="option4" className="py-2">Option 4</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <ChevronDown className="h-5 w-5" />
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Utilisez appearance-none pour masquer la flèche native et ajouter votre propre icône</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Container Widths */}
          <motion.section 
            className="bg-white rounded-2xl p-8 shadow-sm mb-8"
            variants={fadeInUp}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Conteneurs</h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Largeurs standards</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">max-w-7xl - Container Large</h4>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="bg-blue-100 p-4 rounded-lg text-center text-sm text-blue-800">
                        Utilisé pour les layouts principaux et les pages de contenu
                        <div className="text-xs text-blue-600 mt-1">Exemple: Header, Landing pages, Dashboard</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">max-w-6xl - Container Medium</h4>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="bg-blue-100 p-4 rounded-lg text-center text-sm text-blue-800">
                        Utilisé pour les grilles de contenu et les sections de fonctionnalités
                        <div className="text-xs text-blue-600 mt-1">Exemple: Grilles de Sparks, Chat interface</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">max-w-4xl - Container Small</h4>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="bg-blue-100 p-4 rounded-lg text-center text-sm text-blue-800">
                        Utilisé pour le contenu focalisé et les formulaires
                        <div className="text-xs text-blue-600 mt-1">Exemple: Profils consultants, Formulaires</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">max-w-3xl - Container Extra Small</h4>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="bg-blue-100 p-4 rounded-lg text-center text-sm text-blue-800">
                        Utilisé pour le texte de contenu et les descriptions
                        <div className="text-xs text-blue-600 mt-1">Exemple: Paragraphes de texte, Descriptions de sections</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Utilisation</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="text-sm text-gray-800">
{`// Container Large
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* Contenu */}
</div>

// Container Medium
<div className="max-w-6xl mx-auto px-4 sm:px-0">
  {/* Contenu */}
</div>

// Container Small
<div className="max-w-4xl mx-auto px-4">
  {/* Contenu */}
</div>

// Container Extra Small
<div className="max-w-3xl mx-auto px-4">
  {/* Contenu */}
</div>`}
                  </pre>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <p>Notes:</p>
                  <ul className="list-disc pl-5 space-y-2 mt-2">
                    <li>Toujours utiliser <code>mx-auto</code> pour centrer le conteneur</li>
                    <li>Ajouter un padding horizontal adaptatif avec <code>px-4 sm:px-6 lg:px-8</code> pour les grands conteneurs</li>
                    <li>Utiliser des paddings plus simples pour les petits conteneurs</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Icons Section */}
          <motion.section 
            className="bg-white rounded-2xl p-8 shadow-sm mb-8"
            variants={fadeInUp}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Icônes</h2>
            <div className="space-y-8">
              {/* Feature Icons */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Icônes de fonctionnalités</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-blue-600" />
                    <span>Sparkles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package2 className="h-6 w-6 text-blue-600" />
                    <span>Package</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-6 w-6 text-blue-600" />
                    <span>Clock</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Store className="h-6 w-6 text-blue-600" />
                    <span>Store</span>
                  </div>
                </div>
              </div>

              {/* Social Icons */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Icônes sociales</h3>
                <div className="flex gap-4">
                  <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-pink-600 transition-colors">
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-red-600 transition-colors">
                    <Youtube className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors">
                    <FileText className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                    <BookOpen className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                    <Globe className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Motion and Animations */}
          <motion.section 
            className="bg-white rounded-2xl p-8 shadow-sm mb-8"
            variants={fadeInUp}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Animations</h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Transitions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium mb-2">Fade In Up</p>
                    <motion.div
                      className="p-4 bg-blue-50 rounded-lg cursor-pointer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{
                        opacity: [1, 0, 1],
                        y: [0, 20, 0],
                        transition: {
                          duration: 1,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }
                      }}
                    >
                      Animation Fade In Up (Hover to repeat)
                    </motion.div>
                  </div>
                  <div>
                    <p className="font-medium mb-2">Hover Scale</p>
                    <motion.div
                      className="p-4 bg-blue-50 rounded-lg cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      Hover pour scale
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Usage Guidelines */}
          <motion.section 
            className="bg-white rounded-2xl p-8 shadow-sm"
            variants={fadeInUp}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Règles d'Utilisation</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">À Faire</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span>Utiliser les couleurs officielles de la marque</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span>Maintenir les proportions du logo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span>Respecter l'espace de protection autour du logo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span>Utiliser la typographie recommandée</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">À Ne Pas Faire</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="text-red-500">✗</span>
                    <span>Modifier les couleurs du logo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-red-500">✗</span>
                    <span>Déformer ou étirer le logo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-red-500">✗</span>
                    <span>Ajouter des effets au logo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-red-500">✗</span>
                    <span>Utiliser le logo sur des fonds complexes</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.section>
        </motion.div>
      </main>
    </div>
  );
} 