'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import {
  ChartBarIcon,
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
      description: 'Get personalized career advice and guidance',
      icon: SparklesIcon,
      href: '/assistant',
      color: 'bg-pink-500',
    },
    {
      title: 'Admin Panel',
      description: 'Manage onboarding catalogs and skill databases',
      icon: CogIcon,
      href: '/admin',
      color: 'bg-gray-500',
    },
  ];

  const recentActivity = [
    {
      time: '2 hours ago',
      activity: 'New hire Alex completed onboarding checklist',
      type: 'Onboarding',
      status: 'Completed',
    },
    {
      time: '4 hours ago',
      activity: 'Sarah finished Python fundamentals course',
      type: 'Learning',
      status: 'Completed',
    },
    {
      time: '6 hours ago',
      activity: 'Team completed Q4 feedback reviews',
      type: 'Feedback',
      status: 'Completed',
    },
    {
      time: '1 day ago',
      activity: 'Mentor matching completed for 15 employees',
      type: 'Matching',
      status: 'Completed',
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
            Ready to accelerate your talent development journey? Let's explore your personalized growth opportunities.
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

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentActivity.map((activity, index) => (
              <div key={index} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.activity}
                    </p>
                    <p className="text-sm text-gray-500">
                      {activity.time} • {activity.type}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {activity.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
