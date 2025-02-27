import { useState, useEffect, useRef } from 'react';
import { getConsultantProfile } from '../services/consultants';
import type { ConsultantProfile } from '../types/consultant';
import { supabase } from '../lib/supabase';
import { User, LogOut, Settings, UserCircle, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProfileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [consultantProfile, setConsultantProfile] = useState<ConsultantProfile | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { user, refreshUser } = useAuth();

    useEffect(() => {
        const fetchConsultantProfile = async () => {
            if (user?.roles.includes('consultant')) {
                const consultantData = await getConsultantProfile(user.id);
                setConsultantProfile(consultantData);
            }
        };

        fetchConsultantProfile();
    }, [user]);

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
        try {
            await supabase.auth.signOut();
            // Force refresh the auth state
            await refreshUser();
            // Only navigate after the auth state has been refreshed
            navigate('/', { replace: true });
        } catch (error) {
            console.error('Error during logout:', error);
            // Still try to navigate home if there's an error
            navigate('/', { replace: true });
        }
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
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 md:right-0 md:left-auto left-auto -right-2 sm:w-56 max-w-[calc(100vw-1rem)] border border-gray-100">
                    <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                        {user.roles.includes('client') && (
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    navigate('/client/dashboard');
                                }}
                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                <UserCircle className="w-4 h-4 mr-2" />
                                Mon tableau de bord
                            </button>
                        )}

                        {user.roles.includes('consultant') && (
                            <>
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        navigate(`/${consultantProfile?.slug || ''}`);
                                    }}
                                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    Voir mon profil
                                </button>
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        navigate(`/consultants/${user.id}/edit`);
                                    }}
                                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    <Settings className="w-4 h-4 mr-2" />
                                    Éditer mon profil
                                </button>
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        navigate('/sparks/manage');
                                    }}
                                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Mes Sparks
                                </button>
                            </>
                        )}
                        {user.roles.includes('admin') && (
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    navigate('/admin/dashboard');
                                }}
                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                <ShieldCheck className="w-4 h-4 mr-2" />
                                Administration
                            </button>
                        )}
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
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