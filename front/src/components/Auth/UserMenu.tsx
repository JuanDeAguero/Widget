import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const UserMenuContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.8;
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

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      const nameParts = name.trim().split(' ');
      if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
      }
      return nameParts[0][0].toUpperCase();
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return 'U';
  };

  const getDisplayName = (name?: string, email?: string) => {
    if (name && name.trim()) {
      return name;
    }
    return email || 'User';
  };

  if (!state.user) return null;

  return (
    <UserMenuContainer ref={menuRef}>
      <UserButton onClick={() => setIsOpen(!isOpen)}>
        <UserAvatar>
          {getInitials(state.user.name, state.user.email)}
        </UserAvatar>
      </UserButton>

      <DropdownMenu $isOpen={isOpen}>
        <DropdownHeader>
          <DropdownUserName>
            {getDisplayName(state.user.name, state.user.email)}
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