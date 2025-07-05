import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, Brain, Heart, Utensils, Loader2, ArrowRight, TrendingUp } from 'lucide-react';
import { geminiService } from '../services/openai';
import { useApp } from '../contexts/AppContext';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface AIAssistantProps {
  setActiveTab: (tab: string) => void;
}

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'es', label: 'Español' }
];

const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    aiCoach: 'AI Nutrition Coach',
    poweredBy: 'Powered by Gemini',
    getInsights: 'Get personalized food and mood insights powered by advanced AI',
    quickQuestions: 'Quick questions & commands:',
    tryCommands: 'Try commands:',
    clear: 'Clear',
    online: 'Online • Ready to help',
    thinking: 'AI is thinking...'
  },
  hi: {
    aiCoach: 'एआई पोषण कोच',
    poweredBy: 'Gemini द्वारा संचालित',
    getInsights: 'एआई द्वारा संचालित व्यक्तिगत भोजन और मूड अंतर्दृष्टि प्राप्त करें',
    quickQuestions: 'त्वरित प्रश्न और कमांड:',
    tryCommands: 'कमांड आज़माएँ:',
    clear: 'साफ़ करें',
    online: 'ऑनलाइन • मदद के लिए तैयार',
    thinking: 'एआई सोच रहा है...'
  },
  es: {
    aiCoach: 'Entrenador de Nutrición AI',
    poweredBy: 'Desarrollado por Gemini',
    getInsights: 'Obtén información personalizada sobre alimentos y estado de ánimo impulsada por IA',
    quickQuestions: 'Preguntas y comandos rápidos:',
    tryCommands: 'Prueba comandos:',
    clear: 'Limpiar',
    online: 'En línea • Listo para ayudar',
    thinking: 'La IA está pensando...'
  }
};

function t(lang: string, key: string) {
  return TRANSLATIONS[lang]?.[key] || TRANSLATIONS['en'][key] || key;
}

const FUN_FACTS: Record<string, string[]> = {
  en: [
    "Did you know? Bananas can help boost your mood!",
    "Dark chocolate contains compounds that may improve brain function.",
    "Drinking water can help you feel more energetic.",
    "Avocados are rich in healthy fats for your brain.",
    "A healthy gut can improve your mental health!"
  ],
  hi: [
    "क्या आप जानते हैं? केले आपके मूड को बेहतर बना सकते हैं!",
    "डार्क चॉकलेट में ऐसे तत्व होते हैं जो मस्तिष्क के लिए अच्छे हैं।",
    "पानी पीना आपको अधिक ऊर्जावान बना सकता है।",
    "एवोकाडो में दिमाग के लिए अच्छे वसा होते हैं।",
    "स्वस्थ पेट मानसिक स्वास्थ्य को सुधार सकता है!"
  ],
  es: [
    "¿Sabías que los plátanos pueden mejorar tu estado de ánimo?",
    "El chocolate negro contiene compuestos que mejoran el cerebro.",
    "Beber agua puede darte más energía.",
    "Los aguacates son ricos en grasas saludables para el cerebro.",
    "¡Un intestino sano mejora la salud mental!"
  ]
};

function getRandomFact(lang: string) {
  const facts = FUN_FACTS[lang] || FUN_FACTS['en'];
  return facts[Math.floor(Math.random() * facts.length)];
}

export function AIAssistant({ setActiveTab }: AIAssistantProps) {
  const { user, moodEntries, foodEntries, currentMood, language, setLanguage } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: `Hi ${user?.name || 'there'}! I'm your AI nutrition and mood coach powered by Gemini. I can help you understand how food affects your emotions, suggest meals based on your mood, and provide personalized insights. What would you like to know?`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [lastWasFallback, setLastWasFallback] = useState(false);
  const [loadingFact, setLoadingFact] = useState(getRandomFact(language));

  // Auto-scroll to latest message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (isTyping) {
      setLoadingFact(getRandomFact(language));
    }
  }, [isTyping, language]);

  const aiSuggestions = [
    "What should I eat to boost my energy?",
    "I'm feeling stressed, what foods can help?",
    "Analyze my mood patterns this week",
    "Suggest a recipe for my current mood"
  ];

  const commandSuggestions = [
    { command: "/recipe", display: "Recipe", example: "tofu, broccoli, vegan" },
    { command: "/summary", display: "Summary" },
    { command: "/fact", display: "Nutrition Fact" },
    { command: "/motivate", display: "Motivation" },
    { command: "/remember", display: "Remember", example: "I am vegetarian" },
    { command: "/preferences", display: "Preferences" }
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    setLastWasFallback(false);

    // Prepend system message for language
    const systemPrompt = {
      role: 'system',
      content: `You are an AI assistant. Always reply in ${LANGUAGES.find(l => l.code === language)?.label || 'English'}.`
    };

    // Handle special commands
    const special = await geminiService.handleSpecialCommand(inputMessage, {
      moodEntries,
      foodEntries,
      preferences: geminiService.getUserPreferences(),
    });
    if (special) {
      const aiContent = await special;
      const isFallback = aiContent.includes('I understand you') || aiContent.includes('I apologize') || aiContent.includes('nutrition and mood guidance');
      setLastWasFallback(isFallback);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiContent,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
      return;
    }

    try {
      // Convert messages to Gemini format
      const conversationHistory = messages.slice(-5).map(msg => ({
        role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      }));

      // Add system prompt for language
      const fullHistory = [systemPrompt, ...conversationHistory];

      // Add current user message
      fullHistory.push({
        role: 'user',
        content: inputMessage
      });

      const aiResponse = await geminiService.generateResponse(fullHistory);
      const isFallback = aiResponse.includes('I understand you') || aiResponse.includes('I apologize') || aiResponse.includes('nutrition and mood guidance');
      setLastWasFallback(isFallback);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      setLastWasFallback(true);
      console.error('AI response error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I apologize, but I'm having trouble connecting right now. Please check your Gemini API configuration and try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'analyze-mood':
        if (moodEntries.length > 0) {
          const avgMood = moodEntries.reduce((sum, entry) => sum + entry.mood, 0) / moodEntries.length;
          setInputMessage(`Analyze my mood patterns. My recent average mood is ${avgMood.toFixed(1)}/7 and I've logged ${moodEntries.length} mood entries.`);
        } else {
          setInputMessage("I haven't tracked my mood yet. Can you help me understand how to start?");
        }
        break;
      case 'food-recommendations':
        setInputMessage(`Based on my current mood level of ${currentMood}/7, what foods would you recommend to improve my energy and happiness?`);
        break;
      case 'nutrition-analysis':
        if (foodEntries.length > 0) {
          const recentFoods = foodEntries.slice(0, 5).map(entry => entry.name).join(', ');
          setInputMessage(`Analyze my recent food choices: ${recentFoods}. How are these affecting my mood and what improvements can I make?`);
        } else {
          setInputMessage("I haven't logged any food yet. Can you help me understand how food affects mood?");
        }
        break;
      default:
        break;
    }
  };

  // Keyboard accessibility for quick suggestions
  const suggestionButtonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const handleSuggestionKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === 'ArrowRight') {
      suggestionButtonsRef.current[idx + 1]?.focus();
    } else if (e.key === 'ArrowLeft') {
      suggestionButtonsRef.current[idx - 1]?.focus();
    } else if (e.key === 'Enter') {
      if (idx < aiSuggestions.length) {
        handleSuggestionClick(aiSuggestions[idx]);
      } else {
        const cmdIdx = idx - aiSuggestions.length;
        const cmd = commandSuggestions[cmdIdx];
        handleSuggestionClick(cmd.example ? `${cmd.command} ${cmd.example}` : cmd.command);
      }
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: '1',
        type: 'ai',
        content: `Hi ${user?.name || 'there'}! I'm your AI nutrition and mood coach powered by Gemini. I can help you understand how food affects your emotions, suggest meals based on your mood, and provide personalized insights. What would you like to know?`,
        timestamp: new Date()
      }
    ]);
    setInputMessage('');
    setLastWasFallback(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center">
              <Bot className="w-10 h-10 mr-4 text-purple-600" />
              {t(language, 'aiCoach')}
              <span className="ml-3 text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
                {t(language, 'poweredBy')}
              </span>
            </h1>
            <p className="text-gray-600 text-lg">{t(language, 'getInsights')}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">🌐</span>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* User Context Summary */}
        {user && (
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-6 mb-8 border border-blue-200">
            <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center">
              <Brain className="w-5 h-5 mr-2" />
              Your Current Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/80 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{currentMood}/7</div>
                <div className="text-sm text-gray-600">Current Mood</div>
              </div>
              <div className="bg-white/80 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{foodEntries.length}</div>
                <div className="text-sm text-gray-600">Meals Logged</div>
              </div>
              <div className="bg-white/80 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{moodEntries.length}</div>
                <div className="text-sm text-gray-600">Mood Entries</div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick AI Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handleQuickAction('analyze-mood')}
              className="p-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Heart className="w-6 h-6 mx-auto mb-2" />
              <div className="font-semibold">Analyze My Mood</div>
              <div className="text-sm opacity-90">Get mood insights</div>
            </button>
            <button
              onClick={() => handleQuickAction('food-recommendations')}
              className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Utensils className="w-6 h-6 mx-auto mb-2" />
              <div className="font-semibold">Food Recommendations</div>
              <div className="text-sm opacity-90">What should I eat?</div>
            </button>
            <button
              onClick={() => handleQuickAction('nutrition-analysis')}
              className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <TrendingUp className="w-6 h-6 mx-auto mb-2" />
              <div className="font-semibold">Nutrition Analysis</div>
              <div className="text-sm opacity-90">Review my choices</div>
            </button>
          </div>
        </div>

        {/* AI Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100">
            <div className="flex items-center space-x-3 mb-4">
              <Brain className="w-8 h-8 text-purple-600" />
              <h3 className="text-lg font-bold text-gray-800">Smart Analysis</h3>
            </div>
            <p className="text-gray-600">AI analyzes your mood patterns and food choices to provide personalized insights.</p>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100">
            <div className="flex items-center space-x-3 mb-4">
              <Utensils className="w-8 h-8 text-green-600" />
              <h3 className="text-lg font-bold text-gray-800">Food Recommendations</h3>
            </div>
            <p className="text-gray-600">Get meal suggestions tailored to your current mood and nutritional needs.</p>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-100">
            <div className="flex items-center space-x-3 mb-4">
              <Heart className="w-8 h-8 text-orange-600" />
              <h3 className="text-lg font-bold text-gray-800">Mood Coaching</h3>
            </div>
            <p className="text-gray-600">Learn how different foods impact your emotions and well-being.</p>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">AI Nutrition Assistant</h3>
                <p className="text-purple-100 text-sm">
                  {isTyping ? t(language, 'thinking') : t(language, 'online')}
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {lastWasFallback && (
              <div className="flex justify-center mb-2">
                <span className="px-3 py-1 bg-yellow-200 text-yellow-900 rounded-full text-xs font-semibold flex items-center gap-2">
                  ⚠️ Gemini fallback or error response
                </span>
              </div>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.type === 'ai' && (
                    <div className="flex items-center space-x-2 mb-2">
                      <Bot className="w-4 h-4 text-purple-600" />
                      <span className="text-xs font-medium text-purple-600">AI Assistant</span>
                    </div>
                  )}
                  <div className="whitespace-pre-line">{message.content}</div>
                  <div className={`text-xs mt-2 ${message.type === 'user' ? 'text-orange-100' : 'text-gray-500'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gradient-to-r from-yellow-100 to-orange-100 text-gray-800 px-4 py-4 rounded-2xl flex items-center gap-4 shadow-md animate-pulse">
                  <div className="relative flex items-center justify-center">
                    <span className="text-3xl animate-bounce">🍌</span>
                  </div>
                  <div>
                    <div className="font-semibold text-sm mb-1 text-orange-700">{loadingFact}</div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                      <span>{t(language, 'thinking')}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggestions */}
          <div className="px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-600 mb-3">{t(language, 'quickQuestions')}</p>
            <div className="flex flex-wrap gap-2">
              {aiSuggestions.map((suggestion, index) => (
                <button
                  key={`suggestion-${index}`}
                  ref={el => suggestionButtonsRef.current[index] = el}
                  onClick={() => handleSuggestionClick(suggestion)}
                  onKeyDown={e => handleSuggestionKeyDown(e, index)}
                  className="px-3 py-2 bg-purple-100 text-purple-700 rounded-full text-sm hover:bg-purple-200 transition-colors"
                  disabled={isTyping}
                >
                  {suggestion}
                </button>
              ))}
              
              {commandSuggestions.map((cmd, index) => (
                <button
                  key={`command-${index}`}
                  ref={el => suggestionButtonsRef.current[index + aiSuggestions.length] = el}
                  onClick={() => handleSuggestionClick(cmd.example ? `${cmd.command} ${cmd.example}` : cmd.command)}
                  onKeyDown={e => handleSuggestionKeyDown(e, index + aiSuggestions.length)}
                  className="px-3 py-2 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors flex items-center gap-1"
                  disabled={isTyping}
                >
                  <span className="font-semibold">{cmd.display}</span>
                  {cmd.example && <span className="text-blue-500 text-xs">({cmd.example})</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-6 border-t border-gray-100 flex flex-col gap-2">
            <div className="mb-2 text-xs text-gray-500">
              <span className="font-semibold">{t(language, 'tryCommands')}</span> <span className="font-mono">/recipe</span>, <span className="font-mono">/summary</span>, <span className="font-mono">/fact</span>, <span className="font-mono">/motivate</span>, <span className="font-mono">/remember</span>, <span className="font-mono">/preferences</span>
            </div>
            <div className="flex space-x-4">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me about nutrition, mood, recipes, or use /recipe, /summary, /fact, /motivate..."
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isTyping ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={handleClearChat}
                className="px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
                disabled={isTyping}
                title={t(language, 'clear')}
              >
                {t(language, 'clear')}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveTab('mood')}
            className="p-4 bg-pink-100 hover:bg-pink-200 rounded-xl transition-colors flex items-center space-x-3"
          >
            <Heart className="w-5 h-5 text-pink-600" />
            <span className="text-pink-800 font-medium">Track Your Mood</span>
            <ArrowRight className="w-4 h-4 text-pink-600" />
          </button>
          <button
            onClick={() => setActiveTab('food')}
            className="p-4 bg-green-100 hover:bg-green-200 rounded-xl transition-colors flex items-center space-x-3"
          >
            <Utensils className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">Log Your Food</span>
            <ArrowRight className="w-4 h-4 text-green-600" />
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className="p-4 bg-blue-100 hover:bg-blue-200 rounded-xl transition-colors flex items-center space-x-3"
          >
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span className="text-blue-800 font-medium">View Analytics</span>
            <ArrowRight className="w-4 h-4 text-blue-600" />
          </button>
        </div>
      </div>
    </div>
  );
}