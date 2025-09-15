'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { useToast } from '@/components/Toast';
import Navigation from '@/components/Navigation';
import {
  PlusIcon,
  ChartBarIcon,
  LightBulbIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';

export default function FeedbackPage() {
  const { user } = useAuth();
  const { showErrorToast, showSuccessToast } = useToast();
  const [newFeedback, setNewFeedback] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [isAddingFeedback, setIsAddingFeedback] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    type: 'classify' | 'summarise';
    data: {
      classified_feedback?: {
        strengths: string[];
        improvements: string[];
      };
      summary?: {
        strengths_insights: string[];
        improvements_insights: string[];
        growth_tips: string[];
      };
    };
  } | null>(null);
  const [activeTab, setActiveTab] = useState<'add' | 'classify' | 'summarise'>('summarise');

  const handleAddFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeedback.trim() || !feedbackEmail.trim()) return;

    setIsAddingFeedback(true);
    try {
      await apiClient.addFeedback({
        email: feedbackEmail,
        feedback: newFeedback.trim(),
      });
      setNewFeedback('');
      setFeedbackEmail('');
      showSuccessToast('Feedback added successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add feedback. Please try again.';
      showErrorToast(errorMessage, () => {
        const mockEvent = { preventDefault: () => {} } as React.FormEvent;
        handleAddFeedback(mockEvent);
      });
    } finally {
      setIsAddingFeedback(false);
    }
  };

  const handleClassifyFeedback = async () => {
    if (!user?.email) return;

    setIsAnalyzing(true);
    try {
      const result = await apiClient.classifyFeedback({ email: user.email });
      setAnalysisResult({ type: 'classify', data: result });
      setActiveTab('classify');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to classify feedback. Please try again.';
      showErrorToast(errorMessage, () => handleClassifyFeedback());
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSummariseFeedback = async () => {
    if (!user?.email) return;

    setIsAnalyzing(true);
    try {
      const result = await apiClient.summariseFeedback({ email: user.email });
      setAnalysisResult({ type: 'summarise', data: result });
      setActiveTab('summarise');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to summarise feedback. Please try again.';
      showErrorToast(errorMessage, () => handleSummariseFeedback());
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full mb-6 shadow-lg">
            <ChatBubbleLeftRightIcon className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Feedback Analysis
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Collect, analyze, and gain insights from your feedback. Get AI-powered classification 
            and actionable recommendations for your professional growth.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8 justify-center">
            <button
              onClick={() => setActiveTab('add')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'add'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Add Feedback
            </button>
            <button
              onClick={() => setActiveTab('classify')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'classify'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Classify Feedback
            </button>
            <button
              onClick={() => setActiveTab('summarise')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'summarise'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Summarise Feedback
            </button>
          </nav>
        </div>

        {/* Add Feedback Tab */}
        {activeTab === 'add' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Feedback</h2>
            <form onSubmit={handleAddFeedback} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Employee Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={feedbackEmail}
                  onChange={(e) => setFeedbackEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder="Enter employee email address"
                  required
                />
              </div>
              <div>
                <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
                  Feedback Text
                </label>
                <textarea
                  id="feedback"
                  rows={4}
                  value={newFeedback}
                  onChange={(e) => setNewFeedback(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder="Enter your feedback here..."
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isAddingFeedback || !newFeedback.trim()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingFeedback ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Feedback
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Classify Feedback Tab */}
        {activeTab === 'classify' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Classify Feedback</h2>
              <p className="text-sm text-gray-600 mb-4">
                Use AI to classify your feedback into strengths and improvement areas.
              </p>
              <button
                onClick={handleClassifyFeedback}
                disabled={isAnalyzing}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <ChartBarIcon className="h-4 w-4 mr-2" />
                    Classify Feedback
                  </>
                )}
              </button>
            </div>

            {/* Classification Results */}
            {analysisResult?.type === 'classify' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center mb-4">
                      <CheckCircleIcon className="h-6 w-6 text-green-600 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-900">Strengths</h3>
                    </div>
                    <div className="space-y-2">
                      {analysisResult.data.classified_feedback?.strengths.map((strength: string, index: number) => (
                        <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm text-green-800">{strength}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center mb-4">
                    <ExclamationTriangleIcon className="h-6 w-6 text-orange-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Improvement Areas</h3>
                  </div>
                  <div className="space-y-2">
                    {analysisResult.data.classified_feedback?.improvements.map((improvement: string, index: number) => (
                      <div key={index} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <p className="text-sm text-orange-800">{improvement}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              </div>
            )}
          </div>
        )}

        {/* Summarise Feedback Tab */}
        {activeTab === 'summarise' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Summarise Feedback</h2>
              <p className="text-sm text-gray-600 mb-4">
                Get comprehensive insights and actionable recommendations from your feedback.
              </p>
              <button
                onClick={handleSummariseFeedback}
                disabled={isAnalyzing}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <LightBulbIcon className="h-4 w-4 mr-2" />
                    Generate Summary
                  </>
                )}
              </button>
            </div>

            {/* Summary Results */}
            {analysisResult?.type === 'summarise' && (
              <div className="space-y-6">
                {/* Strengths */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center mb-4">
                    <CheckCircleIcon className="h-6 w-6 text-green-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Strengths</h3>
                  </div>
                  <div className="space-y-3">
                    {analysisResult.data.summary?.strengths_insights?.map((strength: string, index: number) => (
                      <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800">{strength}</p>
                      </div>
                    )) || <p className="text-gray-500 text-sm">No strengths identified yet.</p>}
                  </div>
                </div>

                {/* Improvement Areas */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center mb-4">
                    <ExclamationTriangleIcon className="h-6 w-6 text-orange-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Improvement Areas</h3>
                  </div>
                  <div className="space-y-3">
                    {analysisResult.data.summary?.improvements_insights?.map((improvement: string, index: number) => (
                      <div key={index} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <p className="text-sm text-orange-800">{improvement}</p>
                      </div>
                    )) || <p className="text-gray-500 text-sm">No improvement areas identified yet.</p>}
                  </div>
                </div>


                {/* Growth Tips */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center mb-4">
                    <LightBulbIcon className="h-6 w-6 text-purple-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Growth Tips</h3>
                  </div>
                  <div className="space-y-3">
                    {analysisResult.data.summary?.growth_tips?.map((tip: string, index: number) => (
                      <div key={index} className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                        <p className="text-sm text-purple-800">{tip}</p>
                      </div>
                    )) || <p className="text-gray-500 text-sm">No growth tips available yet.</p>}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
