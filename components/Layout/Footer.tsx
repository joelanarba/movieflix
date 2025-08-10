'use client';

import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #1a202c;
  color: #e2e8f0;
  padding: 40px 20px 20px;
  margin-top: auto;
  border-top: 1px solid #2d3748;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 20px;
  }
`;

const FooterSection = styled.div`
  h3 {
    color: #ffffff;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
  }

  p, a {
    color: #cbd5e0;
    font-size: 14px;
    line-height: 1.6;
    text-decoration: none;
    transition: color 0.2s ease;
  }

  a:hover {
    color: #4299e1;
  }
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    margin-bottom: 8px;
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid #2d3748;
  padding-top: 20px;
  text-align: center;
  color: #718096;
  font-size: 14px;

  @media (max-width: 768px) {
    padding-top: 15px;
    font-size: 12px;
  }
`;

const TMDbCredit = styled.p`
  margin-top: 8px;
  font-size: 12px;
  color: #4a5568;

  a {
    color: #4299e1;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <h3>MovieFlix</h3>
          <p>
            Discover amazing movies, explore detailed information, and save your favorites. 
            Your ultimate destination for movie discovery and entertainment.
          </p>
        </FooterSection>
        
        <FooterSection>
          <h3>Features</h3>
          <FooterLinks>
            <li><a href="/">Trending Movies</a></li>
            <li><a href="/favorites">My Favorites</a></li>
            <li><a href="/">Movie Search</a></li>
            <li><a href="/">Detailed Reviews</a></li>
          </FooterLinks>
        </FooterSection>
        
        <FooterSection>
          <h3>About</h3>
          <FooterLinks>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Contact</a></li>
          </FooterLinks>
        </FooterSection>
        
        <FooterSection>
          <h3>Connect</h3>
          <FooterLinks>
            <li><a href="#">Twitter</a></li>
            <li><a href="#">Facebook</a></li>
            <li><a href="#">Instagram</a></li>
            <li><a href="#">YouTube</a></li>
          </FooterLinks>
        </FooterSection>
      </FooterContent>
      
      <FooterBottom>
        <p>&copy; {new Date().getFullYear()} MovieFlix. All rights reserved.</p>
        <TMDbCredit>
          This product uses the TMDb API but is not endorsed or certified by{' '}
          <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">
            TMDb
          </a>
        </TMDbCredit>
      </FooterBottom>
    </FooterContainer>
  );
};

export default Footer;
