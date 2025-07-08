import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { LogOut, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const UserMenuContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const UserAvatar = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.8rem;
`;

const UserName = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
`;

const ChevronIcon = styled(ChevronDown)<{ $isOpen: boolean }>`
  width: 16px;
  height: 16px;
  transition: transform 0.2s ease;
  transform: rotate(${props => props.$isOpen ? '180deg' : '0deg'});
`;

const DropdownMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(0, 0, 0, 0.1);
  min-width: 200px;
  z-index: 1000;
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.$isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.2s ease;
`;

const DropdownHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
`;

const DropdownUserName = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
`;

const DropdownUserEmail = styled.div`
  font-size: 0.8rem;
  color: #666;
`;

const DropdownItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
  color: #333;
  font-size: 0.9rem;

  &:hover {
    background: #f8f9fa;
  }

  &:last-child {
    border-radius: 0 0 8px 8px;
  }
`;

export const UserMenu: React.FC = () => {
  const { state, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const getInitials = (firstName?: string, lastName?: string, email?: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) {
      return firstName[0].toUpperCase();
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return 'U';
  };

  const getDisplayName = (firstName?: string, lastName?: string, email?: string) => {
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }
    if (firstName) {
      return firstName;
    }
    return email || 'User';
  };

  if (!state.user) return null;

  return (
    <UserMenuContainer ref={menuRef}>
      <UserButton onClick={() => setIsOpen(!isOpen)}>
        <UserAvatar>
          {getInitials(state.user.firstName, state.user.lastName, state.user.email)}
        </UserAvatar>
        <UserName>
          {getDisplayName(state.user.firstName, state.user.lastName, state.user.email)}
        </UserName>
        <ChevronIcon $isOpen={isOpen} />
      </UserButton>

      <DropdownMenu $isOpen={isOpen}>
        <DropdownHeader>
          <DropdownUserName>
            {getDisplayName(state.user.firstName, state.user.lastName, state.user.email)}
          </DropdownUserName>
          <DropdownUserEmail>{state.user.email}</DropdownUserEmail>
        </DropdownHeader>

        <DropdownItem onClick={() => setIsOpen(false)}>
          <User size={16} />
          Profile
        </DropdownItem>

        <DropdownItem onClick={handleLogout}>
          <LogOut size={16} />
          Sign out
        </DropdownItem>
      </DropdownMenu>
    </UserMenuContainer>
  );
};
