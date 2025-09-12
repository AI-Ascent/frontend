'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import Navigation from '@/components/Navigation';
import {
  PlusIcon,
  AcademicCapIcon,
  StarIcon,
  LinkIcon,
} from '@heroicons/react/24/outline';

export default function SkillsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'create' | 'recommend'>('create');
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

  // Create form state
  const [createForm, setCreateForm] = useState({
    title: '',
    tags: '',
    type: '',
    url: '',
  });

  // Recommend form state
  const [recommendForm, setRecommendForm] = useState({
    skill_query: '',
    additional_prompt: '',
  });

  const handleCreateSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const tags = createForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag);

      const result = await apiClient.createSkill({
        title: createForm.title,
        tags,
        type: createForm.type,
        url: createForm.url,
      });

      alert(`Skill item created successfully! ID: ${result.id}`);
      
      // Reset form
      setCreateForm({
        title: '',
        tags: '',
        type: '',
        url: '',
      });
    } catch (error) {
      console.error('Error creating skill:', error);
      alert('Failed to create skill item. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetSkillRecommendations = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) return;

    setIsLoading(true);
    try {
      const result = await apiClient.getSkillRecommendations({
        email: user.email,
        skill_query: recommendForm.skill_query,
        additional_prompt: recommendForm.additional_prompt || undefined,
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
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('create')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'create'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Create Skill Item
            </button>
            <button
              onClick={() => setActiveTab('recommend')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'recommend'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Get Skill Recommendations
            </button>
          </nav>
        </div>

        {/* Create Skill Item Tab */}
        {activeTab === 'create' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Skill Item</h2>
            <form onSubmit={handleCreateSkill} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Skill Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={createForm.title}
                    onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Advanced Python Programming"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                    Skill Type *
                  </label>
                  <select
                    id="type"
                    value={createForm.type}
                    onChange={(e) => setCreateForm({ ...createForm, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select type...</option>
                    <option value="Course">Course</option>
                    <option value="Tutorial">Tutorial</option>
                    <option value="Article">Article</option>
                    <option value="Video">Video</option>
                    <option value="Book">Book</option>
                    <option value="Tool">Tool</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  id="tags"
                  value={createForm.tags}
                  onChange={(e) => setCreateForm({ ...createForm, tags: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., python, programming, advanced, algorithms"
                />
              </div>

              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                  Resource URL *
                </label>
                <input
                  type="url"
                  id="url"
                  value={createForm.url}
                  onChange={(e) => setCreateForm({ ...createForm, url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/skill-resource"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !createForm.title || !createForm.type || !createForm.url}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Create Skill Item
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Get Skill Recommendations Tab */}
        {activeTab === 'recommend' && (
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
                <div>
                  <label htmlFor="additional_prompt" className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Context (Optional)
                  </label>
                  <textarea
                    id="additional_prompt"
                    rows={3}
                    value={recommendForm.additional_prompt}
                    onChange={(e) => setRecommendForm({ ...recommendForm, additional_prompt: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., focus on practical projects, prefer video content, include certification paths"
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
                  {skillResult.recommendations.map((skill, index) => (
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
                          {skill.tags.map((tag, tagIndex) => (
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
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
