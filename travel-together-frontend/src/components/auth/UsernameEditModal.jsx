import React, { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import usernameService from '../../services/usernameService';
import api from '../../services/api';

const UsernameEditModal = ({ isOpen, onClose, adminMode = false, targetUsername = null }) => {
  const { username: currentUsername, updateUsername } = useUser();
  const [newUsername, setNewUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [conflictInfo, setConflictInfo] = useState(null);
  const [allParticipants, setAllParticipants] = useState([]);
  const [affectedTrips, setAffectedTrips] = useState([]);

  // Determine which username we're editing
  const editingUsername = adminMode ? targetUsername : currentUsername;

  useEffect(() => {
    if (isOpen) {
      loadInitialData();
      setNewUsername(editingUsername || '');
      setError('');
      setSuccess('');
      setConflictInfo(null);
    }
  }, [isOpen, editingUsername]);

  const loadInitialData = async () => {
    try {
      // Load all participants for validation
      const participants = await usernameService.getExistingParticipants(api);
      setAllParticipants(participants);

      // If editing a specific username, find trips they're in
      if (editingUsername) {
        const trips = await api.tripApi.getAllTrips();
        const userTrips = trips.filter(trip => 
          trip.participants?.some(p => p.toLowerCase() === editingUsername.toLowerCase())
        );
        setAffectedTrips(userTrips);
      }
    } catch (error) {
      console.warn('Could not load initial data:', error);
    }
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setNewUsername(value);
    setError('');
    setSuccess('');
    setConflictInfo(null);
  };

  const checkForConflicts = async (proposedUsername) => {
    try {
      console.log('Checking conflicts for:', {
        proposedUsername,
        editingUsername,
        trimmed: proposedUsername.trim()
      });

      const validation = await usernameService.validateUsernameChange(
        proposedUsername,
        editingUsername,
        api
      );

      console.log('Validation result:', validation);
      console.log('Button should be enabled:', !isLoading && newUsername.trim() && newUsername.trim() !== editingUsername && !(validation && !validation.valid && !validation.isReclaim));
      setConflictInfo(validation);
      return validation;
    } catch (error) {
      console.error('Validation error:', error);
      setError(error.message);
      return { valid: false, conflicts: [] };
    }
  };

  const handlePreview = async () => {
    if (!newUsername.trim() || newUsername.trim() === editingUsername) {
      setError('Please enter a different username');
      return;
    }

    setIsLoading(true);
    setError('');

    const validation = await checkForConflicts(newUsername.trim());
    setIsLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLoading) return;

    const trimmedUsername = newUsername.trim();
    
    if (!trimmedUsername) {
      setError('Username cannot be empty');
      return;
    }

    if (trimmedUsername === editingUsername) {
      setError('Please enter a different username');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      if (adminMode) {
        // Admin mode: Call backend API to update participant names across trips
        const response = await fetch('/api/trips/update-username', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            oldUsername: editingUsername,
            newUsername: trimmedUsername
          })
        });

        const result = await response.json();

        if (response.ok && result.success) {
          setSuccess(`✅ Successfully updated "${editingUsername}" to "${trimmedUsername}" across ${result.tripsAffected.length} trip${result.tripsAffected.length !== 1 ? 's' : ''}: ${result.tripsAffected.map(t => t.name).join(', ')}`);
          setTimeout(() => {
            onClose();
          }, 3000); // Give more time to read success message
        } else {
          if (result.conflicts && result.conflicts.length > 0) {
            setError(`❌ Username "${trimmedUsername}" already exists in: ${result.conflicts.map(c => c.tripName).join(', ')}`);
          } else {
            setError(`❌ ${result.error || 'Failed to update username'}`);
          }
        }
      } else {
        // User self-editing
        const result = await updateUsername(trimmedUsername, api);
        
        if (result.success) {
          setSuccess(result.message);
          setTimeout(() => {
            onClose();
          }, 2000);
        } else {
          setError(result.error);
        }
      }
    } catch (error) {
      setError(error.message || 'Failed to update username');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {adminMode ? 'Admin: Edit Username' : 'Edit Your Username'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
              disabled={isLoading}
            >
              ×
            </button>
          </div>

          {/* Admin Mode Warning */}
          {adminMode && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="font-medium text-red-800">Admin Mode</span>
              </div>
              <p className="text-sm text-red-700 mt-1">
                Editing: <strong>{editingUsername}</strong> across all trips
              </p>
            </div>
          )}

          {/* Current Username Info */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              {adminMode ? 'Current username:' : 'Your current username:'}
            </p>
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="font-medium text-gray-900">{editingUsername}</span>
              {affectedTrips.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Participates in {affectedTrips.length} trip{affectedTrips.length !== 1 ? 's' : ''}: {affectedTrips.map(t => t.name).join(', ')}
                </p>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* New Username Input */}
            <div className="mb-4">
              <label htmlFor="newUsername" className="block text-sm font-medium text-gray-700 mb-2">
                New username:
              </label>
              <input
                id="newUsername"
                type="text"
                value={newUsername}
                onChange={handleUsernameChange}
                placeholder="Enter new username..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
                required
              />
            </div>

            {/* Preview Button */}
            <div className="mb-4">
              <button
                type="button"
                onClick={handlePreview}
                disabled={isLoading || !newUsername.trim() || newUsername.trim() === editingUsername}
                className="w-full bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {isLoading ? 'Checking...' : 'Preview Changes'}
              </button>
            </div>

            {/* Conflict Information */}
            {conflictInfo && (
              <div className="mb-4">
                {conflictInfo.valid ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm font-medium text-green-800">Username Available</span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      "{newUsername.trim()}" is available and won't conflict with existing participants.
                    </p>
                  </div>
                ) : conflictInfo.isReclaim ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span className="text-sm font-medium text-yellow-800">Username Exists in Trip Data</span>
                    </div>
                    <p className="text-sm text-yellow-700 mt-1">
                      "{newUsername.trim()}" exists in these trips:
                    </p>
                    <ul className="text-sm text-yellow-700 mt-1 ml-4">
                      {conflictInfo.conflicts?.map((conflict, index) => (
                        <li key={index} className="list-disc">
                          {conflict.tripName}
                        </li>
                      ))}
                    </ul>
                    <p className="text-sm text-yellow-700 mt-2">
                      <strong>You can still use this name</strong> - it may be your original username from these trips.
                    </p>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="text-sm font-medium text-red-800">Username Conflicts</span>
                    </div>
                    <p className="text-sm text-red-700 mt-1">
                      This username conflicts with existing participants in:
                    </p>
                    <ul className="text-sm text-red-700 mt-1 ml-4">
                      {conflictInfo.conflicts?.map((conflict, index) => (
                        <li key={index} className="list-disc">
                          {conflict.tripName}: "{conflict.conflictingParticipant}"
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-600">{success}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !newUsername.trim() || newUsername.trim() === editingUsername || (conflictInfo && !conflictInfo.valid && !conflictInfo.isReclaim)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Updating...</span>
                  </div>
                ) : (
                  adminMode ? 'Admin Update' : 'Update Username'
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              {adminMode 
                ? 'Admin mode changes affect all trips containing this participant'
                : 'Your username will be updated across all trips you participate in'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsernameEditModal;