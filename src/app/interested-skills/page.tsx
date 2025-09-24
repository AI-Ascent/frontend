'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getInterestedSkills, deleteInterestedSkill } from '@/lib/api';
import { useToast } from '@/components/Toast';
import Navigation from '@/components/Navigation';
import {
  HeartIcon,
  TrashIcon,
  LinkIcon,
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
            <p className="text-gray-600">Skills you add from the Skills page will appear here.</p>
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
                      <AcademicCapIcon className="h-4 w-4 mr-1" />
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
