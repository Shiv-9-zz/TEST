interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  summary: string;
  instructions?: string;
  nutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  ingredients?: {
    name: string;
    amount: number;
    unit: string;
  }[];
}

interface SpoonacularResponse {
  results: Recipe[];
}

interface EdamamRecipe {
  recipe: {
    label: string;
    image: string;
    url: string;
    yield: number;
    calories: number;
    totalTime: number;
    ingredients: {
      text: string;
    }[];
    digest: {
      label: string;
      total: number;
      unit: string;
    }[];
  };
}

interface EdamamResponse {
  hits: EdamamRecipe[];
}

class RecipeService {
  private spoonacularKey: string;
  private edamamAppId: string;
  private edamamAppKey: string;

  constructor() {
    this.spoonacularKey = import.meta.env.VITE_SPOONACULAR_API_KEY || '';
    this.edamamAppId = import.meta.env.VITE_EDAMAM_APP_ID || '';
    this.edamamAppKey = import.meta.env.VITE_EDAMAM_APP_KEY || '';
    
    if (!this.spoonacularKey && (!this.edamamAppId || !this.edamamAppKey)) {
      console.warn('Recipe API credentials not found. Please add recipe API keys to your environment variables.');
    }
  }

  async searchRecipesByMood(mood: string, limit: number = 6): Promise<Recipe[]> {
    // Map moods to recipe search terms
    const moodToQuery: Record<string, string> = {
      happy: 'colorful,fresh,vibrant',
      sad: 'comfort,warm,hearty',
      energetic: 'protein,quinoa,energy',
      calm: 'tea,soup,gentle',
      comfort: 'pasta,soup,warm',
      healthy: 'salad,vegetables,nutritious'
    };

    const query = moodToQuery[mood.toLowerCase()] || 'healthy';
    
    try {
      if (this.spoonacularKey) {
        return await this.searchSpoonacular(query, limit);
      } else if (this.edamamAppId && this.edamamAppKey) {
        return await this.searchEdamam(query, limit);
      } else {
        return this.getFallbackRecipes(mood);
      }
    } catch (error) {
      console.error('Recipe search error:', error);
      return this.getFallbackRecipes(mood);
    }
  }

  private async searchSpoonacular(query: string, limit: number): Promise<Recipe[]> {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(query)}&number=${limit}&addRecipeInformation=true&addRecipeNutrition=true&apiKey=${this.spoonacularKey}`
    );

    if (!response.ok) {
      throw new Error(`Spoonacular API error: ${response.status}`);
    }

    const data: SpoonacularResponse = await response.json();
    return data.results.map(recipe => ({
      ...recipe,
      nutrition: recipe.nutrition ? {
        calories: Math.round(recipe.nutrition.calories || 0),
        protein: Math.round(recipe.nutrition.protein || 0),
        carbs: Math.round(recipe.nutrition.carbs || 0),
        fat: Math.round(recipe.nutrition.fat || 0)
      } : undefined
    }));
  }

  private async searchEdamam(query: string, limit: number): Promise<Recipe[]> {
    const response = await fetch(
      `https://api.edamam.com/search?q=${encodeURIComponent(query)}&app_id=${this.edamamAppId}&app_key=${this.edamamAppKey}&from=0&to=${limit}`
    );

    if (!response.ok) {
      throw new Error(`Edamam API error: ${response.status}`);
    }

    const data: EdamamResponse = await response.json();
    return data.hits.map((hit, index) => ({
      id: index,
      title: hit.recipe.label,
      image: hit.recipe.image,
      readyInMinutes: hit.recipe.totalTime || 30,
      servings: hit.recipe.yield,
      summary: `Delicious ${hit.recipe.label} recipe`,
      nutrition: {
        calories: Math.round(hit.recipe.calories / hit.recipe.yield),
        protein: Math.round(hit.recipe.digest.find(d => d.label === 'Protein')?.total || 0),
        carbs: Math.round(hit.recipe.digest.find(d => d.label === 'Carbs')?.total || 0),
        fat: Math.round(hit.recipe.digest.find(d => d.label === 'Fat')?.total || 0)
      },
      ingredients: hit.recipe.ingredients.map(ing => ({
        name: ing.text,
        amount: 1,
        unit: 'serving'
      }))
    }));
  }

  async getRecipesByNutrition(nutrition: 'high-protein' | 'low-carb' | 'high-fiber' | 'low-calorie', limit: number = 6): Promise<Recipe[]> {
    const nutritionQueries: Record<string, string> = {
      'high-protein': 'protein,chicken,fish,eggs',
      'low-carb': 'keto,low carb,vegetables',
      'high-fiber': 'fiber,beans,vegetables,whole grains',
      'low-calorie': 'light,salad,vegetables,lean'
    };

    const query = nutritionQueries[nutrition];
    return this.searchRecipesByMood(query, limit);
  }

  async getRecipeDetails(id: number): Promise<Recipe | null> {
    if (!this.spoonacularKey) {
      return null;
    }

    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=true&apiKey=${this.spoonacularKey}`
      );

      if (!response.ok) {
        throw new Error(`Spoonacular API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Recipe details error:', error);
      return null;
    }
  }

  private getFallbackRecipes(mood: string): Recipe[] {
    const fallbackRecipes: Record<string, Recipe[]> = {
      happy: [
        {
          id: 1,
          title: 'Rainbow Buddha Bowl',
          image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
          readyInMinutes: 25,
          servings: 2,
          summary: 'Colorful and nutritious bowl packed with quinoa, roasted vegetables, and tahini dressing.',
          nutrition: { calories: 420, protein: 15, carbs: 65, fat: 12 }
        },
        {
          id: 2,
          title: 'Tropical Smoothie Bowl',
          image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=400',
          readyInMinutes: 10,
          servings: 1,
          summary: 'Refreshing tropical smoothie bowl with mango, pineapple, and coconut.',
          nutrition: { calories: 280, protein: 8, carbs: 45, fat: 6 }
        }
      ],
      comfort: [
        {
          id: 3,
          title: 'Creamy Tomato Soup',
          image: 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=400',
          readyInMinutes: 30,
          servings: 4,
          summary: 'Rich and creamy tomato soup perfect for a cozy meal.',
          nutrition: { calories: 180, protein: 6, carbs: 25, fat: 8 }
        }
      ],
      energetic: [
        {
          id: 4,
          title: 'Protein Power Bowl',
          image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
          readyInMinutes: 20,
          servings: 1,
          summary: 'High-protein bowl with quinoa, chicken, and vegetables.',
          nutrition: { calories: 450, protein: 35, carbs: 40, fat: 15 }
        }
      ]
    };

    return fallbackRecipes[mood.toLowerCase()] || fallbackRecipes.happy;
  }
}

export const recipeService = new RecipeService();