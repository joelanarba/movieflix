'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Movie } from '../../types/movie';
import { 
  fetchPopularMovies, 
  fetchTrendingMovies, 
  fetchTopRatedMovies, 
  fetchUpcomingMovies 
} from '../../utils/api';
import MovieGrid from '../../components/Movies/MovieGrid';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';

const PageContainer = styled.div`
  min-height: calc(100vh - 80px);
  padding: 20px 0 40px;

  @media (max-width: 768px) {
    padding: 16px 0 32px;
  }
`;

const HeroSection = styled.section`
  text-align: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #1a1d29 0%, #2d3748 50%, #1a1d29 100%);
  margin-bottom: 32px;

  @media (max-width: 768px) {
    padding: 32px 16px;
    margin-bottom: 24px;
  }

  @media (max-width: 480px) {
    padding: 24px 12px;
    margin-bottom: 20px;
  }
`;

const HeroTitle = styled.h1`
  font-size: clamp(28px, 5vw, 48px);
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 16px;
  line-height: 1.2;
`;

const HeroSubtitle = styled.p`
  font-size: clamp(16px, 3vw, 20px);
  color: #cbd5e0;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const Section = styled.section`
  margin-bottom: 48px;

  @media (max-width: 768px) {
    margin-bottom: 40px;
  }

  @media (max-width: 480px) {
    margin-bottom: 32px;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  margin-bottom: 24px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  gap: 16px;

  @media (max-width: 768px) {
    padding: 0 16px;
    margin-bottom: 20px;
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  @media (max-width: 480px) {
    padding: 0 12px;
    gap: 8px;
  }
`;

const SectionTitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: center;
    gap: 12px;
  }
`;

const SectionTitle = styled.h2`
  font-size: clamp(24px, 4vw, 32px);
  font-weight: bold;
  color: #ffffff;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 480px) {
    gap: 6px;
  }
`;

const TabButton = styled.button<{ $isActive: boolean }>`
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: ${(props) => (props.$isActive ? '#4299e1' : '#2d3748')};
  color: ${(props) => (props.$isActive ? '#ffffff' : '#cbd5e0')};
  white-space: nowrap;
  min-height: 40px;

  &:hover {
    background-color: ${(props) => (props.$isActive ? '#3182ce' : '#4a5568')};
    color: #ffffff;
  }

  @media (max-width: 480px) {
    padding: 8px 12px;
    font-size: 13px;
    min-height: 36px;
  }
`;

const TimeWindowTabs = styled.div`
  display: flex;
  gap: 4px;
  background-color: #2d3748;
  padding: 4px;
  border-radius: 8px;
`;

const TimeWindowButton = styled.button<{ $isActive: boolean }>`
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: ${(props) => (props.$isActive ? '#4299e1' : 'transparent')};
  color: ${(props) => (props.$isActive ? '#ffffff' : '#cbd5e0')};
  white-space: nowrap;

  &:hover {
    background-color: ${(props) => (props.$isActive ? '#3182ce' : 'rgba(66, 153, 225, 0.1)')};
    color: #ffffff;
  }

  @media (max-width: 480px) {
    padding: 6px 10px;
    font-size: 12px;
  }
`;

const LoadMoreButton = styled.button`
  display: block;
  margin: 32px auto 0;
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
  min-height: 48px;

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
    margin: 24px auto 0;
  }

  @media (max-width: 480px) {
    padding: 10px 20px;
    font-size: 14px;
    margin: 20px auto 0;
  }
`;

const LoadingMoreContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 32px 20px;
  gap: 12px;

  @media (max-width: 768px) {
    padding: 24px 16px;
  }
`;

const LoadingMoreText = styled.span`
  color: #cbd5e0;
  font-size: 16px;
  font-weight: 500;

  @media (max-width: 480px) {
    font-size: 14px;
  }
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

  @media (max-width: 480px) {
    width: 20px;
    height: 20px;
    border-width: 2px;
  }
`;

type CategoryType = 'popular' | 'trending' | 'top-rated' | 'upcoming';
type TrendingTimeWindow = 'day' | 'week';

const MoviesPage: React.FC = () => {
  const [currentCategory, setCurrentCategory] = useState<CategoryType>('popular');
  const [trendingTimeWindow, setTrendingTimeWindow] = useState<TrendingTimeWindow>('week');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadMovies = async (category: CategoryType, page: number = 1, append: boolean = false) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      let movieData: Movie[] = [];
      
      switch (category) {
        case 'popular':
          movieData = await fetchPopularMovies(page);
          break;
        case 'trending':
          movieData = await fetchTrendingMovies(trendingTimeWindow, page);
          break;
        case 'top-rated':
          movieData = await fetchTopRatedMovies(page);
          break;
        case 'upcoming':
          movieData = await fetchUpcomingMovies(page);
          break;
      }

      if (append) {
        setMovies(prev => [...prev, ...movieData]);
      } else {
        setMovies(movieData);
      }

      setCurrentPage(page);
      setHasMore(movieData.length === 20);
    } catch (err) {
      setError('Failed to load movies. Please check your API key and try again.');
      console.error('Error loading movies:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreMovies = async () => {
    if (loadingMore || !hasMore) return;
    const nextPage = currentPage + 1;
    await loadMovies(currentCategory, nextPage, true);
  };

  const handleCategoryChange = (category: CategoryType) => {
    setCurrentCategory(category);
    setCurrentPage(1);
    setHasMore(true);
  };

  const handleTrendingTimeWindowChange = (timeWindow: TrendingTimeWindow) => {
    setTrendingTimeWindow(timeWindow);
    if (currentCategory === 'trending') {
      setCurrentPage(1);
      setHasMore(true);
    }
  };

  useEffect(() => {
    loadMovies(currentCategory, 1, false);
  }, [currentCategory, trendingTimeWindow]);

  const getSectionTitle = (): string => {
    switch (currentCategory) {
      case 'popular':
        return 'Popular Movies';
      case 'trending':
        return 'Trending Movies';
      case 'top-rated':
        return 'Top Rated Movies';
      case 'upcoming':
        return 'Upcoming Movies';
      default:
        return 'Movies';
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingSpinner />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorMessage message={error} />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <HeroSection>
        <HeroTitle>Discover Amazing Movies</HeroTitle>
        <HeroSubtitle>
          Explore the world's best movies, from blockbusters to hidden gems
        </HeroSubtitle>
      </HeroSection>

      <Section>
        <SectionHeader>
          <SectionTitleContainer>
            <SectionTitle>{getSectionTitle()}</SectionTitle>
            {currentCategory === 'trending' && (
              <TimeWindowTabs>
                <TimeWindowButton
                  $isActive={trendingTimeWindow === 'day'}
                  onClick={() => handleTrendingTimeWindowChange('day')}
                >
                  Today
                </TimeWindowButton>
                <TimeWindowButton
                  $isActive={trendingTimeWindow === 'week'}
                  onClick={() => handleTrendingTimeWindowChange('week')}
                >
                  This Week
                </TimeWindowButton>
              </TimeWindowTabs>
            )}
          </SectionTitleContainer>
          
          <TabsContainer>
            <TabButton
              $isActive={currentCategory === 'popular'}
              onClick={() => handleCategoryChange('popular')}
            >
              Popular
            </TabButton>
            <TabButton
              $isActive={currentCategory === 'trending'}
              onClick={() => handleCategoryChange('trending')}
            >
              Trending
            </TabButton>
            <TabButton
              $isActive={currentCategory === 'top-rated'}
              onClick={() => handleCategoryChange('top-rated')}
            >
              Top Rated
            </TabButton>
            <TabButton
              $isActive={currentCategory === 'upcoming'}
              onClick={() => handleCategoryChange('upcoming')}
            >
              Upcoming
            </TabButton>
          </TabsContainer>
        </SectionHeader>

        <MovieGrid movies={movies} />
        
        {/* Load More Button */}
        {hasMore && (
          <>
            {loadingMore ? (
              <LoadingMoreContainer>
                <LoadingSpinnerSmall />
                <LoadingMoreText>Loading more movies...</LoadingMoreText>
              </LoadingMoreContainer>
            ) : (
              <LoadMoreButton onClick={loadMoreMovies}>
                Load More Movies
              </LoadMoreButton>
            )}
          </>
        )}
      </Section>
    </PageContainer>
  );
};

export default MoviesPage;