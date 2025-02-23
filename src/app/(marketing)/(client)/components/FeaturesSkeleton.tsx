export function FeaturesSkeleton() {
    return (
        <div className="mb-24 animate-pulse">
            {/* Title Skeleton */}
            <div className="text-center mb-16">
                <div className="h-10 bg-gray-200 rounded-lg max-w-xl mx-auto mb-4" />
                <div className="h-6 bg-gray-200 rounded-lg max-w-3xl mx-auto" />
            </div>

            {/* Features Grid Skeleton */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="bg-white/80 backdrop-blur-sm p-8 rounded-xl border border-gray-100 shadow-md text-center"
                    >
                        {/* Icon Skeleton */}
                        <div className="mx-auto mb-4 w-12 h-12 bg-gray-200 rounded-lg" />
                        
                        {/* Title Skeleton */}
                        <div className="h-6 bg-gray-200 rounded mb-2 w-3/4 mx-auto" />
                        
                        {/* Description Skeleton */}
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-full" />
                            <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto" />
                            <div className="h-4 bg-gray-200 rounded w-4/6 mx-auto" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 