'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { findMentors } from '@/lib/api';
import { 
  UserGroupIcon, 
  MagnifyingGlassIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  StarIcon,
  SparklesIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

interface Mentor {
  email?: string;
  job_title?: string;
  specialization?: string;
  strengths?: string[];
  can_help_with: string;
  llm_reason: string;
  no_good_mentor?: boolean;
}

interface MentorsResult {
  mentors: Mentor[];
}

export default function MentorsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [mentorsResult, setMentorsResult] = useState<MentorsResult | null>(null);

  const handleFindMentors = async () => {
    if (!user?.email) {
      alert('Please log in first');
      return;
    }

    setIsLoading(true);
    try {
      const result = await findMentors({
        email: user.email,
        top_k: 3
      });
      setMentorsResult(result);
    } catch (error) {
      console.error('Error finding mentors:', error);
      alert('Failed to find mentors. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-600 to-red-600 rounded-full mb-6 shadow-lg">
            <UserGroupIcon className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
            Find Your Mentors
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover mentors within your organization whose strengths match your improvement areas. 
            Our AI finds the best matches based on your feedback analysis.
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="text-center">
            <button
              onClick={handleFindMentors}
              disabled={isLoading || !user?.email}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Finding Mentors...
                </>
              ) : (
                <>
                  <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                  Find My Mentors
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        {mentorsResult && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <SparklesIcon className="h-6 w-6 text-purple-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">Your Mentor Matches</h2>
              </div>
              
              <div className="space-y-4">
                {mentorsResult.mentors.map((mentor, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    {mentor.no_good_mentor ? (
                      <div className="flex items-start">
                        <ExclamationTriangleIcon className="h-6 w-6 text-orange-500 mr-3 mt-1" />
                        <div>
                          <h3 className="text-lg font-medium text-orange-800 mb-2">
                            No Strong Mentor Found
                          </h3>
                          <p className="text-orange-700 mb-2">
                            <strong>For:</strong> {mentor.can_help_with}
                          </p>
                          <p className="text-sm text-orange-600">
                            {mentor.llm_reason}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-4">
                          <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <UserGroupIcon className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {mentor.job_title || 'Mentor'}
                            </h3>
                            <div className="flex items-center">
                              <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
                              <span className="text-sm text-gray-600">Recommended</span>
                            </div>
                          </div>
                          
                          {mentor.specialization && (
                            <p className="text-sm text-gray-600 mb-2">
                              <strong>Specialization:</strong> {mentor.specialization}
                            </p>
                          )}
                          
                          <p className="text-blue-700 mb-3">
                            <strong>Can help with:</strong> {mentor.can_help_with}
                          </p>
                          
                          {mentor.strengths && mentor.strengths.length > 0 && (
                            <div className="mb-3">
                              <p className="text-sm font-medium text-gray-700 mb-1">Strengths:</p>
                              <div className="flex flex-wrap gap-1">
                                {mentor.strengths.map((strength, strengthIndex) => (
                                  <span key={strengthIndex} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                    {strength}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <p className="text-sm text-gray-600 mb-3">
                            <strong>Why this match:</strong> {mentor.llm_reason}
                          </p>
                          
                          {mentor.email && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500">
                                Contact: {mentor.email}
                              </span>
                              <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                Connect
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Info Box */}
        {!mentorsResult && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start">
              <CheckCircleIcon className="h-6 w-6 text-blue-600 mr-3 mt-1" />
              <div>
                <h3 className="text-lg font-medium text-blue-900 mb-2">
                  How Mentor Matching Works
                </h3>
                <ul className="text-blue-800 space-y-1">
                  <li>• AI analyzes your feedback to identify improvement areas</li>
                  <li>• Finds colleagues whose strengths match your needs</li>
                  <li>• Uses vector similarity matching for precise recommendations</li>
                  <li>• Provides detailed reasoning for each mentor match</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
