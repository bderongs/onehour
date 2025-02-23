export function MarketingHeroSkeleton() {
    return (
        <div className="text-center mb-16 animate-pulse">
            {/* Title Skeleton */}
            <div className="h-16 bg-gray-200 rounded-lg max-w-3xl mx-auto mb-6" />
            
            {/* Subtitle Skeleton */}
            <div className="h-8 bg-gray-200 rounded-lg max-w-2xl mx-auto mb-12" />

            {/* Sparks Grid Skeleton */}
            <div className="mb-12 sm:mb-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-xl p-6 shadow-md">
                            <div className="h-6 bg-gray-200 rounded mb-4 w-3/4" />
                            <div className="h-4 bg-gray-200 rounded mb-2 w-full" />
                            <div className="h-4 bg-gray-200 rounded mb-2 w-5/6" />
                            <div className="h-4 bg-gray-200 rounded w-4/6" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Interface Skeleton */}
            <div className="mt-6 flex justify-center">
                <div className="w-full max-w-6xl">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="p-4 border-b border-gray-200">
                            <div className="h-6 bg-gray-200 rounded w-1/4 mb-2" />
                            <div className="h-4 bg-gray-200 rounded w-1/2" />
                        </div>
                        <div className="p-4">
                            <div className="h-12 bg-gray-200 rounded-lg" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 