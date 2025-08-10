'use client';

import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faHeart as faHeartSolid, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { Movie } from '../../types/movie';
import { getImageUrl } from '../../utils/api';
import { useFavorites } from '../../contexts/FavoritesContext';

const Card = styled.div`
  background-color: #1a1d29;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.4s ease;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border: 1px solid #2d3748;

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
    border-color: #4299e1;
  }
`;

const PosterContainer = styled.div`
  position: relative;
  aspect-ratio: 2/3;
  overflow: hidden;
`;

const PosterImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;

  ${Card}:hover & {
    transform: scale(1.05);
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
`;

const FavoriteButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);

  &:hover {
    background: rgba(0, 0, 0, 0.9);
    transform: scale(1.1);
  }
`;

const CardContent = styled.div`
  padding: 16px;
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
`;

const MovieInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #cbd5e0;
  font-size: 14px;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const RatingValue = styled.span<{ $rating: number }>`
  font-weight: 600;
  color: ${(props) => {
    if (props.$rating >= 7.5) return '#48bb78';
    if (props.$rating >= 6.0) return '#ed8936';
    return '#e53e3e';
  }};
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
`;

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const isMovieFavorite = isFavorite(movie.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isMovieFavorite) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  const formatReleaseDate = (dateString: string): string => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.getFullYear().toString();
  };

  return (
    <Card>
      <StyledLink href={`/movies/${movie.id}`}>
        <PosterContainer>
          {movie.poster_path ? (
            <PosterImage
              src={getImageUrl(movie.poster_path, 'w500')}
              alt={movie.title}
              loading="lazy"
            />
          ) : (
            <PosterPlaceholder>
              No poster available
            </PosterPlaceholder>
          )}
          <FavoriteButton onClick={handleFavoriteClick}>
            <FontAwesomeIcon
              icon={isMovieFavorite ? faHeartSolid : faHeartRegular}
              color={isMovieFavorite ? '#e53e3e' : '#ffffff'}
            />
          </FavoriteButton>
        </PosterContainer>
        <CardContent>
          <MovieTitle>{movie.title}</MovieTitle>
          <MovieInfo>
            <InfoRow>
              <FontAwesomeIcon icon={faCalendar} size="sm" />
              <span>{formatReleaseDate(movie.release_date)}</span>
            </InfoRow>
            <Rating>
              <FontAwesomeIcon icon={faStar} color="#ffd700" size="sm" />
              <RatingValue $rating={movie.vote_average}>
                {movie.vote_average.toFixed(1)}
              </RatingValue>
            </Rating>
          </MovieInfo>
        </CardContent>
      </StyledLink>
    </Card>
  );
};

export default MovieCard;