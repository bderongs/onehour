import { Skeleton } from '@/components/ui/skeleton'

export function PricingTierSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
                <div
                    key={i}
                    className="flex flex-col p-6 bg-white shadow-lg rounded-lg dark:bg-zinc-850"
                >
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-8 w-32" />
                    </div>
                    
                    <div className="mt-4 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                    </div>
                    
                    <div className="my-6">
                        <Skeleton className="h-12 w-full" />
                    </div>
                    
                    <div className="space-y-4 flex-1">
                        {[1, 2, 3, 4].map((j) => (
                            <div key={j} className="flex items-center gap-2">
                                <Skeleton className="h-5 w-5 rounded-full" />
                                <Skeleton className="h-4 flex-1" />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
} 