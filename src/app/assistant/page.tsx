'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { coordinatorAsk } from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import { 
  ChatBubbleLeftRightIcon, 
  PaperAirplaneIcon,
  LightBulbIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  SparklesIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

interface CoordinatorResult {
  message: string;
  action_items: string[];
  resources: string[];
}

export default function AssistantPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [coordinatorResult, setCoordinatorResult] = useState<CoordinatorResult | null>(null);

  const handleAskCoordinator = async () => {
    if (!user?.email) {
      alert('Please log in first');
      return;
    }

    if (!query.trim()) {
      alert('Please enter a question');
      return;
    }

    setIsLoading(true);
    try {
      const result = await coordinatorAsk({
        email: user.email,
        query: query.trim()
      });
      setCoordinatorResult(result);
    } catch (error) {
      console.error('Error asking coordinator:', error);
      
      // Show more specific error messages
      let errorMessage = 'Failed to process your question. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('AI service is currently busy')) {
          errorMessage = 'AI service is currently busy due to high usage. Please try again in a few minutes.';
        } else if (error.message.includes('Rate limit')) {
          errorMessage = 'We\'ve reached our daily AI usage limit. Please try again tomorrow or contact support.';
        } else {
          errorMessage = `Error: ${error.message}`;
        }
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAskCoordinator();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full mb-6 shadow-lg">
            <ChatBubbleLeftRightIcon className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Coordinator Ask
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Ask me anything about your career development, skills, onboarding, or feedback. 
            I'll provide personalized advice with actionable steps and resources.
          </p>
        </div>

        {/* Query Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-gray-200/50 p-8 mb-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="query" className="block text-lg font-semibold text-gray-900 mb-3">
                What would you like to know?
              </label>
              <textarea
                id="query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., What skills should I develop for my role? How can I improve my communication? What should I focus on in my onboarding?"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 h-32 resize-none text-gray-700 placeholder-gray-400 transition-all duration-200"
                disabled={isLoading}
              />
            </div>

            <button
              onClick={handleAskCoordinator}
              disabled={isLoading || !user?.email || !query.trim()}
              className="w-full flex items-center justify-center px-6 py-4 border border-transparent text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                  Ask Coordinator
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        {coordinatorResult && (
          <div className="space-y-6">
            {/* Response */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <SparklesIcon className="h-6 w-6 text-purple-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">Coordinator Response</h2>
              </div>
              <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => <h1 className="text-2xl font-bold text-gray-900 mb-4">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-xl font-semibold text-gray-900 mb-3">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-lg font-semibold text-gray-900 mb-2">{children}</h3>,
                    p: ({ children }) => <p className="mb-3 leading-relaxed text-gray-700">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
                    li: ({ children }) => <li className="text-gray-700">{children}</li>,
                    strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                    em: ({ children }) => <em className="italic">{children}</em>,
                    code: ({ children }) => <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">{children}</code>,
                    blockquote: ({ children }) => <blockquote className="border-l-4 border-purple-200 pl-4 italic text-gray-600 mb-3">{children}</blockquote>,
                    a: ({ href, children }) => <a href={href} className="text-purple-600 hover:text-purple-800 underline" target="_blank" rel="noopener noreferrer">{children}</a>,
                  }}
                >
                  {coordinatorResult.message}
                </ReactMarkdown>
              </div>
            </div>

            {/* Action Items */}
            {coordinatorResult.action_items && coordinatorResult.action_items.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <CheckCircleIcon className="h-6 w-6 text-green-600 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Action Items</h2>
                </div>
                <div className="space-y-3">
                  {coordinatorResult.action_items.map((item, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 mr-3 mt-1">
                        <div className="h-6 w-6 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 text-sm font-medium">{index + 1}</span>
                        </div>
                      </div>
                      <p className="text-gray-700">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resources */}
            {coordinatorResult.resources && coordinatorResult.resources.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <DocumentTextIcon className="h-6 w-6 text-blue-600 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Recommended Resources</h2>
                </div>
                <div className="space-y-3">
                  {coordinatorResult.resources.map((resource, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 mr-3 mt-1">
                        <LightBulbIcon className="h-5 w-5 text-blue-500" />
                      </div>
                      <p className="text-gray-700">{resource}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Example Questions */}
        {!coordinatorResult && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start">
              <LightBulbIcon className="h-6 w-6 text-blue-600 mr-3 mt-1" />
              <div>
                <h3 className="text-lg font-medium text-blue-900 mb-3">
                  Example Questions You Can Ask
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <p className="text-blue-800 font-medium">Career Development:</p>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• "What skills should I develop for my role?"</li>
                      <li>• "How can I advance in my current position?"</li>
                      <li>• "What certifications would benefit me?"</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <p className="text-blue-800 font-medium">Feedback & Growth:</p>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• "How can I improve my communication skills?"</li>
                      <li>• "What should I focus on based on my feedback?"</li>
                      <li>• "How can I become a better leader?"</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <p className="text-blue-800 font-medium">Onboarding & Learning:</p>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• "What should I prioritize in my onboarding?"</li>
                      <li>• "Which team members should I connect with?"</li>
                      <li>• "What resources are most important for me?"</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <p className="text-blue-800 font-medium">General Advice:</p>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• "How can I improve my work-life balance?"</li>
                      <li>• "What networking opportunities should I pursue?"</li>
                      <li>• "How can I contribute more to my team?"</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
