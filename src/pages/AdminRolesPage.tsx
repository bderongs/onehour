import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserProfile, updateUserRoles, UserRole } from '../services/auth';
import { supabase } from '../lib/supabase';
import { Notification } from '../components/Notification';
import { Users } from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';

const EmptyState = () => (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
        >
            <Users className="h-20 w-20 text-blue-500" />
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Aucun utilisateur</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl">
            Il n'y a actuellement aucun utilisateur à afficher.
        </p>
    </div>
);

export function AdminRolesPage() {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [showAllUsers, setShowAllUsers] = useState(false);

    const availableRoles: UserRole[] = ['client', 'consultant', 'admin'];

    const fetchUsers = async (includeSparkierEmails: boolean) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, email, first_name, last_name, roles')
                .order('email');

            if (error) throw error;

            const filteredData = includeSparkierEmails 
                ? data 
                : data.filter(profile => !profile.email.endsWith('@sparkier.io'));

            setUsers(filteredData.map(profile => ({
                id: profile.id,
                email: profile.email,
                firstName: profile.first_name,
                lastName: profile.last_name,
                roles: profile.roles,
            })));
        } catch (err) {
            setNotification({
                type: 'error',
                message: 'Failed to fetch users'
            });
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(showAllUsers);
    }, [showAllUsers]);

    const handleRoleToggle = async (userId: string, role: UserRole, currentRoles: UserRole[]) => {
        try {
            setNotification(null);

            const newRoles = currentRoles.includes(role)
                ? currentRoles.filter(r => r !== role)
                : [...currentRoles, role];

            // Ensure at least one role remains
            if (newRoles.length === 0) {
                setNotification({
                    type: 'error',
                    message: 'User must have at least one role'
                });
                return;
            }

            // Update roles using the service
            await updateUserRoles(userId, newRoles, currentRoles);
            
            // Update local state
            await fetchUsers(showAllUsers);

            setNotification({
                type: 'success',
                message: 'Roles updated successfully'
            });
        } catch (err: any) {
            setNotification({
                type: 'error',
                message: err.message || 'Failed to update roles'
            });
            console.error('Error updating roles:', err);
        }
    };

    const toggleShowAll = () => {
        setLoading(true);
        setShowAllUsers(!showAllUsers);
    };

    if (loading) {
        return <LoadingSpinner message="Chargement des rôles..." />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="max-w-7xl mx-auto px-4 py-12">
                {notification && (
                    <Notification
                        type={notification.type}
                        message={notification.message}
                        onClose={() => setNotification(null)}
                    />
                )}

                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Gestion des rôles</h1>
                        <p className="text-gray-600 mt-2">Gérez les rôles des utilisateurs</p>
                    </div>
                    <button
                        onClick={toggleShowAll}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        {showAllUsers ? 'Masquer les emails @sparkier.io' : 'Afficher tous les utilisateurs'}
                    </button>
                </div>

                {users.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nom
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Rôles
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map((user) => (
                                        <tr key={user.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {user.firstName} {user.lastName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <div className="flex flex-wrap gap-2">
                                                    {availableRoles.map((role) => (
                                                        <button
                                                            key={role}
                                                            onClick={() => handleRoleToggle(user.id, role, user.roles)}
                                                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
                                                                ${user.roles.includes(role)
                                                                    ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                                }`}
                                                        >
                                                            {role}
                                                        </button>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 