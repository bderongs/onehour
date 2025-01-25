import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function Privacy() {
    const navigate = useNavigate();

    return (
        <div className="bg-white min-h-screen py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <ArrowLeft className="h-6 w-6" />
                    </button>
                    <h1 className="text-4xl font-extrabold text-gray-900">Politique de confidentialité</h1>
                </div>
                <div className="space-y-8 text-gray-700">
                    <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                        <p className="text-lg leading-relaxed">Chez Sparkier, accessible depuis notre site web, l'une de nos principales priorités est la confidentialité de nos visiteurs. Ce document de politique de confidentialité contient les types d'informations qui sont collectées et enregistrées par Sparkier et comment nous les utilisons.</p>
                    </div>

                    {/* Sections with consistent styling */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">1. Informations que nous collectons</h2>
                        <p className="text-lg">Nous collectons plusieurs types d'informations à des fins diverses pour vous fournir et améliorer notre Service.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">2. Comment nous utilisons vos informations</h2>
                        <p className="text-lg">Nous utilisons les données collectées à diverses fins :</p>
                        <ul className="list-disc pl-6 space-y-2 text-lg">
                            <li>Pour fournir et maintenir notre Service</li>
                            <li>Pour vous notifier des changements apportés à notre Service</li>
                            <li>Pour vous permettre de participer aux fonctionnalités interactives de notre Service</li>
                            <li>Pour fournir un support client</li>
                            <li>Pour recueillir des analyses afin d'améliorer notre Service</li>
                            <li>Pour surveiller l'utilisation de notre Service</li>
                            <li>Pour détecter, prévenir et résoudre les problèmes techniques</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">3. Fichiers journaux</h2>
                        <p className="text-lg leading-relaxed">Sparkier suit une procédure standard d'utilisation des fichiers journaux. Ces fichiers enregistrent les visiteurs lorsqu'ils visitent des sites web. Toutes les sociétés d'hébergement font cela et une partie des analyses des services d'hébergement. Les informations collectées par les fichiers journaux incluent les adresses de protocole Internet (IP), le type de navigateur, le fournisseur de services Internet (ISP), la date et l'heure, les pages de référence/sortie, et éventuellement le nombre de clics. Celles-ci ne sont pas liées à des informations personnellement identifiables.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">4. Cookies et balises web</h2>
                        <p className="text-lg leading-relaxed">Comme tout autre site web, Sparkier utilise des 'cookies'. Ces cookies sont utilisés pour stocker des informations, y compris les préférences des visiteurs, et les pages du site web que le visiteur a consultées ou visitées. Les informations sont utilisées pour optimiser l'expérience des utilisateurs en personnalisant le contenu de notre page web en fonction du type de navigateur des visiteurs et/ou d'autres informations.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">5. Politiques de confidentialité des tiers</h2>
                        <p className="text-lg leading-relaxed">La politique de confidentialité de Sparkier ne s'applique pas aux autres annonceurs ou sites web. Ainsi, nous vous conseillons de consulter les politiques de confidentialité respectives de ces serveurs publicitaires tiers pour des informations plus détaillées.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">6. Politique de confidentialité en ligne uniquement</h2>
                        <p className="text-lg leading-relaxed">Cette politique de confidentialité s'applique uniquement à nos activités en ligne et est valable pour les visiteurs de notre site web en ce qui concerne les informations qu'ils ont partagées et/ou collectées dans Sparkier. Cette politique ne s'applique pas à toute information collectée hors ligne ou via des canaux autres que ce site web.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">7. Consentement</h2>
                        <p className="text-lg leading-relaxed">En utilisant notre site web, vous consentez par la présente à notre politique de confidentialité et acceptez ses termes.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
