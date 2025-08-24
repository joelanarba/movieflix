
'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Movie } from '../../types/movie';
import { fetchPopularMovies } from '../../utils/api';
import MovieGrid from '../../components/Movies/MovieGrid';
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

const LoadMoreButton = styled.button`
  display: block;
  margin: 40px auto;
  background-color: #4299e1;
  color: white;
  border: none;
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #3182ce;
    transform: translateY(-1px);
  }

  &:disabled {
    background-color: #4a5568;
    cursor: not-allowed;
    transform: none;
  }
`;

const PopularPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadMovies = async (page: number = 1, append: boolean = false) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      const popularMovies = await fetchPopularMovies(page);
      
      if (append) {
        setMovies(prev => [...prev, ...popularMovies]);
      } else {
        setMovies(popularMovies);
      }

      // Check if we have more pages (TMDb typically has 500+ pages for popular movies)
      setHasMore(popularMovies.length === 20 && page < 500);
    } catch (err) {
      setError('Failed to load popular movies. Please check your API key and try again.');
      console.error('Error loading popular movies:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadMovies(1, false);
  }, []);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      loadMovies(nextPage, true);
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
        <HeroTitle>Popular Movies</HeroTitle>
        <HeroSubtitle>
          Discover the most popular movies loved by audiences worldwide
        </HeroSubtitle>
      </HeroSection>

      <Section>
        <MovieGrid movies={movies} />
        
        {hasMore && (
          <LoadMoreButton 
            onClick={handleLoadMore} 
            disabled={loadingMore}
          >
            {loadingMore ? 'Loading...' : 'Load More Movies'}
          </LoadMoreButton>
        )}
      </Section>
    </PageContainer>
  );
};

export default PopularPage;