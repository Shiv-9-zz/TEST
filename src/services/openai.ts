interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

class OpenAIService {
  private apiKey: string;
  private baseURL = 'https://api.openai.com/v1';

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    if (!this.apiKey) {
      console.warn('OpenAI API key not found. Please add VITE_OPENAI_API_KEY to your environment variables.');
    }
  }

  async generateResponse(messages: OpenAIMessage[]): Promise<string> {
    if (!this.apiKey) {
      return this.getFallbackResponse(messages[messages.length - 1].content);
    }

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a nutrition and mood expert AI assistant for MoodBites app. 
              You help users understand the connection between food and emotions. 
              Provide personalized, science-based advice about nutrition, mood-boosting foods, 
              and healthy eating habits. Keep responses conversational, encouraging, and practical.
              Use emojis appropriately and format responses with bullet points when listing items.`
            },
            ...messages
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          return "⏰ I'm currently experiencing high demand and need a moment to catch up. Please try again in a few seconds. In the meantime, I can still help with general nutrition advice using my built-in knowledge!";
        }
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data: OpenAIResponse = await response.json();
      return data.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response right now. Please try again.';
    } catch (error) {
      console.error('OpenAI API error:', error);
      if (error instanceof Error && error.message.includes('429')) {
        return "⏰ I'm currently experiencing high demand and need a moment to catch up. Please try again in a few seconds. In the meantime, I can still help with general nutrition advice using my built-in knowledge!";
      }
      return this.getFallbackResponse(messages[messages.length - 1].content);
    }
  }

  async analyzeMoodAndFood(mood: number, foods: string[], note?: string): Promise<string> {
    const moodLabels = ['very sad', 'sad', 'neutral', 'good', 'happy', 'very happy', 'excellent'];
    const moodLabel = moodLabels[mood - 1] || 'neutral';
    
    const prompt = `Analyze this mood and food data:
    - Current mood: ${moodLabel} (${mood}/7)
    - Foods consumed: ${foods.join(', ')}
    ${note ? `- Additional notes: ${note}` : ''}
    
    Provide insights about how these foods might affect mood and suggest improvements.`;

    return this.generateResponse([{ role: 'user', content: prompt }]);
  }

  async getFoodRecommendations(mood: number, preferences?: string[]): Promise<string> {
    const moodLabels = ['very sad', 'sad', 'neutral', 'good', 'happy', 'very happy', 'excellent'];
    const moodLabel = moodLabels[mood - 1] || 'neutral';
    
    const prompt = `Recommend mood-boosting foods for someone feeling ${moodLabel}.
    ${preferences ? `Dietary preferences: ${preferences.join(', ')}` : ''}
    
    Provide 5-7 specific food recommendations with brief explanations of how they help mood.`;

    return this.generateResponse([{ role: 'user', content: prompt }]);
  }

  private getFallbackResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('energy') || lowerMessage.includes('tired')) {
      return "🔋 For an energy boost, I recommend:\n\n• **Complex carbs**: Oatmeal with berries\n• **Protein**: Greek yogurt with nuts\n• **Iron-rich foods**: Spinach salad\n• **B-vitamins**: Whole grain toast\n\nThese foods provide sustained energy without crashes. Would you like a specific recipe?";
    }
    
    if (lowerMessage.includes('stress') || lowerMessage.includes('anxious')) {
      return "🧘 To help manage stress, try these calming foods:\n\n• **Magnesium-rich**: Dark chocolate, almonds\n• **Omega-3s**: Salmon, walnuts\n• **Herbal teas**: Chamomile, green tea\n• **Complex carbs**: Sweet potatoes\n\nThese nutrients support your nervous system and promote relaxation.";
    }
    
    if (lowerMessage.includes('happy') || lowerMessage.includes('mood')) {
      return "😊 Mood-boosting foods that increase serotonin:\n\n• **Tryptophan**: Turkey, eggs, cheese\n• **Folate**: Leafy greens, legumes\n• **Vitamin D**: Fatty fish, fortified foods\n• **Antioxidants**: Berries, dark chocolate\n\nThese help your brain produce feel-good chemicals naturally!";
    }
    
    return "I understand you're looking for nutrition and mood guidance. I can help with:\n\n🍽️ **Food recommendations** based on your mood\n📈 **Mood pattern analysis** from your data\n🥗 **Personalized recipes** for your goals\n🧠 **Nutritional insights** for mental wellness\n\nWhat specific area would you like to explore?";
  }
}

export const openAIService = new OpenAIService();