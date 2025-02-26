import { Check, X } from 'lucide-react';

interface PasswordRequirementsProps {
    password: string;
    confirmPassword?: string;
}

export function PasswordRequirements({ password, confirmPassword }: PasswordRequirementsProps) {
    const requirements = [
        {
            label: 'Au moins 8 caractères',
            isValid: password.length >= 8
        },
        {
            label: 'Au moins une lettre',
            isValid: /[a-zA-Z]/.test(password)
        },
        {
            label: 'Au moins un chiffre',
            isValid: /[0-9]/.test(password)
        },
        ...(confirmPassword ? [{
            label: 'Les mots de passe correspondent',
            isValid: password === confirmPassword && password !== ''
        }] : [])
    ];

    return (
        <div className="space-y-1">
            <p className="text-sm font-medium text-gray-700">
                Exigences du mot de passe :
            </p>
            <ul className="space-y-1">
                {requirements.map((req, index) => (
                    <li
                        key={index}
                        className={`text-sm flex items-center space-x-2 ${
                            req.isValid ? 'text-green-600' : 'text-gray-500'
                        }`}
                    >
                        {req.isValid ? (
                            <Check className="h-4 w-4" />
                        ) : (
                            <X className="h-4 w-4" />
                        )}
                        <span>{req.label}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// Export the validation function to be used by other components
export const isPasswordValid = (password: string) => {
    return password.length >= 8 &&
           /[a-zA-Z]/.test(password) &&
           /[0-9]/.test(password);
};

// Export password matching validation
export const doPasswordsMatch = (password: string, confirmPassword: string) => {
    return password === confirmPassword && password !== '';
}; 