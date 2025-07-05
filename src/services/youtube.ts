interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  duration: string;
  viewCount: string;
  url: string;
}

interface YouTubeSearchResponse {
  items: {
    id: {
      videoId: string;
    };
    snippet: {
      title: string;
      description: string;
      thumbnails: {
        medium: {
          url: string;
        };
        high: {
          url: string;
        };
      };
      channelTitle: string;
      publishedAt: string;
    };
  }[];
}

interface YouTubeVideoDetailsResponse {
  items: {
    id: string;
    contentDetails: {
      duration: string;
    };
    statistics: {
      viewCount: string;
    };
  }[];
}

class YouTubeService {
  private apiKey: string;
  private baseURL = 'https://www.googleapis.com/youtube/v3';

  constructor() {
    this.apiKey = import.meta.env.VITE_YOUTUBE_API_KEY || '';
    if (!this.apiKey) {
      console.warn('YouTube API key not found. Please add VITE_YOUTUBE_API_KEY to your environment variables.');
    }
  }

  async searchRecipeVideos(recipeName: string, limit: number = 6): Promise<YouTubeVideo[]> {
    if (!this.apiKey) {
      return this.getFallbackVideos(recipeName);
    }

    try {
      // Search for recipe videos - removed videoDefinition parameter that was causing 400 error
      const searchQuery = `${recipeName} recipe cooking tutorial`;
      const searchResponse = await fetch(
        `${this.baseURL}/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=video&maxResults=${limit}&key=${this.apiKey}&videoDuration=medium&order=relevance`
      );

      if (!searchResponse.ok) {
        throw new Error(`YouTube search error: ${searchResponse.status}`);
      }

      const searchData: YouTubeSearchResponse = await searchResponse.json();
      
      if (!searchData.items || searchData.items.length === 0) {
        return this.getFallbackVideos(recipeName);
      }

      // Get video details for duration and view count
      const videoIds = searchData.items.map(item => item.id.videoId).join(',');
      const detailsResponse = await fetch(
        `${this.baseURL}/videos?part=contentDetails,statistics&id=${videoIds}&key=${this.apiKey}`
      );

      let videoDetails: YouTubeVideoDetailsResponse | null = null;
      if (detailsResponse.ok) {
        videoDetails = await detailsResponse.json();
      }

      return searchData.items.map((item, index) => {
        const details = videoDetails?.items.find(detail => detail.id === item.id.videoId);
        
        return {
          id: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium.url,
          channelTitle: item.snippet.channelTitle,
          publishedAt: item.snippet.publishedAt,
          duration: details ? this.formatDuration(details.contentDetails.duration) : 'N/A',
          viewCount: details ? this.formatViewCount(details.statistics.viewCount) : 'N/A',
          url: `https://www.youtube.com/watch?v=${item.id.videoId}`
        };
      });
    } catch (error) {
      console.error('YouTube API error:', error);
      return this.getFallbackVideos(recipeName);
    }
  }

  async searchMoodCookingVideos(mood: string, limit: number = 4): Promise<YouTubeVideo[]> {
    const moodQueries: Record<string, string> = {
      happy: 'colorful healthy recipes cooking',
      sad: 'comfort food recipes cooking',
      energetic: 'quick energy recipes cooking',
      calm: 'relaxing cooking meditation',
      comfort: 'comfort food cooking recipes',
      healthy: 'healthy cooking recipes nutrition'
    };

    const query = moodQueries[mood.toLowerCase()] || 'healthy cooking recipes';
    return this.searchRecipeVideos(query, limit);
  }

  async getCookingChannels(): Promise<YouTubeVideo[]> {
    if (!this.apiKey) {
      return this.getFallbackChannelVideos();
    }

    try {
      const searchResponse = await fetch(
        `${this.baseURL}/search?part=snippet&q=cooking channel recipes&type=video&maxResults=8&key=${this.apiKey}&order=relevance&videoDuration=medium`
      );

      if (!searchResponse.ok) {
        throw new Error(`YouTube search error: ${searchResponse.status}`);
      }

      const searchData: YouTubeSearchResponse = await searchResponse.json();
      
      return searchData.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        duration: 'N/A',
        viewCount: 'N/A',
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`
      }));
    } catch (error) {
      console.error('YouTube API error:', error);
      return this.getFallbackChannelVideos();
    }
  }

  private formatDuration(duration: string): string {
    // Convert ISO 8601 duration (PT4M13S) to readable format (4:13)
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 'N/A';

    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  private formatViewCount(viewCount: string): string {
    const count = parseInt(viewCount);
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M views`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K views`;
    }
    return `${count} views`;
  }

  private getFallbackVideos(recipeName: string): YouTubeVideo[] {
    return [
      {
        id: 'fallback1',
        title: `How to Make ${recipeName} - Easy Recipe`,
        description: `Learn how to make delicious ${recipeName} with this step-by-step tutorial.`,
        thumbnail: 'https://images.pexels.com/photos/4253302/pexels-photo-4253302.jpeg?auto=compress&cs=tinysrgb&w=400',
        channelTitle: 'Cooking Channel',
        publishedAt: new Date().toISOString(),
        duration: '8:45',
        viewCount: '125K views',
        url: '#'
      },
      {
        id: 'fallback2',
        title: `${recipeName} Recipe - Professional Chef`,
        description: `Professional chef shows you the secrets to perfect ${recipeName}.`,
        thumbnail: 'https://images.pexels.com/photos/4252137/pexels-photo-4252137.jpeg?auto=compress&cs=tinysrgb&w=400',
        channelTitle: 'Chef Academy',
        publishedAt: new Date().toISOString(),
        duration: '12:30',
        viewCount: '89K views',
        url: '#'
      }
    ];
  }

  private getFallbackChannelVideos(): YouTubeVideo[] {
    return [
      {
        id: 'channel1',
        title: 'Top 10 Healthy Breakfast Ideas',
        description: 'Start your day right with these nutritious breakfast recipes.',
        thumbnail: 'https://images.pexels.com/photos/704555/pexels-photo-704555.jpeg?auto=compress&cs=tinysrgb&w=400',
        channelTitle: 'Healthy Kitchen',
        publishedAt: new Date().toISOString(),
        duration: '15:22',
        viewCount: '245K views',
        url: '#'
      },
      {
        id: 'channel2',
        title: '5-Minute Dinner Recipes',
        description: 'Quick and easy dinner recipes for busy weeknights.',
        thumbnail: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
        channelTitle: 'Quick Meals',
        publishedAt: new Date().toISOString(),
        duration: '10:15',
        viewCount: '156K views',
        url: '#'
      }
    ];
  }
}

export const youtubeService = new YouTubeService();