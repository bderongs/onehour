// Purpose: Component for editing consultant company information
// This component handles the company information section of the consultant profile edit page

import type { ConsultantProfile } from '@/types/consultant';

type CompanyInformationProps = {
    formData: Partial<ConsultantProfile>;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

export function CompanyInformation({
    formData,
    handleInputChange
}: CompanyInformationProps) {
    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Structure professionnelle (optionnel)</h2>
            <p className="text-sm text-gray-500 mb-4">
                Si vous exercez au sein d'une structure (entreprise, cabinet, etc.), vous pouvez renseigner ces informations qui apparaîtront sur votre profil.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                        Nom de la structure
                    </label>
                    <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        placeholder="Ex: Cabinet Dupont Conseil"
                        aria-describedby="company-description"
                    />
                    <p id="company-description" className="mt-1 text-xs text-gray-500">
                        Le nom de votre entreprise ou cabinet de conseil
                    </p>
                </div>
                <div>
                    <label htmlFor="company_title" className="block text-sm font-medium text-gray-700 mb-1">
                        Votre fonction
                    </label>
                    <input
                        type="text"
                        id="company_title"
                        name="company_title"
                        value={formData.company_title || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        placeholder="Ex: Directeur Associé"
                        aria-describedby="company-title-description"
                    />
                    <p id="company-title-description" className="mt-1 text-xs text-gray-500">
                        Votre poste ou titre au sein de cette structure
                    </p>
                </div>
            </div>
        </div>
    );
} 