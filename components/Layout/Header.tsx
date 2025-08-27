'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFilm, 
  faHeart, 
  faHome, 
  faSignInAlt, 
  faSignOutAlt, 
  faBars, 
  faTimes,
  faTv,
  faSearch
} from '@fortawesome/free-solid-svg-icons';
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
  gap: 20px;

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
  max-height: 90vh;
  overflow-y: auto;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileNavLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const NavLink = styled(Link)<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: ${(props) => (props.$isActive ? '#4299e1' : '#cbd5e0')};
  font-weight: 500;
  padding: 12px 16px;
  border-radius: 8px;
  background-color: ${(props) => (props.$isActive ? 'rgba(66, 153, 225, 0.1)' : 'transparent')};
  transition: all 0.3s ease;
  font-size: 14px;
  border: ${(props) => (props.$isActive ? '1px solid rgba(66, 153, 225, 0.3)' : '1px solid transparent')};
  min-height: 44px;

  &:hover {
    color: #4299e1;
    background-color: rgba(66, 153, 225, 0.1);
  }

  @media (max-width: 768px) {
    padding: 14px 16px;
    font-size: 15px;
    min-height: 48px;
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
  min-height: 36px;

  &:hover {
    background-color: #4299e1;
    color: white;
  }

  @media (max-width: 480px) {
    padding: 8px 10px;
    font-size: 13px;
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
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #4299e1;
  object-fit: cover;

  @media (max-width: 480px) {
    width: 28px;
    height: 28px;
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
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: bold;
  margin-left: auto;
  min-width: 20px;
  text-align: center;
  line-height: 1.2;

  @media (max-width: 480px) {
    padding: 2px 6px;
    font-size: 10px;
    min-width: 18px;
  }
`;

const MobileAuthSection = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #2d3748;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionTitle = styled.div`
  fontSize: 12px;
  font-weight: bold;
  color: #718096;
  margin: 16px 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0 16px;

  &:first-child {
    margin-top: 0;
  }
`;

const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { favorites } = useFavorites();
  const { user, logout, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return pathname === path;
    return pathname.startsWith(path);
  };

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

  // Navigation items organized by category
  const navItems = {
    main: [
      { href: '/', label: 'Home', icon: faHome }
    ],
    browse: [
      { href: '/movies', label: 'Movies', icon: faFilm },
      { href: '/tv', label: 'TV Shows', icon: faTv },
      { href: '/search', label: 'Search', icon: faSearch }
    ],
    user: [
      { 
        href: '/favorites', 
        label: 'Favorites', 
        icon: faHeart,
        badge: favorites.length > 0 ? favorites.length : undefined 
      }
    ]
  };

  // For desktop, show only essential items
  const desktopNavItems = [
    ...navItems.main,
    ...navItems.browse.slice(0, 2), // Movies and TV Shows
    ...navItems.user
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
          {desktopNavItems.map((item) => (
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
                    <UserAvatar src={user.photoURL || '/default-avatar.png'} alt={user.name || 'User'} />
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
            {/* Main Navigation */}
            <SectionTitle>Main</SectionTitle>
            {navItems.main.map((item) => (
              <NavLink 
                key={item.href} 
                href={item.href} 
                $isActive={isActive(item.href)}
                onClick={closeMobileMenu}
              >
                <FontAwesomeIcon icon={item.icon} />
                <span>{item.label}</span>
              </NavLink>
            ))}

            {/* Browse Content */}
            <SectionTitle>Browse</SectionTitle>
            {navItems.browse.map((item) => (
              <NavLink 
                key={item.href} 
                href={item.href} 
                $isActive={isActive(item.href)}
                onClick={closeMobileMenu}
              >
                <FontAwesomeIcon icon={item.icon} />
                <span>{item.label}</span>
              </NavLink>
            ))}

            {/* User Section */}
            <SectionTitle>My Collection</SectionTitle>
            {navItems.user.map((item) => (
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
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    padding: '16px',
                    backgroundColor: 'rgba(66, 153, 225, 0.05)',
                    borderRadius: '8px',
                    border: '1px solid rgba(66, 153, 225, 0.1)'
                  }}>
                    <UserAvatar src={user.photoURL || '/default-avatar.png'} alt={user.name || 'User'} />
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#fff' }}>
                        {user.name}
                      </div>
                      <div style={{ fontSize: '12px', color: '#718096' }}>
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <AuthButton onClick={handleAuthAction} style={{ justifyContent: 'center', minHeight: '48px' }}>
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    <span>Sign Out</span>
                  </AuthButton>
                </>
              ) : (
                <AuthButton onClick={handleAuthAction} style={{ justifyContent: 'center', minHeight: '48px' }}>
                  <FontAwesomeIcon icon={faSignInAlt} />
                  <span>Sign In</span>
                </AuthButton>
              )}
            </MobileAuthSection>
          )}
        </MobileMenu>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;