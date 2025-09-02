import React, { createContext, useContext, useState, useEffect } from 'react';
import usernameService from '../services/usernameService.js';

// Create the context
const UserContext = createContext({
  username: null,
  setUsername: () => {},
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  isLoading: true,
  updateUsername: () => {}
});

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// UserProvider component
export const UserProvider = ({ children }) => {
  const [username, setUsernameState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize user state from localStorage on app load
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const storedUsername = usernameService.getStoredUsername();
        if (storedUsername) {
          setUsernameState(storedUsername);
        }
      } catch (error) {
        console.warn('Error initializing user state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, []);

  // Login function
  const login = async (newUsername) => {
    try {
      if (!newUsername || typeof newUsername !== 'string') {
        throw new Error('Valid username is required');
      }

      const trimmedUsername = newUsername.trim();
      
      if (!usernameService.isValidUsernameFormat(trimmedUsername)) {
        throw new Error('Username format is invalid. Use 2-50 characters: letters, numbers, spaces, hyphens, and apostrophes only.');
      }

      // Save to localStorage and update state
      const savedUsername = usernameService.saveUsername(trimmedUsername);
      setUsernameState(savedUsername);
      
      return { success: true, username: savedUsername };
      
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = () => {
    try {
      usernameService.clearStoredUsername();
      setUsernameState(null);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  };

  // Update username (for editing existing username)
  const updateUsername = async (newUsername, apiService) => {
    try {
      if (!newUsername || typeof newUsername !== 'string') {
        throw new Error('Valid username is required');
      }

      const trimmedUsername = newUsername.trim();
      const currentUsername = username;

      // Validate the username change
      const validation = await usernameService.validateUsernameChange(
        trimmedUsername, 
        currentUsername, 
        apiService
      );

      if (!validation.valid && !validation.isReclaim) {
        const conflictDetails = validation.conflicts
          .map(c => `"${c.conflictingParticipant}" in ${c.tripName}`)
          .join(', ');
        throw new Error(`Username "${trimmedUsername}" conflicts with existing participants: ${conflictDetails}`);
      }

      // Save the new username
      const savedUsername = usernameService.saveUsername(trimmedUsername);
      setUsernameState(savedUsername);
      
      const message = validation.isReclaim 
        ? `Username updated to "${savedUsername}" (reclaimed from trip data)`
        : `Username updated to "${savedUsername}"`;
      
      return { 
        success: true, 
        username: savedUsername,
        message: message
      };
      
    } catch (error) {
      console.error('Username update error:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  };

  // Helper to set username directly (for internal use)
  const setUsername = (newUsername) => {
    if (newUsername) {
      usernameService.saveUsername(newUsername);
    }
    setUsernameState(newUsername);
  };

  // Context value
  const value = {
    username,
    setUsername,
    isLoggedIn: !!username,
    login,
    logout,
    updateUsername,
    isLoading
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;