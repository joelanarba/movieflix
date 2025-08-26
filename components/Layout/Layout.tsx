'use client';

import React from 'react';
import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';

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
  return (
    <LayoutContainer>
      <Header />
      <MainContent>{children}</MainContent>
      <Footer />
    </LayoutContainer>
  );
};

export default Layout;