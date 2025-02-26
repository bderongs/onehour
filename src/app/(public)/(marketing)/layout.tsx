import { Header } from './components/Header';
import { Footer } from '@/components/Footer';
import { PageTypeProvider } from '@/contexts/PageTypeContext';

export default function MarketingRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageTypeProvider pageType="marketing">
      <Header />
      <main className="flex-grow pt-16">
        {children}
      </main>
      <Footer />
    </PageTypeProvider>
  );
} 