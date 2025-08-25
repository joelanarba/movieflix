'use client';

import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
`;

const SearchInputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 16px 20px 16px 50px;
  background-color: #1a1d29;
  border: 2px solid #2d3748;
  border-radius: 12px;
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  outline: none;

  &::placeholder {
    color: #718096;
  }

  &:focus {
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
    background-color: #212836;
  }

  @media (max-width: 768px) {
    padding: 14px 18px 14px 45px;
    font-size: 15px;
  }

  @media (max-width: 480px) {
    padding: 12px 16px 12px 40px;
    font-size: 14px;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 18px;
  color: #718096;
  pointer-events: none;
  z-index: 1;
  transition: color 0.3s ease;

  ${SearchInput}:focus + & {
    color: #4299e1;
  }

  @media (max-width: 480px) {
    left: 14px;
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 16px;
  background: none;
  border: none;
  color: #718096;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.3s ease;
  opacity: 0;
  transform: scale(0.8);

  &.visible {
    opacity: 1;
    transform: scale(1);
  }

  &:hover {
    color: #e53e3e;
    background-color: rgba(229, 62, 62, 0.1);
  }

  @media (max-width: 480px) {
    right: 12px;
  }
`;

const SearchSuggestions = styled.div<{ $isVisible: boolean }>`
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
  opacity: ${props => props.$isVisible ? 1 : 0};
  visibility: ${props => props.$isVisible ? 'visible' : 'hidden'};
  transform: translateY(${props => props.$isVisible ? 0 : -8}px);
  transition: all 0.3s ease;
`;

const SuggestionItem = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  color: #cbd5e0;
  font-size: 14px;
  border-bottom: 1px solid #2d3748;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #2d3748;
    color: #ffffff;
  }

  &:first-child {
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
  }

  &:last-child {
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
  }
`;

const NoResultsMessage = styled.div`
  padding: 16px;
  text-align: center;
  color: #718096;
  font-size: 14px;
`;

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
  isLoading?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSearch,
  placeholder = "Search for movies...",
  suggestions = [],
  onSuggestionClick,
  isLoading = false
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setShowSuggestions(newValue.length > 0 && suggestions.length > 0);
  }, [onChange, suggestions.length]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }

    if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef?.blur();
    }
  }, [value]);

  const handleSearch = useCallback(() => {
    if (value.trim()) {
      onSearch(value.trim());
      setShowSuggestions(false);
      inputRef?.blur();
    }
  }, [value, onSearch, inputRef]);

  const handleClear = useCallback(() => {
    onChange('');
    setShowSuggestions(false);
    inputRef?.focus();
  }, [onChange]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    if (onSuggestionClick) {
      onSuggestionClick(suggestion);
    } else {
      onSearch(suggestion);
    }
    inputRef?.blur();
  }, [onChange, onSuggestionClick, onSearch, inputRef]);

  const handleFocus = () => {
    if (value.length > 0 && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => setShowSuggestions(false), 150);
  };

  return (
    <SearchContainer>
      <SearchInputContainer>
        <SearchInput
          ref={setInputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={isLoading}
        />
        <SearchIcon>
          <FontAwesomeIcon icon={faSearch} size="sm" />
        </SearchIcon>
        <ClearButton
          className={value ? 'visible' : ''}
          onClick={handleClear}
          type="button"
        >
          <FontAwesomeIcon icon={faTimes} size="sm" />
        </ClearButton>
      </SearchInputContainer>

      <SearchSuggestions $isVisible={showSuggestions}>
        {suggestions.length > 0 ? (
          suggestions.map((suggestion, index) => (
            <SuggestionItem
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </SuggestionItem>
          ))
        ) : (
          value.length > 0 && (
            <NoResultsMessage>
              No suggestions found
            </NoResultsMessage>
          )
        )}
      </SearchSuggestions>
    </SearchContainer>
  );
};

export default SearchBar;