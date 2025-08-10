'use client';

import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  min-height: 200px;
  text-align: center;
`;

const ErrorIcon = styled.div`
  margin-bottom: 20px;
`;

const ErrorTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #e53e3e;
  margin-bottom: 12px;
`;

const ErrorText = styled.p`
  color: #cbd5e0;
  font-size: 16px;
  line-height: 1.6;
  max-width: 500px;
  margin: 0 auto;
`;

const RetryButton = styled.button`
  background-color: #4299e1;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;

  &:hover {
    background-color: #3182ce;
  }
`;

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <ErrorContainer>
      <ErrorIcon>
        <FontAwesomeIcon 
          icon={faExclamationTriangle} 
          size="3x" 
          color="#e53e3e" 
        />
      </ErrorIcon>
      <ErrorTitle>Oops! Something went wrong</ErrorTitle>
      <ErrorText>{message}</ErrorText>
      {onRetry && (
        <RetryButton onClick={onRetry}>
          Try Again
        </RetryButton>
      )}
    </ErrorContainer>
  );
};

export default ErrorMessage;