import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  Send,
  X,
  Bot,
  User,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Phone,
  MapPin,
} from 'lucide-react';
import { chatbotAPI } from '../services/api';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  // Quick-action labels; full behavior is in backend Groq system prompt
  const issueQuickActions = [
    'street light',
    'water supply',
    'garbage',
    'road damage',
    'traffic',
    'health',
    'parks',
    'housing',
    'noise pollution'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const text = inputMessage.trim();
    setInputMessage('');
    setMessages(prev => [...prev, {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date()
    }]);
    setIsLoading(true);

    const history = messages.slice(-12).map(m => ({ sender: m.sender, text: m.text }));

    try {
      const { data } = await chatbotAPI.chat(text, history);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: data.response || 'Sorry, I could not respond. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
        type: 'simple'
      }]);
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Chat is temporarily unavailable. Please try again.';
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: msg,
        sender: 'bot',
        timestamp: new Date(),
        type: 'simple'
      }]);
    } finally {
      setIsLoading(false);
    }
  };


  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-110 group"
          aria-label="Open chat"
        >
          <MessageCircle className="h-6 w-6 group-hover:animate-pulse" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full animate-ping"></span>
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full"></span>
        </button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-[500px] h-[650px]'
    }`}>
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-2xl flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Bot className="w-6 h-6" />
          <div>
            <h3 className="font-semibold text-lg">AI Grievance Assistant</h3>
            <p className="text-blue-100 text-sm">Instant help for civic issues</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {isMinimized ? (
            <button
              onClick={() => setIsMinimized(false)}
              className="text-white hover:text-blue-200 transition-colors p-1"
              aria-label="Maximize chat"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
              </svg>
            </button>
          ) : (
            <button
              onClick={() => setIsMinimized(true)}
              className="text-white hover:text-blue-200 transition-colors p-1"
              aria-label="Minimize chat"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
          )}
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-blue-200 transition-colors p-1"
            aria-label="Close chat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Quick Actions */}
          <div className="bg-gray-50 p-3 border-b border-gray-200">
            <div className="flex flex-wrap gap-2">
              {issueQuickActions.map((issue) => (
                <button
                  key={issue}
                  onClick={() => setInputMessage(issue)}
                  className="px-3 py-1 bg-white border border-gray-300 rounded-full text-xs hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  {issue.charAt(0).toUpperCase() + issue.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Enhanced Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Bot className="h-16 w-16 mx-auto mb-4 text-blue-500" />
                <h4 className="font-semibold text-gray-700 mb-2">Hello! I'm GrievanceBot</h4>
                <p className="text-sm text-gray-600 mb-4">I can help with the AI Grievance Portal: submit complaints, check status, departments, rewards, and step-by-step guides.</p>
                <div className="bg-blue-50 rounded-lg p-3 text-left">
                  <p className="text-xs text-blue-700 font-medium mb-2">I can help with:</p>
                  <ul className="text-xs text-blue-600 space-y-1">
                    <li>• How to submit a complaint</li>
                    <li>• Check complaint status</li>
                    <li>• Department info (Sanitation, Water, Electrical, Public Works, Traffic, Health, Parks, Housing)</li>
                    <li>• Reward points and badges</li>
                    <li>• Step-by-step guides for civic issues</li>
                  </ul>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                        : 'bg-white text-gray-800 shadow-md'
                    }`}
                  >
                    <div className="p-4">
                      <div className="flex items-start space-x-3">
                        {message.sender === 'bot' && (
                          <div className="bg-blue-100 rounded-full p-2">
                            <Bot className="h-4 w-4 text-blue-600" />
                          </div>
                        )}
                        <div className="flex-1">
                          {message.type === 'structured' && message.data ? (
                            <StructuredResponse data={message.data} />
                          ) : (
                            <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                          )}
                          <p className={`text-xs mt-2 ${
                            message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                        {message.sender === 'user' && (
                          <div className="bg-blue-700 rounded-full p-2">
                            <User className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 rounded-2xl shadow-md p-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 rounded-full p-2">
                      <Bot className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Enhanced Input */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200 rounded-b-2xl">
            <div className="flex space-x-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Describe your issue in detail..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 text-white p-3 rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

// Structured Response Component: primary steps, minor tips, full steps, related data
const StructuredResponse = ({ data }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        {data.icon}
        <span className="font-medium text-sm">Issue Severity: {data.severity}</span>
      </div>

      {data.primarySteps && data.primarySteps.length > 0 && (
        <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="h-4 w-4 text-amber-600" />
            <span className="font-medium text-sm text-amber-800">Primary steps (do these first):</span>
          </div>
          <ol className="text-xs text-amber-800 space-y-1 ml-6">
            {data.primarySteps.map((step, index) => (
              <li key={index} className="list-decimal">{step}</li>
            ))}
          </ol>
        </div>
      )}

      {data.minorIssueTips && (
        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
          <div className="flex items-center space-x-2 mb-1">
            <Lightbulb className="h-4 w-4 text-green-600" />
            <span className="font-medium text-xs text-green-800">Minor issues & tips:</span>
          </div>
          <p className="text-xs text-green-800">{data.minorIssueTips}</p>
        </div>
      )}
      
      <div className="bg-blue-50 rounded-lg p-3">
        <div className="flex items-center space-x-2 mb-2">
          <Lightbulb className="h-4 w-4 text-blue-600" />
          <span className="font-medium text-sm text-blue-800">Step-by-step guide:</span>
        </div>
        <ol className="text-xs text-blue-700 space-y-1 ml-6">
          {data.steps.map((step, index) => (
            <li key={index} className="list-decimal">{step}</li>
          ))}
        </ol>
      </div>

      <div className="bg-gray-50 rounded-lg p-3">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-gray-600" />
            <span className="font-medium text-xs text-gray-700">Department: {data.relatedData.department}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4 text-gray-600" />
            <span className="text-xs text-gray-600">Contact: {data.relatedData.contact}</span>
          </div>
          {data.relatedData.email && (
            <div className="flex items-center space-x-2 text-gray-600">
              <span className="text-xs">Email: {data.relatedData.email}</span>
            </div>
          )}
          {data.relatedData.schedule && (
            <div className="flex items-center space-x-2 text-gray-600">
              <span className="text-xs">{data.relatedData.schedule}</span>
            </div>
          )}
          {data.relatedData.norms && (
            <div className="flex items-center space-x-2 text-gray-600">
              <span className="text-xs">{data.relatedData.norms}</span>
            </div>
          )}
          {data.relatedData.emergency && (
            <div className="flex items-center space-x-2 text-red-600">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-xs font-medium">{data.relatedData.emergency}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatbotWidget;
