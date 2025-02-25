'use client';

import { AlertCircle, ArrowRight } from 'lucide-react';
import ConsultantProfilePage from '../../[slug]/page';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { getDemoConsultantSlug } from './actions';
import logger from '@/utils/logger';

export default function DemoProfilePage() {
    const DEMO_CONSULTANT_ID = process.env.NEXT_PUBLIC_DEMO_CONSULTANT_ID;
    const [consultantSlug, setConsultantSlug] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchConsultantSlug() {
            if (!DEMO_CONSULTANT_ID) {
                logger.error('Missing NEXT_PUBLIC_DEMO_CONSULTANT_ID environment variable');
                redirect('/');
                return;
            }

            const slug = await getDemoConsultantSlug(DEMO_CONSULTANT_ID);
            
            if (!slug) {
                logger.error('Demo consultant not found or missing slug');
                redirect('/');
                return;
            }

            setConsultantSlug(slug);
            setLoading(false);
        }

        fetchConsultantSlug();
    }, []);

    if (loading) {
        return <LoadingSpinner message="Chargement du profil de démonstration..." />;
    }

    if (!consultantSlug) {
        return null;
    }

    // Create a Promise that resolves with the slug parameter
    const paramsPromise = Promise.resolve({ slug: consultantSlug });

    return (
        <>
            {/* Sample Profile Warning Banner */}
            <div className="bg-amber-50 border-b border-amber-200">
                <div className="max-w-4xl mx-auto px-4 py-2.5 sm:py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                    <div className="flex items-center gap-2 text-amber-800">
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        <p className="text-xs sm:text-sm">Ceci est un profil exemple à des fins de démonstration. Les informations présentées ne sont pas réelles.</p>
                    </div>
                    <a href="/consultants" className="text-xs sm:text-sm font-medium text-amber-800 hover:text-amber-900 flex items-center gap-1 whitespace-nowrap">
                        Créer mon profil
                        <ArrowRight className="h-4 w-4" />
                    </a>
                </div>
            </div>
            <ConsultantProfilePage params={paramsPromise} />
        </>
    );
} 