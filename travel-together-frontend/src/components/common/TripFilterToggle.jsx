import React from 'react';

/**
 * Reusable toggle component for switching between "My Trips" and "All Trips" views
 * Only shows for logged-in users
 * 
 * @param {Object} props
 * @param {string} props.viewMode - Current view mode ('myTrips' | 'allTrips')
 * @param {Function} props.setViewMode - Function to change view mode
 * @param {Object} props.tripStats - Trip statistics { userCount, totalCount }
 * @param {boolean} props.isLoggedIn - Whether user is logged in
 * @param {string} props.size - Size variant ('default' | 'small')
 * @param {string} props.className - Additional CSS classes
 */
const TripFilterToggle = ({ 
  viewMode, 
  setViewMode, 
  tripStats, 
  isLoggedIn, 
  size = 'default',
  className = '' 
}) => {
  // Don't render if user is not logged in
  if (!isLoggedIn) {
    return null;
  }

  // Size variants
  const sizeClasses = {
    default: 'px-4 py-2 text-sm font-medium',
    small: 'px-3 py-1.5 text-xs font-medium'
  };

  const buttonClasses = sizeClasses[size] || sizeClasses.default;

  return (
    <div className={`flex gap-2 ${className}`}>
      <button 
        onClick={() => setViewMode('myTrips')}
        className={`${buttonClasses} rounded-lg transition-colors ${
          viewMode === 'myTrips' 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        aria-pressed={viewMode === 'myTrips'}
        aria-label={`Switch to My Trips view (${tripStats.userCount} trips)`}
      >
        My Trips ({tripStats.userCount})
      </button>
      
      <button 
        onClick={() => setViewMode('allTrips')}
        className={`${buttonClasses} rounded-lg transition-colors ${
          viewMode === 'allTrips' 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        aria-pressed={viewMode === 'allTrips'}
        aria-label={`Switch to All Trips view (${tripStats.totalCount} trips)`}
      >
        All Trips ({tripStats.totalCount})
      </button>
    </div>
  );
};

export default TripFilterToggle;