'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getSkillRecommendations } from '@/lib/api';
import Navigation from '@/components/Navigation';
import {
  AcademicCapIcon,
  StarIcon,
  LinkIcon,
} from '@heroicons/react/24/outline';

export default function SkillsPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [skillResult, setSkillResult] = useState<{
    recommendations: Array<{
      title: string;
      tags: string[];
      type: string;
      url: string;
      relevance_score: number;
    }>;
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
      console.error('Error getting skill recommendations:', error);
      alert('Failed to get skill recommendations. Please try again.');
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
            and access curated resources tailored to your professional growth.
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Recommended Skills</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {skillResult.recommendations?.map((skill, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="text-md font-semibold text-gray-900">{skill.title}</h4>
                        <div className="flex items-center">
                          <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm text-gray-600">
                            {(skill.relevance_score * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mb-2">
                          {skill.type}
                        </span>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {skill.tags?.map((tag, tagIndex) => (
                            <span key={tagIndex} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <a
                          href={skill.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                        >
                          <LinkIcon className="h-4 w-4 mr-1" />
                          View Resource
                        </a>
                      </div>
                    </div>
                  )) || <p className="text-gray-500 text-sm col-span-full">No skill recommendations available yet.</p>}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
