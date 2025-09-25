/**
 * AI Ascent Backend API Client
 * Handles all API communication with the backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ai-ascent-backend-azure.orangemushroom-0d454bb1.japanwest.azurecontainerapps.io/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  access_token: string;
  user: {
    id: number;
    email: string;
    job_title: string;
    specialization: string;
    is_admin: boolean;
  };
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
  skills: Array<{
    title: string;
    description: string;
    learning_outcomes: string[];
    resources: Array<{
      title: string;
      url: string;
      type: string;
    }>;
  }>;
  explanation: string;
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

// Onboarding Management
export interface UpdateOnboardItemRequest {
  id: number;
  title?: string;
  specialization?: string;
  tags?: string[];
  checklist?: string[];
  resources?: string[];
}

export interface UpdateOnboardItemResponse {
  message: string;
  id: number;
  data: {
    id: number;
    title: string;
    specialization: string;
    tags: string[];
    checklist: string[];
    resources: string[];
  };
}

export interface ListOnboardItemsRequest {
  index_start: number;
  index_end: number;
}

export type ListOnboardItemsResponse = Array<{
  id: number;
  title: string;
  specialization: string;
}>;

export interface DeleteOnboardItemRequest {
  id: number;
}

export interface DeleteOnboardItemResponse {
  message: string;
}

export interface GetOnboardItemRequest {
  id: number;
}

export interface GetOnboardItemResponse {
  id: number;
  title: string;
  specialization: string;
  tags: string[];
  checklist: string[];
  resources: string[];
}

export interface FinalizeOnboardResponse {
  message: string;
}

export interface MarkChecklistItemRequest {
  checklist_item: string;
}

export interface MarkChecklistItemResponse {
  message: string;
}

export interface CheckOnboardFinalizationResponse {
  finalized: boolean;
}

export interface GetFinalizedOnboardResponse {
  onboard_data: {
    checklist: string[];
    resources: string[];
    explanation: string;
  };
  completed_items: string[];
}

// Skill Management
export interface UpdateSkillItemRequest {
  id: number;
  title?: string;
  tags?: string[];
  type?: string;
  url?: string;
}

export interface UpdateSkillItemResponse {
  message: string;
  id: number;
  data: {
    id: number;
    title: string;
    tags: string[];
    type: string;
    url: string;
  };
}

export interface ListSkillItemsRequest {
  index_start: number;
  index_end: number;
}

export type ListSkillItemsResponse = Array<{
  id: number;
  title: string;
  type: string;
  url: string;
}>;

export interface DeleteSkillItemRequest {
  id: number;
}

export interface DeleteSkillItemResponse {
  message: string;
}

// Interested Skills
export interface AddInterestedSkillRequest {
  skill_title: string;
  skill_description: string;
  learning_outcomes: string[];
  resources: Array<{
    title: string;
    url: string;
    type: string;
  }>;
}

export interface AddInterestedSkillResponse {
  message: string;
  interested_skill_id: number;
}

export interface GetInterestedSkillsResponse {
  skills: Array<{
    id: number;
    skill_title: string;
    skill_description: string;
    learning_outcomes: string[];
    resources: Array<{
      title: string;
      url: string;
      type: string;
    }>;
    set_at: string;
  }>;
}

export interface DeleteInterestedSkillRequest {
  id: number;
}

export interface DeleteInterestedSkillResponse {
  message: string;
}

// Admin Features
export interface GlobalSkillTrendsRequest {
  timeframe_days?: number;
  top_n?: number;
}

export interface GlobalSkillTrendsResponse {
  computed_at: string;
  timeframe_days: number;
  clusters: Array<{
    representative_title: string;
    popularity_users: number;
    sample_titles: string[];
  }>;
}

export interface GlobalNegativeFeedbackTrendsRequest {
  timeframe_days?: number;
  top_n?: number;
}

export interface GlobalNegativeFeedbackTrendsResponse {
  computed_at: string;
  timeframe_days: number;
  clusters: Array<{
    representative_feedback: string;
    popularity_users: number;
    sample_feedbacks: string[];
  }>;
}

export interface KPIResponse {
  data: Array<{
    year: number;
    month: number;
    completed_onboard_tasks: number;
    assigned_onboard_tasks: number;
    prompt_injection_count: number;
    flagged_feedbacks_count: number;
    total_feedbacks_count: number;
    pii_redacted_count: number;
  }>;
}

export interface ApiError {
  error: string;
}

class ApiClient {
  private baseUrl: string;
  private accessToken: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    // Load token from localStorage on initialization
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('access_token');
    }
  }

  // Token management methods
  setToken(token: string | null) {
    this.accessToken = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('access_token', token);
      } else {
        localStorage.removeItem('access_token');
      }
    }
  }

  getToken(): string | null {
    return this.accessToken;
  }

  clearToken() {
    this.setToken(null);
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Add Authorization header if token exists
    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const config: RequestInit = {
      headers,
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorData: ApiError;
        try {
          errorData = await response.json();
        } catch {
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
    const response = await this.request<LoginResponse>('/login/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    // Store the access token
    if (response.access_token) {
      this.setToken(response.access_token);
    }
    
    return response;
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

  async createOnboardItem(data: CreateOnboardItemRequest): Promise<CreateOnboardItemResponse> {
    return this.request<CreateOnboardItemResponse>('/onboard/create/', {
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

  // Onboarding Management (Admin)
  async updateOnboardItem(data: UpdateOnboardItemRequest): Promise<UpdateOnboardItemResponse> {
    return this.request<UpdateOnboardItemResponse>('/onboard/update/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async listOnboardItems(data: ListOnboardItemsRequest): Promise<ListOnboardItemsResponse> {
    return this.request<ListOnboardItemsResponse>('/onboard/list/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteOnboardItem(data: DeleteOnboardItemRequest): Promise<DeleteOnboardItemResponse> {
    return this.request<DeleteOnboardItemResponse>('/onboard/delete/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getOnboardItem(data: GetOnboardItemRequest): Promise<GetOnboardItemResponse> {
    // Since there's no specific endpoint to get individual item details,
    // we'll use the update endpoint with just the ID to fetch the full data
    const response = await this.request<UpdateOnboardItemResponse>('/onboard/update/', {
      method: 'POST',
      body: JSON.stringify({ id: data.id }),
    });
    
    return response.data;
  }

  // Onboarding User Features
  async finalizeOnboard(): Promise<FinalizeOnboardResponse> {
    return this.request<FinalizeOnboardResponse>('/onboard/finalize/', {
      method: 'POST',
    });
  }

  async markChecklistItem(data: MarkChecklistItemRequest): Promise<MarkChecklistItemResponse> {
    return this.request<MarkChecklistItemResponse>('/onboard/mark-checklist-item/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async checkOnboardFinalization(): Promise<CheckOnboardFinalizationResponse> {
    return this.request<CheckOnboardFinalizationResponse>('/onboard/check/', {
      method: 'POST',
    });
  }

  async getFinalizedOnboard(): Promise<GetFinalizedOnboardResponse> {
    return this.request<GetFinalizedOnboardResponse>('/onboard/finalized/', {
      method: 'POST',
    });
  }

  // Skill Management (Admin)
  async updateSkillItem(data: UpdateSkillItemRequest): Promise<UpdateSkillItemResponse> {
    return this.request<UpdateSkillItemResponse>('/update-skill/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async listSkillItems(data: ListSkillItemsRequest): Promise<ListSkillItemsResponse> {
    return this.request<ListSkillItemsResponse>('/list-skill/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteSkillItem(data: DeleteSkillItemRequest): Promise<DeleteSkillItemResponse> {
    return this.request<DeleteSkillItemResponse>('/delete-skill/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Interested Skills
  async addInterestedSkill(data: AddInterestedSkillRequest): Promise<AddInterestedSkillResponse> {
    return this.request<AddInterestedSkillResponse>('/interested/add/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getInterestedSkills(): Promise<GetInterestedSkillsResponse> {
    return this.request<GetInterestedSkillsResponse>('/interested/list/', {
      method: 'POST',
    });
  }

  async deleteInterestedSkill(data: DeleteInterestedSkillRequest): Promise<DeleteInterestedSkillResponse> {
    return this.request<DeleteInterestedSkillResponse>('/interested/delete/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Admin Features
  async getGlobalSkillTrends(data?: GlobalSkillTrendsRequest): Promise<GlobalSkillTrendsResponse> {
    return this.request<GlobalSkillTrendsResponse>('/global-skill-trends/', {
      method: 'POST',
      body: JSON.stringify(data || {}),
    });
  }

  async getGlobalNegativeFeedbackTrends(data?: GlobalNegativeFeedbackTrendsRequest): Promise<GlobalNegativeFeedbackTrendsResponse> {
    return this.request<GlobalNegativeFeedbackTrendsResponse>('/global-negative-feedback-trends/', {
      method: 'POST',
      body: JSON.stringify(data || {}),
    });
  }

  async getKPIData(): Promise<KPIResponse> {
    return this.request<KPIResponse>('/kpi/', {
      method: 'POST',
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
export const createOnboardItem = apiClient.createOnboardItem.bind(apiClient);
export const updateOnboardItem = apiClient.updateOnboardItem.bind(apiClient);
export const listOnboardItems = apiClient.listOnboardItems.bind(apiClient);
export const deleteOnboardItem = apiClient.deleteOnboardItem.bind(apiClient);
export const getOnboardItem = apiClient.getOnboardItem.bind(apiClient);
export const finalizeOnboard = apiClient.finalizeOnboard.bind(apiClient);
export const markChecklistItem = apiClient.markChecklistItem.bind(apiClient);
export const checkOnboardFinalization = apiClient.checkOnboardFinalization.bind(apiClient);
export const getFinalizedOnboard = apiClient.getFinalizedOnboard.bind(apiClient);
export const createSkill = apiClient.createSkill.bind(apiClient);
export const updateSkillItem = apiClient.updateSkillItem.bind(apiClient);
export const listSkillItems = apiClient.listSkillItems.bind(apiClient);
export const deleteSkillItem = apiClient.deleteSkillItem.bind(apiClient);
export const getSkillRecommendations = apiClient.getSkillRecommendations.bind(apiClient);
export const addInterestedSkill = apiClient.addInterestedSkill.bind(apiClient);
export const getInterestedSkills = apiClient.getInterestedSkills.bind(apiClient);
export const deleteInterestedSkill = apiClient.deleteInterestedSkill.bind(apiClient);
export const findMentors = apiClient.findMentors.bind(apiClient);
export const coordinatorAsk = apiClient.coordinatorAsk.bind(apiClient);
export const getGlobalSkillTrends = apiClient.getGlobalSkillTrends.bind(apiClient);
export const getGlobalNegativeFeedbackTrends = apiClient.getGlobalNegativeFeedbackTrends.bind(apiClient);
export const getKPIData = apiClient.getKPIData.bind(apiClient);
export const healthCheck = apiClient.healthCheck.bind(apiClient);
