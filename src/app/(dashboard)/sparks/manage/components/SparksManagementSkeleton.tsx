export const SparksManagementSkeleton = () => {
    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white p-6 rounded-xl shadow-md">
                            <div className="h-40 bg-gray-200 rounded mb-4 animate-pulse" />
                            <div className="h-6 w-3/4 bg-gray-200 rounded mb-2 animate-pulse" />
                            <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                            <div className="flex gap-2 mt-4">
                                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
                                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}; 