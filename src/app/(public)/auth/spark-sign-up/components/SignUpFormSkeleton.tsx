export function SignUpFormSkeleton() {
    return (
        <div className="max-w-md mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-md space-y-6 animate-pulse">
                <div className="text-center">
                    <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
                    <div className="mt-2 h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
                </div>
                <div className="space-y-4">
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                </div>
            </div>
        </div>
    );
} 