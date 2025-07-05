interface GeminiMessage {
  role: 'system' | 'user' | 'assistant' | 'model';
  content?: string;
  parts?: { text: string }[];
}

class GeminiService {
  private apiKey: string;
  private baseURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  private userPreferences: string[] = [];

  constructor() {
    this.apiKey = 'AIzaSyBgEFr6D59_8uUM8sjvTpVzeF_bysEJwV8';
    if (!this.apiKey) {
      console.warn('Gemini API key not found.');
    }
  }

  async generateResponse(messages: { role: string; content: string }[]): Promise<string> {
    if (!this.apiKey) {
      return this.getFallbackResponse(messages[messages.length - 1].content);
    }
    // Convert to Gemini format
    let geminiMessages: GeminiMessage[] = messages.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));
    // If first message is a system prompt, prepend as user message
    if (messages[0]?.role === 'system') {
      geminiMessages = [
        { role: 'user', parts: [{ text: messages[0].content }] },
        ...geminiMessages.slice(1)
      ];
    }
    try {
      const response = await fetch(`${this.baseURL}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: geminiMessages,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          },
        }),
      });
      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }
      const data = await response.json();
      // Gemini returns candidates[0].content.parts[0].text
      return (
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        'I apologize, but I could not generate a response right now. Please try again.'
      );
    } catch (error) {
      console.error('Gemini API error:', error);
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

  setUserPreferences(preferences: string[]) {
    this.userPreferences = preferences;
  }

  getUserPreferences(): string[] {
    return this.userPreferences;
  }

  async generateRecipe(ingredients: string[], dietary?: string): Promise<string> {
    const prompt = `Generate a creative, healthy recipe using these ingredients: ${ingredients.join(', ')}.
    ${dietary ? `Dietary restrictions: ${dietary}` : ''}
    Respond with a recipe name, ingredients, and step-by-step instructions.`;
    return this.generateResponse([{ role: 'user', content: prompt }]);
  }

  async generateSummary(moodEntries: any[], foodEntries: any[]): Promise<string> {
    const moodSummary = moodEntries.length > 0 ? `Mood entries: ${moodEntries.map(e => e.mood).join(', ')}` : 'No mood entries.';
    const foodSummary = foodEntries.length > 0 ? `Foods: ${foodEntries.map(e => e.name).join(', ')}` : 'No food entries.';
    const prompt = `Summarize my week:
    ${moodSummary}
    ${foodSummary}
    Give me a positive, actionable summary of my nutrition and mood trends.`;
    return this.generateResponse([{ role: 'user', content: prompt }]);
  }

  async getDailyFact(): Promise<string> {
    const prompt = 'Give me a fun, science-based nutrition fact. Keep it short and engaging.';
    return this.generateResponse([{ role: 'user', content: prompt }]);
  }

  async getMotivation(): Promise<string> {
    const prompt = 'Share a motivational quote or tip for healthy eating and mood.';
    return this.generateResponse([{ role: 'user', content: prompt }]);
  }

  async handleSpecialCommand(message: string, context: { moodEntries?: any[], foodEntries?: any[], preferences?: string[] }): Promise<string | null> {
    const lower = message.toLowerCase();
    if (lower.startsWith('/recipe')) {
      // /recipe tofu, broccoli, vegan
      const parts = message.split(' ');
      const ingredients = parts.slice(1).join(' ').split(',').map(s => s.trim()).filter(Boolean);
      const dietary = ingredients.find(i => ['vegan', 'vegetarian', 'gluten-free', 'keto', 'paleo'].includes(i));
      return this.generateRecipe(ingredients.filter(i => i !== dietary), dietary);
    }
    if (lower.startsWith('/summary')) {
      return this.generateSummary(context.moodEntries || [], context.foodEntries || []);
    }
    if (lower.startsWith('/fact')) {
      return this.getDailyFact();
    }
    if (lower.startsWith('/motivate')) {
      return this.getMotivation();
    }
    if (lower.startsWith('/remember')) {
      // /remember I am vegetarian
      const pref = message.replace('/remember', '').trim();
      if (pref) {
        this.userPreferences.push(pref);
        return Promise.resolve(`Got it! I'll remember: ${pref}`);
      }
      return Promise.resolve('Please specify what you want me to remember.');
    }
    if (lower.startsWith('/preferences')) {
      return Promise.resolve(`Your preferences: ${this.userPreferences.join(', ') || 'None saved.'}`);
    }
    return null;
  }
}

export const geminiService = new GeminiService();