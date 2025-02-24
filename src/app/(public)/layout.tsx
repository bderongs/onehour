import { Metadata } from 'next';

export const metadata: Metadata = {
    title: {
        default: 'Sparkier - Connectez-vous avec des experts',
        template: '%s | Sparkier'
    },
    description: 'Sparkier vous permet de vous connecter avec des experts et de bénéficier de leur expertise à travers des appels optimisés.',
    keywords: ['expert', 'consultation', 'conseil', 'appel', 'optimisation'],
    openGraph: {
        title: 'Sparkier - Connectez-vous avec des experts',
        description: 'Sparkier vous permet de vous connecter avec des experts et de bénéficier de leur expertise à travers des appels optimisés.',
        type: 'website',
    }
};

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            {children}
        </div>
    );
} 