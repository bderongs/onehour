import { Skeleton } from '@/components/ui/skeleton'

export function SparkProductSkeleton() {
    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Back Button Skeleton */}
                <Skeleton className="mb-8 w-6 h-6" />

                {/* Hero Section Skeleton */}
                <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6 lg:mb-8">
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-2/3" />
                        <Skeleton className="h-4 w-full" />
                        <div className="flex justify-between items-center">
                            <Skeleton className="h-6 w-24" />
                            <Skeleton className="h-6 w-32" />
                        </div>
                    </div>
                </div>

                {/* Main Content Grid Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6 lg:space-y-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                                <Skeleton className="h-6 w-1/3 mb-4" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-5/6" />
                                    <Skeleton className="h-4 w-4/6" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6 lg:space-y-8">
                        {[1, 2].map((i) => (
                            <div key={i} className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                                <Skeleton className="h-6 w-1/2 mb-4" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
} 