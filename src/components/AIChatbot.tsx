/**
 * AI Medical Triage Chatbot Component
 * Floating chatbot for symptom analysis and hospital recommendations
 */

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { analyzeSymptoms, mapRecommendationToAvailableBeds, type TriageResult } from '../lib/ai';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  triageResult?: TriageResult;
  timestamp: Date;
}

interface AIChatbotProps {
  onRecommendationChange?: (recommendedBeds: string[]) => void;
}

export default function AIChatbot({ onRecommendationChange }: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Initialize with welcome message if chat is empty
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        type: 'bot',
        content:
          'Hello! I\'m your medical triage assistant. Describe your symptoms, and I\'ll help recommend the right hospital bed type and find available hospitals nearby.',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsAnalyzing(true);

    try {
      // Analyze symptoms with AI
      const triageResult = await analyzeSymptoms(inputValue);

      // Create bot response
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        type: 'bot',
        content: `Assessment Complete:\n\n📊 Severity: ${capitalize(triageResult.severity)}\n🏥 Recommended: ${triageResult.recommendedBed} Bed\n\nAdvice: ${triageResult.advice}`,
        triageResult,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);

      // Trigger parent component to filter hospitals
      if (onRecommendationChange) {
        const availableBeds = mapRecommendationToAvailableBeds(triageResult.recommendedBed);
        onRecommendationChange(availableBeds);
      }
    } catch (error) {
      console.error('Error analyzing symptoms:', error);

      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        type: 'bot',
        content: 'Sorry, I encountered an error analyzing your symptoms. Please try again.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'severe':
        return 'bg-red-50 border-red-200';
      case 'moderate':
        return 'bg-yellow-50 border-yellow-200';
      case 'mild':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getSeverityBadgeColor = (severity: string): string => {
    switch (severity) {
      case 'severe':
        return 'bg-red-200 text-red-900';
      case 'moderate':
        return 'bg-yellow-200 text-yellow-900';
      case 'mild':
        return 'bg-green-200 text-green-900';
      default:
        return 'bg-gray-200 text-gray-900';
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 right-4 p-4 rounded-full shadow-lg transition-all duration-300 z-40 ${isOpen
            ? 'opacity-0 pointer-events-none'
            : 'bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-110'
          }`}
        title="Open medical triage chatbot"
      >
        <MessageCircle size={24} />
      </button>

      {/* Chatbot Modal */}
      {isOpen && (
        <div className="fixed bottom-0 right-0 w-full md:w-96 h-full md:h-[600px] bg-white rounded-t-2xl md:rounded-2xl shadow-2xl z-50 flex flex-col border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-2xl md:rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle size={20} />
              <div>
                <h3 className="font-bold text-lg">Medical Triage Chatbot</h3>
                <p className="text-xs text-blue-100">AI-Powered Symptom Assessment</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-blue-500 rounded-lg transition-colors"
              title="Close chatbot"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-3 rounded-lg ${message.type === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-gray-200 text-gray-900 rounded-bl-none'
                    }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.content}</p>

                  {/* Display triage card if available */}
                  {message.triageResult && (
                    <div className={`mt-3 p-3 rounded-lg border-2 ${getSeverityColor(message.triageResult.severity)}`}>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${getSeverityBadgeColor(message.triageResult.severity)}`}>
                            {message.triageResult.severity.toUpperCase()}
                          </span>
                          <span className="text-xs font-semibold text-gray-600">
                            {Math.round(message.triageResult.confidence * 100)}% confident
                          </span>
                        </div>
                        <p className="text-xs font-bold text-gray-700">
                          🏥 {message.triageResult.recommendedBed}
                        </p>
                      </div>
                    </div>
                  )}

                  <p className="text-xs opacity-75 mt-2">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {isAnalyzing && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-900 px-4 py-3 rounded-lg rounded-bl-none flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-sm">Analyzing your symptoms...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4 bg-white rounded-b-2xl md:rounded-b-2xl">
            {/* Disclaimer */}
            <p className="text-xs text-gray-500 mb-3 bg-yellow-50 p-2 rounded border border-yellow-200">
              ⚠️ <strong>Disclaimer:</strong> This is not a medical diagnosis. Always consult healthcare professionals for proper medical advice.
            </p>

            {/* Input Field */}
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe your symptoms..."
                disabled={isAnalyzing}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                onClick={handleSendMessage}
                disabled={isAnalyzing || !inputValue.trim()}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                title="Send message"
              >
                {isAnalyzing ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Helper function to capitalize first letter
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
