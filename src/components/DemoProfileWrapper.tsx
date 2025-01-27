import { AlertCircle, ArrowRight } from 'lucide-react';
import ConsultantProfilePage from '../pages/ConsultantProfilePage';

export function DemoProfileWrapper() {
    const DEMO_CONSULTANT_ID = import.meta.env.VITE_DEMO_CONSULTANT_ID;

    if (!DEMO_CONSULTANT_ID) {
        console.error('Missing DEMO_CONSULTANT_ID environment variable');
        return null;
    }

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
            <ConsultantProfilePage id={DEMO_CONSULTANT_ID} />
        </>
    );
} 