import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <Skeleton className="h-6 w-6 rounded" />
                    <Skeleton className="h-9 w-48" />
                </div>
                
                <div className="space-y-6">
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                    
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="h-32 w-full" />
                    </div>
                    
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                    
                    <div className="flex gap-4">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-24" />
                    </div>
                </div>
            </div>
        </div>
    )
} 