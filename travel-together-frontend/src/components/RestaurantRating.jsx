import React from 'react';
import { ratingApi } from '../services/api';

const RestaurantRating = ({ restaurant, participants, currentUser, onRatingChange, tripId, ratings = {} }) => {
  // Use parent's ratings state instead of local state

  const handleRatingClick = async (participant, rating) => {
    // Only allow editing current user's rating
    if (participant !== currentUser) return;
    
    try {
      // Update rating via API
      if (tripId) {
        await ratingApi.rateRestaurant(tripId, restaurant.id, participant, rating);
      }
      
      const newRatings = { ...ratings, [participant]: rating };
      if (onRatingChange) {
        onRatingChange(restaurant.id, newRatings);
      }
    } catch (error) {
      console.error('Failed to update restaurant rating:', error);
      // Could add user-facing error handling here
    }
  };

  // Calculate group stats - add safety checks
  const ratingValues = Object.values(ratings);
  const averageRating = ratingValues.length > 0 
    ? ratingValues.reduce((sum, rating) => sum + rating, 0) / ratingValues.length 
    : 0; // Default to 0 if no ratings
  const interestedCount = ratingValues.filter(rating => rating >= 3).length;
  const mustEatCount = ratingValues.filter(rating => rating === 5).length;
  const wontEatCount = ratingValues.filter(rating => rating === 0).length;

  // Restaurant-focused rating configuration
  const ratingConfig = {
    0: { 
      label: "Won't eat", 
      bgColor: "bg-red-50", 
      borderColor: "border-red-200",
      textColor: "text-red-700",
      buttonActive: "bg-red-500 border-red-500 text-white",
      buttonInactive: "border-red-300 text-red-600 hover:bg-red-50"
    },
    1: { 
      label: "Not interested", 
      bgColor: "bg-orange-50", 
      borderColor: "border-orange-200",
      textColor: "text-orange-700",
      buttonActive: "bg-orange-500 border-orange-500 text-white",
      buttonInactive: "border-orange-300 text-orange-600 hover:bg-orange-50"
    },
    2: { 
      label: "Neutral", 
      bgColor: "bg-gray-50", 
      borderColor: "border-gray-200",
      textColor: "text-gray-700",
      buttonActive: "bg-gray-500 border-gray-500 text-white",
      buttonInactive: "border-gray-300 text-gray-600 hover:bg-gray-50"
    },
    3: { 
      label: "Would try", 
      bgColor: "bg-cyan-50", 
      borderColor: "border-cyan-200",
      textColor: "text-cyan-700",
      buttonActive: "bg-cyan-500 border-cyan-500 text-white",
      buttonInactive: "border-cyan-300 text-cyan-600 hover:bg-cyan-50"
    },
    4: { 
      label: "Want to go", 
      bgColor: "bg-teal-50", 
      borderColor: "border-teal-200",
      textColor: "text-teal-700",
      buttonActive: "bg-teal-500 border-teal-500 text-white",
      buttonInactive: "border-teal-300 text-teal-600 hover:bg-teal-50"
    },
    5: { 
      label: "Must eat", 
      bgColor: "bg-amber-50", 
      borderColor: "border-amber-200",
      textColor: "text-amber-700",
      buttonActive: "bg-amber-500 border-amber-500 text-white",
      buttonInactive: "border-amber-300 text-amber-600 hover:bg-amber-50"
    }
  };

  // Safely get config with fallback to neutral rating
  const roundedRating = Math.round(averageRating);
  const currentConfig = ratingConfig[roundedRating] || ratingConfig[2]; // Fallback to "Maybe" (rating 2)

  // Helper function to get dietary restriction emoji
  const getDietaryIcon = (option) => {
    const icons = {
      'vegetarian': '🥗',
      'vegan': '🌱',
      'gluten-free': '🌾',
      'kids-friendly': '👶'
    };
    return icons[option] || '🍽️';
  };

  // Helper function to get price range color
  const getPriceRangeColor = (priceRange) => {
    switch(priceRange) {
      case '$': return 'bg-green-100 text-green-800';
      case '$$': return 'bg-yellow-100 text-yellow-800';
      case '$$$': return 'bg-orange-100 text-orange-800';
      case '$$$$': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`border rounded-lg p-4 sm:p-6 mb-4 transition-all duration-300 hover:shadow-md ${currentConfig.bgColor} ${currentConfig.borderColor}`}>
      {/* Restaurant Header */}
      <div className="mb-4">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-3 lg:space-y-0">
          <div className="flex-1">
            <h4 className="text-xl font-bold text-gray-900 mb-2">
              {restaurant.name}
            </h4>
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-3">
              <span className="bg-blue-100 px-3 py-1 rounded-full text-blue-700 font-medium">
                {restaurant.cuisine}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriceRangeColor(restaurant.priceRange)}`}>
                {restaurant.priceRange}
              </span>
              <span className="flex items-center">
                💰 <span className="ml-1 font-semibold">${restaurant.cost}/person</span>
              </span>
              <span className="flex items-center">
                👥 <span className="ml-1">Up to {restaurant.groupCapacity}</span>
              </span>
              <span className="flex items-center">
                📍 <span className="ml-1">{restaurant.location}</span>
              </span>
            </div>
            {/* Dietary Options */}
            {restaurant.dietaryOptions && restaurant.dietaryOptions.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {restaurant.dietaryOptions.map((option, index) => (
                  <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                    <span className="mr-1">{getDietaryIcon(option)}</span>
                    {option.replace('-', ' ')}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="text-center lg:text-right lg:ml-4">
            <div className={`text-2xl font-bold ${currentConfig.textColor}`}>
              {averageRating.toFixed(1)}/5
            </div>
            <div className="text-sm text-gray-500">
              {interestedCount}/{participants.length} interested
            </div>
          </div>
        </div>
      </div>

      {/* Group Summary Badges */}
      <div className="mb-4 flex flex-wrap gap-1 sm:gap-2 justify-center sm:justify-start">
        {mustEatCount > 0 && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-amber-100 text-amber-800">
            <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
            {mustEatCount} must eat
          </span>
        )}
        {interestedCount > mustEatCount && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-teal-100 text-teal-800">
            <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
            {interestedCount - mustEatCount} interested
          </span>
        )}
        {wontEatCount > 0 && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
            {wontEatCount} won't eat
          </span>
        )}
      </div>

      {/* Individual Ratings */}
      <div>
        <div className="text-sm font-semibold text-gray-700 mb-3">Individual Ratings:</div>
        <div className="space-y-2 sm:space-y-3">
          {participants.map(participant => {
            const participantRating = ratings[participant];
            const participantConfig = ratingConfig[participantRating] || ratingConfig[2]; // Fallback to "Maybe"
            const isCurrentUser = participant === currentUser;
            
            return (
              <div key={participant} className={`
                flex flex-col sm:flex-row sm:items-center sm:justify-between 
                p-3 rounded-lg backdrop-blur-sm space-y-2 sm:space-y-0
                ${isCurrentUser 
                  ? 'bg-orange-50 border-2 border-orange-200 bg-opacity-90' 
                  : 'bg-white bg-opacity-70'
                }
              `}>
                <span className={`
                  text-sm font-medium text-center sm:text-left
                  ${isCurrentUser ? 'text-orange-900' : 'text-gray-900'}
                `}>
                  {isCurrentUser ? `${participant} (You)` : participant}
                </span>
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-1 ml-0 sm:ml-4">
                  <div className="flex items-center gap-1 flex-wrap justify-center sm:justify-start">
                  {[0, 1, 2, 3, 4, 5].map(rating => {
                    const config = ratingConfig[rating];
                    const isActive = participantRating === rating;
                    const canEdit = isCurrentUser;
                    
                    return (
                      <button
                        key={rating}
                        onClick={() => handleRatingClick(participant, rating)}
                        disabled={!canEdit}
                        className={`
                          w-10 h-10 sm:w-8 sm:h-8 
                          text-sm sm:text-xs 
                          border-2 rounded-md font-bold
                          min-w-[44px] min-h-[44px] sm:min-w-[32px] sm:min-h-[32px]
                          mx-0.5 sm:mx-0
                          transition-all duration-200 ease-in-out
                          ${canEdit ? 'transform hover:scale-110 active:scale-95 cursor-pointer' : 'cursor-not-allowed opacity-75'}
                          ${isActive 
                            ? config.buttonActive + ' shadow-md' 
                            : canEdit
                              ? 'bg-white ' + config.buttonInactive
                              : 'bg-gray-100 border-gray-300 text-gray-500'
                          }
                        `}
                        title={canEdit ? config.label : `${participant}'s rating: ${config.label}`}
                      >
                        {rating}
                      </button>
                    );
                  })}
                  </div>
                  <span className={`text-center sm:text-left ml-0 sm:ml-3 text-xs font-semibold ${
                    isCurrentUser ? 'text-orange-700' : participantConfig.textColor
                  }`}>
                    {participantConfig.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rating Scale Legend */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-xs sm:text-xs text-gray-500 text-center">
          <div className="font-medium mb-1 sm:mb-0 sm:inline">Rating Scale:</div>
          <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 sm:inline">
            <span>0=Won't eat</span>
            <span>1=Not interested</span>
            <span>2=Neutral</span>
            <span>3=Would try</span>
            <span>4=Want to go</span>
            <span>5=Must eat</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantRating;