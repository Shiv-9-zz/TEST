interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  duration_ms: number;
  preview_url: string | null;
  external_urls: {
    spotify: string;
  };
}

interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  tracks: {
    items: {
      track: SpotifyTrack;
    }[];
  };
}

interface SpotifySearchResponse {
  tracks: {
    items: SpotifyTrack[];
  };
  playlists: {
    items: SpotifyPlaylist[];
  };
}

class SpotifyService {
  private clientId: string;
  private clientSecret: string;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor() {
    this.clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID || '';
    this.clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET || '';
    
    if (!this.clientId || !this.clientSecret) {
      console.warn('Spotify API credentials not found. Please add VITE_SPOTIFY_CLIENT_ID and VITE_SPOTIFY_CLIENT_SECRET to your environment variables.');
    }
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    if (!this.clientId || !this.clientSecret) {
      throw new Error('Spotify API credentials not configured');
    }

    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${this.clientId}:${this.clientSecret}`)}`,
        },
        body: 'grant_type=client_credentials',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Spotify token error response:', errorText);
        throw new Error(`Spotify token error: ${response.status}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // Refresh 1 minute early
      
      return this.accessToken;
    } catch (error) {
      console.error('Spotify authentication error:', error);
      throw error;
    }
  }

  async searchMoodBasedMusic(mood: string, limit: number = 10): Promise<SpotifyTrack[]> {
    try {
      const token = await this.getAccessToken();
      
      // Map moods to Spotify search queries
      const moodQueries: Record<string, string> = {
        happy: 'happy upbeat pop',
        sad: 'sad melancholy indie',
        energetic: 'energetic workout electronic',
        calm: 'calm relaxing ambient',
        comfort: 'comfort folk acoustic',
        focused: 'focus instrumental ambient',
        cooking: 'cooking jazz lounge',
        workout: 'workout electronic rock'
      };

      const query = moodQueries[mood.toLowerCase()] || `${mood} music`;
      
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}&market=US`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Spotify search error response:', errorText);
        throw new Error(`Spotify search error: ${response.status}`);
      }

      const data: SpotifySearchResponse = await response.json();
      return data.tracks.items || [];
    } catch (error) {
      console.error('Spotify search error:', error);
      return this.getFallbackTracks(mood);
    }
  }

  async getCookingPlaylists(): Promise<SpotifyPlaylist[]> {
    try {
      const token = await this.getAccessToken();
      
      const response = await fetch(
        'https://api.spotify.com/v1/search?q=cooking%20kitchen%20chef&type=playlist&limit=6&market=US',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Spotify playlist error response:', errorText);
        throw new Error(`Spotify playlist error: ${response.status}`);
      }

      const data: SpotifySearchResponse = await response.json();
      return data.playlists.items || [];
    } catch (error) {
      console.error('Spotify playlist error:', error);
      return this.getFallbackPlaylists();
    }
  }

  formatDuration(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  private getFallbackTracks(mood: string): SpotifyTrack[] {
    const fallbackTracks: Record<string, SpotifyTrack[]> = {
      happy: [
        {
          id: 'fallback1',
          name: 'Happy Cooking Vibes',
          artists: [{ name: 'Kitchen Beats' }],
          duration_ms: 204000,
          preview_url: null,
          external_urls: { spotify: 'https://open.spotify.com/track/example1' }
        },
        {
          id: 'fallback2',
          name: 'Upbeat Kitchen Tunes',
          artists: [{ name: 'Culinary Sounds' }],
          duration_ms: 189000,
          preview_url: null,
          external_urls: { spotify: 'https://open.spotify.com/track/example2' }
        }
      ],
      cooking: [
        {
          id: 'fallback3',
          name: 'Cooking Jazz',
          artists: [{ name: 'Kitchen Vibes' }],
          duration_ms: 204000,
          preview_url: null,
          external_urls: { spotify: 'https://open.spotify.com/track/example3' }
        },
        {
          id: 'fallback4',
          name: 'Chef\'s Choice',
          artists: [{ name: 'Foodie Beats' }],
          duration_ms: 178000,
          preview_url: null,
          external_urls: { spotify: 'https://open.spotify.com/track/example4' }
        },
        {
          id: 'fallback5',
          name: 'Kitchen Lounge',
          artists: [{ name: 'Culinary Jazz' }],
          duration_ms: 195000,
          preview_url: null,
          external_urls: { spotify: 'https://open.spotify.com/track/example5' }
        },
        {
          id: 'fallback6',
          name: 'Cooking Classics',
          artists: [{ name: 'Food Music Co.' }],
          duration_ms: 212000,
          preview_url: null,
          external_urls: { spotify: 'https://open.spotify.com/track/example6' }
        }
      ],
      calm: [
        {
          id: 'fallback7',
          name: 'Peaceful Kitchen',
          artists: [{ name: 'Zen Cooking' }],
          duration_ms: 234000,
          preview_url: null,
          external_urls: { spotify: 'https://open.spotify.com/track/example7' }
        },
        {
          id: 'fallback8',
          name: 'Mindful Cooking',
          artists: [{ name: 'Meditation Kitchen' }],
          duration_ms: 198000,
          preview_url: null,
          external_urls: { spotify: 'https://open.spotify.com/track/example8' }
        }
      ],
      energetic: [
        {
          id: 'fallback9',
          name: 'High Energy Kitchen',
          artists: [{ name: 'Power Cooking' }],
          duration_ms: 167000,
          preview_url: null,
          external_urls: { spotify: 'https://open.spotify.com/track/example9' }
        },
        {
          id: 'fallback10',
          name: 'Workout Cooking',
          artists: [{ name: 'Fitness Kitchen' }],
          duration_ms: 183000,
          preview_url: null,
          external_urls: { spotify: 'https://open.spotify.com/track/example10' }
        }
      ]
    };

    return fallbackTracks[mood.toLowerCase()] || fallbackTracks.cooking;
  }

  private getFallbackPlaylists(): SpotifyPlaylist[] {
    return [
      {
        id: 'fallback-playlist1',
        name: 'Cooking Vibes',
        description: 'Perfect music for cooking',
        tracks: { items: [] }
      },
      {
        id: 'fallback-playlist2',
        name: 'Kitchen Jazz',
        description: 'Smooth jazz for the kitchen',
        tracks: { items: [] }
      }
    ];
  }
}

export const spotifyService = new SpotifyService();