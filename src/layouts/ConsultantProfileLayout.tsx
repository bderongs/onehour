import { Footer } from '../components/Footer';

interface ConsultantProfileLayoutProps {
  children: React.ReactNode;
}

export const ConsultantProfileLayout: React.FC<ConsultantProfileLayoutProps> = ({ children }) => {
  return (
    <>
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </>
  );
}; 