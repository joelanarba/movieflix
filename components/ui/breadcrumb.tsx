'use client';

import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

const BreadcrumbContainer = styled.nav`
  background-color: rgba(26, 29, 41, 0.8);
  border-bottom: 1px solid #2d3748;
  padding: 12px 0;
  backdrop-filter: blur(4px);
`;

const BreadcrumbContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
`;

const BreadcrumbList = styled.ol`
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 8px;
  flex-wrap: wrap;
`;

const BreadcrumbItem = styled.li`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const BreadcrumbLink = styled(Link)`
  color: #cbd5e0;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  padding: 4px 8px;
  border-radius: 4px;

  &:hover {
    color: #4299e1;
    background-color: rgba(66, 153, 225, 0.1);
  }

  @media (max-width: 480px) {
    font-size: 12px;
    padding: 2px 4px;
  }
`;

const BreadcrumbSeparator = styled.span`
  color: #4a5568;
  font-size: 12px;
  display: flex;
  align-items: center;

  @media (max-width: 480px) {
    font-size: 10px;
  }
`;

const BreadcrumbCurrent = styled.span`
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    max-width: 150px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    max-width: 120px;
  }
`;

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <BreadcrumbContainer>
      <BreadcrumbContent>
        <BreadcrumbList>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            
            return (
              <BreadcrumbItem key={index}>
                {isLast ? (
                  <BreadcrumbCurrent title={item.label}>
                    {item.label}
                  </BreadcrumbCurrent>
                ) : (
                  <>
                    <BreadcrumbLink href={item.href || '#'}>
                      {item.label}
                    </BreadcrumbLink>
                    <BreadcrumbSeparator>
                      <FontAwesomeIcon icon={faChevronRight} />
                    </BreadcrumbSeparator>
                  </>
                )}
              </BreadcrumbItem>
            );
          })}
        </BreadcrumbList>
      </BreadcrumbContent>
    </BreadcrumbContainer>
  );
};

export default Breadcrumb;