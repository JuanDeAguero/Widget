import React, { useState } from 'react';
import { Login } from './Login';
import { Register } from './Register';

export const AuthPage: React.FC = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  const toggleMode = () => {
    setIsLoginMode(prev => !prev);
  };

  return isLoginMode ? (
    <Login onToggleMode={toggleMode} />
  ) : (
    <Register onToggleMode={toggleMode} />
  );
};
