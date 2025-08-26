
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styled from 'styled-components';
import { TVShowDetails as TVShowDetailsType } from '../../../types/tv';
import { fetchTVShowDetails } from '../../../utils/tvApi';
import TVShowDetails from '../../../components/TV/TVShowDetails';
import Breadcrumb from '../../../components/ui/Breadcrumb';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import ErrorMessage from '../../../components/ui/ErrorMessage';

const PageContainer = styled.div`
  min-height: calc(100vh - 80px);
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

const ContentContainer = styled.div`
  padding-top: 0;
`;

const TVShowDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const [tvShow, setTVShow] = useState<TVShowDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tvId = params?.id as string;

  useEffect(() => {
    if (!tvId) {
      setError('Invalid TV show ID');
      setLoading(false);
      return;
    }

    const loadTVShowDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const tvShowData = await fetchTVShowDetails(tvId);
        setTVShow(tvShowData);
      } catch (err) {
        setError('Failed to load TV show details. Please try again.');
        console.error('Error loading TV show details:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTVShowDetails();
  }, [tvId]);

  // Generate breadcrumb items
  const getBreadcrumbItems = (): Array<{ label: string; href?: string }> => {
    const items: Array<{ label: string; href?: string }> = [
      { label: 'Home', href: '/' },
      { label: 'TV Shows', href: '/tv' }
    ];

    // Add current TV show title
    if (tvShow) {
      items.push({ label: tvShow.name });
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
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'TV Shows', href: '/tv' }, { label: 'Error' }]} />
        <BackButton onClick={() => router.back()}>
          ← Back
        </BackButton>
        <ErrorMessage message={error} />
      </PageContainer>
    );
  }

  if (!tvShow) {
    return (
      <PageContainer>
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'TV Shows', href: '/tv' }, { label: 'Not Found' }]} />
        <BackButton onClick={() => router.back()}>
          ← Back
        </BackButton>
        <ErrorMessage message="TV show not found" />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Breadcrumb items={getBreadcrumbItems()} />
      <BackButton onClick={() => router.back()}>
        ← Back to TV Shows
      </BackButton>
      <ContentContainer>
        <TVShowDetails tvShow={tvShow} />
      </ContentContainer>
    </PageContainer>
  );
};

export default TVShowDetailPage;