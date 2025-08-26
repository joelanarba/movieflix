
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBirthdayCake, faMapMarkerAlt, faStar, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { Person } from '../../../types/tv';
import { fetchPersonDetails, getImageUrl } from '../../../utils/tvApi';
import Breadcrumb from '../../../components/ui/Breadcrumb';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import ErrorMessage from '../../../components/ui/ErrorMessage';

const PageContainer = styled.div`
  min-height: calc(100vh - 80px);
  padding: 20px 0;
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

const DetailsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const HeroSection = styled.div`
  display: flex;
  gap: 32px;
  margin-bottom: 40px;
  background-color: #1a1d29;
  padding: 32px;
  border-radius: 16px;
  border: 1px solid #2d3748;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
    padding: 20px;
  }
`;

const ProfileImageContainer = styled.div`
  flex-shrink: 0;
  width: 300px;
  height: 450px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);

  @media (max-width: 768px) {
    width: 200px;
    height: 300px;
    margin: 0 auto;
  }
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProfileImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #718096;
  text-align: center;
  padding: 20px;
  font-size: 16px;
`;

const PersonInfo = styled.div`
  flex: 1;
  color: #ffffff;
`;

const PersonName = styled.h1`
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 16px;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 28px;
    text-align: center;
  }
`;

const PersonMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
  font-size: 16px;

  @media (max-width: 768px) {
    align-items: center;
  }
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #cbd5e0;
`;

const KnownFor = styled.div`
  background-color: rgba(66, 153, 225, 0.1);
  color: #4299e1;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  display: inline-block;
  margin-bottom: 20px;
`;

const Biography = styled.p`
  font-size: 16px;
  line-height: 1.7;
  color: #e2e8f0;
  margin-bottom: 24px;
`;

const Section = styled.section`
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

const CreditsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
`;

const CreditCard = styled(Link)`
  background-color: #1a1d29;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
  border: 1px solid #2d3748;
  display: flex;
  gap: 12px;
  padding: 12px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    border-color: #4299e1;
  }
`;

const CreditPoster = styled.img`
  width: 60px;
  height: 90px;
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0;
`;

const CreditPosterPlaceholder = styled.div`
  width: 60px;
  height: 90px;
  background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
  border-radius: 4px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #718096;
  font-size: 10px;
  text-align: center;
`;

const CreditInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const CreditTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 4px;
  line-height: 1.3;
`;

const CreditCharacter = styled.p`
  font-size: 12px;
  color: #cbd5e0;
  margin-bottom: 4px;
  line-height: 1.3;
`;

const CreditMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: #718096;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
`;

const TabButton = styled.button<{ $isActive: boolean }>`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: ${(props) => (props.$isActive ? '#4299e1' : '#2d3748')};
  color: ${(props) => (props.$isActive ? '#ffffff' : '#cbd5e0')};

  &:hover {
    background-color: ${(props) => (props.$isActive ? '#3182ce' : '#4a5568')};
    color: #ffffff;
  }
`;

const PersonDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'movie' | 'tv'>('movie');

  const personId = params?.id as string;

  useEffect(() => {
    if (!personId) {
      setError('Invalid person ID');
      setLoading(false);
      return;
    }

    const loadPersonDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const personData = await fetchPersonDetails(personId);
        setPerson(personData);
      } catch (err) {
        setError('Failed to load person details. Please try again.');
        console.error('Error loading person details:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPersonDetails();
  }, [personId]);

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const calculateAge = (birthday: string | null, deathday: string | null): string => {
    if (!birthday) return '';
    const birthDate = new Date(birthday);
    const endDate = deathday ? new Date(deathday) : new Date();
    const age = Math.floor((endDate.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    return deathday ? `(${age} years old at death)` : `(${age} years old)`;
  };

  const getBreadcrumbItems = (): Array<{ label: string; href?: string }> => {
    const items: Array<{ label: string; href?: string }> = [
      { label: 'Home', href: '/' }
    ];

    if (person) {
      items.push({ label: person.name });
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

  if (!person) {
    return (
      <PageContainer>
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Not Found' }]} />
        <BackButton onClick={() => router.back()}>
          ← Back
        </BackButton>
        <ErrorMessage message="Person not found" />
      </PageContainer>
    );
  }

  const movieCredits = person.movie_credits?.cast || [];
  const tvCredits = person.tv_credits?.cast || [];

  return (
    <PageContainer>
      <Breadcrumb items={getBreadcrumbItems()} />
      <BackButton onClick={() => router.back()}>
        ← Back
      </BackButton>
      
      <DetailsContainer>
        <HeroSection>
          <ProfileImageContainer>
            {person.profile_path ? (
              <ProfileImage
                src={getImageUrl(person.profile_path, 'w500')}
                alt={person.name}
              />
            ) : (
              <ProfileImagePlaceholder>
                No photo available
              </ProfileImagePlaceholder>
            )}
          </ProfileImageContainer>
          
          <PersonInfo>
            <PersonName>{person.name}</PersonName>
            
            <KnownFor>{person.known_for_department}</KnownFor>
            
            <PersonMeta>
              {person.birthday && (
                <MetaItem>
                  <FontAwesomeIcon icon={faBirthdayCake} />
                  <span>
                    {formatDate(person.birthday)} {calculateAge(person.birthday, person.deathday)}
                  </span>
                </MetaItem>
              )}
              
              {person.deathday && (
                <MetaItem>
                  <FontAwesomeIcon icon={faCalendar} />
                  <span>Died: {formatDate(person.deathday)}</span>
                </MetaItem>
              )}
              
              {person.place_of_birth && (
                <MetaItem>
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                  <span>{person.place_of_birth}</span>
                </MetaItem>
              )}
            </PersonMeta>
            
            {person.biography && (
              <Biography>
                {person.biography.length > 500 
                  ? `${person.biography.substring(0, 500)}...` 
                  : person.biography
                }
              </Biography>
            )}
          </PersonInfo>
        </HeroSection>

        {(movieCredits.length > 0 || tvCredits.length > 0) && (
          <Section>
            <SectionTitle>Known For</SectionTitle>
            
            <TabContainer>
              {movieCredits.length > 0 && (
                <TabButton
                  $isActive={activeTab === 'movie'}
                  onClick={() => setActiveTab('movie')}
                >
                  Movies ({movieCredits.length})
                </TabButton>
              )}
              {tvCredits.length > 0 && (
                <TabButton
                  $isActive={activeTab === 'tv'}
                  onClick={() => setActiveTab('tv')}
                >
                  TV Shows ({tvCredits.length})
                </TabButton>
              )}
            </TabContainer>
            
            <CreditsGrid>
              {activeTab === 'movie' ? (
                movieCredits
                  .sort((a, b) => new Date(b.release_date || '').getTime() - new Date(a.release_date || '').getTime())
                  .slice(0, 20)
                  .map((credit) => (
                    <CreditCard key={`movie-${credit.id}`} href={`/movies/${credit.id}`}>
                      {credit.poster_path ? (
                        <CreditPoster
                          src={getImageUrl(credit.poster_path, 'w185')}
                          alt={credit.title}
                        />
                      ) : (
                        <CreditPosterPlaceholder>
                          No poster
                        </CreditPosterPlaceholder>
                      )}
                      <CreditInfo>
                        <CreditTitle>{credit.title}</CreditTitle>
                        <CreditCharacter>{credit.character}</CreditCharacter>
                        <CreditMeta>
                          <FontAwesomeIcon icon={faCalendar} size="xs" />
                          {new Date(credit.release_date || '').getFullYear() || 'TBA'}
                          {credit.vote_average > 0 && (
                            <>
                              <FontAwesomeIcon icon={faStar} size="xs" />
                              {credit.vote_average.toFixed(1)}
                            </>
                          )}
                        </CreditMeta>
                      </CreditInfo>
                    </CreditCard>
                  ))
              ) : (
                tvCredits
                  .sort((a, b) => new Date(b.first_air_date || '').getTime() - new Date(a.first_air_date || '').getTime())
                  .slice(0, 20)
                  .map((credit) => (
                    <CreditCard key={`tv-${credit.id}`} href={`/tv/${credit.id}`}>
                      {credit.poster_path ? (
                        <CreditPoster
                          src={getImageUrl(credit.poster_path, 'w185')}
                          alt={credit.name}
                        />
                      ) : (
                        <CreditPosterPlaceholder>
                          No poster
                        </CreditPosterPlaceholder>
                      )}
                      <CreditInfo>
                        <CreditTitle>{credit.name}</CreditTitle>
                        <CreditCharacter>{credit.character}</CreditCharacter>
                        <CreditMeta>
                          <FontAwesomeIcon icon={faCalendar} size="xs" />
                          {new Date(credit.first_air_date || '').getFullYear() || 'TBA'}
                          {credit.episode_count && (
                            <span>({credit.episode_count} episodes)</span>
                          )}
                          {credit.vote_average > 0 && (
                            <>
                              <FontAwesomeIcon icon={faStar} size="xs" />
                              {credit.vote_average.toFixed(1)}
                            </>
                          )}
                        </CreditMeta>
                      </CreditInfo>
                    </CreditCard>
                  ))
              )}
            </CreditsGrid>
          </Section>
        )}
      </DetailsContainer>
    </PageContainer>
  );
};

export default PersonDetailPage;