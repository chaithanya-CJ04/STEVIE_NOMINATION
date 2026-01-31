// Shared TypeScript types for the Stevie Awards recommendation frontend.

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  country: string;
  organization_name: string;
  job_title?: string;
  phone_number?: string;
  company_website?: string;
  has_completed_onboarding: boolean;
  created_at?: string;
}

export interface CreateProfileRequest {
  full_name: string;
  country: string;
  organization_name: string;
  job_title?: string;
  phone_number?: string;
  company_website?: string;
}

export interface ConversationStartResponse {
  success: boolean;
  session_id: string;
  message: string;
  question: string;
  conversation_state: string;
}

export interface ConversationRespondResponse {
  success: boolean;
  session_id: string;
  message?: string;
  question?: string;
  conversation_state: string;
  progress?: {
    current: number;
    total: number;
  };
  recommendations?: Recommendation[];
  total_matches?: number;
}

export interface Recommendation {
  category_id: string;
  category_name: string;
  description: string;
  program_name: string;
  program_code: string;
  similarity_score: number;
  match_reasons: string[];
  is_free: boolean;
}
