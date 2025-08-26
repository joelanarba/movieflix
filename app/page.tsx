
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { Movie } from '../types/movie';
import { TVShow } from '../types/tv';
import { fetchTrendingMovies, fetchPopularMovies } from '../utils/api';
import { fetchPopularTVShows, fetchTrendingTVShows } from '../utils/tvApi';
import MovieGrid from '../components/Movies/MovieGrid';
import TVGrid from '../components/TV/TVGrid';
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

const SectionTitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const SectionTitle = styled.h2`
  font-size: 32px;
  font-weight: bold;
  color: #ffffff;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const ViewAllLink = styled(Link)`
  color: #4299e1;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid #4299e1;
  transition: all 0.3s ease;

  &:hover {
    background-color: #4299e1;
    color: #ffffff;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    padding: 6px 12px;
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

const ContentTypeToggle = styled.div`
  display: flex;
  gap: 4px;
  background-color: #2d3748;
  padding: 4px;
  border-radius: 8px;
`;

const ContentTypeButton = styled.button<{ $isActive: boolean }>`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: ${(props) => (props.$isActive ? '#4299e1' : 'transparent')};
  color: ${(props) => (props.$isActive ? '#ffffff' : '#cbd5e0')};

  &:hover {
    background-color: ${(props) => (props.$isActive ? '#3182ce' : 'rgba(66, 153, 225, 0.1)')};
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
type ContentType = 'movie' | 'tv';

const HomePage: React.FC = () => {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [trendingTVShows, setTrendingTVShows] = useState<TVShow[]>([]);
  const [popularTVShows, setPopularTVShows] = useState<TVShow[]>([]);
  
  const [trendingTimeWindow, setTrendingTimeWindow] = useState<TrendingTimeWindow>('week');
  const [trendingContentType, setTrendingContentType] = useState<ContentType>('movie');
  
  const [loading, setLoading] = useState(true);
  const [loadingMoreTrending, setLoadingMoreTrending] = useState(false);
  const [loadingMorePopular, setLoadingMorePopular] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination states
  const [trendingPage, setTrendingPage] = useState(1);
  const [popularPage, setPopularPage] = useState(1);
  const [hasMoreTrending, setHasMoreTrending] = useState(true);
  const [hasMorePopular, setHasMorePopular] = useState(true);

  const loadInitialContent = async () => {
    try {
      setLoading(true);
      setError(null);

      const [trendingMoviesData, popularMoviesData, trendingTVData, popularTVData] = await Promise.all([
        fetchTrendingMovies(trendingTimeWindow, 1),
        fetchPopularMovies(1),
        fetchTrendingTVShows(trendingTimeWindow, 1),
        fetchPopularTVShows(1),
      ]);

      setTrendingMovies(trendingMoviesData);
      setPopularMovies(popularMoviesData);
      setTrendingTVShows(trendingTVData);
      setPopularTVShows(popularTVData);
      
      setTrendingPage(1);
      setPopularPage(1);
      
      // Check if there are more pages
      setHasMoreTrending(trendingMoviesData.length === 20 || trendingTVData.length === 20);
      setHasMorePopular(popularMoviesData.length === 20 || popularTVData.length === 20);
    } catch (err) {
      setError('Failed to load content. Please check your API key and try again.');
      console.error('Error loading content:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreTrending = async () => {
    if (loadingMoreTrending || !hasMoreTrending) return;

    try {
      setLoadingMoreTrending(true);
      const nextPage = trendingPage + 1;
      
      if (trendingContentType === 'movie') {
        const newMovies = await fetchTrendingMovies(trendingTimeWindow, nextPage);
        setTrendingMovies(prev => [...prev, ...newMovies]);
        setHasMoreTrending(newMovies.length === 20);
      } else {
        const newTVShows = await fetchTrendingTVShows(trendingTimeWindow, nextPage);
        setTrendingTVShows(prev => [...prev, ...newTVShows]);
        setHasMoreTrending(newTVShows.length === 20);
      }
      
      setTrendingPage(nextPage);
    } catch (err) {
      console.error('Error loading more trending content:', err);
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
    } finally {
      setLoadingMorePopular(false);
    }
  };

  useEffect(() => {
    loadInitialContent();
  }, [trendingTimeWindow]);

  const handleTrendingTimeWindowChange = (timeWindow: TrendingTimeWindow) => {
    setTrendingTimeWindow(timeWindow);
    setTrendingPage(1);
    setHasMoreTrending(true);
  };

  const handleTrendingContentTypeChange = (contentType: ContentType) => {
    setTrendingContentType(contentType);
  };

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
        <HeroTitle>Discover Amazing Movies & TV Shows</HeroTitle>
        <HeroSubtitle>
          Explore trending films, discover new favorites, and dive deep into the world of cinema and television
        </HeroSubtitle>
      </HeroSection>

      <Section>
        <SectionHeader>
          <SectionTitleContainer>
            <SectionTitle>Trending</SectionTitle>
            <ContentTypeToggle>
              <ContentTypeButton
                $isActive={trendingContentType === 'movie'}
                onClick={() => handleTrendingContentTypeChange('movie')}
              >
                Movies
              </ContentTypeButton>
              <ContentTypeButton
                $isActive={trendingContentType === 'tv'}
                onClick={() => handleTrendingContentTypeChange('tv')}
              >
                TV Shows
              </ContentTypeButton>
            </ContentTypeToggle>
          </SectionTitleContainer>
          <TabsContainer>
            <TabButton
              $isActive={trendingTimeWindow === 'day'}
              onClick={() => handleTrendingTimeWindowChange('day')}
            >
              Today
            </TabButton>
            <TabButton
              $isActive={trendingTimeWindow === 'week'}
              onClick={() => handleTrendingTimeWindowChange('week')}
            >
              This Week
            </TabButton>
          </TabsContainer>
        </SectionHeader>
        
        {trendingContentType === 'movie' ? (
          <MovieGrid movies={trendingMovies} />
        ) : (
          <TVGrid tvShows={trendingTVShows} />
        )}
        
        {hasMoreTrending && (
          <>
            {loadingMoreTrending ? (
              <LoadingMoreContainer>
                <LoadingSpinnerSmall />
                <LoadingMoreText>Loading more trending {trendingContentType === 'movie' ? 'movies' : 'TV shows'}...</LoadingMoreText>
              </LoadingMoreContainer>
            ) : (
              <LoadMoreButton onClick={loadMoreTrending}>
                Load More Trending {trendingContentType === 'movie' ? 'Movies' : 'TV Shows'}
              </LoadMoreButton>
            )}
          </>
        )}
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitleContainer>
            <SectionTitle>Popular Movies</SectionTitle>
            <ViewAllLink href="/popular">View All</ViewAllLink>
          </SectionTitleContainer>
        </SectionHeader>
        <MovieGrid movies={popularMovies.slice(0, 10)} />
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitleContainer>
            <SectionTitle>Popular TV Shows</SectionTitle>
            <ViewAllLink href="/tv">View All</ViewAllLink>
          </SectionTitleContainer>
        </SectionHeader>
        <TVGrid tvShows={popularTVShows.slice(0, 10)} />
      </Section>
    </HomeContainer>
  );
};

export default HomePage;