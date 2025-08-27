'use client';

import React from 'react';
import styled from 'styled-components';
import { Movie } from '../../types/movie';
import MovieCard from './MovieCard';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  padding: 0 20px;
  max-width: 1200px;
  margin: 0 auto;

  /* Tablet landscape and smaller desktops */
  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    padding: 0 18px;
  }

  /* Tablet portrait */
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 16px;
    padding: 0 16px;
  }

  /* Large mobile */
  @media (max-width: 600px) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 14px;
    padding: 0 14px;
  }

  /* Standard mobile */
  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
    padding: 0 12px;
  }

  /* Small mobile */
  @media (max-width: 400px) {
    grid-template-columns: repeat(auto-fill, minmax(145px, 1fr));
    gap: 10px;
    padding: 0 10px;
  }

  /* Very small mobile */
  @media (max-width: 350px) {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 8px;
    padding: 0 8px;
  }

  /* Ultra small screens */
  @media (max-width: 320px) {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    padding: 0 8px;
  }
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  color: #718096;

  @media (max-width: 768px) {
    padding: 40px 16px;
  }

  @media (max-width: 480px) {
    padding: 32px 12px;
  }
`;

const EmptyStateTitle = styled.h3`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 12px;
  color: #cbd5e0;

  @media (max-width: 768px) {
    font-size: 20px;
    margin-bottom: 10px;
  }

  @media (max-width: 480px) {
    font-size: 18px;
    margin-bottom: 8px;
  }
`;

const EmptyStateText = styled.p`
  font-size: 16px;
  line-height: 1.6;
  max-width: 400px;
  margin: 0 auto;

  @media (max-width: 768px) {
    font-size: 15px;
    max-width: 350px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
    max-width: 300px;
  }
`;

interface MovieGridProps {
  movies: Movie[];
}

const MovieGrid: React.FC<MovieGridProps> = ({ movies }) => {
  if (!movies || movies.length === 0) {
    return (
      <GridContainer>
        <EmptyState>
          <EmptyStateTitle>No Movies Found</EmptyStateTitle>
          <EmptyStateText>
            We couldn't find any movies to display. Try adjusting your search or filters.
          </EmptyStateText>
        </EmptyState>
      </GridContainer>
    );
  }

  return (
    <GridContainer>
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </GridContainer>
  );
};

export default MovieGrid;