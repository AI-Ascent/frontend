'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import {
  UserGroupIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentListIcon,
  SparklesIcon,
  CogIcon,
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const quickActions = [
    {
      title: 'Feedback Analysis',
      description: 'Analyze 360° feedback and generate actionable insights',
      icon: ChatBubbleLeftRightIcon,
      href: '/feedback',
      color: 'bg-blue-500',
    },
    {
      title: 'Onboarding',
      description: 'Create personalized onboarding checklists for new hires',
      icon: ClipboardDocumentListIcon,
      href: '/onboarding',
      color: 'bg-green-500',
    },
    {
      title: 'Skill Development',
      description: 'Recommend learning paths and courses for skill enhancement',
      icon: AcademicCapIcon,
      href: '/skills',
      color: 'bg-purple-500',
    },
    {
      title: 'Find Mentors',
      description: 'Discover mentors whose strengths match your improvement areas',
      icon: UserGroupIcon,
      href: '/mentors',
      color: 'bg-indigo-500',
    },
    {
      title: 'Coordinator Ask',
      description: 'Master AI coordinator that leverages all specialized agents (feedback analysis, skill recommendations, mentor matching, onboarding) to provide comprehensive, personalized career guidance',
      icon: SparklesIcon,
      href: '/assistant',
      color: 'bg-pink-500',
    },
    {
      title: 'Admin Panel',
      description: 'Manage onboarding items and system configurations',
      icon: CogIcon,
      href: '/admin',
      color: 'bg-gray-500',
    },
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full mb-6 shadow-lg">
            <span className="text-2xl font-bold text-white">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Welcome back, {user?.name}!
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ready to accelerate your talent development journey? Let&apos;s explore your personalized growth opportunities.
          </p>
        </div>


        {/* Quick Actions */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                href={action.href || '#'}
                className="group bg-white p-8 rounded-2xl shadow-soft border border-gray-200 hover:shadow-medium transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center mb-6">
                  <div className={`p-4 ${action.color} rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110`}>
                    <action.icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors duration-200">
                  {action.title}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {action.description}
                </p>
                <div className="mt-4 flex items-center text-indigo-600 font-medium group-hover:translate-x-2 transition-transform duration-200">
                  <span>Get started</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
