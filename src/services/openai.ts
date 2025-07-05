interface GeminiMessage {
  role: 'system' | 'user' | 'assistant' | 'model';
  content?: string;
  parts?: { text: string }[];
}

class GeminiService {
  private apiKey: string;
  private baseURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  private userPreferences: string[] = [];
  private maxRetries = 2;

  constructor() {
    this.apiKey = 'AIzaSyBgEFr6D59_8uUM8sjvTpVzeF_bysEJwV8';
    if (!this.apiKey) {
      console.warn('Gemini API key not found.');
    }
    
    // Try to load preferences from localStorage if available
    try {
      const savedPrefs = localStorage.getItem('geminiUserPreferences');
      if (savedPrefs) {
        this.userPreferences = JSON.parse(savedPrefs);
      }
    } catch (e) {
      console.warn('Failed to load preferences from localStorage:', e);
    }
  }

  async generateResponse(messages: { role: string; content: string }[], retryCount = 0): Promise<string> {
    if (!this.apiKey) {
      console.warn('No Gemini API key available, using fallback response');
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
            maxOutputTokens: 1024, // Increased from 500 for more detailed responses
            topP: 0.95,
            topK: 40,
          },
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Gemini API error: ${response.status}`, errorText);
        
        // Retry on 429 (rate limit) or 5xx (server errors)
        if ((response.status === 429 || response.status >= 500) && retryCount < this.maxRetries) {
          console.log(`Retrying Gemini API request (${retryCount + 1}/${this.maxRetries})...`);
          // Exponential backoff: wait longer for each retry
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
          return this.generateResponse(messages, retryCount + 1);
        }
        
        // Specific error messages based on status code
        if (response.status === 400) {
          return "I encountered an error with your request. There might be an issue with the message format or content. Please try a different question.";
        } else if (response.status === 401 || response.status === 403) {
          return "I'm having trouble accessing the Gemini API. There might be an issue with the API key or permissions.";
        } else if (response.status === 429) {
          return "I've reached my usage limit for the Gemini API. Please try again in a few minutes.";
        } else {
          throw new Error(`Gemini API error: ${response.status} ${errorText}`);
        }
      }
      
      const data = await response.json();
      
      // Check for empty response
      if (!data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        console.warn('Empty response from Gemini API:', data);
        if (retryCount < this.maxRetries) {
          console.log(`Retrying due to empty response (${retryCount + 1}/${this.maxRetries})...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          return this.generateResponse(messages, retryCount + 1);
        }
        return "I received an empty response from the AI. This might be due to content filtering or an internal error. Please try rephrasing your question.";
      }
      
      // Format the response for better readability
      let responseText = data.candidates[0].content.parts[0].text.trim();
      
      return responseText;
    } catch (error) {
      console.error('Gemini API error:', error);
      
      // Retry on network errors
      if (retryCount < this.maxRetries && error instanceof Error && (
        error.message.includes('network') || 
        error.message.includes('timeout') || 
        error.message.includes('connection')
      )) {
        console.log(`Retrying due to network error (${retryCount + 1}/${this.maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
        return this.generateResponse(messages, retryCount + 1);
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
    
    // Include user preferences in the prompt
    const userPrefs = [...(preferences || []), ...this.userPreferences];
    
    const prompt = `Recommend mood-boosting foods for someone feeling ${moodLabel}.
    ${userPrefs.length > 0 ? `Dietary preferences: ${userPrefs.join(', ')}` : ''}
    
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
    
    // Save to localStorage if available
    try {
      localStorage.setItem('geminiUserPreferences', JSON.stringify(preferences));
    } catch (e) {
      console.warn('Failed to save preferences to localStorage:', e);
    }
  }

  getUserPreferences(): string[] {
    return this.userPreferences;
  }

  async generateRecipe(ingredients: string[], dietary?: string): Promise<string> {
    // Include user preferences in dietary restrictions
    const dietaryRestrictions = [
      ...(dietary ? [dietary] : []),
      ...this.userPreferences.filter(pref => 
        ['vegan', 'vegetarian', 'gluten-free', 'dairy-free', 'keto', 'paleo'].includes(pref.toLowerCase())
      )
    ];
    
    const prompt = `Generate a creative, healthy recipe using these ingredients: ${ingredients.join(', ')}.
    ${dietaryRestrictions.length > 0 ? `Dietary restrictions: ${dietaryRestrictions.join(', ')}` : ''}
    Respond with a recipe name, ingredients list with measurements, and step-by-step instructions.
    Format the recipe nicely with markdown headings and bullet points.`;
    
    return this.generateResponse([{ role: 'user', content: prompt }]);
  }

  async generateSummary(moodEntries: any[], foodEntries: any[]): Promise<string> {
    // More detailed analysis of mood and food data
    let moodData = 'No mood entries.';
    let foodData = 'No food entries.';
    
    if (moodEntries.length > 0) {
      const avgMood = moodEntries.reduce((sum, e) => sum + e.mood, 0) / moodEntries.length;
      const moodTrend = moodEntries.length > 1 ? 
        (moodEntries[moodEntries.length - 1].mood > moodEntries[0].mood ? 'improving' : 
         moodEntries[moodEntries.length - 1].mood < moodEntries[0].mood ? 'declining' : 'stable') : 'stable';
      
      moodData = `Average mood: ${avgMood.toFixed(1)}/7 (${moodTrend})
      Entries: ${moodEntries.map(e => e.mood).join(', ')}`;
    }
    
    if (foodEntries.length > 0) {
      const categories = foodEntries.reduce((cats, entry) => {
        const category = entry.category || 'Other';
        if (!cats[category]) cats[category] = [];
        cats[category].push(entry.name);
        return cats;
      }, {});
      
      foodData = Object.entries(categories)
        .map(([category, foods]) => `${category}: ${(foods as string[]).join(', ')}`)
        .join('\n');
    }
    
    const prompt = `Summarize my week based on this data:
    
    MOOD DATA:
    ${moodData}
    
    FOOD DATA:
    ${foodData}
    
    Give me a positive, actionable summary of my nutrition and mood trends. Include:
    1. Key observations about my mood patterns
    2. How my food choices might be affecting my mood
    3. Specific recommendations for improvement
    4. A motivational note for the coming week`;
    
    return this.generateResponse([{ role: 'user', content: prompt }]);
  }

  async getDailyFact(): Promise<string> {
    const prompt = 'Give me a fun, science-based nutrition fact that most people don\'t know. Keep it short, engaging, and cite the scientific basis.';
    return this.generateResponse([{ role: 'user', content: prompt }]);
  }

  async getMotivation(): Promise<string> {
    const prompt = 'Share an evidence-based motivational tip for healthy eating and mood improvement. Make it actionable and inspiring.';
    return this.generateResponse([{ role: 'user', content: prompt }]);
  }

  async handleSpecialCommand(message: string, context: { moodEntries?: any[], foodEntries?: any[], preferences?: string[] }): Promise<string | null> {
    const lower = message.toLowerCase();
    
    try {
      if (lower.startsWith('/recipe')) {
        // /recipe tofu, broccoli, vegan
        const parts = message.split(' ');
        const ingredients = parts.slice(1).join(' ').split(',').map(s => s.trim()).filter(Boolean);
        
        if (ingredients.length === 0) {
          return "Please specify ingredients for the recipe. For example: /recipe tofu, broccoli, ginger";
        }
        
        const dietary = ingredients.find(i => 
          ['vegan', 'vegetarian', 'gluten-free', 'keto', 'paleo', 'dairy-free'].includes(i.toLowerCase())
        );
        
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
          // Don't add duplicates
          if (!this.userPreferences.includes(pref)) {
            this.userPreferences.push(pref);
            this.setUserPreferences(this.userPreferences);
          }
          return Promise.resolve(`Got it! I'll remember: ${pref}`);
        }
        return Promise.resolve('Please specify what you want me to remember. For example: /remember I am vegetarian');
      }
      
      if (lower.startsWith('/preferences')) {
        if (this.userPreferences.length === 0) {
          return Promise.resolve("You haven't set any preferences yet. Use /remember to add preferences.");
        }
        return Promise.resolve(`Your preferences: ${this.userPreferences.join(', ')}`);
      }
      
      // If it starts with / but isn't a recognized command
      if (lower.startsWith('/')) {
        return Promise.resolve(`Unknown command. Available commands:\n/recipe - Generate a recipe\n/summary - Summarize your week\n/fact - Get a nutrition fact\n/motivate - Get motivation\n/remember - Save a preference\n/preferences - View your preferences`);
      }
      
      return null;
    } catch (error) {
      console.error('Error handling special command:', error);
      return Promise.resolve(`Sorry, there was an error processing your command. Please try again.`);
    }
  }
}

export const geminiService = new GeminiService();