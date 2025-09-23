'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getInterestedSkills, addInterestedSkill, deleteInterestedSkill } from '@/lib/api';
import { useToast } from '@/components/Toast';
import Navigation from '@/components/Navigation';
import {
  HeartIcon,
  PlusIcon,
  TrashIcon,
  LinkIcon,
  CalendarIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';

interface InterestedSkill {
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
}

export default function InterestedSkillsPage() {
  const { user } = useAuth();
  const { showErrorToast, showSuccessToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [skills, setSkills] = useState<InterestedSkill[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    skill_title: '',
    skill_description: '',
    learning_outcomes: '',
    resources: [] as Array<{
      title: string;
      url: string;
      type: string;
    }>,
  });

  // Resource form state
  const [newResource, setNewResource] = useState({
    title: '',
    url: '',
    type: 'course',
  });

  // Load interested skills on component mount
  useEffect(() => {
    loadInterestedSkills();
  }, [user?.email]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadInterestedSkills = async () => {
    if (!user?.email) {
      console.log('No user email available');
      return;
    }
    
    setIsLoading(true);
    try {
      console.log('Loading interested skills for user:', user.email);
      const result = await getInterestedSkills();
      console.log('Interested skills response:', result);
      setSkills(result.skills);
    } catch (error) {
      console.error('Error loading interested skills:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load interested skills.';
      showErrorToast(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) {
      showErrorToast('User not authenticated');
      return;
    }

    setIsLoading(true);
    try {
      // Parse learning outcomes and resources
      const learningOutcomes = formData.learning_outcomes
        .split('\n')
        .map(item => item.trim())
        .filter(item => item);
      
      const resources = formData.resources;

      // Validate that we have at least one resource
      if (resources.length === 0) {
        showErrorToast('Please add at least one resource before submitting.');
        return;
      }

      const requestData = {
        skill_title: formData.skill_title,
        skill_description: formData.skill_description,
        learning_outcomes: learningOutcomes,
        resources: resources,
      };

      console.log('Sending request:', JSON.stringify(requestData, null, 2));
      console.log('Request data structure:', {
        skill_title: typeof requestData.skill_title,
        skill_description: typeof requestData.skill_description,
        learning_outcomes: Array.isArray(requestData.learning_outcomes),
        resources: Array.isArray(requestData.resources),
        resources_length: requestData.resources.length,
        first_resource: requestData.resources[0]
      });
      
      const response = await addInterestedSkill(requestData);
      console.log('Response:', response);

      showSuccessToast('Skill added to your interested list!');
      setFormData({
        skill_title: '',
        skill_description: '',
        learning_outcomes: '',
        resources: [],
      });
      setShowAddForm(false);
      loadInterestedSkills();
    } catch (error) {
      console.error('Error adding skill:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to add skill.';
      showErrorToast(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSkill = async (id: number) => {
    if (!user?.email) return;
    
    try {
      await deleteInterestedSkill({ id });
      showSuccessToast('Skill removed from your interested list.');
      loadInterestedSkills();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete skill.';
      showErrorToast(errorMessage);
    }
  };

  // Resource management functions
  const addResource = () => {
    if (!newResource.title.trim() || !newResource.url.trim()) {
      showErrorToast('Please fill in both title and URL for the resource.');
      return;
    }

    setFormData(prev => ({
      ...prev,
      resources: [...prev.resources, { ...newResource }]
    }));

    setNewResource({
      title: '',
      url: '',
      type: 'course',
    });
  };

  const removeResource = (index: number) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index)
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-600 to-rose-600 rounded-full mb-6 shadow-lg">
            <HeartIcon className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-4">
            Interested Skills
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Track skills you&apos;re interested in learning. Build your personal learning roadmap 
            and get personalized recommendations based on your interests.
          </p>
        </div>

        {/* Add Skill Button */}
        <div className="mb-8 text-center">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 shadow-md hover:shadow-lg transition-all duration-200"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Interested Skill
          </button>
        </div>

        {/* Add Skill Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Interested Skill</h2>
            <form onSubmit={handleAddSkill} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="skill_title" className="block text-sm font-medium text-gray-700 mb-2">
                    Skill Title *
                  </label>
                  <input
                    type="text"
                    id="skill_title"
                    value={formData.skill_title}
                    onChange={(e) => setFormData({...formData, skill_title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 text-gray-900"
                    placeholder="e.g., Machine Learning"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="skill_description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <input
                    type="text"
                    id="skill_description"
                    value={formData.skill_description}
                    onChange={(e) => setFormData({...formData, skill_description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 text-gray-900"
                    placeholder="Brief description of the skill"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="learning_outcomes" className="block text-sm font-medium text-gray-700 mb-2">
                  Learning Outcomes (one per line)
                </label>
                <textarea
                  id="learning_outcomes"
                  rows={3}
                  value={formData.learning_outcomes}
                  onChange={(e) => setFormData({...formData, learning_outcomes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 text-gray-900"
                  placeholder="Understand supervised learning&#10;Implement ML models&#10;Apply algorithms to real data"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resources
                </label>
                
                {/* Add Resource Form */}
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    <div>
                      <label htmlFor="resource_title" className="block text-xs font-medium text-gray-600 mb-1">
                        Title *
                      </label>
                      <input
                        type="text"
                        id="resource_title"
                        value={newResource.title}
                        onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                        placeholder="e.g., Machine Learning Course"
                      />
                    </div>
                    <div>
                      <label htmlFor="resource_url" className="block text-xs font-medium text-gray-600 mb-1">
                        URL *
                      </label>
                      <input
                        type="url"
                        id="resource_url"
                        value={newResource.url}
                        onChange={(e) => setNewResource({...newResource, url: e.target.value})}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                        placeholder="https://example.com/course"
                      />
                    </div>
                    <div>
                      <label htmlFor="resource_type" className="block text-xs font-medium text-gray-600 mb-1">
                        Type
                      </label>
                      <select
                        id="resource_type"
                        value={newResource.type}
                        onChange={(e) => setNewResource({...newResource, type: e.target.value})}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                      >
                        <option value="course">Course</option>
                        <option value="tutorial">Tutorial</option>
                        <option value="book">Book</option>
                        <option value="documentation">Documentation</option>
                        <option value="video">Video</option>
                        <option value="article">Article</option>
                        <option value="tool">Tool</option>
                      </select>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={addResource}
                    className="px-3 py-1 bg-pink-600 text-white text-sm rounded hover:bg-pink-700 transition-colors"
                  >
                    Add Resource
                  </button>
                </div>

                {/* Resources List */}
                {formData.resources.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Added Resources:</p>
                    {formData.resources.map((resource, index) => (
                      <div key={index} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{resource.title}</span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              {resource.type}
                            </span>
                          </div>
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            <LinkIcon className="h-3 w-3" />
                            {resource.url}
                          </a>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeResource(index)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Remove resource"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Adding...' : 'Add Skill'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Skills List */}
        {isLoading && skills.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your interested skills...</p>
          </div>
        ) : skills.length === 0 ? (
          <div className="text-center py-12">
            <HeartIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No interested skills yet</h3>
            <p className="text-gray-600 mb-6">Start building your learning roadmap by adding skills you want to develop.</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Your First Skill
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {skills.map((skill) => (
              <div key={skill.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{skill.skill_title}</h3>
                    <p className="text-gray-600 mb-3">{skill.skill_description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      Added on {formatDate(skill.set_at)}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteSkill(skill.id)}
                    className="ml-4 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors duration-200"
                    title="Remove skill"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Learning Outcomes */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <AcademicCapIcon className="h-4 w-4 mr-1" />
                      Learning Outcomes
                    </h4>
                    <ul className="space-y-1">
                      {skill.learning_outcomes.map((outcome, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-pink-500 mr-2">•</span>
                          <span className="text-sm text-gray-600">{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Resources */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <LinkIcon className="h-4 w-4 mr-1" />
                      Resources
                    </h4>
                    <div className="space-y-2">
                      {skill.resources.map((resource, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{resource.title}</p>
                            <p className="text-xs text-gray-500 capitalize">{resource.type}</p>
                          </div>
                          {resource.url && (
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-2 px-2 py-1 text-xs text-pink-600 hover:text-pink-800 bg-pink-100 hover:bg-pink-200 rounded transition-colors duration-200"
                            >
                              Open
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
