export function SignUpPageSkeleton() {
    return (
        <div className="bg-white p-8 rounded-lg shadow-md space-y-6 animate-pulse">
            <div className="text-center">
                <div className="h-8 w-48 bg-gray-200 rounded mx-auto" />
                <div className="mt-2">
                    <div className="h-4 w-64 bg-gray-200 rounded mx-auto" />
                </div>
            </div>

            <div className="space-y-4">
                <div className="w-full h-24 bg-gray-200 rounded-lg" />
                <div className="w-full h-24 bg-gray-200 rounded-lg" />
            </div>

            <div className="text-center">
                <div className="h-4 w-48 bg-gray-200 rounded mx-auto" />
            </div>
        </div>
    );
} 