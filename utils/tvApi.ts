import axios from 'axios';
import { TVShow, TVShowDetails, TMDbResponse, Person } from '../types/tv';

const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY,
  },
});

export const getImageUrl = (path: string | null, size: string = 'w500'): string => {
  if (!path) return '/placeholder-movie.jpg';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const fetchPopularTVShows = async (page: number = 1): Promise<TVShow[]> => {
  try {
    if (!process.env.NEXT_PUBLIC_TMDB_API_KEY) {
      throw new Error('TMDb API key is not configured. Please add NEXT_PUBLIC_TMDB_API_KEY to your .env.local file.');
    }
    
    const response = await api.get<TMDbResponse<TVShow>>('/tv/popular', {
      params: {
        page,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching popular TV shows:', error);
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error('Invalid API key. Please check your TMDb API key configuration.');
    }
    throw new Error('Failed to fetch popular TV shows');
  }
};

export const fetchTrendingTVShows = async (
  timeWindow: 'day' | 'week' = 'week', 
  page: number = 1
): Promise<TVShow[]> => {
  try {
    if (!process.env.NEXT_PUBLIC_TMDB_API_KEY) {
      throw new Error('TMDb API key is not configured. Please add NEXT_PUBLIC_TMDB_API_KEY to your .env.local file.');
    }
    
    const response = await api.get<TMDbResponse<TVShow>>(`/trending/tv/${timeWindow}`, {
      params: { page }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching trending TV shows:', error);
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error('Invalid API key. Please check your TMDb API key configuration.');
    }
    throw new Error('Failed to fetch trending TV shows');
  }
};

export const fetchTopRatedTVShows = async (page: number = 1): Promise<TVShow[]> => {
  try {
    if (!process.env.NEXT_PUBLIC_TMDB_API_KEY) {
      throw new Error('TMDb API key is not configured. Please add NEXT_PUBLIC_TMDB_API_KEY to your .env.local file.');
    }
    
    const response = await api.get<TMDbResponse<TVShow>>('/tv/top_rated', {
      params: {
        page,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching top rated TV shows:', error);
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error('Invalid API key. Please check your TMDb API key configuration.');
    }
    throw new Error('Failed to fetch top rated TV shows');
  }
};

export const fetchTVShowDetails = async (tvId: string): Promise<TVShowDetails> => {
  try {
    if (!process.env.NEXT_PUBLIC_TMDB_API_KEY) {
      throw new Error('TMDb API key is not configured. Please add NEXT_PUBLIC_TMDB_API_KEY to your .env.local file.');
    }
    
    const response = await api.get<TVShowDetails>(`/tv/${tvId}`, {
      params: {
        append_to_response: 'credits',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching TV show details:', error);
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error('Invalid API key. Please check your TMDb API key configuration.');
    }
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error('TV show not found.');
    }
    throw new Error('Failed to fetch TV show details');
  }
};

export const fetchPersonDetails = async (personId: string): Promise<Person> => {
  try {
    if (!process.env.NEXT_PUBLIC_TMDB_API_KEY) {
      throw new Error('TMDb API key is not configured. Please add NEXT_PUBLIC_TMDB_API_KEY to your .env.local file.');
    }
    
    const response = await api.get<Person>(`/person/${personId}`, {
      params: {
        append_to_response: 'movie_credits,tv_credits,combined_credits',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching person details:', error);
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error('Invalid API key. Please check your TMDb API key configuration.');
    }
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error('Person not found.');
    }
    throw new Error('Failed to fetch person details');
  }
};

export const fetchPersonCombinedCredits = async (personId: string): Promise<any> => {
  try {
    if (!process.env.NEXT_PUBLIC_TMDB_API_KEY) {
      throw new Error('TMDb API key is not configured. Please add NEXT_PUBLIC_TMDB_API_KEY to your .env.local file.');
    }
    
    const response = await api.get(`/person/${personId}/combined_credits`);
    return response.data;
  } catch (error) {
    console.error('Error fetching person combined credits:', error);
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error('Invalid API key. Please check your TMDb API key configuration.');
    }
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error('Person credits not found.');
    }
    throw new Error('Failed to fetch person combined credits');
  }
};

export const searchTVShows = async (query: string, page: number = 1): Promise<TMDbResponse<TVShow>> => {
  try {
    if (!process.env.NEXT_PUBLIC_TMDB_API_KEY) {
      throw new Error('TMDb API key is not configured. Please add NEXT_PUBLIC_TMDB_API_KEY to your .env.local file.');
    }
    
    const response = await api.get<TMDbResponse<TVShow>>('/search/tv', {
      params: {
        query,
        page,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching TV shows:', error);
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error('Invalid API key. Please check your TMDb API key configuration.');
    }
    throw new Error('Failed to search TV shows');
  }
};