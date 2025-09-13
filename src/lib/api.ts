/**
 * AI Ascent Backend API Client
 * Handles all API communication with the backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

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

export interface FindMentorsRequest {
  email: string;
  top_k?: number;
}

export interface FindMentorsResponse {
  mentors: Array<{
    email?: string;
    job_title?: string;
    specialization?: string;
    strengths?: string[];
    can_help_with: string;
    llm_reason: string;
    no_good_mentor?: boolean;
  }>;
}

export interface CoordinatorAskRequest {
  email: string;
  query: string;
}

export interface CoordinatorAskResponse {
  message: string;
  action_items: string[];
  resources: string[];
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
        let errorData: ApiError;
        try {
          errorData = await response.json();
        } catch (parseError) {
          // If response is not JSON, create a generic error
          errorData = { error: `HTTP error! status: ${response.status}` };
        }
        
        // Handle rate limit errors more gracefully
        if (response.status === 429 || (errorData.error && errorData.error.includes('Rate limit'))) {
          throw new Error('AI service is currently busy. Please try again in a few minutes. This is due to high usage of our AI models.');
        }
        
        // Handle tool call validation errors from backend
        if (errorData.error && errorData.error.includes('Tool call validation failed')) {
          throw new Error('AI agent configuration error: The backend AI model is trying to use unavailable tools. This requires backend configuration fixes.');
        }
        
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

  // Mentor Finding
  async findMentors(data: FindMentorsRequest): Promise<FindMentorsResponse> {
    return this.request<FindMentorsResponse>('/find-mentors/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Coordinator Agent
  async coordinatorAsk(data: CoordinatorAskRequest): Promise<CoordinatorAskResponse> {
    return this.request<CoordinatorAskResponse>('/coordinator-ask/', {
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

// Export individual methods for convenience (properly bound)
export const login = apiClient.login.bind(apiClient);
export const addFeedback = apiClient.addFeedback.bind(apiClient);
export const classifyFeedback = apiClient.classifyFeedback.bind(apiClient);
export const summariseFeedback = apiClient.summariseFeedback.bind(apiClient);
export const getOnboardInfo = apiClient.getOnboardInfo.bind(apiClient);
export const createSkill = apiClient.createSkill.bind(apiClient);
export const getSkillRecommendations = apiClient.getSkillRecommendations.bind(apiClient);
export const findMentors = apiClient.findMentors.bind(apiClient);
export const coordinatorAsk = apiClient.coordinatorAsk.bind(apiClient);
export const healthCheck = apiClient.healthCheck.bind(apiClient);
