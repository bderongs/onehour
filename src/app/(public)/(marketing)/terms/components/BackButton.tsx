'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Go back"
        >
            <ArrowLeft className="h-6 w-6" />
        </button>
    );
} 