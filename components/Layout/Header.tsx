'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faFire, 
  faStar, 
  faClock, 
  faSearch, 
  faSignOutAlt,
  faHeart,
  faTv,
  faUser,
  faChevronDown,
  faFilm,
  faBars,
  faTimes
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

const HeaderContent = styled.div`
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
  position: relative;
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

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
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

const UserAvatar = styled.div<{ $photoURL?: string | null }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #4299e1;
  object-fit: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  background-color: #2c5282;

  ${props => props.$photoURL && `
    background-image: url(${props.$photoURL});
    background-size: cover;
    background-position: center;
  `}

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
  font-size: 12px;
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

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(66, 153, 225, 0.1);
  }
`;

const ProfileDropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #2d3748;
  border: 1px solid #4299e1;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  min-width: 200px;
  z-index: 10;
  opacity: ${props => props.$isOpen ? '1' : '0'};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  transform: translateY(${props => props.$isOpen ? '0' : '-10px'});
  display: flex;
  flex-direction: column;
`;

const DropdownItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: #cbd5e0;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;

  &:hover {
    background-color: rgba(66, 153, 225, 0.1);
    color: #4299e1;
  }
`;

// Define interface for navigation items
interface NavItem {
  href: string;
  label: string;
  icon: any;
  badge?: number;
}

const Header: React.FC = () => {
  const { user, logout, loading } = useAuth();
  const { favorites } = useFavorites();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    try {
      await logout();
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  const handleSignIn = () => {
    router.push('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isDropdownOpen]);

  if (loading) {
    return (
      <HeaderContainer>
        <HeaderContent>
          <div>Loading...</div>
        </HeaderContent>
      </HeaderContainer>
    );
  }

  const isActive = (path: string) => {
    if (path === '/') return pathname === path;
    return pathname.startsWith(path);
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
    ] as NavItem[],
    browse: [
      { href: '/movies', label: 'Movies', icon: faFilm },
      { href: '/tv', label: 'TV Shows', icon: faTv },
      { href: '/search', label: 'Search', icon: faSearch }
    ] as NavItem[],
    user: [
      { 
        href: '/favorites', 
        label: 'Favorites', 
        icon: faHeart,
        badge: favorites.length > 0 ? favorites.length : undefined 
      }
    ] as NavItem[]
  };

  // For desktop, show only essential items
  const desktopNavItems: NavItem[] = [
    ...navItems.main,
    ...navItems.browse.slice(0, 2), // Movies and TV Shows
    ...navItems.user
  ];

  return (
    <HeaderContainer>
      <HeaderContent>
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

          <AuthSection>
            {user ? (
              <UserInfo>
                <UserProfile
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDropdownOpen(!isDropdownOpen);
                  }}
                >
                  <UserAvatar $photoURL={user.photoURL}>
                    {!user.photoURL && getInitials(user.name || user.email)}
                  </UserAvatar>
                  <UserName>{user.name || user.email}</UserName>
                  <FontAwesomeIcon 
                    icon={faChevronDown} 
                    className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </UserProfile>

                <ProfileDropdown $isOpen={isDropdownOpen}>
                  <DropdownItem onClick={() => router.push('/favorites')}>
                    <FontAwesomeIcon icon={faHeart} />
                    <span>Favorites ({favorites.length})</span>
                  </DropdownItem>
                  <DropdownItem onClick={handleSignOut}>
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    <span>Sign Out</span>
                  </DropdownItem>
                </ProfileDropdown>
              </UserInfo>
            ) : (
              <AuthButton onClick={handleSignIn}>
                <FontAwesomeIcon icon={faUser} />
                <span className="hidden sm:inline">Sign In</span>
              </AuthButton>
            )}
          </AuthSection>
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
                    <UserAvatar $photoURL={user.photoURL}>
                       {!user.photoURL && getInitials(user.name || user.email)}
                    </UserAvatar>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#fff' }}>
                        {user.name || user.email}
                      </div>
                      <div style={{ fontSize: '12px', color: '#718096' }}>
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <AuthButton onClick={handleSignOut} style={{ justifyContent: 'center', minHeight: '48px' }}>
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    <span>Sign Out</span>
                  </AuthButton>
                </>
              ) : (
                <AuthButton onClick={handleSignIn} style={{ justifyContent: 'center', minHeight: '48px' }}>
                  <FontAwesomeIcon icon={faUser} />
                  <span>Sign In</span>
                </AuthButton>
              )}
            </MobileAuthSection>
          )}
        </MobileMenu>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;