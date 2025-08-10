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

type TrendingTimeWindow = 'day' | 'week';

const HomePage: React.FC = () => {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [trendingTimeWindow, setTrendingTimeWindow] = useState<TrendingTimeWindow>('week');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        setError(null);

        const [trending, popular] = await Promise.all([
          fetchTrendingMovies(trendingTimeWindow),
          fetchPopularMovies(),
        ]);

        setTrendingMovies(trending);
        setPopularMovies(popular);
      } catch (err) {
        setError('Failed to load movies. Please check your API key and try again.');
        console.error('Error loading movies:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
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
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>Popular Movies</SectionTitle>
        </SectionHeader>
        <MovieGrid movies={popularMovies} />
      </Section>
    </HomeContainer>
  );
};

export default HomePage;