import React, { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import usernameService from '../../services/usernameService';
import api from '../../services/api';

const LoginModal = ({ isOpen, onClose }) => {
  const { login } = useUser();
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isCustomUsername, setIsCustomUsername] = useState(false);

  // Load existing participants on component mount
  useEffect(() => {
    if (isOpen) {
      loadParticipantSuggestions();
      setUsername('');
      setError('');
      setIsCustomUsername(false);
    }
  }, [isOpen]);

  const loadParticipantSuggestions = async () => {
    try {
      const participants = await usernameService.getUsernameSuggestions(api);
      setSuggestions(participants);
    } catch (error) {
      console.warn('Could not load participant suggestions:', error);
      setSuggestions(usernameService.getFallbackParticipants());
    }
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    setError('');
    
    // Show suggestions when typing
    setShowSuggestions(value.length > 0 && !isCustomUsername);
  };

  const handleSuggestionSelect = (selectedUsername) => {
    setUsername(selectedUsername);
    setShowSuggestions(false);
    setIsCustomUsername(false);
  };

  const handleCustomUsernameToggle = () => {
    setIsCustomUsername(!isCustomUsername);
    setShowSuggestions(false);
    setUsername('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isLoading) {
      return;
    }
    
    if (!username.trim()) {
      setError('Please enter a username or select from existing participants');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const trimmedUsername = username.trim();

      // For existing participants, allow selection without duplicate check
      // For new custom usernames, check for duplicates
      if (isCustomUsername) {
        const availabilityCheck = await usernameService.isUsernameAvailableGlobally(
          trimmedUsername, 
          api
        );
        
        if (!availabilityCheck.available) {
          setError(availabilityCheck.reason || 'This username is already taken. Please choose a different name or select from existing participants.');
          setIsLoading(false);
          return;
        }
        
        if (availabilityCheck.warning) {
          console.warn(availabilityCheck.warning);
        }
      }

      const result = await login(trimmedUsername);
      
      if (result.success) {
        // Login successful - App component will handle closing the modal
        // Don't set isLoading(false) here as the modal should close automatically
      } else {
        setError(result.error || 'Login failed');
        setIsLoading(false);
      }
    } catch (error) {
      setError(error.message || 'An unexpected error occurred');
      setIsLoading(false);
    }
  };

  const filteredSuggestions = suggestions.filter(name =>
    name.toLowerCase().includes(username.toLowerCase())
  ).slice(0, 8); // Limit to 8 suggestions

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome to TravelTogether
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
              disabled={isLoading}
            >
              ×
            </button>
          </div>

          {/* Instructions */}
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Choose your username to join trip planning with your friends:
            </p>
            
            {!isCustomUsername && suggestions.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800 mb-2 font-medium">
                  🎉 Existing participants ({suggestions.length} found)
                </p>
                <p className="text-xs text-blue-600">
                  Select your name if you've participated in trips before
                </p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Username Input */}
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                {isCustomUsername ? 'Enter your name:' : 'Select or enter your name:'}
              </label>
              
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  onFocus={() => !isCustomUsername && setShowSuggestions(true)}
                  placeholder={isCustomUsername ? 'Enter a new username...' : 'Type to search or select below...'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading}
                  required
                />

                {/* Suggestions Dropdown */}
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleSuggestionSelect(suggestion)}
                        className="w-full px-4 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                      >
                        <span className="font-medium">{suggestion}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Custom Username Toggle */}
            <div className="mb-6">
              <button
                type="button"
                onClick={handleCustomUsernameToggle}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
                disabled={isLoading}
              >
                {isCustomUsername 
                  ? '← Back to existing participants' 
                  : 'Or enter a new name'}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !username.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Start Planning Trips'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Your username will be saved locally for future visits
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;