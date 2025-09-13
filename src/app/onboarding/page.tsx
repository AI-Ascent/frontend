'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import Navigation from '@/components/Navigation';
import {
  PlusIcon,
  BookOpenIcon,
  CheckCircleIcon,
  SparklesIcon,
  CheckIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';

export default function OnboardingPage() {
  const { user } = useAuth();
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

  // Initialize checklist progress when onboardResult changes
  const initializeChecklistProgress = (checklist: string[]) => {
    setChecklistProgress({
      'main': new Array(checklist.length).fill(false)
    });
  };

  // Toggle checklist item
  const toggleChecklistItem = (itemIndex: number) => {
    setChecklistProgress(prev => ({
      ...prev,
      'main': prev['main'].map((checked, index) => 
        index === itemIndex ? !checked : checked
      )
    }));
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
        alert('Using fallback onboarding plan due to AI configuration. Contact your manager for personalized guidance.');
      } else {
        alert('Failed to get onboarding information. Please try again.');
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
            <ClipboardDocumentListIcon className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            Personalized Onboarding
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Get AI-powered onboarding recommendations tailored to your role and specialization. 
            Complete interactive checklists and access curated resources for a smooth start.
          </p>
        </div>

        {/* Get Personalized Onboarding */}
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Get Personalized Onboarding</h2>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="e.g., focus on the analytics part, emphasize security training, include team collaboration tools"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        const isChecked = checklistProgress['main']?.[index] || false;
                        return (
                          <div 
                            key={index} 
                            className={`flex items-start p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                              isChecked 
                                ? 'bg-green-50 border-green-200' 
                                : 'bg-white border-gray-200 hover:border-green-300 hover:bg-green-25'
                            }`}
                            onClick={() => toggleChecklistItem(index)}
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
                          </div>
                        );
                      })}
                    </div>
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
