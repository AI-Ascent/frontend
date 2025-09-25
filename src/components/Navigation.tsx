'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentListIcon,
  AcademicCapIcon,
  UserGroupIcon,
  SparklesIcon,
  Bars3Icon,
  XMarkIcon,
  HeartIcon,
  CogIcon,
} from '@heroicons/react/24/outline';

export default function Navigation() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const baseNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Feedback', href: '/feedback', icon: ChatBubbleLeftRightIcon },
    { name: 'Onboarding', href: '/onboarding', icon: ClipboardDocumentListIcon },
    { name: 'Skills', href: '/skills', icon: AcademicCapIcon },
    { name: 'Interested', href: '/interested-skills', icon: HeartIcon },
    { name: 'Mentors', href: '/mentors', icon: UserGroupIcon },
    { name: 'Ask', href: '/assistant', icon: SparklesIcon },
  ];

  // Debug: Log user admin status
  console.log('Navigation - User:', user?.email, 'Is Admin:', user?.is_admin);

  const navigation = user?.is_admin === true
    ? [...baseNavigation, { name: 'Admin', href: '/admin', icon: CogIcon }]
    : baseNavigation;

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-soft border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 mr-8">
            <Link href={user?.is_admin ? "/admin" : "/dashboard"} className="flex items-center group">
              <div className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-lg overflow-hidden group-hover:scale-105 transition-all duration-300 shadow-sm group-hover:shadow-md bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                <Image
                  src="/images/logo.png"
                  alt="AI Ascent Logo"
                  width={40}
                  height={40}
                  className="object-contain w-full h-full"
                  priority
                  onError={(e) => {
                    // Fallback to text if image fails to load
                    e.currentTarget.style.display = 'none';
                    const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                    if (nextElement) {
                      nextElement.style.display = 'block';
                    }
                  }}
                />
                <span className="text-xs sm:text-sm font-bold text-indigo-600 hidden">AI</span>
              </div>
              <span className="ml-1.5 sm:ml-3 text-sm sm:text-xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors duration-300">
                AI Ascent
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1 flex-1 justify-start ml-4 mr-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                <item.icon className="h-4 w-4 mr-1.5" />
                <span className="hidden lg:inline">{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Tablet Navigation - Icons Only */}
          <div className="hidden md:flex lg:hidden items-center space-x-1 flex-1 justify-start ml-4 mr-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                title={item.name}
                className={`flex items-center justify-center w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                <item.icon className="h-5 w-5" />
              </Link>
            ))}
          </div>

          {/* Right Side - User Menu and Mobile Button */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            {/* User Menu - Hidden on mobile */}
            <div className="hidden md:flex items-center space-x-2 sm:space-x-3">
              <div className="hidden lg:block text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              
              <div className="relative">
                <div className="h-8 w-8 sm:h-9 sm:w-9 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-xs sm:text-sm font-medium text-indigo-600">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              <button
                onClick={logout}
                className="hidden md:block text-gray-600 hover:text-red-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition-all duration-200"
              >
                Sign Out
              </button>
            </div>

            {/* Mobile menu button - always at far right */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 sm:p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 flex-shrink-0"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <Bars3Icon className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 pt-4 pb-6 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? 'text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md'
                      : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile user section */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex items-center px-4 py-3">
                  <div className="h-10 w-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center shadow-sm mr-3">
                    <span className="text-sm font-medium text-indigo-600">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
