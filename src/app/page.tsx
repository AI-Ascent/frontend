'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import {
  ChartBarIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  SparklesIcon,
  ShieldCheckIcon,
  CogIcon,
  BuildingOfficeIcon,
  UsersIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  CpuChipIcon,
  LightBulbIcon,
  ServerIcon,
  CircleStackIcon,
} from '@heroicons/react/24/outline';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  const features = [
    {
      title: '360° Feedback Intelligence',
      description: 'Advanced AI analysis of employee feedback with sentiment classification, bias detection, and actionable growth insights.',
      icon: ChatBubbleLeftRightIcon,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Personalized Onboarding',
      description: 'AI-powered onboarding plans tailored to job roles, specializations, and organizational needs with interactive checklists.',
      icon: ClipboardDocumentListIcon,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Intelligent Skill Development',
      description: 'Machine learning recommendations for skill enhancement based on career goals and organizational requirements.',
      icon: AcademicCapIcon,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Smart Mentor Matching',
      description: 'Vector-based mentor discovery using AI to match employee improvement areas with colleague strengths.',
      icon: UserGroupIcon,
      color: 'from-orange-500 to-orange-600',
    },
    {
      title: 'AI Career Coordinator',
      description: 'Intelligent assistant providing personalized career guidance, action items, and resource recommendations.',
      icon: SparklesIcon,
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      title: 'Enterprise Analytics',
      description: 'Comprehensive performance dashboards and organizational insights for data-driven talent decisions.',
      icon: ChartBarIcon,
      color: 'from-teal-500 to-teal-600',
    },
  ];

  const aiAgents = [
    {
      name: 'Feedback Agent',
      model: 'groq:llama-3.1-8b-instant',
      description: 'AI-powered feedback analysis and classification with sentiment analysis and bias filtering',
      capabilities: [
        'Collect and store user feedback',
        'AI-powered classification into strengths and improvements',
        'Generation of actionable insights and growth tips',
        'Bias filtering for fair and inclusive analysis',
        'Vector-based storage for mentor matching'
      ],
      icon: ChatBubbleLeftRightIcon,
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Onboard Agent',
      model: 'groq:openai/gpt-oss-120b',
      description: 'Personalized onboarding plan generation with semantic search capabilities',
      capabilities: [
        'Create and manage onboarding catalogs for different job roles',
        'Associate specializations, tags, checklists, and resources',
        'AI-powered semantic search using vector embeddings',
        'Personalized plans based on job titles and specializations',
        'Support for structured onboarding processes'
      ],
      icon: ClipboardDocumentListIcon,
      color: 'from-green-500 to-green-600'
    },
    {
      name: 'Skill Agent',
      model: 'groq:openai/gpt-oss-20b',
      description: 'Skill recommendation and development planning with external resource integration',
      capabilities: [
        'Create and manage skill catalogs with learning resources',
        'AI-powered semantic search for skill recommendations',
        'Personalized suggestions based on user context',
        'Integration with external search (Tavily) for additional resources',
        'Support for various resource types (tutorials, courses, documentation)'
      ],
      icon: AcademicCapIcon,
      color: 'from-purple-500 to-purple-600'
    },
    {
      name: 'Opportunity Agent',
      model: 'groq:llama-3.1-8b-instant',
      description: 'Mentor matching and organizational talent analysis using vector similarity',
      capabilities: [
        'Find mentors within the organization based on improvement areas',
        'Vector similarity matching between user improvements and strengths',
        'AI-powered selection of best mentor matches',
        'Support for multiple improvement areas',
        'Individual mentor recommendations'
      ],
      icon: UserGroupIcon,
      color: 'from-orange-500 to-orange-600'
    },
    {
      name: 'Coordinator Agent',
      model: 'groq:openai/gpt-oss-20b',
      description: 'General-purpose coordination and multi-step reasoning for complex queries',
      capabilities: [
        'General-purpose coordination and multi-step reasoning',
        'Complex user query processing',
        'Coordinated agent interactions',
        'Enterprise-grade coordination',
        'Intelligent assistant capabilities'
      ],
      icon: SparklesIcon,
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  const aiModels = [
    {
      category: 'Large Language Models (LLMs)',
      icon: CpuChipIcon,
      color: 'from-blue-500 to-indigo-600',
      models: [
        {
          name: 'Coordinator Agent',
          model: 'groq:openai/gpt-oss-20b',
          purpose: 'General-purpose coordination and multi-step reasoning'
        },
        {
          name: 'Feedback Agent',
          model: 'groq:llama-3.1-8b-instant',
          purpose: 'Feedback analysis, classification, and insight generation'
        },
        {
          name: 'Opportunity Agent',
          model: 'groq:llama-3.1-8b-instant',
          purpose: 'Mentor matching and organizational talent analysis'
        },
        {
          name: 'Onboard Agent',
          model: 'groq:openai/gpt-oss-120b',
          purpose: 'Personalized onboarding plan generation'
        },
        {
          name: 'Skill Agent',
          model: 'groq:openai/gpt-oss-20b',
          purpose: 'Skill recommendation and development planning'
        }
      ]
    },
    {
      category: 'HuggingFace Models',
      icon: LightBulbIcon,
      color: 'from-green-500 to-emerald-600',
      models: [
        {
          name: 'Embeddings Model',
          model: 'all-MiniLM-L6-v2',
          purpose: 'Text embeddings for semantic search and similarity matching'
        },
        {
          name: 'Sentiment Analysis',
          model: 'cardiffnlp/twitter-roberta-base-sentiment-latest',
          purpose: 'Sentiment classification of user feedback'
        },
        {
          name: 'Hate Speech Detection',
          model: 'facebook/roberta-hate-speech-dynabench-r4-target',
          purpose: 'Filtering biased and discriminatory content'
        },
        {
          name: 'Prompt Injection Detection',
          model: 'protectai/deberta-v3-base-prompt-injection-v2',
          purpose: 'Preventing malicious prompt injection attacks'
        }
      ]
    }
  ];

  const technicalFeatures = [
    {
      title: 'Performance & Caching',
      description: 'Comprehensive caching system for improved response times and reduced API costs',
      icon: CircleStackIcon,
      color: 'from-purple-500 to-purple-600',
      features: [
        'Database-backed cache storage for persistence',
        'Smart cache invalidation for data consistency',
        'Optimized timeouts (1 hour to 2 days)',
        'Reduced API costs through intelligent caching'
      ]
    },
    {
      title: 'Safety & Security',
      description: 'Advanced security features ensuring safe AI agent interactions',
      icon: ShieldCheckIcon,
      color: 'from-red-500 to-red-600',
      features: [
        'Bias and hate speech filtering with ML models',
        'Prompt injection detection for user inputs',
        'PII (Personal Identifiable Information) redaction',
        'Safe processing of all AI agent interactions'
      ]
    },
    {
      title: 'User Management',
      description: 'Secure authentication and user management with enterprise-grade security',
      icon: UsersIcon,
      color: 'from-indigo-500 to-indigo-600',
      features: [
        'Secure user login with email and password',
        'Custom APIUser model for enterprise needs',
        'Password hashing and validation',
        'Role-based access controls'
      ]
    }
  ];

  const benefits = [
    {
      title: 'Reduce Onboarding Time',
      description: '40% faster new hire integration with personalized AI-driven onboarding paths.',
      icon: ArrowTrendingUpIcon,
    },
    {
      title: 'Improve Employee Retention',
      description: '25% increase in retention rates through targeted development and mentorship programs.',
      icon: UsersIcon,
    },
    {
      title: 'Accelerate Skill Development',
      description: '3x faster skill acquisition with AI-powered learning recommendations and progress tracking.',
      icon: AcademicCapIcon,
    },
    {
      title: 'Enhance Performance Management',
      description: 'Data-driven insights enable more effective performance reviews and development planning.',
      icon: ChartBarIcon,
    },
  ];

  const securityFeatures = [
    'SOC 2 Type II Compliant',
    'Enterprise-grade encryption',
    'Role-based access controls',
    'Audit logging and compliance',
    'GDPR and CCPA compliant',
    'SSO and SAML integration',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-white">AI</span>
              </div>
              <div className="ml-3">
                <h1 className="text-2xl font-bold text-gray-900">AI Ascent</h1>
                <p className="text-sm text-gray-500">Enterprise Edition</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Employee Login
              </Link>
              <Link
                href="/login"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Access Platform
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full mb-8 shadow-xl">
            <BuildingOfficeIcon className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6 leading-tight">
            Enterprise Talent Intelligence
          </h1>
          <p className="text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
            Transform your workforce with AI-powered talent development. Our enterprise platform 
            delivers intelligent feedback analysis, personalized onboarding, and data-driven insights 
            that accelerate organizational growth and employee success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Access Your Platform
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Enterprise-Grade AI Capabilities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced machine learning and natural language processing power every aspect of talent development
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className={`inline-flex p-4 bg-gradient-to-r ${feature.color} rounded-xl mb-6 shadow-md`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Agents Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl mb-6 shadow-md">
              <CpuChipIcon className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              AI Agents Powered by LangChain
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced AI agents that handle complex processing tasks with specialized models for different aspects of talent development
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {aiAgents.map((agent, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start mb-6">
                  <div className={`inline-flex p-4 bg-gradient-to-r ${agent.color} rounded-xl mr-6 shadow-md`}>
                    <agent.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {agent.name}
                    </h3>
                    <p className="text-sm font-mono text-gray-500 mb-2 bg-gray-100 px-3 py-1 rounded-lg inline-block">
                      {agent.model}
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      {agent.description}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Capabilities:</h4>
                  {agent.capabilities.map((capability, capIndex) => (
                    <div key={capIndex} className="flex items-start">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{capability}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Models Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl mb-6 shadow-md">
              <ServerIcon className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Advanced AI Models & Infrastructure
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Enterprise-grade AI models configured via environment variables for easy deployment and testing
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {aiModels.map((category, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-8">
                  <div className={`inline-flex p-4 bg-gradient-to-r ${category.color} rounded-xl mr-4 shadow-md`}>
                    <category.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {category.category}
                  </h3>
                </div>
                
                <div className="space-y-6">
                  {category.models.map((model, modelIndex) => (
                    <div key={modelIndex} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {model.name}
                        </h4>
                        <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {model.model}
                        </span>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        {model.purpose}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Features Section */}
      <section className="py-24 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Technical Excellence & Performance
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built with enterprise-grade architecture and performance optimization
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {technicalFeatures.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className={`inline-flex p-4 bg-gradient-to-r ${feature.color} rounded-xl mb-6 shadow-md`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                <div className="space-y-3">
                  {feature.features.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Measurable Business Impact
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Organizations using AI Ascent see significant improvements in key talent metrics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="inline-flex p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl mb-6 shadow-md">
                  <benefit.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex p-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl mb-6 shadow-md">
                <ShieldCheckIcon className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Enterprise Security & Compliance
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Built for enterprise requirements with industry-leading security, compliance, 
                and data protection standards.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {securityFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-12 rounded-3xl">
              <div className="text-center">
                <CogIcon className="h-24 w-24 text-indigo-600 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Trusted by Leading Organizations
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Fortune 500 companies rely on AI Ascent for their talent development needs, 
                  ensuring data security and regulatory compliance at the highest levels.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-8">
            <BuildingOfficeIcon className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Workforce?
          </h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-3xl mx-auto">
            Join forward-thinking organizations leveraging AI Ascent to build high-performing teams 
            and accelerate employee growth.
          </p>
          <Link
            href="/login"
            className="bg-white text-indigo-600 px-10 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Access Your Enterprise Platform
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                <div className="h-10 w-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-sm font-bold text-white">AI</span>
                </div>
                <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">AI Ascent</span>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                Enterprise talent development platform powered by advanced AI and machine learning. 
                Transforming organizations through intelligent workforce insights.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">Platform</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Feedback Intelligence</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Onboarding Automation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Skill Development</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mentor Matching</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">Enterprise</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Security & Compliance</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integration Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Custom Solutions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">24/7 Support</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">&copy; 2024 AI Ascent. All rights reserved.</p>
            <div className="flex space-x-6 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}