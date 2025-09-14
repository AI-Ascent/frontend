'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient, createSkill } from '@/lib/api';
import { 
  CogIcon, 
  PlusIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  XMarkIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

interface OnboardFormData {
  title: string;
  specialization: string;
  tags: string;
  checklist: string;
  resources: string;
}

interface SkillFormData {
  title: string;
  tags: string;
  type: string;
  url: string;
}

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'onboard' | 'skill'>('onboard');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [onboardForm, setOnboardForm] = useState<OnboardFormData>({
    title: '',
    specialization: '',
    tags: '',
    checklist: '',
    resources: ''
  });

  const [skillForm, setSkillForm] = useState<SkillFormData>({
    title: '',
    tags: '',
    type: '',
    url: ''
  });

  const clearMessages = () => {
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleOnboardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) {
      setErrorMessage('Please log in first');
      return;
    }

    setIsLoading(true);
    clearMessages();

    try {
      // Parse comma-separated strings into arrays
      const tags = onboardForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      const checklist = onboardForm.checklist.split('\n').map(item => item.trim()).filter(item => item);
      const resources = onboardForm.resources.split('\n').map(resource => resource.trim()).filter(resource => resource);

      await apiClient.createOnboardItem({
        title: onboardForm.title,
        specialization: onboardForm.specialization,
        tags,
        checklist,
        resources
      });

      setSuccessMessage('Onboarding item created successfully!');
      setOnboardForm({
        title: '',
        specialization: '',
        tags: '',
        checklist: '',
        resources: ''
      });
    } catch (error) {
      console.error('Error creating onboarding item:', error);
      setErrorMessage('Failed to create onboarding item. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkillSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) {
      setErrorMessage('Please log in first');
      return;
    }

    setIsLoading(true);
    clearMessages();

    try {
      // Parse comma-separated tags into array
      const tags = skillForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag);

      await createSkill({
        title: skillForm.title,
        tags,
        type: skillForm.type,
        url: skillForm.url
      });

      setSuccessMessage('Skill item created successfully!');
      setSkillForm({
        title: '',
        tags: '',
        type: '',
        url: ''
      });
    } catch (error) {
      console.error('Error creating skill item:', error);
      setErrorMessage('Failed to create skill item. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-600 to-slate-600 rounded-full mb-6 shadow-lg">
            <CogIcon className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-600 to-slate-600 bg-clip-text text-transparent mb-4">
            Admin Panel
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Manage onboarding catalogs and skill databases for your organization with powerful AI-driven tools.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-gray-200/50 mb-8">
          <div className="border-b border-gray-200/50">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('onboard')}
                className={`w-1/2 py-6 px-8 text-center border-b-3 font-semibold text-base transition-all duration-200 ${
                  activeTab === 'onboard'
                    ? 'border-indigo-500 text-indigo-600 bg-indigo-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50/50'
                }`}
              >
                <DocumentTextIcon className="h-6 w-6 mx-auto mb-3" />
                Onboarding Catalogs
              </button>
              <button
                onClick={() => setActiveTab('skill')}
                className={`w-1/2 py-6 px-8 text-center border-b-3 font-semibold text-base transition-all duration-200 ${
                  activeTab === 'skill'
                    ? 'border-indigo-500 text-indigo-600 bg-indigo-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50/50'
                }`}
              >
                <AcademicCapIcon className="h-6 w-6 mx-auto mb-3" />
                Skill Catalogs
              </button>
            </nav>
          </div>
        </div>

        {/* Messages */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
              <p className="text-green-800">{successMessage}</p>
              <button
                onClick={() => setSuccessMessage('')}
                className="ml-auto text-green-600 hover:text-green-800"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <XMarkIcon className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-red-800">{errorMessage}</p>
              <button
                onClick={() => setErrorMessage('')}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Onboarding Form */}
        {activeTab === 'onboard' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Create Onboarding Catalog Item</h2>
            
            <form onSubmit={handleOnboardSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={onboardForm.title}
                    onChange={(e) => setOnboardForm({...onboardForm, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Software Engineer"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-2">
                    Specialization *
                  </label>
                  <input
                    type="text"
                    id="specialization"
                    value={onboardForm.specialization}
                    onChange={(e) => setOnboardForm({...onboardForm, specialization: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Backend, Frontend, DevOps"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  id="tags"
                  value={onboardForm.tags}
                  onChange={(e) => setOnboardForm({...onboardForm, tags: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., python, django, api, database"
                />
              </div>

              <div>
                <label htmlFor="checklist" className="block text-sm font-medium text-gray-700 mb-2">
                  Checklist Items (one per line)
                </label>
                <textarea
                  id="checklist"
                  value={onboardForm.checklist}
                  onChange={(e) => setOnboardForm({...onboardForm, checklist: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 h-32"
                  placeholder="Collect laptop from IT&#10;Complete coding assessment&#10;Review company policies&#10;Setup development environment"
                />
              </div>

              <div>
                <label htmlFor="resources" className="block text-sm font-medium text-gray-700 mb-2">
                  Resources (one per line)
                </label>
                <textarea
                  id="resources"
                  value={onboardForm.resources}
                  onChange={(e) => setOnboardForm({...onboardForm, resources: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 h-32"
                  placeholder="https://docs.djangoproject.com/&#10;https://www.python.org/&#10;Backend service map"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Create Onboarding Item
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Skill Form */}
        {activeTab === 'skill' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Create Skill Catalog Item</h2>
            
            <form onSubmit={handleSkillSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="skill-title" className="block text-sm font-medium text-gray-700 mb-2">
                    Skill Title *
                  </label>
                  <input
                    type="text"
                    id="skill-title"
                    value={skillForm.title}
                    onChange={(e) => setSkillForm({...skillForm, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Python Programming"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                    Resource Type *
                  </label>
                  <select
                    id="type"
                    value={skillForm.type}
                    onChange={(e) => setSkillForm({...skillForm, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select type</option>
                    <option value="tutorial">Tutorial</option>
                    <option value="course">Course</option>
                    <option value="documentation">Documentation</option>
                    <option value="book">Book</option>
                    <option value="video">Video</option>
                    <option value="article">Article</option>
                    <option value="workshop">Workshop</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="skill-tags" className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  id="skill-tags"
                  value={skillForm.tags}
                  onChange={(e) => setSkillForm({...skillForm, tags: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., python, programming, beginner, data-science"
                />
              </div>

              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                  Resource URL *
                </label>
                <input
                  type="url"
                  id="url"
                  value={skillForm.url}
                  onChange={(e) => setSkillForm({...skillForm, url: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/python-tutorial"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Create Skill Item
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
