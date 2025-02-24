export default function SignInFormSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div>
                <div className="h-5 w-20 bg-gray-200 rounded mb-2"></div>
                <div className="h-10 w-full bg-gray-200 rounded"></div>
            </div>

            <div>
                <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
                <div className="h-10 w-full bg-gray-200 rounded"></div>
            </div>

            <div className="flex justify-end">
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>

            <div>
                <div className="h-10 w-full bg-gray-200 rounded"></div>
            </div>
        </div>
    );
} 