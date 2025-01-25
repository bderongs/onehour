import { Footer } from '../components/Footer';
import { DashboardHeader } from '../components/DashboardHeader';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <>
      <DashboardHeader />
      <main className="flex-grow pt-16">
        {children}
      </main>
      <Footer />
    </>
  );
}; 