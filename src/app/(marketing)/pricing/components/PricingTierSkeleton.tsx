export function PricingTierSkeleton() {
    return (
        <div className="bg-white rounded-2xl shadow-xl p-8 relative flex flex-col animate-pulse">
            <div className="mb-6">
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded w-1/4"></div>
            </div>
            <ul className="space-y-4 mb-8 flex-grow">
                {[1, 2, 3].map((i) => (
                    <li key={i} className="flex items-start">
                        <div className="h-5 w-5 bg-gray-200 rounded-full flex-shrink-0 mt-1"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 ml-3"></div>
                    </li>
                ))}
            </ul>
            <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
        </div>
    );
} 