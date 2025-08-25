'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faChevronDown, faChevronUp, faTimes } from '@fortawesome/free-solid-svg-icons';
import { fetchGenres } from '../../utils/api';
import { Genre } from '../../types/movie';

const FilterContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 16px 20px;
  background-color: #1a1d29;
  border: 2px solid #2d3748;
  border-radius: 12px;
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;

  &:hover {
    border-color: #4a5568;
    background-color: #212836;
  }

  &.active {
    border-color: #4299e1;
    background-color: #212836;
  }

  @media (max-width: 768px) {
    padding: 14px 18px;
    font-size: 15px;
  }

  @media (max-width: 480px) {
    padding: 12px 16px;
    font-size: 14px;
  }
`;

const FilterButtonContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const FilterButtonText = styled.span`
  color: #cbd5e0;
  
  &.has-selection {
    color: #4299e1;
  }
`;

const SelectedCount = styled.span`
  background-color: #4299e1;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
`;

const FilterDropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background-color: #1a1d29;
  border: 1px solid #2d3748;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transform: translateY(${props => props.$isOpen ? 0 : -8}px);
  transition: all 0.3s ease;
`;

const DropdownHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #2d3748;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DropdownTitle = styled.h3`
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
`;

const ClearAllButton = styled.button`
  background: none;
  border: none;
  color: #e53e3e;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(229, 62, 62, 0.1);
  }

  &:disabled {
    color: #4a5568;
    cursor: not-allowed;
  }
`;

const GenreList = styled.div`
  padding: 8px 0;
`;

const GenreItem = styled.label`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #2d3748;
  }
`;

const GenreCheckbox = styled.input.attrs({ type: 'checkbox' })`
  width: 18px;
  height: 18px;
  margin-right: 12px;
  cursor: pointer;
  accent-color: #4299e1;
`;

const GenreName = styled.span`
  color: #cbd5e0;
  font-size: 14px;
  font-weight: 500;
  flex: 1;
`;

const LoadingMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: #718096;
  font-size: 14px;
`;

const ErrorMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: #e53e3e;
  font-size: 14px;
`;

interface GenreFilterProps {
  selectedGenres: number[];
  onChange: (selectedGenres: number[]) => void;
  placeholder?: string;
}

const GenreFilter: React.FC<GenreFilterProps> = ({
  selectedGenres,
  onChange,
  placeholder = "Filter by genres"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        setLoading(true);
        setError(null);
        const genreData = await fetchGenres();
        setGenres(genreData);
      } catch (err) {
        setError('Failed to load genres');
        console.error('Error loading genres:', err);
      } finally {
        setLoading(false);
      }
    };

    loadGenres();
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleGenreChange = (genreId: number, isChecked: boolean) => {
    if (isChecked) {
      onChange([...selectedGenres, genreId]);
    } else {
      onChange(selectedGenres.filter(id => id !== genreId));
    }
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const getSelectedGenreNames = (): string => {
    if (selectedGenres.length === 0) return placeholder;
    if (selectedGenres.length === 1) {
      const genre = genres.find(g => g.id === selectedGenres[0]);
      return genre?.name || placeholder;
    }
    return `${selectedGenres.length} genres selected`;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-genre-filter]')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <FilterContainer data-genre-filter>
      <FilterButton
        onClick={handleToggle}
        className={isOpen ? 'active' : ''}
      >
        <FilterButtonContent>
          <FontAwesomeIcon icon={faFilter} color="#4299e1" />
          <FilterButtonText className={selectedGenres.length > 0 ? 'has-selection' : ''}>
            {getSelectedGenreNames()}
          </FilterButtonText>
          {selectedGenres.length > 0 && (
            <SelectedCount>{selectedGenres.length}</SelectedCount>
          )}
        </FilterButtonContent>
        <FontAwesomeIcon
          icon={isOpen ? faChevronUp : faChevronDown}
          color="#718096"
          size="sm"
        />
      </FilterButton>

      <FilterDropdown $isOpen={isOpen}>
        <DropdownHeader>
          <DropdownTitle>Filter by Genre</DropdownTitle>
          <ClearAllButton
            onClick={handleClearAll}
            disabled={selectedGenres.length === 0}
          >
            <FontAwesomeIcon icon={faTimes} size="sm" style={{ marginRight: '4px' }} />
            Clear All
          </ClearAllButton>
        </DropdownHeader>

        {loading && (
          <LoadingMessage>Loading genres...</LoadingMessage>
        )}

        {error && (
          <ErrorMessage>{error}</ErrorMessage>
        )}

        {!loading && !error && (
          <GenreList>
            {genres.map((genre) => (
              <GenreItem key={genre.id}>
                <GenreCheckbox
                  checked={selectedGenres.includes(genre.id)}
                  onChange={(e) => handleGenreChange(genre.id, e.target.checked)}
                />
                <GenreName>{genre.name}</GenreName>
              </GenreItem>
            ))}
          </GenreList>
        )}
      </FilterDropdown>
    </FilterContainer>
  );
};

export default GenreFilter;