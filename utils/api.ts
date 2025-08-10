import axios from 'axios';
import { Movie, MovieDetails, TMDbResponse } from '../types/movie';

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

export const fetchTrendingMovies = async (timeWindow: 'day' | 'week' = 'week'): Promise<Movie[]> => {
  try {
    if (!process.env.NEXT_PUBLIC_TMDB_API_KEY) {
      throw new Error('TMDb API key is not configured. Please add NEXT_PUBLIC_TMDB_API_KEY to your .env.local file.');
    }
    
    const response = await api.get<TMDbResponse<Movie>>(`/trending/movie/${timeWindow}`);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error('Invalid API key. Please check your TMDb API key configuration.');
    }
    throw new Error('Failed to fetch trending movies');
  }
};

export const fetchMovieDetails = async (movieId: string): Promise<MovieDetails> => {
  try {
    if (!process.env.NEXT_PUBLIC_TMDB_API_KEY) {
      throw new Error('TMDb API key is not configured. Please add NEXT_PUBLIC_TMDB_API_KEY to your .env.local file.');
    }
    
    const response = await api.get<MovieDetails>(`/movie/${movieId}`, {
      params: {
        append_to_response: 'credits',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error('Invalid API key. Please check your TMDb API key configuration.');
    }
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error('Movie not found.');
    }
    throw new Error('Failed to fetch movie details');
  }
};

export const searchMovies = async (query: string, page: number = 1): Promise<TMDbResponse<Movie>> => {
  try {
    if (!process.env.NEXT_PUBLIC_TMDB_API_KEY) {
      throw new Error('TMDb API key is not configured. Please add NEXT_PUBLIC_TMDB_API_KEY to your .env.local file.');
    }
    
    const response = await api.get<TMDbResponse<Movie>>('/search/movie', {
      params: {
        query,
        page,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching movies:', error);
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error('Invalid API key. Please check your TMDb API key configuration.');
    }
    throw new Error('Failed to search movies');
  }
};

export const fetchPopularMovies = async (page: number = 1): Promise<Movie[]> => {
  try {
    if (!process.env.NEXT_PUBLIC_TMDB_API_KEY) {
      throw new Error('TMDb API key is not configured. Please add NEXT_PUBLIC_TMDB_API_KEY to your .env.local file.');
    }
    
    const response = await api.get<TMDbResponse<Movie>>('/movie/popular', {
      params: {
        page,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error('Invalid API key. Please check your TMDb API key configuration.');
    }
    throw new Error('Failed to fetch popular movies');
  }
};

export const fetchRecommendations = async (movieId: string): Promise<Movie[]> => {
  try {
    if (!process.env.NEXT_PUBLIC_TMDB_API_KEY) {
      throw new Error('TMDb API key is not configured. Please add NEXT_PUBLIC_TMDB_API_KEY to your .env.local file.');
    }
    
    const response = await api.get<TMDbResponse<Movie>>(`/movie/${movieId}/recommendations`);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error('Invalid API key. Please check your TMDb API key configuration.');
    }
    throw new Error('Failed to fetch recommendations');
  }
};