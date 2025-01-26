import React from 'react';
import { PasswordRequirements } from './PasswordRequirements';

interface PasswordSetupFormProps {
    password: string;
    confirmPassword: string;
    validations: {
        isLongEnough: boolean;
        hasLower: boolean;
        hasUpper: boolean;
        hasNumber: boolean;
        passwordsMatch: boolean;
    };
    loading: boolean;
    isPasswordValid: boolean;
    onPasswordChange: (value: string) => void;
    onConfirmPasswordChange: (value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export const PasswordSetupForm: React.FC<PasswordSetupFormProps> = ({
    password,
    confirmPassword,
    validations,
    loading,
    isPasswordValid,
    onPasswordChange,
    onConfirmPasswordChange,
    onSubmit
}) => {
    return (
        <div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
                Définissez votre mot de passe
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
                Veuillez définir un mot de passe sécurisé pour votre compte
            </p>

            <form className="mt-8 space-y-6" onSubmit={onSubmit}>
                <div className="rounded-md shadow-sm -space-y-px">
                    <div>
                        <label htmlFor="password" className="sr-only">Mot de passe</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                            placeholder="Mot de passe"
                            value={password}
                            onChange={(e) => onPasswordChange(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="confirm-password" className="sr-only">Confirmer le mot de passe</label>
                        <input
                            id="confirm-password"
                            name="confirm-password"
                            type="password"
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                            placeholder="Confirmer le mot de passe"
                            value={confirmPassword}
                            onChange={(e) => onConfirmPasswordChange(e.target.value)}
                        />
                    </div>
                </div>

                <PasswordRequirements validations={validations} />

                <div>
                    <button
                        type="submit"
                        disabled={loading || !isPasswordValid}
                        className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${isPasswordValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    >
                        {loading ? 'Configuration en cours...' : 'Définir le mot de passe'}
                    </button>
                </div>
            </form>
        </div>
    );
}; 