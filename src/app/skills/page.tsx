'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getSkillRecommendations } from '@/lib/api';
import { useToast } from '@/components/Toast';
import Navigation from '@/components/Navigation';
import {
  AcademicCapIcon,
  LinkIcon,
} from '@heroicons/react/24/outline';

export default function SkillsPage() {
  const { user } = useAuth();
  const { showErrorToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [skillResult, setSkillResult] = useState<{
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
  } | null>(null);

  // Recommend form state
  const [recommendForm, setRecommendForm] = useState({
    skill_query: '',
  });

  const handleGetSkillRecommendations = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) return;

    setIsLoading(true);
    try {
      const result = await getSkillRecommendations({
        email: user.email,
        skill_query: recommendForm.skill_query,
      });

      setSkillResult(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get skill recommendations. Please try again.';
      showErrorToast(errorMessage, () => {
        const mockEvent = { preventDefault: () => {} } as React.FormEvent;
        handleGetSkillRecommendations(mockEvent);
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full mb-6 shadow-lg">
            <AcademicCapIcon className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Skill Development
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover and develop new skills with AI-powered recommendations. Create learning paths 
            and access curated resources tailored to your professional growth. It uses your feedback to generate recommendations.
          </p>
        </div>


        {/* Get Skill Recommendations */}
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Get Skill Recommendations</h2>
              <p className="text-sm text-gray-600 mb-4">
                Get AI-powered skill recommendations based on your role and learning goals.
              </p>
              <form onSubmit={handleGetSkillRecommendations} className="space-y-4">
                <div>
                  <label htmlFor="skill_query" className="block text-sm font-medium text-gray-700 mb-2">
                    Skill Query *
                  </label>
                  <input
                    type="text"
                    id="skill_query"
                    value={recommendForm.skill_query}
                    onChange={(e) => setRecommendForm({ ...recommendForm, skill_query: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="e.g., learn advanced Python programming, improve backend development skills"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !recommendForm.skill_query}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <AcademicCapIcon className="h-4 w-4 mr-2" />
                      Get Recommendations
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Skill Recommendations Results */}
            {skillResult && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">AI Explanation</h3>
                  <p className="text-blue-800">{skillResult.explanation}</p>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900">Recommended Skills</h3>
                <div className="space-y-6">
                  {skillResult.skills?.map((skill, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">{skill.title}</h4>
                      <p className="text-gray-600 mb-4">{skill.description}</p>
                      
                      <div className="space-y-4">
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Learning Outcomes:</h5>
                          <ul className="space-y-1">
                            {skill.learning_outcomes.map((outcome, outcomeIndex) => (
                              <li key={outcomeIndex} className="flex items-start">
                                <span className="text-green-500 mr-2">•</span>
                                <span className="text-sm text-gray-600">{outcome}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Resources:</h5>
                          <div className="space-y-2">
                            {skill.resources.map((resource, resourceIndex) => (
                              <div key={resourceIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900">{resource.title}</p>
                                  <p className="text-xs text-gray-500 capitalize">{resource.type}</p>
                                </div>
                                <a
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 ml-3"
                                >
                                  <LinkIcon className="h-4 w-4 mr-1" />
                                  View
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )) || <p className="text-gray-500 text-sm">No skill recommendations available yet.</p>}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
