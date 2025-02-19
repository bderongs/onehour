import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export const MarketingLayout: React.FC<MarketingLayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <main className="flex-grow pt-16">
        {children}
      </main>
      <Footer />
    </>
  );
}; 