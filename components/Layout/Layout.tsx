'use client';

import React from 'react';
import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';
import SignInDialog from '../ui/SignInDialog';
import { useSignInPrompt } from '../../hooks/useSignInPrompt';

const LayoutContainer = styled.div`
  min-height: 100vh;
  background-color: #0f1419;
  color: #ffffff;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  padding-top: 80px; 
  flex: 1;

  @media (max-width: 768px) {
    padding-top: 70px; 
  }
`;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { showDialog, handleClose } = useSignInPrompt();

  return (
    <LayoutContainer>
      <Header />
      <MainContent>{children}</MainContent>
      <Footer />
      <SignInDialog isOpen={showDialog} onClose={handleClose} />
    </LayoutContainer>
  );
};

export default Layout;