import { useState, useMemo } from 'react';
import { useUser } from '../contexts/UserContext';

/**
 * Custom hook for user-contextualized trip filtering
 * Provides filtered trips, statistics, and view mode management
 * 
 * @param {Array} allTrips - Array of all trips from API
 * @returns {Object} - { filteredTrips, tripStats, viewMode, setViewMode, getTripMessage, isUserParticipant }
 */
export const useUserTripFiltering = (allTrips = []) => {
  const { username, isLoggedIn } = useUser();
  const [viewMode, setViewMode] = useState('myTrips'); // 'myTrips' | 'allTrips'

  // Filter trips based on user participation and view mode
  const filteredTrips = useMemo(() => {
    if (!isLoggedIn || viewMode === 'allTrips') {
      return allTrips;
    }
    
    // Filter for user's trips (where they are a participant)
    return allTrips.filter(trip => 
      trip.participants && trip.participants.includes(username)
    );
  }, [allTrips, username, isLoggedIn, viewMode]);

  // Calculate trip statistics
  const tripStats = useMemo(() => {
    if (!isLoggedIn) {
      return { userCount: 0, totalCount: allTrips.length };
    }
    
    const userTripCount = allTrips.filter(trip => 
      trip.participants && trip.participants.includes(username)
    ).length;
    
    return { userCount: userTripCount, totalCount: allTrips.length };
  }, [allTrips, username, isLoggedIn]);

  // Get personalized trip message
  const getTripMessage = () => {
    if (!isLoggedIn) {
      return `${allTrips.length} trip${allTrips.length === 1 ? '' : 's'} available`;
    }
    
    if (viewMode === 'myTrips') {
      return tripStats.userCount === 0 
        ? "You haven't joined any trips yet"
        : `You're planning ${tripStats.userCount} trip${tripStats.userCount === 1 ? '' : 's'}`;
    }
    
    return `${tripStats.totalCount} trip${tripStats.totalCount === 1 ? '' : 's'} in the system`;
  };

  // Helper function to check if user participates in a specific trip
  const isUserParticipant = (trip) => {
    if (!isLoggedIn || !username || !trip?.participants) return false;
    return trip.participants.includes(username);
  };

  return {
    filteredTrips,
    tripStats,
    viewMode,
    setViewMode,
    getTripMessage,
    isUserParticipant,
    username,
    isLoggedIn
  };
};