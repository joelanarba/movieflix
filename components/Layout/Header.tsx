'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styled from 'styled-components';
import Navbar from './Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm, faHeart, faHome, faSignInAlt, faSignOutAlt, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useAuth } from '../../contexts/AuthContext';

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
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  position: relative;

  @media (max-width: 768px) {
    padding: 0 12px;
    height: 70px;
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: #ffffff;
  font-size: 20px;
  font-weight: bold;
  transition: color 0.3s ease;
  flex-shrink: 0;

  &:hover {
    color: #4299e1;
  }

  @media (max-width: 480px) {
    font-size: 18px;
    gap: 6px;
  }
`;

const DesktopNavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #cbd5e0;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    color: #4299e1;
    background-color: rgba(66, 153, 225, 0.1);
  }

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const MobileMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #1a1d29 0%, #2d3748 100%);
  border-bottom: 1px solid #2d3748;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transform: translateY(${props => props.$isOpen ? '0' : '-100%'});
  opacity: ${props => props.$isOpen ? '1' : '0'};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  padding: 16px;
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileNavLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const NavLink = styled(Link)<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: ${(props) => (props.$isActive ? '#4299e1' : '#cbd5e0')};
  font-weight: 500;
  padding: 12px 16px;
  border-radius: 8px;
  background-color: ${(props) => (props.$isActive ? 'rgba(66, 153, 225, 0.1)' : 'transparent')};
  transition: all 0.3s ease;
  font-size: 14px;

  &:hover {
    color: #4299e1;
    background-color: rgba(66, 153, 225, 0.1);
  }

  @media (max-width: 480px) {
    padding: 10px 12px;
    font-size: 14px;
  }
`;

const AuthSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const AuthButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: 1px solid #4299e1;
  color: #4299e1;
  padding: 8px 12px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  white-space: nowrap;

  &:hover {
    background-color: #4299e1;
    color: white;
  }

  @media (max-width: 480px) {
    padding: 6px 10px;
    font-size: 12px;
    gap: 4px;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #cbd5e0;
`;

const UserAvatar = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid #4299e1;

  @media (max-width: 480px) {
    width: 24px;
    height: 24px;
  }
`;

const UserName = styled.span`
  font-weight: 500;
  font-size: 14px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const FavoritesCounter = styled.span`
  background-color: #e53e3e;
  color: white;
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 11px;
  font-weight: bold;
  margin-left: 4px;
  min-width: 18px;
  text-align: center;
  line-height: 1;

  @media (max-width: 480px) {
    padding: 1px 4px;
    font-size: 10px;
    min-width: 16px;
  }
`;

const MobileAuthSection = styled.div`
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #2d3748;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { favorites } = useFavorites();
  const { user, logout, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const handleAuthAction = async () => {
    if (user) {
      try {
        await logout();
      } catch (error) {
        console.error('Error signing out:', error);
      }
    } else {
      router.push('/login');
    }
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { href: '/', label: 'Home', icon: faHome },
    { 
      href: '/favorites', 
      label: 'Favorites', 
      icon: faHeart, 
      badge: favorites.length > 0 ? favorites.length : undefined 
    }
  ];

  return (
    <HeaderContainer>
      <Nav>
        <Logo href="/" onClick={closeMobileMenu}>
          <FontAwesomeIcon icon={faFilm} size="lg" />
          <span>MovieFlix</span>
        </Logo>

        {/* Desktop Navigation */}
        <DesktopNavLinks>
          {navItems.map((item) => (
            <NavLink key={item.href} href={item.href} $isActive={isActive(item.href)}>
              <FontAwesomeIcon icon={item.icon} />
              <span>{item.label}</span>
              {item.badge && (
                <FavoritesCounter>{item.badge}</FavoritesCounter>
              )}
            </NavLink>
          ))}
          
          {!loading && (
            <AuthSection>
              {user ? (
                <>
                  <UserInfo>
                    <UserAvatar src={user.photoURL || '/default-avatar.png'} alt={user.name} />
                    <UserName>{user.name}</UserName>
                  </UserInfo>
                  <AuthButton onClick={handleAuthAction}>
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    <span>Logout</span>
                  </AuthButton>
                </>
              ) : (
                <AuthButton onClick={handleAuthAction}>
                  <FontAwesomeIcon icon={faSignInAlt} />
                  <span>Sign In</span>
                </AuthButton>
              )}
            </AuthSection>
          )}
        </DesktopNavLinks>

        {/* Mobile Menu Button */}
        <MobileMenuButton onClick={toggleMobileMenu}>
          <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
        </MobileMenuButton>

        {/* Mobile Menu */}
        <MobileMenu $isOpen={isMobileMenuOpen}>
          <MobileNavLinks>
            {navItems.map((item) => (
              <NavLink 
                key={item.href} 
                href={item.href} 
                $isActive={isActive(item.href)}
                onClick={closeMobileMenu}
              >
                <FontAwesomeIcon icon={item.icon} />
                <span>{item.label}</span>
                {item.badge && (
                  <FavoritesCounter>{item.badge}</FavoritesCounter>
                )}
              </NavLink>
            ))}
          </MobileNavLinks>

          {/* Mobile Auth Section */}
          {!loading && (
            <MobileAuthSection>
              {user ? (
                <>
                  <UserInfo>
                    <UserAvatar src={user.photoURL || '/default-avatar.png'} alt={user.name} />
                    <span style={{ fontSize: '14px' }}>{user.name}</span>
                  </UserInfo>
                  <AuthButton onClick={handleAuthAction}>
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    <span>Logout</span>
                  </AuthButton>
                </>
              ) : (
                <AuthButton onClick={handleAuthAction} style={{ width: '100%', justifyContent: 'center' }}>
                  <FontAwesomeIcon icon={faSignInAlt} />
                  <span>Sign In</span>
                </AuthButton>
              )}
            </MobileAuthSection>
          )}
        </MobileMenu>
      </Nav>
      
      {/* Add the navbar here */}
      <Navbar />
    </HeaderContainer>
  );
};

export default Header;