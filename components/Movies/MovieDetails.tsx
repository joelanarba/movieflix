'use client';

import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar,
  faCalendar,
  faClock,
  faHeart as faHeartSolid,
  faTag,
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { MovieDetails as MovieDetailsType } from '../../types/movie';
import { getImageUrl } from '../../utils/api';
import { useFavorites } from '../../contexts/FavoritesContext';
import RecommendedMovies from './RecommendedMovies';
import MovieReviews from './MovieReviews';

const DetailsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const HeroSection = styled.div`
  display: flex;
  gap: 40px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 24px;
  }
`;

const PosterSection = styled.div`
  flex-shrink: 0;
`;

const PosterImage = styled.img`
  width: 300px;
  height: 450px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);

  @media (max-width: 768px) {
    width: 100%;
    max-width: 300px;
    height: auto;
    aspect-ratio: 2/3;
  }
`;

const PosterPlaceholder = styled.div`
  width: 300px;
  height: 450px;
  background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #718096;
  font-size: 16px;
  text-align: center;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 300px;
    height: auto;
    aspect-ratio: 2/3;
  }
`;

const InfoSection = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 16px;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const MetaInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 20px;
  align-items: center;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #cbd5e0;
  font-size: 16px;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RatingValue = styled.span<{ $rating: number }>`
  font-weight: 600;
  font-size: 18px;
  color: ${(props) => {
    if (props.$rating >= 7.5) return '#48bb78';
    if (props.$rating >= 6.0) return '#ed8936';
    return '#e53e3e';
  }};
`;

const FavoriteButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #4299e1;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 24px;

  &:hover {
    background-color: #3182ce;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &.favorite {
    background-color: #e53e3e;

    &:hover {
      background-color: #c53030;
    }
  }
`;

const Overview = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 16px;
`;

const OverviewText = styled.p`
  font-size: 16px;
  line-height: 1.7;
  color: #cbd5e0;
`;

const GenresList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 32px;
`;

const GenreTag = styled.span`
  background-color: #2d3748;
  color: #cbd5e0;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const CastSection = styled.div`
  margin-top: 32px;
`;

const CastGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
`;

const CastMember = styled.div`
  text-align: center;
`;

const CastImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 auto 8px;
  display: block;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
`;

const CastImagePlaceholder = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #2d3748;
  margin: 0 auto 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #718096;
  font-size: 12px;
`;

const CastName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  margin-bottom: 4px;
`;

const CharacterName = styled.div`
  font-size: 12px;
  color: #718096;
`;

interface MovieDetailsProps {
  movie: MovieDetailsType;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ movie }) => {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const isMovieFavorite = isFavorite(movie.id);

  const handleFavoriteClick = () => {
    if (isMovieFavorite) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  const formatReleaseDate = (dateString: string): string => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatRuntime = (minutes: number): string => {
    if (!minutes) return 'Unknown';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const topCast = movie.credits?.cast?.slice(0, 8) || [];

  return (
    <DetailsContainer>
      <HeroSection>
        <PosterSection>
          {movie.poster_path ? (
            <PosterImage
              src={getImageUrl(movie.poster_path, 'w500')}
              alt={movie.title}
            />
          ) : (
            <PosterPlaceholder>No poster available</PosterPlaceholder>
          )}
        </PosterSection>
        <InfoSection>
          <Title>{movie.title}</Title>
          <MetaInfo>
            <MetaItem>
              <FontAwesomeIcon icon={faCalendar} />
              <span>{formatReleaseDate(movie.release_date)}</span>
            </MetaItem>
            <MetaItem>
              <FontAwesomeIcon icon={faClock} />
              <span>{formatRuntime(movie.runtime)}</span>
            </MetaItem>
            <Rating>
              <FontAwesomeIcon icon={faStar} color="#ffd700" />
              <RatingValue $rating={movie.vote_average}>
                {movie.vote_average.toFixed(1)}
              </RatingValue>
              <span>({movie.vote_count} votes)</span>
            </Rating>
          </MetaInfo>
          <FavoriteButton
            onClick={handleFavoriteClick}
            className={isMovieFavorite ? 'favorite' : ''}
          >
            <FontAwesomeIcon
              icon={isMovieFavorite ? faHeartSolid : faHeartRegular}
            />
            {isMovieFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </FavoriteButton>
          {movie.genres && movie.genres.length > 0 && (
            <GenresList>
              {movie.genres.map((genre) => (
                <GenreTag key={genre.id}>
                  <FontAwesomeIcon icon={faTag} size="sm" />
                  {genre.name}
                </GenreTag>
              ))}
            </GenresList>
          )}
          {movie.overview && (
            <Overview>
              <SectionTitle>Overview</SectionTitle>
              <OverviewText>{movie.overview}</OverviewText>
            </Overview>
          )}
        </InfoSection>
      </HeroSection>

      {topCast.length > 0 && (
        <CastSection>
          <SectionTitle>Cast</SectionTitle>
          <CastGrid>
            {topCast.map((castMember) => (
              <CastMember key={castMember.id}>
                {castMember.profile_path ? (
                  <CastImage
                    src={getImageUrl(castMember.profile_path, 'w185')}
                    alt={castMember.name}
                  />
                ) : (
                  <CastImagePlaceholder>No Photo</CastImagePlaceholder>
                )}
                <CastName>{castMember.name}</CastName>
                <CharacterName>{castMember.character}</CharacterName>
              </CastMember>
            ))}
          </CastGrid>
        </CastSection>
      )}

      <MovieReviews movieId={movie.id} />

      <RecommendedMovies movieId={movie.id} />
    </DetailsContainer>
  );
};

export default MovieDetails;