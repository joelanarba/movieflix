'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Video } from '../../types/movie';

const TrailerSection = styled.section`
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

const TrailerContainer = styled.div`
  position: relative;
  overflow: hidden;
`;

const TrailerScrollWrapper = styled.div`
  display: flex;
  gap: 20px;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding-bottom: 10px;
  scrollbar-width: thin;
  scrollbar-color: #4299e1 #2d3748;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #2d3748;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #4299e1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #3182ce;
  }
`;

const TrailerCard = styled.div`
  flex-shrink: 0;
  width: 320px;
  background-color: #1a1d29;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #2d3748;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    border-color: #4299e1;
  }

  @media (max-width: 768px) {
    width: 280px;
  }
`;

const TrailerThumbnail = styled.div`
  position: relative;
  width: 100%;
  height: 180px;
  background-color: #2d3748;
  cursor: pointer;
  overflow: hidden;
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${TrailerCard}:hover & {
    transform: scale(1.05);
  }
`;

const PlayButton = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 20px;
  backdrop-filter: blur(4px);
  transition: all 0.3s ease;

  ${TrailerCard}:hover & {
    background-color: rgba(66, 153, 225, 0.9);
    transform: translate(-50%, -50%) scale(1.1);
  }
`;

const OfficialBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: rgba(66, 153, 225, 0.9);
  color: #ffffff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  backdrop-filter: blur(4px);
`;

const TrailerInfo = styled.div`
  padding: 16px;
`;

const TrailerTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 8px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const TrailerType = styled.span`
  font-size: 12px;
  color: #4299e1;
  font-weight: 500;
  text-transform: uppercase;
`;

const ScrollButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background-color: rgba(66, 153, 225, 0.9);
  color: #ffffff;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);

  &:hover {
    background-color: rgba(66, 153, 225, 1);
    transform: translateY(-50%) scale(1.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: translateY(-50%) scale(1);
  }

  &.left {
    left: 10px;
  }

  &.right {
    right: 10px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const VideoModal = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 1000;
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 900px;
  aspect-ratio: 16/9;
`;

const VideoIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 8px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: -50px;
  right: 0;
  background: none;
  border: none;
  color: #ffffff;
  font-size: 24px;
  cursor: pointer;
  padding: 10px;
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #718096;
  font-size: 16px;
`;

interface TrailerListProps {
  videos: Video[];
  title?: string;
}

const TrailerList: React.FC<TrailerListProps> = ({ videos, title = "Trailers" }) => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Filter and sort trailers
  const trailers = videos
    .filter(video => video.site === 'YouTube' && (video.type === 'Trailer' || video.type === 'Teaser'))
    .sort((a, b) => {
      // Official trailers first
      if (a.official && !b.official) return -1;
      if (!a.official && b.official) return 1;
      // Then by type (Trailer before Teaser)
      if (a.type === 'Trailer' && b.type === 'Teaser') return -1;
      if (a.type === 'Teaser' && b.type === 'Trailer') return 1;
      // Finally by publication date (newest first)
      return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
    });

  const updateScrollButtons = () => {
    const container = document.getElementById('trailer-scroll-container');
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth
      );
    }
  };

  useEffect(() => {
    const container = document.getElementById('trailer-scroll-container');
    if (container) {
      container.addEventListener('scroll', updateScrollButtons);
      updateScrollButtons();
      return () => container.removeEventListener('scroll', updateScrollButtons);
    }
  }, [trailers]);

  const scrollLeft = () => {
    const container = document.getElementById('trailer-scroll-container');
    if (container) {
      container.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = document.getElementById('trailer-scroll-container');
    if (container) {
      container.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
  };

  const closeModal = () => {
    setSelectedVideo(null);
  };

  const getYouTubeThumbnail = (key: string): string => {
    return `https://img.youtube.com/vi/${key}/maxresdefault.jpg`;
  };

  if (trailers.length === 0) {
    return (
      <TrailerSection>
        <SectionTitle>{title}</SectionTitle>
        <EmptyState>No trailers available</EmptyState>
      </TrailerSection>
    );
  }

  return (
    <TrailerSection>
      <SectionTitle>{title}</SectionTitle>
      <TrailerContainer>
        {trailers.length > 1 && (
          <>
            <ScrollButton 
              className="left" 
              onClick={scrollLeft} 
              disabled={!canScrollLeft}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </ScrollButton>
            <ScrollButton 
              className="right" 
              onClick={scrollRight} 
              disabled={!canScrollRight}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </ScrollButton>
          </>
        )}
        
        <TrailerScrollWrapper id="trailer-scroll-container">
          {trailers.map((video) => (
            <TrailerCard key={video.id} onClick={() => handleVideoClick(video)}>
              <TrailerThumbnail>
                <ThumbnailImage
                  src={getYouTubeThumbnail(video.key)}
                  alt={video.name}
                  loading="lazy"
                />
                <PlayButton>
                  <FontAwesomeIcon icon={faPlay} />
                </PlayButton>
                {video.official && <OfficialBadge>Official</OfficialBadge>}
              </TrailerThumbnail>
              <TrailerInfo>
                <TrailerTitle>{video.name}</TrailerTitle>
                <TrailerType>{video.type}</TrailerType>
              </TrailerInfo>
            </TrailerCard>
          ))}
        </TrailerScrollWrapper>
      </TrailerContainer>

      <VideoModal $isOpen={!!selectedVideo} onClick={closeModal}>
        {selectedVideo && (
          <VideoWrapper onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={closeModal}>×</CloseButton>
            <VideoIframe
              src={`https://www.youtube.com/embed/${selectedVideo.key}?autoplay=1&rel=0`}
              title={selectedVideo.name}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </VideoWrapper>
        )}
      </VideoModal>
    </TrailerSection>
  );
};

export default TrailerList;
