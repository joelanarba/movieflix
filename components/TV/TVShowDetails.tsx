
'use client';

import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faCalendar, faTv, faPlay } from '@fortawesome/free-solid-svg-icons';
import { TVShowDetails as TVShowDetailsType } from '../../types/tv';
import { getImageUrl } from '../../utils/tvApi';

const DetailsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const HeroSection = styled.div`
  position: relative;
  margin-bottom: 40px;
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(135deg, #1a1d29 0%, #2d3748 100%);
`;

const BackdropContainer = styled.div`
  position: relative;
  height: 400px;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 250px;
  }
`;

const BackdropImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.3;
`;

const BackdropOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    rgba(26, 29, 41, 0.9) 0%,
    rgba(26, 29, 41, 0.7) 50%,
    rgba(26, 29, 41, 0.9) 100%
  );
`;

const HeroContent = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  padding: 40px;
  gap: 32px;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    padding: 20px;
    gap: 20px;
  }
`;

const PosterContainer = styled.div`
  flex-shrink: 0;
  width: 200px;
  height: 300px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);

  @media (max-width: 768px) {
    width: 150px;
    height: 225px;
  }
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
  text-align: center;
  padding: 20px;
`;

const InfoSection = styled.div`
  flex: 1;
  color: #ffffff;
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 12px;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const Tagline = styled.p`
  font-size: 16px;
  color: #cbd5e0;
  font-style: italic;
  margin-bottom: 16px;
`;

const MetaInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 20px;
  font-size: 14px;

  @media (max-width: 768px) {
    justify-content: center;
    gap: 16px;
  }
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #cbd5e0;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #ffd700;
  font-weight: 600;
`;

const Genres = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const GenreTag = styled.span`
  background-color: rgba(66, 153, 225, 0.2);
  color: #4299e1;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid rgba(66, 153, 225, 0.3);
`;

const Overview = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: #e2e8f0;
  margin-bottom: 24px;
`;

const ContentSection = styled.section`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 20px;
  padding-bottom: 8px;
  border-bottom: 2px solid #4299e1;
`;

const CastGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
  }
`;

const CastCard = styled(Link)`
  background-color: #1a1d29;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
  border: 1px solid #2d3748;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    border-color: #4299e1;
  }
`;

const CastImageContainer = styled.div`
  aspect-ratio: 2/3;
  overflow: hidden;
`;

const CastImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CastImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #718096;
  font-size: 12px;
`;

const CastInfo = styled.div`
  padding: 12px;
`;

const CastName = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 4px;
  line-height: 1.3;
`;

const CharacterName = styled.p`
  font-size: 12px;
  color: #cbd5e0;
  line-height: 1.3;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  background-color: #1a1d29;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #2d3748;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #4299e1;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #cbd5e0;
`;

const CreatedBySection = styled.div`
  background-color: #1a1d29;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #2d3748;
  margin-bottom: 32px;
`;

const CreatorList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
`;

const CreatorName = styled.span`
  color: #4299e1;
  font-weight: 500;
`;

interface TVShowDetailsProps {
  tvShow: TVShowDetailsType;
}

const TVShowDetails: React.FC<TVShowDetailsProps> = ({ tvShow }) => {
  const formatDate = (dateString: string): string => {
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatRuntime = (runtimes: number[]): string => {
    if (!runtimes || runtimes.length === 0) return 'N/A';
    const avgRuntime = Math.round(runtimes.reduce((a, b) => a + b) / runtimes.length);
    return `~${avgRuntime} min`;
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'returning series':
      case 'in production':
        return '#48bb78';
      case 'ended':
      case 'canceled':
        return '#f56565';
      default:
        return '#ed8936';
    }
  };

  return (
    <DetailsContainer>
      <HeroSection>
        <BackdropContainer>
          {tvShow.backdrop_path && (
            <BackdropImage
              src={getImageUrl(tvShow.backdrop_path, 'w1280')}
              alt={tvShow.name}
            />
          )}
          <BackdropOverlay />
        </BackdropContainer>
        
        <HeroContent>
          <PosterContainer>
            {tvShow.poster_path ? (
              <PosterImage
                src={getImageUrl(tvShow.poster_path, 'w500')}
                alt={tvShow.name}
              />
            ) : (
              <PosterPlaceholder>
                No poster available
              </PosterPlaceholder>
            )}
          </PosterContainer>
          
          <InfoSection>
            <Title>{tvShow.name}</Title>
            {tvShow.tagline && <Tagline>"{tvShow.tagline}"</Tagline>}
            
            <MetaInfo>
              <Rating>
                <FontAwesomeIcon icon={faStar} />
                {tvShow.vote_average.toFixed(1)}
              </Rating>
              <MetaItem>
                <FontAwesomeIcon icon={faCalendar} />
                {formatDate(tvShow.first_air_date)}
              </MetaItem>
              <MetaItem>
                <FontAwesomeIcon icon={faTv} />
                {formatRuntime(tvShow.episode_run_time)}
              </MetaItem>
              <MetaItem>
                <FontAwesomeIcon icon={faPlay} />
                <span style={{ color: getStatusColor(tvShow.status) }}>
                  {tvShow.status}
                </span>
              </MetaItem>
            </MetaInfo>
            
            <Genres>
              {tvShow.genres.map((genre) => (
                <GenreTag key={genre.id}>{genre.name}</GenreTag>
              ))}
            </Genres>
            
            <Overview>{tvShow.overview}</Overview>
          </InfoSection>
        </HeroContent>
      </HeroSection>

      <StatsGrid>
        <StatCard>
          <StatValue>{tvShow.number_of_seasons}</StatValue>
          <StatLabel>Seasons</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{tvShow.number_of_episodes}</StatValue>
          <StatLabel>Episodes</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{tvShow.vote_count.toLocaleString()}</StatValue>
          <StatLabel>Votes</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{tvShow.popularity.toFixed(0)}</StatValue>
          <StatLabel>Popularity Score</StatLabel>
        </StatCard>
      </StatsGrid>

      {tvShow.created_by && tvShow.created_by.length > 0 && (
        <ContentSection>
          <CreatedBySection>
            <SectionTitle style={{ marginBottom: '12px', paddingBottom: '4px', border: 'none', fontSize: '18px' }}>
              Created By
            </SectionTitle>
            <CreatorList>
              {tvShow.created_by.map((creator, index) => (
                <CreatorName key={creator.id}>
                  {creator.name}{index < tvShow.created_by.length - 1 ? ', ' : ''}
                </CreatorName>
              ))}
            </CreatorList>
          </CreatedBySection>
        </ContentSection>
      )}

      {tvShow.credits && tvShow.credits.cast.length > 0 && (
        <ContentSection>
          <SectionTitle>Cast</SectionTitle>
          <CastGrid>
            {tvShow.credits.cast.slice(0, 10).map((castMember) => (
              <CastCard key={castMember.id} href={`/person/${castMember.id}`}>
                <CastImageContainer>
                  {castMember.profile_path ? (
                    <CastImage
                      src={getImageUrl(castMember.profile_path, 'w185')}
                      alt={castMember.name}
                      loading="lazy"
                    />
                  ) : (
                    <CastImagePlaceholder>
                      No photo
                    </CastImagePlaceholder>
                  )}
                </CastImageContainer>
                <CastInfo>
                  <CastName>{castMember.name}</CastName>
                  <CharacterName>{castMember.character}</CharacterName>
                </CastInfo>
              </CastCard>
            ))}
          </CastGrid>
        </ContentSection>
      )}
    </DetailsContainer>
  );
};

export default TVShowDetails;