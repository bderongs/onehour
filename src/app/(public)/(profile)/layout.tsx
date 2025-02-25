import { Footer } from '@/components/Footer';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 35%, rgba(147, 197, 253, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 75% 44%, rgba(165, 180, 252, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 5% 75%, rgba(147, 197, 253, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 95%, rgba(165, 180, 252, 0.15) 0%, transparent 50%)
            `
          }}
        />
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 30%, rgba(147, 197, 253, 0.2) 0%, transparent 40%),
              radial-gradient(circle at 70% 60%, rgba(165, 180, 252, 0.2) 0%, transparent 40%)
            `
          }}
        />
      </div>
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
} 