'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function Terms() {
    const router = useRouter();

    return (
        <div className="bg-white min-h-screen py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => router.back()}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <ArrowLeft className="h-6 w-6" />
                    </button>
                    <h1 className="text-4xl font-extrabold text-gray-900">Termes et conditions</h1>
                </div>
                <div className="space-y-8 text-gray-700">
                    <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                        <p className="text-lg leading-relaxed">Bienvenue chez Sparkier. Ces termes et conditions décrivent les règles et règlements pour l'utilisation de notre site web.</p>
                    </div>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">1. Introduction</h2>
                        <p className="text-lg leading-relaxed">En accédant à ce site web, nous supposons que vous acceptez ces termes et conditions. Ne continuez pas à utiliser Sparkier si vous n'acceptez pas tous les termes et conditions énoncés sur cette page.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">2. Droits de propriété intellectuelle</h2>
                        <p className="text-lg leading-relaxed">Sauf indication contraire, Sparkier et/ou ses concédants détiennent les droits de propriété intellectuelle pour tout le matériel sur Sparkier. Tous les droits de propriété intellectuelle sont réservés. Vous pouvez accéder à cela depuis Sparkier pour votre usage personnel soumis aux restrictions définies dans ces termes et conditions.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">3. Commentaires des utilisateurs</h2>
                        <p className="text-lg leading-relaxed">Certaines parties de ce site web offrent aux utilisateurs la possibilité de publier et d'échanger des opinions et des informations dans certaines zones du site web. Sparkier ne filtre pas, n'édite pas, ne publie pas et ne révise pas les commentaires avant leur présence sur le site web. Les commentaires ne reflètent pas les vues et opinions de Sparkier, ses agents et/ou affiliés. Les commentaires reflètent les vues et opinions de la personne qui publie ses vues et opinions.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">4. Hyperliens vers notre contenu</h2>
                        <p className="text-lg leading-relaxed">Les organisations suivantes peuvent créer des liens vers notre site web sans approbation écrite préalable : agences gouvernementales, moteurs de recherche, organisations de presse, distributeurs d'annuaires en ligne, et entreprises accréditées à l'échelle du système.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">5. iFrames</h2>
                        <p className="text-lg leading-relaxed">Sans approbation préalable et permission écrite, vous ne pouvez pas créer de cadres autour de nos pages web qui modifient de quelque manière que ce soit la présentation visuelle ou l'apparence de notre site web.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">6. Responsabilité du contenu</h2>
                        <p className="text-lg leading-relaxed">Nous ne serons pas tenus responsables de tout contenu apparaissant sur votre site web. Vous acceptez de nous protéger et de nous défendre contre toutes les réclamations qui se lèvent sur votre site web.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">7. Votre confidentialité</h2>
                        <p className="text-lg leading-relaxed">Veuillez lire notre politique de confidentialité.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">8. Réservation des droits</h2>
                        <p className="text-lg leading-relaxed">Nous nous réservons le droit de vous demander de supprimer tous les liens ou tout lien particulier vers notre site web. Vous approuvez de supprimer immédiatement tous les liens vers notre site web sur demande.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">9. Suppression de liens de notre site web</h2>
                        <p className="text-lg leading-relaxed">Si vous trouvez un lien sur notre site web qui est offensant pour une raison quelconque, vous êtes libre de nous contacter et de nous en informer à tout moment. Nous examinerons les demandes de suppression de liens mais nous ne sommes pas obligés de le faire ou de vous répondre directement.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">10. Avertissement</h2>
                        <p className="text-lg leading-relaxed">Dans la mesure maximale permise par la loi applicable, nous excluons toutes les représentations, garanties et conditions relatives à notre site web et à l'utilisation de ce site web.</p>
                    </section>
                </div>
            </div>
        </div>
    );
} 