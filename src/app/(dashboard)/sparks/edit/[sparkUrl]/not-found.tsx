import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Spark introuvable</h2>
                <p className="text-gray-600 mb-6">Le spark que vous recherchez n'existe pas ou a été supprimé.</p>
                <Link
                    href="/admin/sparks"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                >
                    Retour aux sparks
                </Link>
            </div>
        </div>
    )
} 