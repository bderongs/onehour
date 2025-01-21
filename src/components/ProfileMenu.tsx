import { useState, useEffect, useRef } from 'react';
import { UserProfile, getCurrentUser } from '../services/auth';
import { supabase } from '../lib/supabase';
import { User, LogOut, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ProfileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<UserProfile | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const userProfile = await getCurrentUser();
            setUser(userProfile);
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    if (!user) return null;

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
            >
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-indigo-600" />
                </div>
                <span className="hidden md:inline font-medium">
                    {user.firstName} {user.lastName}
                </span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <div className="py-1">
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                navigate('/profile');
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            <Settings className="w-4 h-4 mr-2" />
                            Paramètres
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Déconnexion
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
} 