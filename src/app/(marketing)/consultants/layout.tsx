import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sparkier - Créez vos offres de conseil packagées',
  description: 'Transformez vos expertises en Sparks : des modules de conseil packagés et prêts à vendre. Simplifiez votre activité de conseil avec Sparkier.',
  openGraph: {
    title: 'Sparkier - Créez vos offres de conseil packagées',
    description: 'Transformez vos expertises en Sparks : des modules de conseil packagés et prêts à vendre. Simplifiez votre activité de conseil avec Sparkier.',
    images: [
      {
        url: 'https://sparkier.io/images/og-consultant.png',
        width: 1200,
        height: 630,
      },
    ],
    url: 'https://sparkier.io/consultants',
    siteName: 'Sparkier',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@sparkier',
    title: 'Sparkier - Créez vos offres de conseil packagées',
    description: 'Transformez vos expertises en Sparks : des modules de conseil packagés et prêts à vendre. Simplifiez votre activité de conseil avec Sparkier.',
    images: ['https://sparkier.io/images/og-consultant.png'],
  },
};

export default function ConsultantsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 