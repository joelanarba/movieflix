'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styled from 'styled-components';
import Navbar from './Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm, faHeart, faHome } from '@fortawesome/free-solid-svg-icons';
import { useFavorites } from '../../contexts/FavoritesContext';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: linear-gradient(135deg, #1a1d29 0%, #2d3748 100%);
  border-bottom: 1px solid #2d3748;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: #ffffff;
  font-size: 24px;
  font-weight: bold;
  transition: color 0.3s ease;

  &:hover {
    color: #4299e1;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;

  @media (max-width: 768px) {
    gap: 20px;
  }
`;

const NavLink = styled(Link)<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: ${(props) => (props.$isActive ? '#4299e1' : '#cbd5e0')};
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  background-color: ${(props) => (props.$isActive ? 'rgba(66, 153, 225, 0.1)' : 'transparent')};
  transition: all 0.3s ease;

  &:hover {
    color: #4299e1;
    background-color: rgba(66, 153, 225, 0.1);
  }

  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 14px;
  }
`;

const FavoritesCounter = styled.span`
  background-color: #e53e3e;
  color: white;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: bold;
  margin-left: 4px;
  min-width: 20px;
  text-align: center;
`;

const Header: React.FC = () => {
  const pathname = usePathname();
  const { favorites } = useFavorites();

  const isActive = (path: string) => pathname === path;

  return (
    <HeaderContainer>
      <Nav>
        <Logo href="/">
          <FontAwesomeIcon icon={faFilm} size="lg" />
          <span>MovieFlix</span>
        </Logo>
        <NavLinks>
          <NavLink href="/" $isActive={isActive('/')}>
            <FontAwesomeIcon icon={faHome} />
            <span>Home</span>
          </NavLink>
          <NavLink href="/favorites" $isActive={isActive('/favorites')}>
            <FontAwesomeIcon icon={faHeart} />
            <span>Favorites</span>
            {favorites.length > 0 && (
              <FavoritesCounter>{favorites.length}</FavoritesCounter>
            )}
          </NavLink>
        </NavLinks>
      </Nav>
      {/* Add the navbar here */}
      <Navbar />
    </HeaderContainer>
  );
};

export default Header;
