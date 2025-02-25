import { Skeleton } from '@/components/ui/skeleton'

export function HeroSkeleton() {
    return (
        <div className="flex flex-col items-center text-center space-y-8">
            <div className="space-y-4 max-w-3xl">
                <Skeleton className="h-12 w-3/4 mx-auto" />
                <Skeleton className="h-12 w-2/3 mx-auto" />
                <div className="space-y-2 mt-6">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-5/6 mx-auto" />
                    <Skeleton className="h-5 w-4/5 mx-auto" />
                </div>
            </div>
            
            <div className="flex gap-4 justify-center">
                <Skeleton className="h-12 w-32" />
                <Skeleton className="h-12 w-32" />
            </div>
            
            <div className="w-full max-w-5xl aspect-video">
                <Skeleton className="w-full h-full rounded-xl" />
            </div>
        </div>
    )
} 