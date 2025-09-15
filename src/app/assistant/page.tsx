'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { coordinatorAsk } from '@/lib/api';
import { useToast } from '@/components/Toast';
import ReactMarkdown from 'react-markdown';
import { 
  ChatBubbleLeftRightIcon, 
  PaperAirplaneIcon,
  LightBulbIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  SparklesIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';


interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  action_items?: string[];
  resources?: string[];
}

export default function AssistantPage() {
  const { user } = useAuth();
  const { showErrorToast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [progress, setProgress] = useState(0);
  const [progressInterval, setProgressInterval] = useState<NodeJS.Timeout | null>(null);

  // Load chat history from localStorage on component mount
  React.useEffect(() => {
    const savedHistory = localStorage.getItem('coordinatorChatHistory');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        // Convert timestamp strings back to Date objects
        const historyWithDates = parsed.map((msg: Omit<ChatMessage, 'timestamp'> & { timestamp: string }) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setChatHistory(historyWithDates);
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    }
  }, []);

  // Save chat history to localStorage whenever it changes
  React.useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem('coordinatorChatHistory', JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  // Cleanup progress interval on component unmount
  React.useEffect(() => {
    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [progressInterval]);

  const handleAskCoordinator = async () => {
    if (!user?.email) {
      alert('Please log in first');
      return;
    }

    if (!query.trim()) {
      alert('Please enter a question');
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: query.trim(),
      timestamp: new Date()
    };

    // Add user message to chat history
    setChatHistory(prev => [...prev, userMessage]);
    
    setIsLoading(true);
    startProgressBar();
    try {
      const result = await coordinatorAsk({
        email: user.email,
        query: query.trim()
      });
      
      // Complete progress bar to 100% immediately when response is received
      setProgress(100);
      
      // Stop the progress interval
      if (progressInterval) {
        clearInterval(progressInterval);
        setProgressInterval(null);
      }
      
      // Add a small delay before showing the response
      setTimeout(() => {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: result.message,
          timestamp: new Date(),
          action_items: result.action_items,
          resources: result.resources
        };

        // Add assistant response to chat history
        setChatHistory(prev => [...prev, assistantMessage]);
        setQuery(''); // Clear the input
        setIsLoading(false);
        
        // Reset progress bar after showing response
        setTimeout(() => setProgress(0), 1000);
      }, 500); // 500ms delay
      
    } catch (error) {
      console.error('Error asking coordinator:', error);
      
      // Show more specific error messages
      let errorMessage = 'Failed to process your question. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('AI service is currently busy')) {
          errorMessage = 'AI service is currently busy due to high usage. Please try again in a few minutes.';
        } else if (error.message.includes('Rate limit')) {
          errorMessage = 'We\'ve reached our daily AI usage limit. Please try again tomorrow or contact support.';
        } else {
          errorMessage = `Error: ${error.message}`;
        }
      }
      
      showErrorToast(errorMessage, () => handleAskCoordinator());
      setIsLoading(false);
      stopProgressBar();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAskCoordinator();
    }
  };

  const startProgressBar = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        // Random increment between 2-5%
        const increment = Math.random() * 3 + 2;
        const newProgress = prev + increment;
        
        // Don't complete automatically - let the API response control completion
        return Math.min(newProgress, 95); // Stop at 95% until response arrives
      });
    }, Math.random() * 1500 + 800); // Random interval between 0.8-2.3 seconds (faster)
    
    setProgressInterval(interval);
  };

  const stopProgressBar = () => {
    if (progressInterval) {
      clearInterval(progressInterval);
      setProgressInterval(null);
    }
    // Only complete if not already at 100%
    if (progress < 100) {
      setProgress(100); // Complete the progress bar
    }
    setTimeout(() => setProgress(0), 1000); // Reset after 1 second
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full mb-6 shadow-lg">
            <ChatBubbleLeftRightIcon className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Coordinator Ask
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Ask me anything about your career development, skills, onboarding, or feedback. 
            I&apos;ll provide personalized advice with actionable steps and resources.
          </p>
        </div>


        {/* Progress Bar */}
        {isLoading && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-center mb-4">
              <SparklesIcon className="h-6 w-6 text-purple-600 mr-2 animate-pulse" />
              <h3 className="text-lg font-semibold text-gray-900">Coordinator is thinking...</h3>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Processing your request...</span>
              <span className="text-sm font-medium text-purple-600">{Math.round(progress)}%</span>
            </div>
            <p className="text-center text-gray-600 text-sm">
              This may take up to 45 seconds as the coordinator analyzes your question and gathers insights from all specialized agents.
            </p>
          </div>
        )}

        {/* Query Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-gray-200/50 p-8 mb-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="query" className="block text-lg font-semibold text-gray-900 mb-3">
                What would you like to know?
              </label>
              <textarea
                id="query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., What skills should I develop for my role? How can I improve my communication? What should I focus on in my onboarding?"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 h-32 resize-none text-gray-900 placeholder-gray-400 transition-all duration-200"
                disabled={isLoading}
              />
            </div>

            <button
              onClick={handleAskCoordinator}
              disabled={isLoading || !user?.email || !query.trim()}
              className="w-full flex items-center justify-center px-6 py-4 border border-transparent text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                  Ask Coordinator
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        {chatHistory.length > 0 && chatHistory[chatHistory.length - 1]?.type === 'assistant' && (
          <div className="space-y-6">
            {/* Response */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <SparklesIcon className="h-6 w-6 text-purple-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">Coordinator Response</h2>
              </div>
              <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => <h1 className="text-2xl font-bold text-gray-900 mb-4">{children}</h1>,
                    h2: ({ children }) => {
                      // Filter out Action Items and Resources sections
                      const text = children?.toString().toLowerCase() || '';
                      if (text.includes('action items') || text.includes('resources') || text.includes('next steps')) {
                        return null;
                      }
                      return <h2 className="text-xl font-semibold text-gray-900 mb-3">{children}</h2>;
                    },
                    h3: ({ children }) => <h3 className="text-lg font-semibold text-gray-900 mb-2">{children}</h3>,
                    p: ({ children }) => <p className="mb-3 leading-relaxed text-gray-700">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
                    li: ({ children }) => <li className="text-gray-700">{children}</li>,
                    strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                    em: ({ children }) => <em className="italic">{children}</em>,
                    code: ({ children }) => <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">{children}</code>,
                    blockquote: ({ children }) => <blockquote className="border-l-4 border-purple-200 pl-4 italic text-gray-600 mb-3">{children}</blockquote>,
                    a: ({ href, children }) => {
                      // Check if it's a URL (starts with http)
                      if (href && href.startsWith('http')) {
                        return (
                          <div className="mt-2">
                            <a 
                              href={href} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                            >
                              <DocumentTextIcon className="h-4 w-4 mr-1" />
                              {children || 'Open Resource'}
                            </a>
                          </div>
                        );
                      }
                      // Regular link styling for non-URL links
                      return <a href={href} className="text-purple-600 hover:text-purple-800 underline" target="_blank" rel="noopener noreferrer">{children}</a>;
                    },
                  }}
                >
                  {(() => {
                    // Filter out Action Items and Resources sections from the content
                    const content = chatHistory[chatHistory.length - 1]?.content || '';
                    
                    // Remove sections that start with "## Action Items", "## Resources", "## Next Steps"
                    const lines = content.split('\n');
                    const filteredLines = [];
                    let skipSection = false;
                    
                    for (let i = 0; i < lines.length; i++) {
                      const line = lines[i];
                      
                      // Check if this line starts a section we want to skip
                      if (line.match(/^##\s*(Action Items|Resources|Next Steps)/i)) {
                        skipSection = true;
                        continue;
                      }
                      
                      // Check if we're starting a new section (## heading)
                      if (line.match(/^##\s*/) && !line.match(/^##\s*(Action Items|Resources|Next Steps)/i)) {
                        skipSection = false;
                      }
                      
                      // If we're not in a section to skip, add the line
                      if (!skipSection) {
                        filteredLines.push(line);
                      }
                    }
                    
                    return filteredLines.join('\n');
                  })()}
                </ReactMarkdown>
              </div>
            </div>

            {/* Action Items */}
            {chatHistory[chatHistory.length - 1]?.action_items && chatHistory[chatHistory.length - 1]?.action_items!.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <CheckCircleIcon className="h-6 w-6 text-green-600 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Action Items</h2>
                </div>
                <div className="space-y-3">
                  {chatHistory[chatHistory.length - 1]?.action_items!.map((item, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 mr-3 mt-1">
                        <div className="h-6 w-6 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 text-sm font-medium">{index + 1}</span>
                        </div>
                      </div>
                      <p className="text-gray-700">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resources */}
            {chatHistory[chatHistory.length - 1]?.resources && chatHistory[chatHistory.length - 1]?.resources!.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <DocumentTextIcon className="h-6 w-6 text-blue-600 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Recommended Resources</h2>
                </div>
                <div className="space-y-3">
                  {chatHistory[chatHistory.length - 1]?.resources!.map((resource, index) => {
                    // Enhanced URL extraction - handle various formats
                    const urlRegex = /(https?:\/\/[^\s\)]+)/g;
                    const urls = resource.match(urlRegex);
                    const url = urls ? urls[0] : '';
                    
                    // Extract title by removing URLs and cleaning up
                    let title = resource;
                    if (url) {
                      // Remove URL from the text
                      title = resource.replace(urlRegex, '').trim();
                      // Clean up common separators and formatting
                      title = title.replace(/^[-:\s]+|[-:\s]+$/g, '').trim();
                      // Remove backticks if present
                      title = title.replace(/`/g, '').trim();
                    }
                    
                    // If no title after URL removal, use the full resource text
                    if (!title) {
                      title = resource;
                    }
                    
                    return (
                      <div key={index} className="flex items-start">
                        <div className="flex-shrink-0 mr-3 mt-1">
                          <LightBulbIcon className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-700 mb-2">{title}</p>
                          {url && (
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                            >
                              <DocumentTextIcon className="h-4 w-4 mr-1" />
                              Open Resource
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}


      </div>
    </div>
  );
}
