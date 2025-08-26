
'use client';

import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { TVShow } from '../../types/tv';
import { getImageUrl } from '../../utils/tvApi';

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
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
  }
`;

const TVCard = styled(Link)`
  background-color: #1a1d29;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.4s ease;
  text-decoration: none;
  color: inherit;
  display: block;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border: 1px solid #2d3748;

  &:hover {
    transform: translateY(-8px);
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

  ${TVCard}:hover & {
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

const RatingBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.8);
  color: #ffd700;
  padding: 6px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  backdrop-filter: blur(4px);
`;

const CardContent = styled.div`
  padding: 16px;
`;

const TVTitle = styled.h3`
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

const TVOverview = styled.p`
  font-size: 14px;
  color: #a0aec0;
  line-height: 1.4;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const TVMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #cbd5e0;
  font-size: 12px;
`;

const ReleaseDate = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: #718096;
  grid-column: 1 / -1;
`;

const EmptyStateTitle = styled.h3`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #cbd5e0;
`;

const EmptyStateText = styled.p`
  font-size: 16px;
  line-height: 1.6;
`;

interface TVGridProps {
  tvShows: TVShow[];
  loading?: boolean;
}

const TVGrid: React.FC<TVGridProps> = ({ tvShows, loading = false }) => {
  const formatReleaseDate = (dateString: string): string => {
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    return date.getFullYear().toString();
  };

  const formatRating = (rating: number): string => {
    return rating.toFixed(1);
  };

  if (loading) {
    return (
      <GridContainer>
        {/* Loading skeleton could be added here */}
      </GridContainer>
    );
  }

  if (tvShows.length === 0) {
    return (
      <GridContainer>
        <EmptyState>
          <EmptyStateTitle>No TV Shows Found</EmptyStateTitle>
          <EmptyStateText>
            We couldn't find any TV shows matching your criteria.
          </EmptyStateText>
        </EmptyState>
      </GridContainer>
    );
  }

  return (
    <GridContainer>
      {tvShows.map((tvShow) => (
        <TVCard key={tvShow.id} href={`/tv/${tvShow.id}`}>
          <PosterContainer>
            {tvShow.poster_path ? (
              <PosterImage
                src={getImageUrl(tvShow.poster_path, 'w500')}
                alt={tvShow.name}
                loading="lazy"
              />
            ) : (
              <PosterPlaceholder>
                No poster available
              </PosterPlaceholder>
            )}
            {tvShow.vote_average > 0 && (
              <RatingBadge>
                <FontAwesomeIcon icon={faStar} size="xs" />
                {formatRating(tvShow.vote_average)}
              </RatingBadge>
            )}
          </PosterContainer>
          <CardContent>
            <TVTitle>{tvShow.name}</TVTitle>
            {tvShow.overview && (
              <TVOverview>{tvShow.overview}</TVOverview>
            )}
            <TVMeta>
              <ReleaseDate>
                <FontAwesomeIcon icon={faCalendar} size="xs" />
                {formatReleaseDate(tvShow.first_air_date)}
              </ReleaseDate>
              <span>{tvShow.vote_count.toLocaleString()} votes</span>
            </TVMeta>
          </CardContent>
        </TVCard>
      ))}
    </GridContainer>
  );
};

export default TVGrid;