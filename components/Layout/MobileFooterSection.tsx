import React, { useState } from "react";
import styled from "styled-components";
import { ChevronDown, ChevronUp } from "lucide-react";

const SectionContainer = styled.div`
  border-bottom: 1px solid #2d3748;
  padding: 8px 0;
`;

const SectionHeader = styled.div<{ isOpen: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  cursor: pointer;

  h3 {
    margin: 0 !important;
    font-size: 16px !important;
  }
`;

const SectionContent = styled.div<{ isOpen: boolean }>`
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  padding-bottom: 8px;
`;

interface MobileFooterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const MobileFooterSection: React.FC<MobileFooterSectionProps> = ({
  title,
  children,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <SectionContainer>
      <SectionHeader isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}>
        <h3>{title}</h3>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </SectionHeader>
      <SectionContent isOpen={isOpen}>{children}</SectionContent>
    </SectionContainer>
  );
};

export default MobileFooterSection;
