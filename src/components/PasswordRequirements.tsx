import React from 'react';

interface PasswordValidations {
    isLongEnough: boolean;
    hasLower: boolean;
    hasUpper: boolean;
    hasNumber: boolean;
    passwordsMatch: boolean;
}

interface PasswordRequirementsProps {
    validations: PasswordValidations;
}

export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ validations }) => {
    return (
        <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
                Exigences du mot de passe:
            </h3>
            <ul className="space-y-1 text-sm">
                <li className={`flex items-center ${validations.isLongEnough ? 'text-green-600' : 'text-gray-500'}`}>
                    {validations.isLongEnough ? '✓' : '○'} Au moins 8 caractères
                </li>
                <li className={`flex items-center ${validations.hasLower ? 'text-green-600' : 'text-gray-500'}`}>
                    {validations.hasLower ? '✓' : '○'} Au moins une lettre minuscule
                </li>
                <li className={`flex items-center ${validations.hasUpper ? 'text-green-600' : 'text-gray-500'}`}>
                    {validations.hasUpper ? '✓' : '○'} Au moins une lettre majuscule
                </li>
                <li className={`flex items-center ${validations.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                    {validations.hasNumber ? '✓' : '○'} Au moins un chiffre
                </li>
                <li className={`flex items-center ${validations.passwordsMatch ? 'text-green-600' : 'text-gray-500'}`}>
                    {validations.passwordsMatch ? '✓' : '○'} Les mots de passe correspondent
                </li>
            </ul>
        </div>
    );
}; 