'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import SearchBar from './SearchBar';
import GenreFilter from './GenreFilter';

const FilterBarContainer = styled.div`
  background: linear-gradient(135deg, #1a1d29 0%, #2d3748 50%, #1a1d29 100%);
  padding: 32px 20px;
  margin-bottom: 40px;
  border-bottom: 1px solid #2d3748;
`;

const FilterBarContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
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

const FilterTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #ffffff;
  text-align: center;
  margin-bottom: 24px;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 20px;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    font-size: 18px;
    margin-bottom: 16px;
  }
`;

interface SearchFilterBarProps {
  title?: string;
  showSearch?: boolean;
  showGenreFilter?: boolean;
  searchPlaceholder?: string;
  onGenreFilter?: (genreIds: number[]) => void;
  selectedGenres?: number[];
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  title = "Search & Filter Movies",
  showSearch = true,
  showGenreFilter = true,
  searchPlaceholder = "Search for movies...",
  onGenreFilter,
  selectedGenres = []
}) => {
  const router = useRouter();

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleGenreChange = (genreIds: number[]) => {
    if (onGenreFilter) {
      onGenreFilter(genreIds);
    } else {
      // Navigate to search page with genre filters
      if (genreIds.length > 0) {
        router.push(`/search?genres=${genreIds.join(',')}`);
      }
    }
  };

  return (
    <FilterBarContainer>
      <FilterBarContent>
        {title && <FilterTitle>{title}</FilterTitle>}
        {(showSearch || showGenreFilter) && (
          <FilterBarContent>
            {showSearch && (
              <SearchBar
                value=""
                onChange={() => {}} // Controlled by internal state in SearchBar
                onSearch={handleSearch}
                placeholder={searchPlaceholder}
              />
            )}
            {showGenreFilter && (
              <GenreFilter
                selectedGenres={selectedGenres}
                onChange={handleGenreChange}
              />
            )}
          </FilterBarContent>
        )}
      </FilterBarContent>
    </FilterBarContainer>
  );
};

export default SearchFilterBar;