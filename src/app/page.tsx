'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import {
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  SparklesIcon,
  ShieldCheckIcon,
  BuildingOfficeIcon,
  UsersIcon,
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
      title: 'User Authentication',
      description: 'JWT-based authentication with secure user login, token-based API access, and comprehensive user management.',
      icon: ShieldCheckIcon,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Feedback Processing',
      description: 'AI-powered feedback collection, classification, and insight generation with bias filtering and vector-based storage.',
      icon: ChatBubbleLeftRightIcon,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Onboarding Management',
      description: 'Comprehensive onboarding catalogs with AI-powered semantic search and personalized plans for different job roles.',
      icon: ClipboardDocumentListIcon,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Skill Development',
      description: 'Intelligent skill catalogs with semantic search, personalized recommendations, and external resource integration.',
      icon: AcademicCapIcon,
      color: 'from-orange-500 to-orange-600',
    },
    {
      title: 'Mentorship Matching',
      description: 'Advanced mentor discovery using vector similarity matching and AI-powered selection with detailed reasoning.',
      icon: UserGroupIcon,
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      title: 'Safety and Security',
      description: 'Comprehensive safety measures including bias filtering, prompt injection detection, and PII redaction.',
      icon: ShieldCheckIcon,
      color: 'from-red-500 to-red-600',
    },
  ];

  const aiAgents = [
    {
      name: 'Feedback Agent',
      model: 'groq:meta-llama/llama-4-scout-17b-16e-instruct',
      description: 'AI-powered feedback collection, classification, and insight generation with bias filtering',
      capabilities: [
        'Collect and store user feedback with secure processing',
        'AI-powered classification into strengths and improvements using sentiment analysis',
        'Generation of actionable insights and growth tips from classified feedback',
        'Bias filtering to ensure fair and inclusive feedback analysis',
        'Vector-based storage of user strengths for mentor matching'
      ],
      icon: ChatBubbleLeftRightIcon,
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Onboard Agent',
      model: 'groq:openai/gpt-oss-20b',
      description: 'Comprehensive onboarding management with AI-powered semantic search and personalized plans',
      capabilities: [
        'Create and manage onboarding catalogs for different job roles',
        'Associate specializations, tags, checklists, and resources with each role',
        'AI-powered semantic search using vector embeddings for relevant information',
        'Personalized onboarding plans based on employee job titles and specializations',
        'Support for structured onboarding processes with customizable checklists'
      ],
      icon: ClipboardDocumentListIcon,
      color: 'from-green-500 to-green-600'
    },
    {
      name: 'Skill Agent',
      model: 'groq:openai/gpt-oss-20b',
      description: 'Intelligent skill development with semantic search and external resource integration',
      capabilities: [
        'Create and manage skill catalogs with comprehensive learning resources',
        'AI-powered semantic search for personalized skill recommendations',
        'Personalized skill suggestions based on user context and feedback insights',
        'Integration with external search (Tavily) for additional resources when needed',
        'Support for various resource types (tutorials, courses, documentation, etc.)'
      ],
      icon: AcademicCapIcon,
      color: 'from-purple-500 to-purple-600'
    },
    {
      name: 'Mentor Agent',
      model: 'groq:meta-llama/llama-4-scout-17b-16e-instruct',
      description: 'Advanced mentorship matching using vector similarity and AI-powered selection',
      capabilities: [
        'Find mentors within the organization based on improvement areas',
        'Vector similarity matching between user improvements and other users\' strengths',
        'AI-powered selection of best mentor matches with detailed reasoning',
        'Support for multiple improvement areas with individual mentor recommendations',
        'Surface mentor emails when available for direct contact'
      ],
      icon: UserGroupIcon,
      color: 'from-orange-500 to-orange-600'
    },
    {
      name: 'Coordinator Agent',
      model: 'groq:openai/gpt-oss-20b',
      description: 'Master AI coordinator that orchestrates all specialized agents for comprehensive career guidance',
      capabilities: [
        'Orchestrates feedback analysis, skill recommendations, and mentor matching',
        'Coordinates multiple AI agents for complex career queries',
        'Provides comprehensive career guidance by leveraging all available data',
        'Generates personalized action items and resource recommendations',
        'Enterprise-grade multi-agent coordination with JSON formatting and guardrails'
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
          purpose: 'Master AI coordinator that leverages all specialized agents to provide comprehensive, personalized career guidance'
        },
        {
          name: 'Feedback Agent',
          model: 'groq:meta-llama/llama-4-scout-17b-16e-instruct',
          purpose: 'Feedback analysis, classification, and insight generation with bias filtering'
        },
        {
          name: 'Mentor Agent',
          model: 'groq:meta-llama/llama-4-scout-17b-16e-instruct',
          purpose: 'Advanced mentorship matching using vector similarity and AI-powered selection'
        },
        {
          name: 'Onboard Agent',
          model: 'groq:openai/gpt-oss-20b',
          purpose: 'Comprehensive onboarding management with AI-powered semantic search'
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
          purpose: 'Text embeddings for semantic search and similarity matching across job titles, skills, and user data'
        },
        {
          name: 'Sentiment Analysis',
          model: 'cardiffnlp/twitter-roberta-base-sentiment-latest',
          purpose: 'Sentiment classification of user feedback for comprehensive feedback processing'
        },
        {
          name: 'Hate Speech Detection',
          model: 'facebook/roberta-hate-speech-dynabench-r4-target',
          purpose: 'Filtering biased and discriminatory content in safety checks on user feedback'
        },
        {
          name: 'Prompt Injection Detection',
          model: 'protectai/deberta-v3-base-prompt-injection-v2',
          purpose: 'Preventing malicious prompt injection attacks in input validation and security checks'
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
        'Database-backed cache storage for persistence across deployments',
        'Smart cache invalidation to maintain data consistency',
        'Optimized timeouts based on data volatility (1 hour to 2 days)',
        'Reduced API costs through intelligent response caching'
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


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="relative h-10 w-auto rounded-lg overflow-hidden shadow-md">
        <Image
                  src="/images/logo.png"
                  alt="AI Ascent Logo"
                  width={40}
                  height={40}
                  className="object-contain w-full h-full"
          priority
        />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-indigo-600">AI Ascent</h1>
                <p className="text-sm text-gray-500">Enterprise Edition</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
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
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Developed by</h3>
            <div className="flex flex-wrap justify-center gap-6 text-gray-400">
              <div className="flex items-center">
                <span className="mr-2">👨‍💻</span>
                <span className="font-medium">Chanwoo Song</span>
                <span className="ml-2 text-sm text-gray-500">(Data Science @ NTU)</span>
                <a 
                  href="https://github.com/chanthr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-400 hover:text-blue-300 transition-colors duration-200"
                >
                  GitHub →
                </a>
              </div>
              <div className="flex items-center">
                <span className="mr-2">👨‍💻</span>
                <span className="font-medium">Yash Raj</span>
                <span className="ml-2 text-sm text-gray-500">(Computer Science @ NTU)</span>
                <a 
                  href="https://github.com/ryash072007" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-400 hover:text-blue-300 transition-colors duration-200"
                >
                  GitHub →
                </a>
              </div>
              <div className="flex items-center">
                <span className="mr-2">👨‍💻</span>
                <span className="font-medium">Nestor Zhang Ruizhe</span>
                <span className="ml-2 text-sm text-gray-500">(Computer Science @ NTU)</span>
                <a 
                  href="https://github.com/Nestor-os" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-400 hover:text-blue-300 transition-colors duration-200"
                >
                  GitHub →
                </a>
              </div>
              <div className="flex items-center">
                <span className="mr-2">👨‍💻</span>
                <span className="font-medium">Adrian</span>
                <span className="ml-2 text-sm text-gray-500">(Data Science @ NTU)</span>
                <span className="ml-2 text-gray-500 text-sm">GitHub →</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">👨‍💻</span>
                <span className="font-medium">Yanxi</span>
                <span className="ml-2 text-sm text-gray-500">(Computer Science @ NTU)</span>
                <span className="ml-2 text-gray-500 text-sm">GitHub →</span>
              </div>
            </div>
          </div>
          <div className="text-center">
            <p className="text-gray-400">&copy; 2024 AI Ascent. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}