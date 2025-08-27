'use client';

import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faCalendar, faHeart } from '@fortawesome/free-solid-svg-icons';
import { Movie } from '../../types/movie';
import { getImageUrl } from '../../utils/api';
import { useFavorites } from '../../contexts/FavoritesContext';

const CardContainer = styled(Link)`
  display: block;
  background-color: #1a1d29;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.4s ease;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border: 1px solid #2d3748;
  text-decoration: none;
  color: inherit;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
    border-color: #4299e1;
  }

  /* Mobile optimizations */
  @media (max-width: 768px) {
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
    }
  }

  @media (max-width: 480px) {
    border-radius: 8px;
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
    }
  }

  /* Touch device optimizations */
  @media (hover: none) and (pointer: coarse) {
    &:hover {
      transform: none;
    }
    
    &:active {
      transform: scale(0.98);
    }
  }
`;

const PosterContainer = styled.div`
  position: relative;
  aspect-ratio: 2/3;
  overflow: hidden;
  background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
`;

const PosterImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;

  ${CardContainer}:hover & {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    ${CardContainer}:hover & {
      transform: scale(1.02);
    }
  }

  /* Disable transform on touch devices for better performance */
  @media (hover: none) and (pointer: coarse) {
    ${CardContainer}:hover & {
      transform: none;
    }
  }
`;

const PosterPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #718096;
  font-size: 14px;
  text-align: center;
  padding: 20px;
  line-height: 1.4;

  @media (max-width: 480px) {
    font-size: 12px;
    padding: 16px;
  }

  @media (max-width: 350px) {
    font-size: 11px;
    padding: 12px;
  }
`;

const FavoriteButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
  z-index: 2;
  
  /* Minimum touch target size for accessibility */
  min-width: 44px;
  min-height: 44px;

  &:hover {
    background: rgba(0, 0, 0, 0.9);
    transform: scale(1.1);
  }

  &:focus {
    outline: 2px solid #4299e1;
    outline-offset: 2px;
  }

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    min-width: 40px;
    min-height: 40px;
    top: 8px;
    right: 8px;
  }

  @media (max-width: 350px) {
    width: 36px;
    height: 36px;
    min-width: 36px;
    min-height: 36px;
    top: 6px;
    right: 6px;
  }

  /* Touch device optimizations */
  @media (hover: none) and (pointer: coarse) {
    &:hover {
      transform: none;
    }
    
    &:active {
      transform: scale(0.95);
      background: rgba(0, 0, 0, 0.9);
    }
  }
`;

const FavoriteIcon = styled(FontAwesomeIcon)<{ $isFavorite: boolean }>`
  color: ${props => props.$isFavorite ? '#e53e3e' : '#ffffff'};
  transition: color 0.3s ease;
  font-size: 16px;

  @media (max-width: 480px) {
    font-size: 14px;
  }

  @media (max-width: 350px) {
    font-size: 12px;
  }
`;

const RatingBadge = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(0, 0, 0, 0.8);
  color: #ffd700;
  padding: 6px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 4px;
  backdrop-filter: blur(4px);
  line-height: 1;

  @media (max-width: 480px) {
    padding: 5px 8px;
    font-size: 11px;
    top: 8px;
    left: 8px;
  }

  @media (max-width: 350px) {
    padding: 4px 6px;
    font-size: 10px;
    top: 6px;
    left: 6px;
  }
`;

const CardContent = styled.div`
  padding: 16px;

  @media (max-width: 480px) {
    padding: 12px;
  }

  @media (max-width: 350px) {
    padding: 10px;
  }
`;

const MovieTitle = styled.h3`
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 8px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 42px;

  @media (max-width: 480px) {
    font-size: 14px;
    min-height: 38px;
    margin-bottom: 6px;
  }

  @media (max-width: 350px) {
    font-size: 13px;
    min-height: 34px;
    margin-bottom: 6px;
  }
`;

const MovieInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #cbd5e0;
  font-size: 14px;
  gap: 8px;

  @media (max-width: 480px) {
    font-size: 12px;
    gap: 6px;
  }

  @media (max-width: 350px) {
    font-size: 11px;
    gap: 4px;
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ReleaseDate = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  min-width: 0;

  @media (max-width: 350px) {
    gap: 3px;
  }
`;

const VoteAverage = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
  color: #ffd700;
  flex-shrink: 0;

  @media (max-width: 350px) {
    gap: 3px;
  }
`;

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();

  const formatReleaseDate = (dateString: string): string => {
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    const year = date.getFullYear();
    return isNaN(year) ? 'TBA' : year.toString();
  };

  const isFavorite = (movieId: number): boolean => {
    return favorites.some(fav => fav.id === movieId);
  };

  const handleFavoriteClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (isFavorite(movie.id)) {
      removeFromFavorites(movie.id);
    } else {
      // Pass the full movie object to addToFavorites
      // The context will handle adding the addedAt property
      addToFavorites(movie);
    }
  };

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    img.style.display = 'none';
    
    // Create placeholder element
    const placeholder = document.createElement('div');
    placeholder.style.cssText = `
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #718096;
      font-size: 14px;
      text-align: center;
      padding: 20px;
      line-height: 1.4;
    `;
    placeholder.textContent = 'No poster available';
    
    const parent = img.parentElement;
    if (parent) {
      parent.appendChild(placeholder);
    }
  };

  return (
    <CardContainer href={`/movies/${movie.id}?from=movies`}>
      <PosterContainer>
        {movie.poster_path ? (
          <PosterImage
            src={getImageUrl(movie.poster_path, 'w500')}
            alt={`${movie.title} poster`}
            loading="lazy"
            onError={handleImageError}
          />
        ) : (
          <PosterPlaceholder>
            No poster available
          </PosterPlaceholder>
        )}
        
        <FavoriteButton 
          onClick={handleFavoriteClick}
          title={isFavorite(movie.id) ? 'Remove from favorites' : 'Add to favorites'}
          aria-label={isFavorite(movie.id) ? 'Remove from favorites' : 'Add to favorites'}
        >
          <FavoriteIcon 
            icon={faHeart} 
            $isFavorite={isFavorite(movie.id)}
          />
        </FavoriteButton>

        {movie.vote_average > 0 && (
          <RatingBadge>
            <FontAwesomeIcon icon={faStar} />
            {movie.vote_average.toFixed(1)}
          </RatingBadge>
        )}
      </PosterContainer>
      
      <CardContent>
        <MovieTitle>{movie.title}</MovieTitle>
        <MovieInfo>
          <ReleaseDate>
            <FontAwesomeIcon icon={faCalendar} />
            <span>{formatReleaseDate(movie.release_date)}</span>
          </ReleaseDate>
          <VoteAverage>
            <FontAwesomeIcon icon={faStar} />
            {movie.vote_average.toFixed(1)}
          </VoteAverage>
        </MovieInfo>
      </CardContent>
    </CardContainer>
  );
};

export default MovieCard;