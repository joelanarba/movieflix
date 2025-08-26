'use client';

import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faFilm, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const DialogOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  animation: ${props => props.$isOpen ? fadeIn : 'none'} 0.3s ease-out;
`;

const DialogContent = styled.div`
  background: linear-gradient(135deg, #1a1d29 0%, #2d3748 100%);
  border-radius: 20px;
  padding: 40px;
  max-width: 480px;
  width: 100%;
  position: relative;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  border: 1px solid #2d3748;
  animation: ${slideUp} 0.4s ease-out;

  @media (max-width: 480px) {
    padding: 32px 24px;
    margin: 20px;
    border-radius: 16px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #cbd5e0;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: #ffffff;
    transform: scale(1.1);
  }

  @media (max-width: 480px) {
    top: 16px;
    right: 16px;
    width: 36px;
    height: 36px;
  }
`;

const LogoSection = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const LogoIcon = styled.div`
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  box-shadow: 0 8px 25px rgba(66, 153, 225, 0.3);

  @media (max-width: 480px) {
    width: 64px;
    height: 64px;
  }
`;

const WelcomeTitle = styled.h1`
  font-size: 32px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 12px;
  line-height: 1.2;

  @media (max-width: 480px) {
    font-size: 28px;
    margin-bottom: 8px;
  }
`;

const WelcomeSubtitle = styled.p`
  font-size: 18px;
  color: #cbd5e0;
  line-height: 1.5;
  margin-bottom: 32px;

  @media (max-width: 480px) {
    font-size: 16px;
    margin-bottom: 24px;
  }
`;

const SignInButton = styled.button<{ $isLoading?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: #ffffff;
  color: #1a202c;
  border: none;
  padding: 16px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 24px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

  &:hover:not(:disabled) {
    background: #f7fafc;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 480px) {
    padding: 14px 20px;
    font-size: 15px;
  }
`;

const BrowseButton = styled.button`
  width: 100%;
  background: transparent;
  color: #cbd5e0;
  border: 1px solid #4a5568;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(74, 85, 104, 0.2);
    color: #ffffff;
    border-color: #718096;
  }

  @media (max-width: 480px) {
    padding: 10px 20px;
    font-size: 13px;
  }
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 24px 0;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #e2e8f0;
  font-size: 14px;
  margin-bottom: 12px;
  line-height: 1.4;

  &:before {
    content: '✓';
    background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
    flex-shrink: 0;
  }

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid #cbd5e0;
  border-top: 2px solid #1a202c;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

interface SignInDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignInDialog: React.FC<SignInDialogProps> = ({ isOpen, onClose }) => {
  const { signInWithGoogle } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signInWithGoogle();
      onClose(); // Close dialog on successful sign in
    } catch (error) {
      console.error('Failed to sign in:', error);
      setIsSigningIn(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Prevent body scroll when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <DialogOverlay $isOpen={isOpen} onClick={handleOverlayClick}>
      <DialogContent>
        <CloseButton onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </CloseButton>

        <LogoSection>
          <LogoIcon>
            <FontAwesomeIcon icon={faFilm} size="2x" color="white" />
          </LogoIcon>
          <WelcomeTitle>Welcome to MovieFlix!</WelcomeTitle>
          <WelcomeSubtitle>
            Sign in to unlock personalized movie recommendations and save your favorites
          </WelcomeSubtitle>
        </LogoSection>

        <SignInButton onClick={handleSignIn} disabled={isSigningIn} $isLoading={isSigningIn}>
          {isSigningIn ? (
            <>
              <LoadingSpinner />
              <span>Signing you in...</span>
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faGoogle} size="lg" />
              <span>Continue with Google</span>
            </>
          )}
        </SignInButton>

        <BrowseButton onClick={onClose}>
          Continue browsing without signing in
        </BrowseButton>

        <FeaturesList>
          <FeatureItem>Save and organize your favorite movies</FeatureItem>
          <FeatureItem>Get personalized movie recommendations</FeatureItem>
          <FeatureItem>Sync your preferences across all devices</FeatureItem>
          <FeatureItem>Access exclusive features and content</FeatureItem>
        </FeaturesList>
      </DialogContent>
    </DialogOverlay>
  );
};

export default SignInDialog;