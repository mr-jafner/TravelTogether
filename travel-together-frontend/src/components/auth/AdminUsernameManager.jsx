import React, { useState, useEffect } from 'react';
import usernameService from '../../services/usernameService';
import UsernameEditModal from './UsernameEditModal';
import api from '../../services/api';

const AdminUsernameManager = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [hasRecentUpdate, setHasRecentUpdate] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (bustCache = false) => {
    if (isLoadingData) {
      return; // Prevent concurrent data loading
    }
    
    try {
      setIsLoadingData(true);
      setIsLoading(true);
      
      // Add cache-busting parameter when needed
      const tripApiCall = bustCache 
        ? fetch(`${window.location.protocol}//${window.location.host}/api/trips?_=${Date.now()}`, {
            headers: { 'Cache-Control': 'no-cache' }
          }).then(r => r.json())
        : api.tripApi.getAllTrips();
      
      const [tripParticipants, tripsData] = await Promise.all([
        usernameService.getExistingParticipants(api),
        tripApiCall
      ]);
      
      // Get all users: trip participants + any other usernames from localStorage history
      const allUsernames = new Set(tripParticipants);
      
      // Add current logged-in user if not already in the list
      const currentUser = usernameService.getStoredUsername();
      if (currentUser && !allUsernames.has(currentUser)) {
        allUsernames.add(currentUser);
      }
      
      // TODO: In a real system, this would fetch all users from a user database
      // For now, we'll show trip participants + current user + any we can discover
      
      // Create user objects with additional metadata
      const userList = Array.from(allUsernames).map(username => {
        const userTrips = tripsData.filter(trip => 
          trip.participants?.some(p => p.toLowerCase() === username.toLowerCase())
        );
        
        return {
          username,
          tripCount: userTrips.length,
          trips: userTrips,
          isCurrentUser: currentUser?.toLowerCase() === username.toLowerCase(),
          source: tripParticipants.includes(username) ? 'trip' : 'login'
        };
      }).sort((a, b) => {
        // Sort by trip count descending, then alphabetically
        if (a.tripCount !== b.tripCount) {
          return b.tripCount - a.tripCount;
        }
        return a.username.localeCompare(b.username);
      });
      
      setAllUsers(userList);
      setTrips(tripsData);
      console.log('Updated users state:', userList.map(u => u.username));
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingData(false);
    }
  };

  const handleEditUser = (username) => {
    setSelectedUser(username);
    setShowEditModal(true);
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
    setSelectedUser(null);
    // Only reload if no recent successful update already refreshed the data
    if (!hasRecentUpdate) {
      loadData();
    }
    setHasRecentUpdate(false);
  };

  const handleSuccessfulUpdate = async (oldUsername, newUsername, result) => {
    // Immediately reload fresh data from server to show the updated username
    console.log('handleSuccessfulUpdate called:', { oldUsername, newUsername, result });
    console.log('Users before update:', allUsers.map(u => u.username));
    setHasRecentUpdate(true);
    
    // Clear the username service cache to force fresh data
    usernameService.clearCache();
    
    // Force a complete refresh by clearing the state first
    setAllUsers([]);
    setTrips([]);
    
    // Add a small delay to ensure database changes are committed before refetching
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Then reload with fresh data (with cache busting)
    await loadData(true);
    console.log('Data reloaded after username update');
  };

  const filteredUsers = allUsers.filter(user =>
    user.username.toLowerCase().includes(searchFilter.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-red-100 p-2 rounded-full">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Username Admin Panel</h1>
            <p className="text-gray-600">Manage participant usernames across all trips</p>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">
            <strong>⚠️ Admin Mode:</strong> Changes made here affect all trips containing the selected participant. 
            Full implementation requires backend API endpoints for cross-trip username updates.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
          Search users:
        </label>
        <input
          id="search"
          type="text"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          placeholder="Type to filter users..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{allUsers.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="bg-green-100 p-2 rounded-full mr-3">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active Trips</p>
              <p className="text-2xl font-bold text-gray-900">{trips.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="bg-purple-100 p-2 rounded-full mr-3">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Filtered Results</p>
              <p className="text-2xl font-bold text-gray-900">{filteredUsers.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Users</h2>
          <p className="text-sm text-gray-600 mt-1">Click "Edit" to modify a user's username across all their trips</p>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredUsers.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              {searchFilter ? 'No users match your search.' : 'No users found.'}
            </div>
          ) : (
            filteredUsers.map((user, index) => {
              return (
                <div key={index} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        {/* Avatar */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          user.isCurrentUser ? 'bg-green-500' : 'bg-blue-500'
                        }`}>
                          <span className="text-white text-sm font-semibold">
                            {user.username.split(' ').map(part => part.charAt(0).toUpperCase()).join('').slice(0, 2)}
                          </span>
                        </div>
                        
                        {/* Name and Details */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium text-gray-900">{user.username}</p>
                            {user.isCurrentUser && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Current User
                              </span>
                            )}
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
                              user.source === 'trip' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                            }`}>
                              {user.source === 'trip' ? 'Trip Participant' : 'Login Only'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {user.tripCount > 0 
                              ? `${user.tripCount} trip${user.tripCount !== 1 ? 's' : ''}: ${user.trips.map(trip => trip.name).join(', ')}`
                              : 'Not participating in any trips'
                            }
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.tripCount > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {user.tripCount} trip{user.tripCount !== 1 ? 's' : ''}
                      </span>
                      
                      <button
                        onClick={() => handleEditUser(user.username)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Admin Edit Modal */}
      <UsernameEditModal 
        isOpen={showEditModal} 
        onClose={handleEditModalClose}
        adminMode={true}
        targetUsername={selectedUser}
        onSuccessfulUpdate={handleSuccessfulUpdate}
      />
    </div>
  );
};

export default AdminUsernameManager;