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
      color: 'bg-purple-500',
    },
    {
      title: 'Team Analytics',
      description: 'View performance metrics and team insights',
      icon: ChartBarIcon,
      color: 'bg-orange-500',
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
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h2>
          <p className="text-lg text-gray-600">
            AI-powered talent development platform designed for modern organizations.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UserGroupIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">1,247</p>
                <p className="text-sm text-green-600">+12% from last month</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <ClipboardDocumentListIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Onboarding Success</p>
                <p className="text-2xl font-bold text-gray-900">94%</p>
                <p className="text-sm text-green-600">+3% from last month</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <AcademicCapIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Skill Completions</p>
                <p className="text-2xl font-bold text-gray-900">3,456</p>
                <p className="text-sm text-green-600">+28% from last month</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">AI Interactions</p>
                <p className="text-2xl font-bold text-gray-900">12,789</p>
                <p className="text-sm text-green-600">+45% from last month</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                href={action.href || '#'}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center mb-4">
                  <div className={`p-3 ${action.color} rounded-lg`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {action.title}
                </h4>
                <p className="text-sm text-gray-600">
                  {action.description}
                </p>
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
