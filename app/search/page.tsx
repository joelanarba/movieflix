// app/search/page.tsx
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styled from 'styled-components';
import { Movie, TMDbResponse } from '../../types/movie';
import { searchMovies, discoverMoviesByGenre } from '../../utils/api';
import MovieGrid from '../../components/Movies/MovieGrid';
import SearchBar from '../../components/ui/SearchBar';
import GenreFilter from '../../components/ui/GenreFilter';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';

// ... keep all your existing styled components ...

const PageContainer = styled.div`
  min-height: calc(100vh - 80px);
  padding: 20px 0;
`;

const SearchSection = styled.section`
  background: linear-gradient(135deg, #1a1d29 0%, #2d3748 50%, #1a1d29 100%);
  padding: 40px 20px;
  margin-bottom: 40px;
`;

const SearchContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SearchTitle = styled.h1`
  font-size: 36px;
  font-weight: bold;
  color: #ffffff;
  text-align: center;
  margin-bottom: 32px;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 28px;
    margin-bottom: 24px;
  }

  @media (max-width: 480px) {
    font-size: 24px;
    margin-bottom: 20px;
  }
`;

const SearchControls = styled.div`
  display: flex;
  gap: 20px;
  align-items: flex-start;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 16px;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const ResultsSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const ResultsHeader = styled.div`
  margin-bottom: 32px;
  text-align: center;

  @media (max-width: 768px) {
    margin-bottom: 24px;
  }
`;

const ResultsTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 8px;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const ResultsSubtitle = styled.p`
  color: #cbd5e0;
  font-size: 16px;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const LoadMoreButton = styled.button`
  display: block;
  margin: 40px auto;
  background-color: #4299e1;
  color: white;
  border: none;
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #3182ce;
    transform: translateY(-1px);
  }

  &:disabled {
    background-color: #4a5568;
    cursor: not-allowed;
    transform: none;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: #718096;
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
  max-width: 400px;
  margin: 0 auto;
`;

// Create a separate component for the search functionality
const SearchResultsContent: React.FC = () => {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '');
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // Load movies based on search query or genre filters
  const loadMovies = async (page: number = 1, append: boolean = false) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      let result: TMDbResponse<Movie>;
      
      if (searchQuery.trim()) {
        result = await searchMovies(searchQuery.trim(), page);
      } else if (selectedGenres.length > 0) {
        result = await discoverMoviesByGenre(selectedGenres, page);
      } else {
        // No search query or genres selected
        setMovies([]);
        setTotalResults(0);
        setHasMore(false);
        return;
      }

      if (append) {
        setMovies(prev => [...prev, ...result.results]);
      } else {
        setMovies(result.results);
      }

      setTotalResults(result.total_results);
      setHasMore(page < result.total_pages && result.results.length === 20);
    } catch (err) {
      setError('Failed to load movies. Please try again.');
      console.error('Error loading movies:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedGenres([]);
    setCurrentPage(1);
  };

  // Handle genre filter change
  const handleGenreChange = (genres: number[]) => {
    setSelectedGenres(genres);
    if (genres.length > 0) {
      setSearchQuery('');
    }
    setCurrentPage(1);
  };

  // Load more results
  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      loadMovies(nextPage, true);
    }
  };

  // Load movies when search query or genres change
  useEffect(() => {
    if (searchQuery.trim() || selectedGenres.length > 0) {
      loadMovies(1, false);
    } else {
      setMovies([]);
      setTotalResults(0);
      setHasMore(false);
    }
  }, [searchQuery, selectedGenres]);

  // Get results description
  const getResultsDescription = (): string => {
    if (loading) return '';
    
    if (searchQuery.trim()) {
      return totalResults === 0
        ? `No results found for "${searchQuery}"`
        : `${totalResults.toLocaleString()} results for "${searchQuery}"`;
    }
    
    if (selectedGenres.length > 0) {
      const genreText = selectedGenres.length === 1 ? 'genre' : 'genres';
      return totalResults === 0
        ? `No movies found for selected ${genreText}`
        : `${totalResults.toLocaleString()} movies found for selected ${genreText}`;
    }
    
    return '';
  };

  return (
    <>
      <SearchSection>
        <SearchContainer>
          <SearchTitle>Search & Discover Movies</SearchTitle>
          <SearchControls>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              placeholder="Search for movies..."
              isLoading={loading}
            />
            <GenreFilter
              selectedGenres={selectedGenres}
              onChange={handleGenreChange}
              placeholder="Filter by genres"
            />
          </SearchControls>
        </SearchContainer>
      </SearchSection>

      <ResultsSection>
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage message={error} onRetry={() => loadMovies(1, false)} />
        ) : movies.length > 0 ? (
          <>
            <ResultsHeader>
              <ResultsTitle>Search Results</ResultsTitle>
              <ResultsSubtitle>{getResultsDescription()}</ResultsSubtitle>
            </ResultsHeader>
            <MovieGrid movies={movies} />
            {hasMore && (
              <LoadMoreButton onClick={handleLoadMore} disabled={loadingMore}>
                {loadingMore ? 'Loading...' : 'Load More Results'}
              </LoadMoreButton>
            )}
          </>
        ) : (searchQuery.trim() || selectedGenres.length > 0) ? (
          <EmptyState>
            <EmptyStateTitle>No Results Found</EmptyStateTitle>
            <EmptyStateText>
              {searchQuery.trim()
                ? `We couldn't find any movies matching "${searchQuery}". Try a different search term.`
                : 'No movies found for the selected genres. Try selecting different genres.'
              }
            </EmptyStateText>
          </EmptyState>
        ) : (
          <EmptyState>
            <EmptyStateTitle>Start Your Search</EmptyStateTitle>
            <EmptyStateText>
              Use the search bar to find movies by title, or use the genre filter to discover movies by category.
            </EmptyStateText>
          </EmptyState>
        )}
      </ResultsSection>
    </>
  );
};

// Main component with Suspense boundary
const SearchResultsPage: React.FC = () => {
  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Search' }
  ];

  return (
    <PageContainer>
      <Breadcrumb items={breadcrumbItems} />
      <Suspense fallback={<LoadingSpinner />}>
        <SearchResultsContent />
      </Suspense>
    </PageContainer>
  );
};

export default SearchResultsPage;