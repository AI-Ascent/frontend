'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import Navigation from '@/components/Navigation';
import {
  ChartBarIcon,
  ClipboardDocumentListIcon,
  AcademicCapIcon,
  ArrowRightIcon,
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
      title: 'Dashboard',
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Admin Panel
            </h1>
            <p className="text-gray-600">
              Manage the AI Ascent platform and user data
            </p>
          </div>
        </div>

        {/* Admin Functions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminFunctions.map((func) => (
            <div
              key={func.href}
              onClick={() => {
                console.log('Navigating to:', func.href);
                router.push(func.href);
              }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-lg ${func.color} text-white mr-4`}>
                  <func.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {func.title}
                  </h3>
                </div>
                <ArrowRightIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
              <p className="text-gray-600 text-sm">
                {func.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}