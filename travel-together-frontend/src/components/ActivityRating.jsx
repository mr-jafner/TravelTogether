import React, { useState, useEffect } from 'react';
import { ratingApi, tripApi } from '../services/api';
import { useUser } from '../contexts/UserContext';

const ActivityRating = ({ activity, participants, onRatingChange, tripId, ratings = {}, onEditActivity, onDeleteActivity }) => {
  const { username: loggedInUser, isLoggedIn } = useUser();
  const [userRating, setUserRating] = useState(null);
  const [groupAverage, setGroupAverage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  // Use parent's ratings state instead of local state

  // Load user-specific rating data on component mount
  useEffect(() => {
    const loadRatingData = async () => {
      if (!isLoggedIn || !tripId || !activity.id) return;
      
      try {
        const data = await ratingApi.getActivityRatingsWithUser(tripId, activity.id, loggedInUser);
        setUserRating(data.userRating);
        setGroupAverage(data.groupAverage);
      } catch (error) {
        console.error('Failed to load activity rating data:', error);
      }
    };
    
    loadRatingData();
  }, [tripId, activity.id, loggedInUser, isLoggedIn]);

  const handleRatingClick = async (participant, rating) => {
    // Only allow editing current user's rating
    if (participant !== loggedInUser) return;
    
    try {
      // Update rating via enhanced API
      if (tripId && isLoggedIn) {
        const response = await ratingApi.rateActivityAsUser(tripId, activity.id, loggedInUser, rating);
        setUserRating(response.userRating);
        setGroupAverage(response.groupAverage);
      }
      
      // Update local ratings state for backward compatibility
      const newRatings = { ...ratings, [participant]: rating };
      if (onRatingChange) {
        onRatingChange(newRatings);
      }
    } catch (error) {
      console.error('Failed to update activity rating:', error);
      // Could add user-facing error handling here
    }
  };

  const handleEditClick = () => {
    setEditFormData({
      name: activity.name,
      category: activity.category,
      location: activity.location,
      cost: activity.cost || '',
      duration: activity.duration || ''
    });
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      if (onEditActivity) {
        await onEditActivity(activity.id, editFormData);
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update activity:', error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFormData({});
  };

  const handleDeleteClick = async () => {
    if (!window.confirm('Are you sure you want to delete this activity? This action cannot be undone.')) {
      return;
    }

    try {
      if (onDeleteActivity) {
        await onDeleteActivity(activity.id);
      }
    } catch (error) {
      console.error('Failed to delete activity:', error);
    }
  };

  // Helper function to get proper initials (e.g., "Chris Taylor" -> "CT")
  const getInitials = (name) => {
    if (!name) return '?';
    const words = name.trim().split(/\s+/);
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };

  
  // Calculate group stats - add safety checks
  const ratingValues = Object.values(ratings).filter(rating => rating !== undefined && rating !== null);
  const averageRating = ratingValues.length > 0 
    ? ratingValues.reduce((sum, rating) => sum + rating, 0) / ratingValues.length 
    : 0; // Default to 0 if no ratings
  const interestedCount = ratingValues.filter(rating => rating >= 3).length;
  const mustDoCount = ratingValues.filter(rating => rating === 5).length;
  const wontDoCount = ratingValues.filter(rating => rating === 0).length;

  // Enhanced rating configuration with Tailwind colors
  const ratingConfig = {
    0: { 
      label: "Won't do", 
      bgColor: "bg-red-50", 
      borderColor: "border-red-200",
      textColor: "text-red-700",
      buttonActive: "bg-red-500 border-red-500 text-white",
      buttonInactive: "border-red-300 text-red-600 hover:bg-red-50"
    },
    1: { 
      label: "Don't want", 
      bgColor: "bg-orange-50", 
      borderColor: "border-orange-200",
      textColor: "text-orange-700",
      buttonActive: "bg-orange-500 border-orange-500 text-white",
      buttonInactive: "border-orange-300 text-orange-600 hover:bg-orange-50"
    },
    2: { 
      label: "Indifferent", 
      bgColor: "bg-gray-50", 
      borderColor: "border-gray-200",
      textColor: "text-gray-700",
      buttonActive: "bg-gray-500 border-gray-500 text-white",
      buttonInactive: "border-gray-300 text-gray-600 hover:bg-gray-50"
    },
    3: { 
      label: "Interested", 
      bgColor: "bg-cyan-50", 
      borderColor: "border-cyan-200",
      textColor: "text-cyan-700",
      buttonActive: "bg-cyan-500 border-cyan-500 text-white",
      buttonInactive: "border-cyan-300 text-cyan-600 hover:bg-cyan-50"
    },
    4: { 
      label: "Really want", 
      bgColor: "bg-teal-50", 
      borderColor: "border-teal-200",
      textColor: "text-teal-700",
      buttonActive: "bg-teal-500 border-teal-500 text-white",
      buttonInactive: "border-teal-300 text-teal-600 hover:bg-teal-50"
    },
    5: { 
      label: "Must do", 
      bgColor: "bg-amber-50", 
      borderColor: "border-amber-200",
      textColor: "text-amber-700",
      buttonActive: "bg-amber-500 border-amber-500 text-white",
      buttonInactive: "border-amber-300 text-amber-600 hover:bg-amber-50"
    }
  };

  // Safely get config with fallback to neutral rating
  const roundedRating = Math.round(averageRating);
  const currentConfig = ratingConfig[roundedRating] || ratingConfig[2]; // Fallback to "Indifferent" (rating 2)

  return (
    <div className={`border rounded-lg p-4 sm:p-6 mb-4 transition-all duration-300 hover:shadow-md ${currentConfig.bgColor} ${currentConfig.borderColor}`}>
      {/* Activity Header */}
      <div className="mb-4">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-3 lg:space-y-0">
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-xl font-bold text-gray-900">
                {activity.name}
              </h4>
              <div className="flex space-x-1 ml-4">
                <button
                  onClick={handleEditClick}
                  className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Edit activity"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Delete activity"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-700 font-medium">
                {activity.category}
              </span>
              <span className="flex items-center">
                💰 <span className="ml-1 font-semibold">${activity.cost}</span>
              </span>
              <span className="flex items-center">
                ⏱️ <span className="ml-1">{activity.duration}</span>
              </span>
              <span className="flex items-center">
                📍 <span className="ml-1">{activity.location}</span>
              </span>
            </div>
          </div>
          <div className="text-center lg:text-right lg:ml-4">
            {isLoggedIn && (userRating !== null || groupAverage !== null) ? (
              <div className="space-y-1">
                <div className="text-lg font-bold text-blue-600">
                  Your Rating: {userRating !== null ? `${userRating}/5` : 'Not rated'}
                </div>
                <div className={`text-2xl font-bold ${currentConfig.textColor}`}>
                  Group: {groupAverage !== null ? `${groupAverage}/5` : `${averageRating.toFixed(1)}/5`}
                </div>
                <div className="text-sm text-gray-500">
                  {interestedCount}/{participants.length} interested
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <div className={`text-2xl font-bold ${currentConfig.textColor}`}>
                  {averageRating.toFixed(1)}/5
                </div>
                <div className="text-sm text-gray-500">
                  {interestedCount}/{participants.length} interested
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Group Summary Badges */}
      <div className="mb-4 flex flex-wrap gap-1 sm:gap-2 justify-center sm:justify-start">
        {mustDoCount > 0 && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-amber-100 text-amber-800">
            <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
            {mustDoCount} must do
          </span>
        )}
        {interestedCount > mustDoCount && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-teal-100 text-teal-800">
            <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
            {interestedCount - mustDoCount} interested
          </span>
        )}
        {wontDoCount > 0 && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
            {wontDoCount} won't do
          </span>
        )}
      </div>

      {/* Edit Form */}
      {isEditing && (
        <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h5 className="text-lg font-semibold text-gray-900">Edit Activity</h5>
            <div className="flex space-x-2">
              <button
                onClick={handleSaveEdit}
                className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Activity Name</label>
              <input
                type="text"
                value={editFormData.name || ''}
                onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                value={editFormData.category || ''}
                onChange={(e) => setEditFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={editFormData.location || ''}
                onChange={(e) => setEditFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cost ($)</label>
              <input
                type="number"
                value={editFormData.cost || ''}
                onChange={(e) => setEditFormData(prev => ({ ...prev, cost: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <input
                type="text"
                value={editFormData.duration || ''}
                onChange={(e) => setEditFormData(prev => ({ ...prev, duration: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 2 hours, Half day, etc."
              />
            </div>
          </div>
        </div>
      )}

      {/* Individual Ratings */}
      <div>
        <div className="text-sm font-semibold text-gray-700 mb-3">Individual Ratings:</div>
        
        {/* Current User - Full Rating Scale */}
        {isLoggedIn && participants.includes(loggedInUser) && participants.filter(p => p === loggedInUser).map(participant => {
          const participantRating = ratings[participant];
          const participantConfig = participantRating !== undefined && participantRating !== null 
            ? ratingConfig[participantRating] || ratingConfig[2] 
            : ratingConfig[2];
          
          return (
            <div key={participant} className="bg-blue-50 border-2 border-blue-200 bg-opacity-90 p-3 rounded-lg backdrop-blur-sm mb-4">
              <span className="text-sm font-medium text-blue-900 mb-2 block">
                {participant} (You)
              </span>
              <div className="w-full">
                <div className="flex items-center gap-1 flex-wrap justify-center sm:justify-between mb-2">
                  {[0, 1, 2, 3, 4, 5].map(rating => {
                    const config = ratingConfig[rating];
                    const isActive = participantRating === rating;
                    
                    return (
                      <button
                        key={rating}
                        onClick={() => handleRatingClick(participant, rating)}
                        className={`
                          flex-1 h-12 sm:h-10 
                          text-base sm:text-sm 
                          border-2 rounded-md font-bold
                          min-h-[48px] sm:min-h-[40px]
                          mx-1 sm:mx-0.5
                          transition-all duration-200 ease-in-out
                          transform hover:scale-105 active:scale-95 cursor-pointer
                          touch-manipulation
                          ${isActive 
                            ? config.buttonActive + ' shadow-md' 
                            : 'bg-white ' + config.buttonInactive
                          }
                        `}
                        title={config.label}
                      >
                        {rating}
                      </button>
                    );
                  })}
                </div>
                <div className="text-center sm:text-left text-xs font-semibold text-blue-700">
                  {participantConfig.label}
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Other Participants - Compact Grid */}
        {(() => {
          const otherParticipants = participants.filter(p => p !== loggedInUser);
          if (otherParticipants.length === 0) return null;
          
          return (
            <div className="bg-white bg-opacity-70 p-3 rounded-lg">
              <div className="text-xs font-medium text-gray-700 mb-2">Other Participants:</div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {otherParticipants.map(participant => {
                  const participantRating = ratings[participant];
                  const participantConfig = participantRating !== undefined && participantRating !== null 
                    ? ratingConfig[participantRating] || ratingConfig[2] 
                    : ratingConfig[2];
                  
                  return (
                    <div key={participant} className="flex flex-col items-center gap-1 p-2 rounded-md hover:bg-gray-50">
                      <span className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center ${
                        participantRating !== undefined && participantRating !== null
                          ? participantConfig.buttonActive
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {getInitials(participant)}
                      </span>
                      <span className={`text-xs font-bold ${
                        participantRating !== undefined && participantRating !== null
                          ? participantConfig.textColor
                          : 'text-gray-400'
                      }`}>
                        {participantRating !== undefined && participantRating !== null ? participantRating : '-'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </div>

    </div>
  );
};

export default ActivityRating;