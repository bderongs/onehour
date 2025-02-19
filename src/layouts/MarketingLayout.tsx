import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface MarketingLayoutProps {
  children: React.ReactNode;
  withTopPadding?: boolean;
}

export const MarketingLayout: React.FC<MarketingLayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </>
  );
}; 