'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Movie } from '../../types/movie';
import { fetchRecommendations } from '../../utils/api';
import MovieCard from './MovieCard';

const RecommendationsSection = styled.div`
  margin-top: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 24px;
`;

const RecommendationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 16px;
  }
`;

const ErrorMessage = styled.div`
  color: #cbd5e0;
  font-size: 16px;
  text-align: center;
  padding: 20px;
`;

const LoadingMessage = styled.div`
  color: #cbd5e0;
  font-size: 16px;
  text-align: center;
  padding: 20px;
`;

const NoRecommendations = styled.div`
  color: #cbd5e0;
  font-size: 16px;
  text-align: center;
  padding: 20px;
`;

interface RecommendedMoviesProps {
  movieId: number;
}

const RecommendedMovies: React.FC<RecommendedMoviesProps> = ({ movieId }) => {
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);
        const recommendedMovies = await fetchRecommendations(movieId.toString());
        setRecommendations(recommendedMovies.slice(0, 6)); // Show top 6 recommendations
      } catch (err) {
        setError('Failed to load recommendations');
        console.error('Error loading recommendations:', err);
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      loadRecommendations();
    }
  }, [movieId]);

  if (loading) {
    return (
      <RecommendationsSection>
        <SectionTitle>Recommended Movies</SectionTitle>
        <LoadingMessage>Loading recommendations...</LoadingMessage>
      </RecommendationsSection>
    );
  }

  if (error) {
    return (
      <RecommendationsSection>
        <SectionTitle>Recommended Movies</SectionTitle>
        <ErrorMessage>{error}</ErrorMessage>
      </RecommendationsSection>
    );
  }

  if (recommendations.length === 0) {
    return (
      <RecommendationsSection>
        <SectionTitle>Recommended Movies</SectionTitle>
        <NoRecommendations>No recommendations available for this movie.</NoRecommendations>
      </RecommendationsSection>
    );
  }

  return (
    <RecommendationsSection>
      <SectionTitle>Recommended Movies</SectionTitle>
      <RecommendationsGrid>
        {recommendations.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </RecommendationsGrid>
    </RecommendationsSection>
  );
};

export default RecommendedMovies;
