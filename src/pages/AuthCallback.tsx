import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AuthCallback() {
    const [error, setError] = useState<string | null>(null)
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        // Get the access_token from URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')

        if (!accessToken) {
            setError('Token d\'accès non trouvé')
            setLoading(false)
            return
        }

        const setupSession = async () => {
            try {
                const { data, error } = await supabase.auth.getSession()
                
                if (error) throw error
                
                if (data?.session) {
                    // User is authenticated, redirect to dashboard or profile
                    navigate('/dashboard')
                }
            } catch (err) {
                console.error('Error setting up session:', err)
                setError('Échec de la configuration de la session')
            } finally {
                setLoading(false)
            }
        }

        setupSession()
    }, [navigate])

    const handleSetPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            })

            if (error) throw error

            // Password set successfully, redirect to dashboard
            navigate('/dashboard')
        } catch (err) {
            console.error('Error setting password:', err)
            setError('Échec de la définition du mot de passe')
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Configuration de votre compte en cours...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center text-red-600">
                    <p>Erreur : {error}</p>
                    <button 
                        onClick={() => navigate('/')}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Retour à l'accueil
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Définissez votre mot de passe
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Veuillez définir un mot de passe pour finaliser la création de votre compte
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSetPassword}>
                    <div>
                        <label htmlFor="password" className="sr-only">
                            Mot de passe
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                            placeholder="Entrez votre nouveau mot de passe"
                            minLength={8}
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Définir le mot de passe et continuer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
} 