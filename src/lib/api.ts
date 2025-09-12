/**
 * AI Ascent Backend API Client
 * Handles all API communication with the backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
}

export interface AddFeedbackRequest {
  email: string;
  feedback: string;
}

export interface AddFeedbackResponse {
  message: string;
}

export interface ClassifyFeedbackRequest {
  email: string;
}

export interface ClassifyFeedbackResponse {
  classified_feedback: {
    strengths: string[];
    improvements: string[];
  };
}

export interface SummariseFeedbackRequest {
  email: string;
}

export interface SummariseFeedbackResponse {
  summary: {
    strengths: string[];
    improvements: string[];
    strengths_insights: string[];
    improvements_insights: string[];
    growth_tips: string[];
  };
}

export interface CreateOnboardItemRequest {
  title: string;
  specialization: string;
  tags: string[];
  checklist: string[];
  resources: string[];
}

export interface CreateOnboardItemResponse {
  message: string;
  id: number;
}

export interface GetOnboardInfoRequest {
  email: string;
  additional_prompt?: string;
}

export interface GetOnboardInfoResponse {
  checklist: string[];
  resources: string[];
  explanation: string;
}

export interface CreateSkillRequest {
  title: string;
  tags: string[];
  type: string;
  url: string;
}

export interface CreateSkillResponse {
  message: string;
  id: number;
}

export interface GetSkillRecommendationsRequest {
  email: string;
  skill_query: string;
  additional_prompt?: string;
}

export interface GetSkillRecommendationsResponse {
  recommendations: Array<{
    title: string;
    tags: string[];
    type: string;
    url: string;
    relevance_score: number;
  }>;
}

export interface ApiError {
  error: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  // User Authentication
  async login(data: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>('/login/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Feedback Management
  async addFeedback(data: AddFeedbackRequest): Promise<AddFeedbackResponse> {
    return this.request<AddFeedbackResponse>('/add-feedback/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async classifyFeedback(data: ClassifyFeedbackRequest): Promise<ClassifyFeedbackResponse> {
    return this.request<ClassifyFeedbackResponse>('/classify-feedback/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async summariseFeedback(data: SummariseFeedbackRequest): Promise<SummariseFeedbackResponse> {
    return this.request<SummariseFeedbackResponse>('/summarise-feedback/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Onboarding Management
  async createOnboardItem(data: CreateOnboardItemRequest): Promise<CreateOnboardItemResponse> {
    return this.request<CreateOnboardItemResponse>('/onboard/create/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getOnboardInfo(data: GetOnboardInfoRequest): Promise<GetOnboardInfoResponse> {
    return this.request<GetOnboardInfoResponse>('/onboard/get/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Skill Management
  async createSkill(data: CreateSkillRequest): Promise<CreateSkillResponse> {
    return this.request<CreateSkillResponse>('/create-skill/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getSkillRecommendations(data: GetSkillRecommendationsRequest): Promise<GetSkillRecommendationsResponse> {
    return this.request<GetSkillRecommendationsResponse>('/get-skill-recommendations/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    return this.request<{ status: string }>('/health/', {
      method: 'GET',
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export individual methods for convenience
export const {
  login,
  addFeedback,
  classifyFeedback,
  summariseFeedback,
  createOnboardItem,
  getOnboardInfo,
  createSkill,
  getSkillRecommendations,
  healthCheck,
} = apiClient;
