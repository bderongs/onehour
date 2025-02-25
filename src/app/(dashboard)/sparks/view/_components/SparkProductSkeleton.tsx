export function SparkProductSkeleton() {
    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Back Button Skeleton */}
                <div className="mb-8 w-6 h-6 bg-gray-200 rounded animate-pulse" />

                {/* Hero Section Skeleton */}
                <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6 lg:mb-8">
                    <div className="space-y-4">
                        <div className="h-8 bg-gray-200 rounded w-2/3 animate-pulse" />
                        <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                        <div className="flex justify-between items-center">
                            <div className="h-6 bg-gray-200 rounded w-24 animate-pulse" />
                            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* Main Content Grid Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6 lg:space-y-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4 animate-pulse" />
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                                    <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
                                    <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6 lg:space-y-8">
                        {[1, 2].map((i) => (
                            <div key={i} className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                                <div className="h-6 bg-gray-200 rounded w-1/2 mb-4 animate-pulse" />
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
} 