'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Movie } from '../types/movie';
import { fetchTrendingMovies, fetchPopularMovies } from '../utils/api';
import MovieGrid from '../components/Movies/MovieGrid';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';

const HomeContainer = styled.div`
  min-height: calc(100vh - 80px);
  padding: 40px 0;
`;

const HeroSection = styled.section`
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, #1a1d29 0%, #2d3748 50%, #1a1d29 100%);
  margin-bottom: 40px;
`;

const HeroTitle = styled.h1`
  font-size: 48px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 16px;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 36px;
  }

  @media (max-width: 480px) {
    font-size: 28px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 20px;
  color: #cbd5e0;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 18px;
  }

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const Section = styled.section`
  margin-bottom: 60px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  margin-bottom: 30px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
`;

const SectionTitle = styled.h2`
  font-size: 32px;
  font-weight: bold;
  color: #ffffff;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const TabButton = styled.button<{ $isActive: boolean }>`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: ${(props) => (props.$isActive ? '#4299e1' : '#2d3748')};
  color: ${(props) => (props.$isActive ? '#ffffff' : '#cbd5e0')};

  &:hover {
    background-color: ${(props) => (props.$isActive ? '#3182ce' : '#4a5568')};
    color: #ffffff;
  }

  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 12px;
  }
`;

const LoadMoreButton = styled.button`
  display: block;
  margin: 40px auto;
  background-color: #4299e1;
  color: white;
  border: none;
  padding: 14px 32px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(66, 153, 225, 0.3);

  &:hover {
    background-color: #3182ce;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(66, 153, 225, 0.4);
  }

  &:disabled {
    background-color: #4a5568;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    opacity: 0.6;
  }

  @media (max-width: 768px) {
    padding: 12px 24px;
    font-size: 14px;
  }
`;

const LoadingMoreContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  gap: 12px;
`;

const LoadingMoreText = styled.span`
  color: #cbd5e0;
  font-size: 16px;
  font-weight: 500;
`;

const LoadingSpinnerSmall = styled.div`
  width: 24px;
  height: 24px;
  border: 2px solid #2d3748;
  border-top: 2px solid #4299e1;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

type TrendingTimeWindow = 'day' | 'week';

const HomePage: React.FC = () => {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [trendingTimeWindow, setTrendingTimeWindow] = useState<TrendingTimeWindow>('week');
  const [loading, setLoading] = useState(true);
  const [loadingMoreTrending, setLoadingMoreTrending] = useState(false);
  const [loadingMorePopular, setLoadingMorePopular] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination states
  const [trendingPage, setTrendingPage] = useState(1);
  const [popularPage, setPopularPage] = useState(1);
  const [hasMoreTrending, setHasMoreTrending] = useState(true);
  const [hasMorePopular, setHasMorePopular] = useState(true);

  const loadInitialMovies = async () => {
    try {
      setLoading(true);
      setError(null);

      const [trending, popular] = await Promise.all([
        fetchTrendingMovies(trendingTimeWindow, 1),
        fetchPopularMovies(1),
      ]);

      setTrendingMovies(trending);
      setPopularMovies(popular);
      setTrendingPage(1);
      setPopularPage(1);
      
      // Check if there are more pages (TMDB returns 20 items per page)
      setHasMoreTrending(trending.length === 20);
      setHasMorePopular(popular.length === 20);
    } catch (err) {
      setError('Failed to load movies. Please check your API key and try again.');
      console.error('Error loading movies:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreTrending = async () => {
    if (loadingMoreTrending || !hasMoreTrending) return;

    try {
      setLoadingMoreTrending(true);
      const nextPage = trendingPage + 1;
      const newMovies = await fetchTrendingMovies(trendingTimeWindow, nextPage);
      
      setTrendingMovies(prev => [...prev, ...newMovies]);
      setTrendingPage(nextPage);
      setHasMoreTrending(newMovies.length === 20);
    } catch (err) {
      console.error('Error loading more trending movies:', err);
      // Don't show error for "load more" failures, just log them
    } finally {
      setLoadingMoreTrending(false);
    }
  };

  const loadMorePopular = async () => {
    if (loadingMorePopular || !hasMorePopular) return;

    try {
      setLoadingMorePopular(true);
      const nextPage = popularPage + 1;
      const newMovies = await fetchPopularMovies(nextPage);
      
      setPopularMovies(prev => [...prev, ...newMovies]);
      setPopularPage(nextPage);
      setHasMorePopular(newMovies.length === 20);
    } catch (err) {
      console.error('Error loading more popular movies:', err);
      // Don't show error for "load more" failures, just log them
    } finally {
      setLoadingMorePopular(false);
    }
  };

  useEffect(() => {
    loadInitialMovies();
  }, [trendingTimeWindow]);

  if (loading) {
    return (
      <HomeContainer>
        <LoadingSpinner />
      </HomeContainer>
    );
  }

  if (error) {
    return (
      <HomeContainer>
        <ErrorMessage message={error} />
      </HomeContainer>
    );
  }

  return (
    <HomeContainer>
      <HeroSection>
        <HeroTitle>Discover Amazing Movies</HeroTitle>
        <HeroSubtitle>
          Explore trending films, discover new favorites, and dive deep into the world of cinema
        </HeroSubtitle>
      </HeroSection>

      <Section>
        <SectionHeader>
          <SectionTitle>Trending Movies</SectionTitle>
          <TabsContainer>
            <TabButton
              $isActive={trendingTimeWindow === 'day'}
              onClick={() => setTrendingTimeWindow('day')}
            >
              Today
            </TabButton>
            <TabButton
              $isActive={trendingTimeWindow === 'week'}
              onClick={() => setTrendingTimeWindow('week')}
            >
              This Week
            </TabButton>
          </TabsContainer>
        </SectionHeader>
        <MovieGrid movies={trendingMovies} />
        
        {/* Load More Button for Trending */}
        {hasMoreTrending && (
          <>
            {loadingMoreTrending ? (
              <LoadingMoreContainer>
                <LoadingSpinnerSmall />
                <LoadingMoreText>Loading more trending movies...</LoadingMoreText>
              </LoadingMoreContainer>
            ) : (
              <LoadMoreButton onClick={loadMoreTrending}>
                Load More Trending Movies
              </LoadMoreButton>
            )}
          </>
        )}
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>Popular Movies</SectionTitle>
        </SectionHeader>
        <MovieGrid movies={popularMovies} />
        
        {/* Load More Button for Popular */}
        {hasMorePopular && (
          <>
            {loadingMorePopular ? (
              <LoadingMoreContainer>
                <LoadingSpinnerSmall />
                <LoadingMoreText>Loading more popular movies...</LoadingMoreText>
              </LoadingMoreContainer>
            ) : (
              <LoadMoreButton onClick={loadMorePopular}>
                Load More Popular Movies
              </LoadMoreButton>
            )}
          </>
        )}
      </Section>
    </HomeContainer>
  );
};

export default HomePage;