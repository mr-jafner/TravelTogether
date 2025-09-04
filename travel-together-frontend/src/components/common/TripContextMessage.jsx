import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Reusable component for personalized trip messaging and empty states
 * Provides contextual messages based on user login status and view mode
 * 
 * @param {Object} props
 * @param {boolean} props.isLoggedIn - Whether user is logged in
 * @param {string} props.viewMode - Current view mode ('myTrips' | 'allTrips')
 * @param {Object} props.tripStats - Trip statistics { userCount, totalCount }
 * @param {number} props.filteredTripsLength - Number of filtered trips
 * @param {string} props.className - Additional CSS classes for header message
 */
const TripContextMessage = ({ 
  isLoggedIn, 
  viewMode, 
  tripStats, 
  filteredTripsLength,
  className = '' 
}) => {
  // Get personalized trip message for header
  const getHeaderMessage = () => {
    if (!isLoggedIn) {
      return `${tripStats.totalCount} trip${tripStats.totalCount === 1 ? '' : 's'} available`;
    }
    
    if (viewMode === 'myTrips') {
      return tripStats.userCount === 0 
        ? "You haven't joined any trips yet"
        : `You're planning ${tripStats.userCount} trip${tripStats.userCount === 1 ? '' : 's'}`;
    }
    
    return `${tripStats.totalCount} trip${tripStats.totalCount === 1 ? '' : 's'} in the system`;
  };

  return (
    <>
      {/* Header Message */}
      <p className={`text-gray-600 ${className}`}>
        {getHeaderMessage()}
      </p>

      {/* Empty State for My Trips */}
      {isLoggedIn && viewMode === 'myTrips' && filteredTripsLength === 0 && (
        <TripEmptyState />
      )}
    </>
  );
};

/**
 * Empty state component for when user has no trips
 */
const TripEmptyState = () => (
  <div className="text-center py-12">
    <div className="text-gray-500 mb-4">
      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">No trips yet</h3>
    <p className="text-gray-500 mb-6">Get started by creating your first trip or joining an existing one.</p>
    <Link 
      to="/trips/new" 
      className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
    >
      Create New Trip
    </Link>
  </div>
);

/**
 * Utility function for getting trip context message (can be used independently)
 * @param {boolean} isLoggedIn 
 * @param {string} viewMode 
 * @param {Object} tripStats 
 * @returns {string} Contextual message
 */
export const getTripContextMessage = (isLoggedIn, viewMode, tripStats) => {
  if (!isLoggedIn) {
    return `${tripStats.totalCount} trip${tripStats.totalCount === 1 ? '' : 's'} available`;
  }
  
  if (viewMode === 'myTrips') {
    return tripStats.userCount === 0 
      ? "You haven't joined any trips yet"
      : `You're planning ${tripStats.userCount} trip${tripStats.userCount === 1 ? '' : 's'}`;
  }
  
  return `${tripStats.totalCount} trip${tripStats.totalCount === 1 ? '' : 's'} in the system`;
};

export default TripContextMessage;