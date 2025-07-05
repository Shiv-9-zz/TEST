import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Plus, Camera, ArrowRight, Bot, Users } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface SocialProps {
  setActiveTab: (tab: string) => void;
}

export function Social({ setActiveTab }: SocialProps) {
  const { user, addFoodEntry } = useApp();
  const [newPost, setNewPost] = useState('');
  const [speakingPostId, setSpeakingPostId] = useState<number | null>(null);

  const posts = [
    {
      id: 1,
      user: {
        name: 'Emma Johnson',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
        mood: '😊'
      },
      time: '2 hours ago',
      content: 'Just made this amazing quinoa bowl and feeling so energized! 🌱 The combination of roasted vegetables and tahini dressing is perfect.',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=500',
      likes: 24,
      comments: 8,
      moodBoost: '+2 energy',
    },
    {
      id: 2,
      user: {
        name: 'Marcus Chen',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
        mood: '🤗'
      },
      time: '4 hours ago',
      content: 'Comfort food day with homemade lentil soup. Sometimes you just need something warm and hearty. Perfect for this rainy afternoon! ☔',
      image: 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=500',
      likes: 18,
      comments: 5,
      moodBoost: '+3 comfort',
    },
    {
      id: 3,
      user: {
        name: 'Sarah Williams',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
        mood: '⚡'
      },
      time: '6 hours ago',
      content: 'Morning green smoothie bowl to start the day right! Packed with spinach, banana, and topped with fresh berries. Feeling amazing! 💚',
      image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=500',
      likes: 31,
      comments: 12,
      moodBoost: '+4 energy',
    },
    {
      id: 4,
      user: {
        name: 'David Rodriguez',
        avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=100',
        mood: '🧘'
      },
      time: '1 day ago',
      content: 'Evening wind-down with chamomile tea and dark chocolate. Simple pleasures that help me relax after a busy day. 🍃',
      likes: 15,
      comments: 3,
      moodBoost: '+2 calm',
    },
  ];

  const handleCreatePost = () => {
    if (newPost.trim()) {
      alert('Post shared with the community! 🎉');
      setNewPost('');
    }
  };

  const handleTryRecipe = (postContent: string) => {
    // Extract food name from post content (simplified)
    const foodName = postContent.includes('quinoa') ? 'Quinoa Bowl' :
                    postContent.includes('soup') ? 'Lentil Soup' :
                    postContent.includes('smoothie') ? 'Green Smoothie' :
                    'Healthy Recipe';
    
    addFoodEntry({
      name: foodName,
      calories: 350,
      mealType: 'lunch',
      mood: '😊'
    });
    
    alert(`${foodName} added to your food log! 🍽️`);
  };

  const handleSpeak = (postId: number, text: string) => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setSpeakingPostId(null);
      return;
    }
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.onend = () => setSpeakingPostId(null);
    utter.onerror = () => setSpeakingPostId(null);
    setSpeakingPostId(postId);
    window.speechSynthesis.speak(utter);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Feed</h1>
        <p className="text-gray-600">Share your mood-boosting meals and connect with others on their wellness journey.</p>
      </div>

      {/* Community Stats */}
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 mb-8 border border-purple-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-purple-600" />
            <div>
              <h3 className="text-lg font-bold text-purple-800">Join 10,000+ Members</h3>
              <p className="text-purple-700">Share recipes, get support, and inspire others</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-600">2.5K</div>
              <div className="text-xs text-purple-700">Recipes Shared</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">15K</div>
              <div className="text-xs text-purple-700">Mood Boosts</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">8.2</div>
              <div className="text-xs text-purple-700">Avg Happiness</div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Post */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex items-start space-x-4">
          <img 
            src={user?.avatar || "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=60"} 
            alt="Your avatar"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share your mood-boosting meal or wellness tip..."
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={3}
            />
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                  <Camera className="w-4 h-4" />
                  <span className="text-sm">Photo</span>
                </button>
                <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                  <span className="text-lg">😊</span>
                  <span className="text-sm">Mood</span>
                </button>
              </div>
              <button 
                onClick={handleCreatePost}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium py-2 px-6 rounded-xl hover:shadow-md transition-all duration-200 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Post Header */}
            <div className="p-6 pb-4">
              <div className="flex items-center space-x-3">
                <img 
                  src={post.user.avatar} 
                  alt={post.user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900">{post.user.name}</h3>
                    <span className="text-lg">{post.user.mood}</span>
                  </div>
                  <p className="text-gray-500 text-sm">{post.time}</p>
                </div>
                <div className="px-3 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-full">
                  {post.moodBoost}
                </div>
              </div>
            </div>

            {/* Post Content */}
            <div className="px-6 pb-4 flex items-center gap-2">
              <p className="text-gray-800 flex-1">{post.content}</p>
              <button
                onClick={() => handleSpeak(post.id, post.content)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700 flex items-center space-x-1 ${speakingPostId === post.id ? 'opacity-60 cursor-not-allowed' : ''}`}
                disabled={speakingPostId === post.id}
                aria-label={speakingPostId === post.id ? 'Stop' : 'Listen'}
                title={speakingPostId === post.id ? 'Stop' : 'Listen'}
              >
                {speakingPostId === post.id ? (
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                )}
                <span>{speakingPostId === post.id ? 'Stop' : 'Listen'}</span>
              </button>
            </div>

            {/* Post Image */}
            {post.image && (
              <div className="px-6 pb-4">
                <img 
                  src={post.image} 
                  alt="Post content"
                  className="w-full h-64 object-cover rounded-xl"
                />
              </div>
            )}

            {/* Post Actions */}
            <div className="px-6 py-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors">
                    <Heart className="w-5 h-5" />
                    <span className="text-sm font-medium">{post.likes}</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">{post.comments}</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors">
                    <Share2 className="w-5 h-5" />
                    <span className="text-sm font-medium">Share</span>
                  </button>
                </div>
                <button
                  onClick={() => handleTryRecipe(post.content)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  Try Recipe
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Links */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setActiveTab('recipes')}
          className="p-4 bg-green-100 hover:bg-green-200 rounded-xl transition-colors flex items-center space-x-3"
        >
          <span className="text-2xl">📖</span>
          <span className="text-green-800 font-medium">Find Recipes</span>
          <ArrowRight className="w-4 h-4 text-green-600" />
        </button>
        <button
          onClick={() => setActiveTab('food')}
          className="p-4 bg-orange-100 hover:bg-orange-200 rounded-xl transition-colors flex items-center space-x-3"
        >
          <span className="text-2xl">🍽️</span>
          <span className="text-orange-800 font-medium">Log Your Meals</span>
          <ArrowRight className="w-4 h-4 text-orange-600" />
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className="p-4 bg-purple-100 hover:bg-purple-200 rounded-xl transition-colors flex items-center space-x-3"
        >
          <Bot className="w-5 h-5 text-purple-600" />
          <span className="text-purple-800 font-medium">Ask AI Coach</span>
          <ArrowRight className="w-4 h-4 text-purple-600" />
        </button>
      </div>
    </div>
  );
}