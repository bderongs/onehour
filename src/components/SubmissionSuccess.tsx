import { CheckCircle } from 'lucide-react';

interface SubmissionSuccessProps {
    title?: string;
    message: string;
}

export function SubmissionSuccess({ 
    title = "Merci pour votre inscription !",
    message 
}: SubmissionSuccessProps) {
    return (
        <div className="bg-green-50 text-green-800 p-6 rounded-xl text-center">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p>{message}</p>
        </div>
    );
} 