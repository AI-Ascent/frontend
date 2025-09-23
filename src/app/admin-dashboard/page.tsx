'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { getKPIData, getGlobalSkillTrends, getGlobalNegativeFeedbackTrends } from '@/lib/api';
import Navigation from '@/components/Navigation';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UsersIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

interface KPIData {
  year: number;
  month: number;
  completed_onboard_tasks: number;
  assigned_onboard_tasks: number;
  prompt_injection_count: number;
  flagged_feedbacks_count: number;
  total_feedbacks_count: number;
  pii_redacted_count: number;
}

interface SkillTrend {
  representative_title: string;
  popularity_users: number;
  sample_titles: string[];
}

interface FeedbackTrend {
  representative_feedback: string;
  popularity_users: number;
  sample_feedbacks: string[];
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { isAdminAuthenticated } = useAdminAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [kpiData, setKpiData] = useState<KPIData[]>([]);
  const [skillTrends, setSkillTrends] = useState<SkillTrend[]>([]);
  const [feedbackTrends, setFeedbackTrends] = useState<FeedbackTrend[]>([]);
  const [activeTab, setActiveTab] = useState<'kpi' | 'skills' | 'feedback'>('kpi');

  // Check admin authentication
  useEffect(() => {
    if (!isAdminAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAdminAuthenticated, router]);

  // Load all data on component mount
  useEffect(() => {
    if (isAdminAuthenticated) {
      loadAllData();
    }
  }, [isAdminAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [kpi, skills, feedback] = await Promise.all([
        getKPIData(),
        getGlobalSkillTrends({ timeframe_days: 7, top_n: 10 }),
        getGlobalNegativeFeedbackTrends({ timeframe_days: 7, top_n: 10 })
      ]);
      
      setKpiData(kpi.data);
      setSkillTrends(skills.clusters);
      setFeedbackTrends(feedback.clusters);
    } catch (error) {
      console.error('Admin dashboard error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatMonth = (year: number, month: number) => {
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const calculateCompletionRate = (completed: number, assigned: number) => {
    if (assigned === 0) return 0;
    return Math.round((completed / assigned) * 100);
  };

  const calculateFlagRate = (flagged: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((flagged / total) * 100);
  };

  // Don't render if not authenticated
  if (!isAdminAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-slate-600 to-gray-600 rounded-full mb-6 shadow-lg">
            <ChartBarIcon className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-600 to-gray-600 bg-clip-text text-transparent mb-4">
            Admin Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Monitor organizational performance, skill trends, and feedback analytics 
            with comprehensive KPI tracking and insights.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-gray-200/50 mb-8">
          <div className="border-b border-gray-200/50">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('kpi')}
                className={`w-1/3 py-4 sm:py-6 px-4 sm:px-8 text-center border-b-3 font-semibold text-sm sm:text-base transition-all duration-200 ${
                  activeTab === 'kpi'
                    ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50/50'
                }`}
              >
                <ChartBarIcon className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-2 sm:mb-3" />
                <span className="hidden sm:block">KPI Dashboard</span>
                <span className="sm:hidden">KPIs</span>
              </button>
              <button
                onClick={() => setActiveTab('skills')}
                className={`w-1/3 py-4 sm:py-6 px-4 sm:px-8 text-center border-b-3 font-semibold text-sm sm:text-base transition-all duration-200 ${
                  activeTab === 'skills'
                    ? 'border-green-500 text-green-600 bg-green-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50/50'
                }`}
              >
                <ArrowTrendingUpIcon className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-2 sm:mb-3" />
                <span className="hidden sm:block">Skill Trends</span>
                <span className="sm:hidden">Skills</span>
              </button>
              <button
                onClick={() => setActiveTab('feedback')}
                className={`w-1/3 py-4 sm:py-6 px-4 sm:px-8 text-center border-b-3 font-semibold text-sm sm:text-base transition-all duration-200 ${
                  activeTab === 'feedback'
                    ? 'border-red-500 text-red-600 bg-red-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50/50'
                }`}
              >
                <ArrowTrendingDownIcon className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-2 sm:mb-3" />
                <span className="hidden sm:block">Feedback Trends</span>
                <span className="sm:hidden">Feedback</span>
              </button>
            </nav>
          </div>
        </div>

        {/* KPI Dashboard */}
        {activeTab === 'kpi' && (
          <div className="space-y-6">
            {/* Backend Connection Status */}
            {kpiData.length === 0 && !isLoading && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-800">Backend Server Not Available</h3>
                    <p className="text-yellow-700 mt-1">
                      Unable to connect to the online backend server. The admin dashboard requires the backend to be accessible.
                    </p>
                    <p className="text-yellow-600 text-sm mt-2">
                      Please check your internet connection and ensure the backend service is running.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Current Monthly Summary */}
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Monthly Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Onboarding Completion Rate */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <UsersIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Onboarding Completion</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {kpiData.length > 0 ? calculateCompletionRate(
                        kpiData[0].completed_onboard_tasks,
                        kpiData[0].assigned_onboard_tasks
                      ) : 0}%
                    </p>
                    <p className="text-xs text-gray-500">
                      {kpiData.length > 0 ? `${kpiData[0].completed_onboard_tasks}/${kpiData[0].assigned_onboard_tasks} tasks` : '0/0 tasks'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Total Feedback */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Feedback</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {kpiData.length > 0 ? kpiData[0].total_feedbacks_count : 0}
                    </p>
                    <p className="text-xs text-gray-500">
                      {kpiData.length > 0 ? `${kpiData[0].flagged_feedbacks_count} flagged` : '0 flagged'}
                    </p>
                  </div>
                </div>
              </div>

              {/* PII Redacted Count */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <ExclamationTriangleIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">PII Redacted</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {kpiData.length > 0 ? kpiData[0].pii_redacted_count : 0}
                    </p>
                    <p className="text-xs text-gray-500">Privacy violations prevented</p>
                  </div>
                </div>
              </div>

              {/* Prompt Injection Count */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Security Violations</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {kpiData.length > 0 ? kpiData[0].prompt_injection_count : 0}
                    </p>
                    <p className="text-xs text-gray-500">Prompt injections detected</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly KPI Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly KPI Overview (Last 3 Months)</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Onboarding Tasks</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Security Issues</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feedback Analytics</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PII Redacted</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {kpiData.map((data, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatMonth(data.year, data.month)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex flex-col">
                            <span className="text-blue-600 font-medium">
                              {data.completed_onboard_tasks}/{data.assigned_onboard_tasks} completed
                            </span>
                            <span className="text-xs text-gray-400">
                              {calculateCompletionRate(data.completed_onboard_tasks, data.assigned_onboard_tasks)}% completion rate
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex flex-col">
                            <span className="text-red-600 font-medium">{data.prompt_injection_count} prompt injections</span>
                            <span className="text-xs text-gray-400">Security violations</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex flex-col">
                            <span className="text-gray-900 font-medium">{data.total_feedbacks_count} total</span>
                            <span className="text-xs text-gray-400">
                              {data.flagged_feedbacks_count} flagged ({calculateFlagRate(data.flagged_feedbacks_count, data.total_feedbacks_count)}%)
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex flex-col">
                            <span className="text-green-600 font-medium">{data.pii_redacted_count}</span>
                            <span className="text-xs text-gray-400">PII instances</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Skill Trends */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Skill Interests (Last 7 Days)</h3>
              <div className="space-y-4">
                {skillTrends.map((trend, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-medium text-gray-900">{trend.representative_title}</h4>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                        {trend.popularity_users} users
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Related interests:</p>
                    <div className="flex flex-wrap gap-2">
                      {trend.sample_titles.map((title, titleIndex) => (
                        <span key={titleIndex} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {title}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Feedback Trends */}
        {activeTab === 'feedback' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Improvement Areas (Last 7 Days)</h3>
              <div className="space-y-4">
                {feedbackTrends.map((trend, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-medium text-gray-900">{trend.representative_feedback}</h4>
                      <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                        {trend.popularity_users} users
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Similar feedback:</p>
                    <div className="space-y-1">
                      {trend.sample_feedbacks.map((feedback, feedbackIndex) => (
                        <p key={feedbackIndex} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          {feedback}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading admin data...</p>
          </div>
        )}
      </div>
    </div>
  );
}
