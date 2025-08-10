'use client';

import React from 'react';
import styled from 'styled-components';
import { Movie } from '../../types/movie';
import MovieCard from './MovieCard';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;
  padding: 0 20px;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
    padding: 0 16px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
  }
`;

interface MovieGridProps {
  movies: Movie[];
}

const MovieGrid: React.FC<MovieGridProps> = ({ movies }) => {
  return (
    <GridContainer>
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </GridContainer>
  );
};

export default MovieGrid;