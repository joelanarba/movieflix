'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import styled from 'styled-components';
import { MovieDetails as MovieDetailsType } from '../../../types/movie';
import { fetchMovieDetails } from '../../../utils/api';
import MovieDetails from '../../../components/Movies/MovieDetails';
import Breadcrumb from '../../../components/ui/Breadcrumb';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import ErrorMessage from '../../../components/ui/ErrorMessage';

const PageContainer = styled.div`
  min-height: calc(100vh - 80px);
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
  margin: 20px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 20px;

  &:hover {
    background-color: #4a5568;
    color: #ffffff;
  }

  @media (max-width: 768px) {
    margin: 20px 16px;
  }
`;

const ContentContainer = styled.div`
  padding-top: 0;
`;

// Helper function to determine source page info
const getSourcePageInfo = (searchParams: URLSearchParams) => {
  const from = searchParams.get('from');
  
  switch (from) {
    case 'popular':
      return { label: 'Popular', href: '/popular' };
    case 'top-rated':
      return { label: 'Top Rated', href: '/top-rated' };
    case 'upcoming':
      return { label: 'Upcoming', href: '/upcoming' };
    case 'trending':
      return { label: 'Trending', href: '/' };
    case 'favorites':
      return { label: 'Favorites', href: '/favorites' };
    default:
      return { label: 'Home', href: '/' };
  }
};

const MovieDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
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

  // Generate breadcrumb items based on the source page and movie title
  const getBreadcrumbItems = (): Array<{ label: string; href?: string }> => {
    const sourcePageInfo = getSourcePageInfo(searchParams);
    const items: Array<{ label: string; href?: string }> = [
      { label: 'Home', href: '/' }
    ];

    // Only add intermediate page if it's not the home page
    if (sourcePageInfo.href !== '/') {
      items.push(sourcePageInfo);
    }

    // Add current movie title
    if (movie) {
      items.push({ label: movie.title });
    }

    return items;
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
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Error' }]} />
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
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Not Found' }]} />
        <BackButton onClick={() => router.back()}>
          ← Back
        </BackButton>
        <ErrorMessage message="Movie not found" />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Breadcrumb items={getBreadcrumbItems()} />
      <BackButton onClick={() => router.back()}>
        ← Back to Movies
      </BackButton>
      <ContentContainer>
        <MovieDetails movie={movie} />
      </ContentContainer>
    </PageContainer>
  );
};

export default MovieDetailPage;