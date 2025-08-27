'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, 
  faMapMarkerAlt, 
  faBriefcase,
  faChevronDown,
  faChevronUp
} from '@fortawesome/free-solid-svg-icons';
import { Person } from '../../types/tv';
import { getImageUrl } from '../../utils/tvApi';

// Styled components
const DetailsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  color: #ffffff;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const HeroSection = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 40px;
  margin-bottom: 40px;

  @media (max-width: 1024px) {
    grid-template-columns: 250px 1fr;
    gap: 30px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
    text-align: center;
  }
`;

const PosterContainer = styled.div`
  position: relative;

  @media (max-width: 768px) {
    display: flex;
    justify-content: center;
  }
`;

const PosterImage = styled.img`
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  aspect-ratio: 2/3;
  object-fit: cover;

  @media (max-width: 768px) {
    width: 250px;
  }

  @media (max-width: 480px) {
    width: 200px;
  }
`;

const PosterPlaceholder = styled.div`
  width: 100%;
  aspect-ratio: 2/3;
  background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #718096;
  font-size: 16px;
  text-align: center;
  padding: 20px;

  @media (max-width: 768px) {
    width: 250px;
    margin: 0 auto;
  }

  @media (max-width: 480px) {
    width: 200px;
  }
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const PersonName = styled.h1`
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 16px;
  line-height: 1.1;

  @media (max-width: 1024px) {
    font-size: 36px;
  }

  @media (max-width: 768px) {
    font-size: 32px;
    text-align: center;
  }

  @media (max-width: 480px) {
    font-size: 28px;
  }
`;

const PersonInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    align-items: center;
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  color: #cbd5e0;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const InfoIcon = styled.div`
  width: 20px;
  display: flex;
  justify-content: center;
`;

const BiographySection = styled.div`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #ffffff;

  @media (max-width: 768px) {
    font-size: 24px;
    text-align: center;
  }
`;

const BiographyText = styled.div<{ $isExpanded: boolean }>`
  font-size: 16px;
  line-height: 1.7;
  color: #e2e8f0;
  margin-bottom: 16px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: ${props => props.$isExpanded ? 'none' : '6'};
  -webkit-box-orient: vertical;

  @media (max-width: 768px) {
    font-size: 15px;
    text-align: left;
  }
`;

const ReadMoreButton = styled.button`
  background: none;
  border: none;
  color: #4299e1;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: color 0.3s ease;

  &:hover {
    color: #63b3ed;
  }

  @media (max-width: 768px) {
    align-self: center;
  }
`;

const KnownForSection = styled.div`
  margin-bottom: 40px;
`;

const KnownForGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 16px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
  }
`;

const KnownForCard = styled(Link)`
  display: block;
  background-color: #1a1d29;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
  border: 1px solid #2d3748;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
    border-color: #4299e1;
  }
`;

const CardPosterContainer = styled.div`
  position: relative;
  aspect-ratio: 2/3;
  overflow: hidden;
`;

const CardPoster = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CardPosterPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #718096;
  font-size: 12px;
  text-align: center;
  padding: 10px;
`;

const CardContent = styled.div`
  padding: 12px;

  @media (max-width: 480px) {
    padding: 8px;
  }
`;

const CardTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 4px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const CardSubtitle = styled.div`
  font-size: 12px;
  color: #cbd5e0;

  @media (max-width: 480px) {
    font-size: 11px;
  }
`;

interface PersonDetailsProps {
  person: Person;
}

const PersonDetails: React.FC<PersonDetailsProps> = ({ person }) => {
  const [isBiographyExpanded, setIsBiographyExpanded] = useState(false);

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAge = (birthdate: string | null, deathdate: string | null): string => {
    if (!birthdate) return '';
    
    const birth = new Date(birthdate);
    const end = deathdate ? new Date(deathdate) : new Date();
    const age = Math.floor((end.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    
    return ` (${age} years old)`;
  };

  // Get top 12 most popular credits
  const getKnownForCredits = () => {
    const movieCredits = person.movie_credits?.cast || [];
    const tvCredits = person.tv_credits?.cast || [];
    
    const allCredits = [
      ...movieCredits.map(credit => ({
        ...credit,
        type: 'movie' as const,
        name: credit.title, // Movies use 'title'
        date: credit.release_date, // Movies use 'release_date'
        vote_average: credit.vote_average || 0,
        poster_path: credit.poster_path
      })),
      ...tvCredits.map(credit => ({
        ...credit,
        type: 'tv' as const,
        name: credit.name, // TV shows use 'name'
        date: credit.first_air_date, // TV shows use 'first_air_date'
        vote_average: credit.vote_average || 0,
        poster_path: credit.poster_path
      }))
    ];

    // Sort by popularity (vote_average * vote_count for better ranking)
    return allCredits
      .filter(credit => credit.vote_average > 0) // Filter out unrated content
      .sort((a, b) => {
        const aScore = (a.vote_average || 0) * Math.log(((a as any).vote_count || 0) + 1);
        const bScore = (b.vote_average || 0) * Math.log(((b as any).vote_count || 0) + 1);
        return bScore - aScore;
      })
      .slice(0, 12);
  };

  const knownForCredits = getKnownForCredits();

  return (
    <DetailsContainer>
      <HeroSection>
        <PosterContainer>
          {person.profile_path ? (
            <PosterImage
              src={getImageUrl(person.profile_path, 'w500')}
              alt={person.name}
            />
          ) : (
            <PosterPlaceholder>
              No photo available
            </PosterPlaceholder>
          )}
        </PosterContainer>

        <InfoSection>
          <PersonName>{person.name}</PersonName>
          
          <PersonInfo>
            <InfoItem>
              <InfoIcon>
                <FontAwesomeIcon icon={faBriefcase} />
              </InfoIcon>
              <span>{person.known_for_department}</span>
            </InfoItem>

            {person.birthday && (
              <InfoItem>
                <InfoIcon>
                  <FontAwesomeIcon icon={faCalendarAlt} />
                </InfoIcon>
                <span>
                  {formatDate(person.birthday)}
                  {calculateAge(person.birthday, person.deathday)}
                </span>
              </InfoItem>
            )}

            {person.place_of_birth && (
              <InfoItem>
                <InfoIcon>
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                </InfoIcon>
                <span>{person.place_of_birth}</span>
              </InfoItem>
            )}
          </PersonInfo>

          {person.biography && (
            <BiographySection>
              <SectionTitle>Biography</SectionTitle>
              <BiographyText $isExpanded={isBiographyExpanded}>
                {person.biography}
              </BiographyText>
              {person.biography.length > 500 && (
                <ReadMoreButton
                  onClick={() => setIsBiographyExpanded(!isBiographyExpanded)}
                >
                  {isBiographyExpanded ? (
                    <>
                      Read Less
                      <FontAwesomeIcon icon={faChevronUp} />
                    </>
                  ) : (
                    <>
                      Read More
                      <FontAwesomeIcon icon={faChevronDown} />
                    </>
                  )}
                </ReadMoreButton>
              )}
            </BiographySection>
          )}
        </InfoSection>
      </HeroSection>

      {knownForCredits.length > 0 && (
        <KnownForSection>
          <SectionTitle>Known For</SectionTitle>
          <KnownForGrid>
            {knownForCredits.map((credit) => (
              <KnownForCard
                key={`${credit.type}-${credit.id}`}
                href={credit.type === 'movie' ? `/movies/${credit.id}?from=person` : `/tv/${credit.id}?from=person`}
              >
                <CardPosterContainer>
                  {credit.poster_path ? (
                    <CardPoster
                      src={getImageUrl(credit.poster_path, 'w300')}
                      alt={credit.name}
                    />
                  ) : (
                    <CardPosterPlaceholder>
                      No poster available
                    </CardPosterPlaceholder>
                  )}
                </CardPosterContainer>
                <CardContent>
                  <CardTitle>{credit.name}</CardTitle>
                  <CardSubtitle>
                    {credit.date ? new Date(credit.date).getFullYear() : 'N/A'}
                  </CardSubtitle>
                </CardContent>
              </KnownForCard>
            ))}
          </KnownForGrid>
        </KnownForSection>
      )}
    </DetailsContainer>
  );
};

export default PersonDetails;