export const RequestsSkeleton = () => {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                    <div className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-4">
                                    <div className="h-6 w-48 bg-gray-200 rounded"></div>
                                    <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
                                </div>
                                <div className="mt-1 flex items-center gap-4">
                                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                                </div>
                                <div className="mt-2 h-4 w-3/4 bg-gray-200 rounded"></div>
                            </div>
                            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
} 