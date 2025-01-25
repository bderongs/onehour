import { Link } from 'react-router-dom';
import { ProfileMenu } from './ProfileMenu';
import { BrandName } from './BrandName';

export const DashboardHeader: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 shadow-sm bg-white">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <BrandName color="blue-900" />
            </Link>
          </div>
          <div className="flex items-center">
            <ProfileMenu />
          </div>
        </div>
      </nav>
    </header>
  );
}; 