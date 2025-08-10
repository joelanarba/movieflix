'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styled from 'styled-components';
import { MovieDetails as MovieDetailsType } from '../../../types/movie';
import { fetchMovieDetails } from '../../../utils/api';
import MovieDetails from '../../../components/Movies/MovieDetails';
import LoadingSpinner from '../../../components/UI/LoadingSpinner';
import ErrorMessage from '../../../components/UI/ErrorMessage';

const PageContainer = styled.div`
  min-height: calc(100vh - 80px);
  padding: 20px 0;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #2d3748;
  color: #cbd5e0;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0 20px 20px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 20px;

  &:hover {
    background-color: #4a5568;
    color: #ffffff;
  }
`;

const MovieDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState<MovieDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const movieId = params?.id as string;

  useEffect(() => {
    if (!movieId) {
      setError('Invalid movie ID');
      setLoading(false);
      return;
    }

    const loadMovieDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const movieData = await fetchMovieDetails(movieId);
        setMovie(movieData);
      } catch (err) {
        setError('Failed to load movie details. Please try again.');
        console.error('Error loading movie details:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMovieDetails();
  }, [movieId]);

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
        <BackButton onClick={() => router.back()}>
          ← Back
        </BackButton>
        <ErrorMessage message={error} />
      </PageContainer>
    );
  }

  if (!movie) {
    return (
      <PageContainer>
        <BackButton onClick={() => router.back()}>
          ← Back
        </BackButton>
        <ErrorMessage message="Movie not found" />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <BackButton onClick={() => router.back()}>
        ← Back to Movies
      </BackButton>
      <MovieDetails movie={movie} />
    </PageContainer>
  );
};

export default MovieDetailPage;