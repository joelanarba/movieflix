'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faUser } from '@fortawesome/free-solid-svg-icons';
import { fetchMovieReviews } from '../../utils/api';
import { MovieReview } from '../../types/movie';

const ReviewsSection = styled.div`
  margin-top: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 24px;
`;

const ReviewsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ReviewCard = styled.div`
  background-color: #1a1d29;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #2d3748;
  transition: all 0.3s ease;

  &:hover {
    border-color: #4299e1;
    box-shadow: 0 4px 12px rgba(66, 153, 225, 0.1);
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
`;

const AvatarContainer = styled.div`
  position: relative;
  flex-shrink: 0;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #4299e1;
`;

const AvatarPlaceholder = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #4299e1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: bold;
  font-size: 18px;
`;

const ReviewerInfo = styled.div`
  flex: 1;
`;

const ReviewerName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 4px;
`;

const ReviewMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
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
    if (props.$rating >= 8) return '#48bb78';
    if (props.$rating >= 6) return '#ed8936';
    return '#e53e3e';
  }};
`;

const ReviewDate = styled.span`
  color: #718096;
`;

const ReviewContent = styled.div`
  color: #cbd5e0;
  line-height: 1.7;
  font-size: 15px;
`;

const ReviewText = styled.p<{ $isExpanded: boolean; $isLong: boolean }>`
  margin: 0;
  ${props => !props.$isExpanded && props.$isLong && `
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
  `}
`;

const ShowMoreButton = styled.button`
  background: none;
  border: none;
  color: #4299e1;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  margin-top: 8px;
  padding: 4px 0;
  transition: color 0.2s ease;

  &:hover {
    color: #63b3ed;
  }
`;

const LoadingMessage = styled.div`
  color: #cbd5e0;
  font-size: 16px;
  text-align: center;
  padding: 40px 20px;
`;

const ErrorMessage = styled.div`
  color: #cbd5e0;
  font-size: 16px;
  text-align: center;
  padding: 40px 20px;
`;

const NoReviews = styled.div`
  color: #cbd5e0;
  font-size: 16px;
  text-align: center;
  padding: 40px 20px;
`;

const ShowMoreReviewsButton = styled.button`
  display: block;
  margin: 24px auto 0;
  background-color: #4299e1;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #3182ce;
  }

  &:disabled {
    background-color: #4a5568;
    cursor: not-allowed;
  }
`;

interface MovieReviewsProps {
  movieId: number;
}

const MovieReviews: React.FC<MovieReviewsProps> = ({ movieId }) => {
  const [reviews, setReviews] = useState<MovieReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());
  const [visibleReviews, setVisibleReviews] = useState(3);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        const movieReviews = await fetchMovieReviews(movieId.toString());
        setReviews(movieReviews);
      } catch (err) {
        setError('Failed to load reviews');
        console.error('Error loading reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      loadReviews();
    }
  }, [movieId]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatRating = (rating: number): number => {
    return Math.round(rating * 10) / 10;
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isReviewLong = (content: string): boolean => {
    return content.length > 400;
  };

  const toggleReviewExpansion = (reviewId: string) => {
    setExpandedReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const showMoreReviews = () => {
    setVisibleReviews(prev => Math.min(prev + 3, reviews.length));
  };

  if (loading) {
    return (
      <ReviewsSection>
        <SectionTitle>Reviews</SectionTitle>
        <LoadingMessage>Loading reviews...</LoadingMessage>
      </ReviewsSection>
    );
  }

  if (error) {
    return (
      <ReviewsSection>
        <SectionTitle>Reviews</SectionTitle>
        <ErrorMessage>{error}</ErrorMessage>
      </ReviewsSection>
    );
  }

  if (reviews.length === 0) {
    return (
      <ReviewsSection>
        <SectionTitle>Reviews</SectionTitle>
        <NoReviews>No reviews available for this movie.</NoReviews>
      </ReviewsSection>
    );
  }

  const displayedReviews = reviews.slice(0, visibleReviews);
  const hasMoreReviews = visibleReviews < reviews.length;

  return (
    <ReviewsSection>
      <SectionTitle>Reviews ({reviews.length})</SectionTitle>
      <ReviewsContainer>
        {displayedReviews.map((review) => {
          const isExpanded = expandedReviews.has(review.id);
          const isLong = isReviewLong(review.content);
          
          return (
            <ReviewCard key={review.id}>
              <ReviewHeader>
                <AvatarContainer>
                  {review.author_details.avatar_path ? (
                    <Avatar
                      src={review.author_details.avatar_path.startsWith('/http') 
                        ? review.author_details.avatar_path.slice(1)
                        : `https://image.tmdb.org/t/p/w185${review.author_details.avatar_path}`
                      }
                      alt={review.author_details.name || review.author}
                    />
                  ) : (
                    <AvatarPlaceholder>
                      {review.author_details.name 
                        ? getInitials(review.author_details.name)
                        : <FontAwesomeIcon icon={faUser} />
                      }
                    </AvatarPlaceholder>
                  )}
                </AvatarContainer>
                <ReviewerInfo>
                  <ReviewerName>
                    {review.author_details.name || review.author}
                  </ReviewerName>
                  <ReviewMeta>
                    {review.author_details.rating && (
                      <Rating>
                        <FontAwesomeIcon icon={faStar} color="#ffd700" size="sm" />
                        <RatingValue $rating={review.author_details.rating}>
                          {formatRating(review.author_details.rating)}/10
                        </RatingValue>
                      </Rating>
                    )}
                    <ReviewDate>
                      {formatDate(review.created_at)}
                    </ReviewDate>
                  </ReviewMeta>
                </ReviewerInfo>
              </ReviewHeader>
              <ReviewContent>
                <ReviewText 
                  $isExpanded={isExpanded} 
                  $isLong={isLong}
                >
                  {review.content}
                </ReviewText>
                {isLong && (
                  <ShowMoreButton 
                    onClick={() => toggleReviewExpansion(review.id)}
                  >
                    {isExpanded ? 'Show Less' : 'Show More'}
                  </ShowMoreButton>
                )}
              </ReviewContent>
            </ReviewCard>
          );
        })}
      </ReviewsContainer>
      {hasMoreReviews && (
        <ShowMoreReviewsButton onClick={showMoreReviews}>
          Show More Reviews ({reviews.length - visibleReviews} remaining)
        </ShowMoreReviewsButton>
      )}
    </ReviewsSection>
  );
};

export default MovieReviews;