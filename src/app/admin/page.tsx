'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import Navigation from '@/components/Navigation';
import {
  ChartBarIcon,
  ClipboardDocumentListIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';

export default function AdminPage() {
  const router = useRouter();
  const { isAdminAuthenticated } = useAdminAuth();

  // Check admin authentication
  useEffect(() => {
    if (!isAdminAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAdminAuthenticated, router]);

  if (!isAdminAuthenticated) {
    return null;
  }

  const adminFunctions = [
    {
      title: 'Admin Dashboard',
      description: 'View KPI data, skill trends, and feedback analytics',
      icon: ChartBarIcon,
      href: '/admin-dashboard',
      color: 'bg-blue-500',
    },
    {
      title: 'Onboarding Management',
      description: 'Create and manage onboarding catalogs for job roles',
      icon: ClipboardDocumentListIcon,
      href: '/admin-onboarding',
      color: 'bg-green-500',
    },
    {
      title: 'Skill Management',
      description: 'Create and manage skill catalog items with resources',
      icon: AcademicCapIcon,
      href: '/admin-skills',
      color: 'bg-purple-500',
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
              A
            </span>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Welcome back, Admin!
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage the AI Ascent platform and user data with powerful administrative tools.
          </p>
        </div>

        {/* Admin Functions */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Admin Functions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {adminFunctions.map((func) => (
              <div
                key={func.href}
                onClick={() => {
                  console.log('Navigating to:', func.href);
                  router.push(func.href);
                }}
                className="group bg-white p-8 rounded-2xl shadow-soft border border-gray-200 hover:shadow-medium transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
              >
                <div className="flex items-center mb-6">
                  <div className={`p-4 ${func.color} rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110`}>
                    <func.icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors duration-200">
                  {func.title}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {func.description}
                </p>
                <div className="mt-4 flex items-center text-indigo-600 font-medium group-hover:translate-x-2 transition-transform duration-200">
                  <span>Get started</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}