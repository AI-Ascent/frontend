'use client';

import { useCallback } from 'react';
import { apiClient, LoginRequest, AddFeedbackRequest, ClassifyFeedbackRequest, SummariseFeedbackRequest, GetOnboardInfoRequest, CreateOnboardItemRequest, GetSkillRecommendationsRequest, FindMentorsRequest, CoordinatorAskRequest, LoginResponse, AddFeedbackResponse, ClassifyFeedbackResponse, SummariseFeedbackResponse, GetOnboardInfoResponse, CreateOnboardItemResponse, GetSkillRecommendationsResponse, FindMentorsResponse, CoordinatorAskResponse } from '@/lib/api';
import { useToast } from '@/components/Toast';

export const useApiWithToast = () => {
  const { showErrorToast, showSuccessToast } = useToast();

  const handleApiCall = useCallback(async <T>(
    apiCall: () => Promise<T>,
    successMessage?: string,
    retryAction?: () => void
  ): Promise<T | null> => {
    try {
      const result = await apiCall();
      if (successMessage) {
        showSuccessToast(successMessage);
      }
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      showErrorToast(errorMessage, retryAction);
      return null;
    }
  }, [showErrorToast, showSuccessToast]);

  // Wrapped API methods with toast notifications
  const login = useCallback(async (data: LoginRequest): Promise<LoginResponse | null> => {
    return handleApiCall(
      () => apiClient.login(data),
      'Login successful!',
      () => login(data)
    );
  }, [handleApiCall]);

  const addFeedback = useCallback(async (data: AddFeedbackRequest): Promise<AddFeedbackResponse | null> => {
    return handleApiCall(
      () => apiClient.addFeedback(data),
      'Feedback added successfully!',
      () => addFeedback(data)
    );
  }, [handleApiCall]);

  const classifyFeedback = useCallback(async (data: ClassifyFeedbackRequest): Promise<ClassifyFeedbackResponse | null> => {
    return handleApiCall(
      () => apiClient.classifyFeedback(data),
      undefined,
      () => classifyFeedback(data)
    );
  }, [handleApiCall]);

  const summariseFeedback = useCallback(async (data: SummariseFeedbackRequest): Promise<SummariseFeedbackResponse | null> => {
    return handleApiCall(
      () => apiClient.summariseFeedback(data),
      undefined,
      () => summariseFeedback(data)
    );
  }, [handleApiCall]);

  const getOnboardInfo = useCallback(async (data: GetOnboardInfoRequest): Promise<GetOnboardInfoResponse | null> => {
    return handleApiCall(
      () => apiClient.getOnboardInfo(data),
      undefined,
      () => getOnboardInfo(data)
    );
  }, [handleApiCall]);

  const createOnboardItem = useCallback(async (data: CreateOnboardItemRequest): Promise<CreateOnboardItemResponse | null> => {
    return handleApiCall(
      () => apiClient.createOnboardItem(data),
      'Onboarding item created successfully!',
      () => createOnboardItem(data)
    );
  }, [handleApiCall]);

  const getSkillRecommendations = useCallback(async (data: GetSkillRecommendationsRequest): Promise<GetSkillRecommendationsResponse | null> => {
    return handleApiCall(
      () => apiClient.getSkillRecommendations(data),
      undefined,
      () => getSkillRecommendations(data)
    );
  }, [handleApiCall]);

  const findMentors = useCallback(async (data: FindMentorsRequest): Promise<FindMentorsResponse | null> => {
    return handleApiCall(
      () => apiClient.findMentors(data),
      undefined,
      () => findMentors(data)
    );
  }, [handleApiCall]);

  const coordinatorAsk = useCallback(async (data: CoordinatorAskRequest): Promise<CoordinatorAskResponse | null> => {
    return handleApiCall(
      () => apiClient.coordinatorAsk(data),
      undefined,
      () => coordinatorAsk(data)
    );
  }, [handleApiCall]);

  return {
    login,
    addFeedback,
    classifyFeedback,
    summariseFeedback,
    getOnboardInfo,
    createOnboardItem,
    getSkillRecommendations,
    findMentors,
    coordinatorAsk,
  };
};
