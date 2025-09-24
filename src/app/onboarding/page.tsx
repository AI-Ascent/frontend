'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient, markChecklistItem, finalizeOnboard, checkOnboardFinalization, getFinalizedOnboard } from '@/lib/api';
import { useToast } from '@/components/Toast';
import Navigation from '@/components/Navigation';
import {
  BookOpenIcon,
  CheckCircleIcon,
  SparklesIcon,
  CheckIcon,
  ClipboardDocumentListIcon,
  FlagIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';

export default function OnboardingPage() {
  const { user } = useAuth();
  const { showErrorToast, showSuccessToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [onboardResult, setOnboardResult] = useState<{
    checklist: string[];
    resources: string[];
    explanation: string;
  } | null>(null);
  
  // Interactive checklist state
  const [checklistProgress, setChecklistProgress] = useState<{
    [key: string]: boolean[];
  }>({});

  // Finalization state
  const [isFinalized, setIsFinalized] = useState(false);

  // Initialize checklist progress when onboardResult changes
  const initializeChecklistProgress = (checklist: string[]) => {
    setChecklistProgress({
      'main': new Array(checklist.length).fill(false)
    });
  };


  // Calculate progress percentage
  const getProgressPercentage = () => {
    const progress = checklistProgress['main'];
    if (!progress) return 0;
    const completed = progress.filter(Boolean).length;
    return Math.round((completed / progress.length) * 100);
  };

  // Get form state
  const [getForm, setGetForm] = useState({
    additional_prompt: '',
  });

  // Check finalization status on component mount
  useEffect(() => {
    const checkStatus = async () => {
      if (!user?.email) return;
      
      try {
        const finalizationStatus = await checkOnboardFinalization();
        setIsFinalized(finalizationStatus.finalized);
        
        if (finalizationStatus.finalized) {
          const finalizedOnboard = await getFinalizedOnboard();
          setOnboardResult(finalizedOnboard.onboard_data);
          initializeChecklistProgress(finalizedOnboard.onboard_data.checklist);
          
          // Mark completed items as checked
          const completedIndices = finalizedOnboard.onboard_data.checklist
            .map((item, index) => finalizedOnboard.completed_items.includes(item) ? index : -1)
            .filter(index => index !== -1);
          
          setChecklistProgress({
            'main': finalizedOnboard.onboard_data.checklist.map((_, index) => 
              completedIndices.includes(index)
            )
          });
        }
      } catch (error) {
        console.error('Error checking finalization status:', error);
      }
    };

    checkStatus();
  }, [user?.email]);

  // Ensure checklist progress is initialized when onboardResult changes
  useEffect(() => {
    if (onboardResult && onboardResult.checklist && !checklistProgress['main']) {
      initializeChecklistProgress(onboardResult.checklist);
    }
  }, [onboardResult, checklistProgress]);

  // Handle checklist item completion
  const handleChecklistItemComplete = async (item: string, itemIndex: number) => {
    if (!user?.email) return;
    
    try {
      await markChecklistItem({ checklist_item: item });
      showSuccessToast(`"${item}" marked as completed!`);
      
      // Update local state
      setChecklistProgress(prev => ({
        ...prev,
        'main': prev['main'].map((checked, index) => 
          index === itemIndex ? true : checked
        )
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to mark item as completed.';
      showErrorToast(errorMessage);
    }
  };

  // Handle onboarding finalization
  const handleFinalizeOnboard = async () => {
    if (!user?.email) return;
    
    setIsLoading(true);
    try {
      await finalizeOnboard();
      setIsFinalized(true);
      showSuccessToast('Onboarding finalized successfully! 🎉');
      
      // Refresh finalized data
      const finalizedOnboard = await getFinalizedOnboard();
      setOnboardResult(finalizedOnboard.onboard_data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to finalize onboarding.';
      showErrorToast(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetOnboardInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) return;

    setIsLoading(true);
    try {
      const result = await apiClient.getOnboardInfo({
        email: user.email,
        additional_prompt: getForm.additional_prompt || undefined,
      });

      setOnboardResult(result);
      initializeChecklistProgress(result.checklist);
      
      // Reset finalization status when getting new onboarding plan
      setIsFinalized(false);
    } catch (error) {
      console.error('Error getting onboarding info:', error);
      
      // Handle AI agent configuration error with fallback response
      if (error instanceof Error && error.message.includes('AI agent configuration error')) {
        const fallbackResult = {
          checklist: [
            "Complete your employee orientation",
            "Set up your work email and accounts",
            "Review company policies and procedures",
            "Meet with your direct manager",
            "Attend team introduction meeting",
            "Set up your development environment",
            "Review project documentation",
            "Complete required training modules"
          ],
          resources: [
            "Company Employee Handbook",
            "Internal Wiki and Documentation",
            "Team Collaboration Tools Guide",
            "Development Environment Setup Guide",
            "Project Management System Tutorial"
          ],
          explanation: "This is a fallback onboarding plan while the AI agent is being configured. Please contact your manager for personalized onboarding guidance."
        };
        
        setOnboardResult(fallbackResult);
        initializeChecklistProgress(fallbackResult.checklist);
        setIsFinalized(false); // Reset finalization status for fallback too
        showErrorToast('Using fallback onboarding plan due to AI configuration. Contact your manager for personalized guidance.', () => {
          const mockEvent = { preventDefault: () => {} } as React.FormEvent;
          handleGetOnboardInfo(mockEvent);
        });
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Failed to get onboarding information. Please try again.';
        showErrorToast(errorMessage, () => {
          const mockEvent = { preventDefault: () => {} } as React.FormEvent;
          handleGetOnboardInfo(mockEvent);
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full mb-6 shadow-lg">
            {isFinalized ? (
              <TrophyIcon className="h-10 w-10 text-white" />
            ) : (
              <ClipboardDocumentListIcon className="h-10 w-10 text-white" />
            )}
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            {isFinalized ? 'Onboarding Complete!' : 'Personalized Onboarding'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {isFinalized 
              ? 'Congratulations! You have successfully completed your onboarding process. Your progress has been tracked and saved.'
              : 'Get AI-powered onboarding recommendations tailored to your role and specialization. Complete interactive checklists and access curated resources for a smooth start.'
            }
          </p>
          {isFinalized && (
            <div className="mt-6 inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              <FlagIcon className="h-4 w-4 mr-2" />
              Onboarding Finalized
            </div>
          )}
        </div>

        {/* Get Personalized Onboarding */}
        <div className="space-y-6">
            {!isFinalized && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Get Personalized Onboarding
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Get AI-powered onboarding recommendations based on your role and specialization.
                </p>
                <form onSubmit={handleGetOnboardInfo} className="space-y-4">
                <div>
                  <label htmlFor="additional_prompt" className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Context (Optional)
                  </label>
                  <textarea
                    id="additional_prompt"
                    rows={3}
                    value={getForm.additional_prompt}
                    onChange={(e) => setGetForm({ ...getForm, additional_prompt: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 text-base"
                    placeholder="e.g., focus on the analytics part, emphasize security training, include team collaboration tools"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="h-4 w-4 mr-2" />
                      Get Onboarding Plan
                    </>
                  )}
                </button>
              </form>
            </div>
            )}

            {/* Onboarding Results */}
            {onboardResult && (
              <div className="space-y-6">
                {/* Explanation */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center mb-4">
                    <SparklesIcon className="h-6 w-6 text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">AI Explanation</h3>
                  </div>
                  <p className="text-sm text-gray-700">{onboardResult.explanation}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Interactive Checklist */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                        <h4 className="text-md font-semibold text-gray-900">Onboarding Checklist</h4>
                      </div>
                      <div className="text-sm text-gray-600">
                        {getProgressPercentage()}% Complete
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-300 ease-in-out"
                          style={{ width: `${getProgressPercentage()}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {onboardResult.checklist.map((item: string, index: number) => {
                        const isChecked = checklistProgress['main'] && checklistProgress['main'][index] ? checklistProgress['main'][index] : false;
                        console.log('Checklist item:', index, 'isChecked:', isChecked, 'checklistProgress:', checklistProgress);
                        return (
                          <div 
                            key={index} 
                            className={`flex items-start p-3 rounded-lg border-2 transition-all duration-200 ${
                              isChecked 
                                ? 'bg-green-50 border-green-200' 
                                : 'bg-white border-gray-200 hover:border-green-300 hover:bg-green-25'
                            }`}
                          >
                            <div className="flex-shrink-0 mr-3">
                              <div className={`h-6 w-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                                isChecked 
                                  ? 'bg-green-600 text-white' 
                                  : 'bg-gray-200 text-gray-600'
                              }`}>
                                {isChecked ? (
                                  <CheckIcon className="h-4 w-4" />
                                ) : (
                                  <span className="text-xs font-medium">{index + 1}</span>
                                )}
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className={`text-sm transition-colors duration-200 ${
                                isChecked ? 'text-green-800 line-through' : 'text-gray-900'
                              }`}>
                                {item}
                              </p>
                            </div>
                            {!isChecked && (
                              <button
                                onClick={() => handleChecklistItemComplete(item, index)}
                                className="ml-3 px-3 py-1 text-xs font-medium text-green-600 bg-green-100 hover:bg-green-200 rounded-md transition-colors duration-200"
                              >
                                Mark Complete
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Finalize Button */}
                    {onboardResult && !isFinalized && (
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <button
                          onClick={handleFinalizeOnboard}
                          disabled={isLoading || getProgressPercentage() < 50}
                          className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          {isLoading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Finalizing...
                            </>
                          ) : (
                            <>
                              <TrophyIcon className="h-5 w-5 mr-2" />
                              Finalize Onboarding ({getProgressPercentage()}% Complete)
                            </>
                          )}
                        </button>
                        {getProgressPercentage() < 50 && (
                          <p className="mt-2 text-sm text-gray-500 text-center">
                            Complete at least 50% of tasks to finalize onboarding
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Resources */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center mb-4">
                      <BookOpenIcon className="h-5 w-5 text-purple-600 mr-2" />
                      <h4 className="text-md font-semibold text-gray-900">Resources</h4>
                    </div>
                    <div className="space-y-2">
                      {onboardResult.resources.map((resource: string, index: number) => (
                        <div key={index} className="p-2 bg-purple-50 border border-purple-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-purple-800">{resource}</p>
                            {resource.startsWith('http') && (
                              <a
                                href={resource}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-purple-600 hover:text-purple-800 underline"
                              >
                                Open
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
