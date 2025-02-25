import Link from 'next/link'

export default function SparkNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Spark non trouvé</h1>
        <p className="text-gray-600 mb-6">
          Le spark que vous recherchez n'existe pas ou a été supprimé.
        </p>
        <Link 
          href="/admin/sparks"
          className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Retour aux sparks
        </Link>
      </div>
    </div>
  )
} 