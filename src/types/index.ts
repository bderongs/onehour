export interface ConsultingRequest {
  companyName: string;
  industry: string;
  problemDescription: string;
  preferredDateTime: string;
  budget: string;
}

export interface Consultant {
  expertise: string[];
  yearsOfExperience: number;
  industries: string[];
  availability: string;
}

export type ExpertiseArea = 
  | "CRM Implementation"
  | "Team Management"
  | "Digital Transformation"
  | "Process Optimization"
  | "Marketing Strategy"
  | "Financial Planning";