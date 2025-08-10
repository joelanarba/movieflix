'use client';

import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useFavorites } from '../../contexts/FavoritesContext';
import { getImageUrl } from '../../utils/api';

const FavoritesContainer = styled.div`
  min-height: calc(100vh - 80px);
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: #cbd5e0;
  max-width: 600px;
  margin: 0 auto;
`;

const FavoritesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
  }
`;

const FavoriteCard = styled.div`
  background-color: #1a1d29;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.4s ease;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border: 1px solid #2d3748;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
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

const RemoveButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(229, 62, 62, 0.9);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);

  &:hover {
    background: rgba(229, 62, 62, 1);
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
  justify-content: space-between;
  align-items: center;
  color: #cbd5e0;
  font-size: 14px;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
  color: #ffd700;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: #718096;
`;

const EmptyStateTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #cbd5e0;
`;

const EmptyStateText = styled.p`
  font-size: 16px;
  line-height: 1.6;
  max-width: 400px;
  margin: 0 auto;
`;

const ClearAllButton = styled.button`
  background-color: #e53e3e;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 32px;

  &:hover {
    background-color: #c53030;
  }

  &:disabled {
    background-color: #4a5568;
    cursor: not-allowed;
  }
`;

const FavoritesPage: React.FC = () => {
  const { favorites, removeFromFavorites, clearFavorites } = useFavorites();

  const formatReleaseDate = (dateString: string): string => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.getFullYear().toString();
  };

  const handleRemove = (movieId: number, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    removeFromFavorites(movieId);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to remove all favorites?')) {
      clearFavorites();
    }
  };

  return (
    <FavoritesContainer>
      <Header>
        <Title>
          <FontAwesomeIcon icon={faHeart} color="#e53e3e" />
          My Favorites
        </Title>
        <Subtitle>
          {favorites.length > 0 
            ? `You have ${favorites.length} favorite ${favorites.length === 1 ? 'movie' : 'movies'}`
            : 'Start building your favorite movies collection'
          }
        </Subtitle>
      </Header>

      {favorites.length > 0 && (
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <ClearAllButton onClick={handleClearAll}>
            <FontAwesomeIcon icon={faTrash} style={{ marginRight: '8px' }} />
            Clear All Favorites
          </ClearAllButton>
        </div>
      )}

      {favorites.length === 0 ? (
        <EmptyState>
          <FontAwesomeIcon icon={faHeart} size="4x" color="#4a5568" style={{ marginBottom: '24px' }} />
          <EmptyStateTitle>No favorites yet</EmptyStateTitle>
          <EmptyStateText>
            Start exploring movies and click the heart icon to add them to your favorites collection.
          </EmptyStateText>
        </EmptyState>
      ) : (
        <FavoritesGrid>
          {favorites.map((movie) => (
            <FavoriteCard key={movie.id}>
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
                <RemoveButton onClick={(e) => handleRemove(movie.id, e)}>
                  <FontAwesomeIcon icon={faTrash} color="#ffffff" size="sm" />
                </RemoveButton>
              </PosterContainer>
              <CardContent>
                <MovieTitle>{movie.title}</MovieTitle>
                <MovieInfo>
                  <span>{formatReleaseDate(movie.release_date)}</span>
                  <Rating>
                    <FontAwesomeIcon icon={faHeart} size="sm" />
                    {movie.vote_average.toFixed(1)}
                  </Rating>
                </MovieInfo>
              </CardContent>
            </FavoriteCard>
          ))}
        </FavoritesGrid>
      )}
    </FavoritesContainer>
  );
};

export default FavoritesPage;