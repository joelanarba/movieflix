
'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { TVShow } from '../../types/tv';
import { fetchPopularTVShows, fetchTrendingTVShows, fetchTopRatedTVShows } from '../../utils/tvApi';
import TVGrid from '../../components/TV/TVGrid';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';

const PageContainer = styled.div`
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

type CategoryType = 'popular' | 'trending' | 'top-rated';
type TrendingTimeWindow = 'day' | 'week';

const TVShowsPage: React.FC = () => {
  const [currentCategory, setCurrentCategory] = useState<CategoryType>('popular');
  const [trendingTimeWindow, setTrendingTimeWindow] = useState<TrendingTimeWindow>('week');
  const [tvShows, setTvShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadTVShows = async (category: CategoryType, page: number = 1, append: boolean = false) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      let shows: TVShow[] = [];
      
      switch (category) {
        case 'popular':
          shows = await fetchPopularTVShows(page);
          break;
        case 'trending':
          shows = await fetchTrendingTVShows(trendingTimeWindow, page);
          break;
        case 'top-rated':
          shows = await fetchTopRatedTVShows(page);
          break;
      }

      if (append) {
        setTvShows(prev => [...prev, ...shows]);
      } else {
        setTvShows(shows);
      }

      setCurrentPage(page);
      setHasMore(shows.length === 20);
    } catch (err) {
      setError('Failed to load TV shows. Please check your API key and try again.');
      console.error('Error loading TV shows:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreShows = async () => {
    if (loadingMore || !hasMore) return;
    const nextPage = currentPage + 1;
    await loadTVShows(currentCategory, nextPage, true);
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
    loadTVShows(currentCategory, 1, false);
  }, [currentCategory, trendingTimeWindow]);

  const getSectionTitle = (): string => {
    switch (currentCategory) {
      case 'popular':
        return 'Popular TV Shows';
      case 'trending':
        return 'Trending TV Shows';
      case 'top-rated':
        return 'Top Rated TV Shows';
      default:
        return 'TV Shows';
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
        <HeroTitle>Discover Amazing TV Shows</HeroTitle>
        <HeroSubtitle>
          Explore popular series, trending shows, and critically acclaimed television
        </HeroSubtitle>
      </HeroSection>

      <Section>
        <SectionHeader>
          <SectionTitle>{getSectionTitle()}</SectionTitle>
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
          </TabsContainer>
        </SectionHeader>

        {currentCategory === 'trending' && (
          <SectionHeader>
            <div></div>
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
        )}

        <TVGrid tvShows={tvShows} />
        
        {/* Load More Button */}
        {hasMore && (
          <>
            {loadingMore ? (
              <LoadingMoreContainer>
                <LoadingSpinnerSmall />
                <LoadingMoreText>Loading more TV shows...</LoadingMoreText>
              </LoadingMoreContainer>
            ) : (
              <LoadMoreButton onClick={loadMoreShows}>
                Load More TV Shows
              </LoadMoreButton>
            )}
          </>
        )}
      </Section>
    </PageContainer>
  );
};

export default TVShowsPage;