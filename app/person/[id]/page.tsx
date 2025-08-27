'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styled from 'styled-components';
import { Person } from '../../../types/tv';
import { fetchPersonDetails } from '../../../utils/tvApi';
import PersonDetails from '../../../components/Person/PersonDetails';
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

const PersonDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Generate breadcrumb items
  const getBreadcrumbItems = (): Array<{ label: string; href?: string }> => {
    const items: Array<{ label: string; href?: string }> = [
      { label: 'Home', href: '/' }
    ];

    // Add current person name
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

  return (
    <PageContainer>
      <Breadcrumb items={getBreadcrumbItems()} />
      <BackButton onClick={() => router.back()}>
        ← Back
      </BackButton>
      <ContentContainer>
        <PersonDetails person={person} />
      </ContentContainer>
    </PageContainer>
  );
};

export default PersonDetailPage;