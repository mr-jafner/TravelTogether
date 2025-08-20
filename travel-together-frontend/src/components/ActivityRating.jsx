import React, { useState } from 'react';

const ActivityRating = ({ activity, participants, onRatingChange }) => {
  // Initialize ratings state - each participant starts with rating 2 (indifferent)
  const [ratings, setRatings] = useState(() => {
    const initialRatings = {};
    participants.forEach(participant => {
      // Convert existing votes to mock individual ratings for demo
      initialRatings[participant] = Math.floor(Math.random() * 6); // 0-5 random for now
    });
    return initialRatings;
  });

  const handleRatingClick = (participant, rating) => {
    const newRatings = { ...ratings, [participant]: rating };
    setRatings(newRatings);
    if (onRatingChange) {
      onRatingChange(activity.id, newRatings);
    }
  };

  // Calculate group stats
  const ratingValues = Object.values(ratings);
  const averageRating = ratingValues.reduce((sum, rating) => sum + rating, 0) / ratingValues.length;
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
      bgColor: "bg-blue-50", 
      borderColor: "border-blue-200",
      textColor: "text-blue-700",
      buttonActive: "bg-blue-500 border-blue-500 text-white",
      buttonInactive: "border-blue-300 text-blue-600 hover:bg-blue-50"
    },
    4: { 
      label: "Really want", 
      bgColor: "bg-green-50", 
      borderColor: "border-green-200",
      textColor: "text-green-700",
      buttonActive: "bg-green-500 border-green-500 text-white",
      buttonInactive: "border-green-300 text-green-600 hover:bg-green-50"
    },
    5: { 
      label: "Must do", 
      bgColor: "bg-purple-50", 
      borderColor: "border-purple-200",
      textColor: "text-purple-700",
      buttonActive: "bg-purple-500 border-purple-500 text-white",
      buttonInactive: "border-purple-300 text-purple-600 hover:bg-purple-50"
    }
  };

  const currentConfig = ratingConfig[Math.round(averageRating)];

  return (
    <div className={`border rounded-lg p-6 mb-4 transition-all duration-300 hover:shadow-md ${currentConfig.bgColor} ${currentConfig.borderColor}`}>
      {/* Activity Header */}
      <div className="mb-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h4 className="text-xl font-bold text-gray-900 mb-2">
              {activity.name}
            </h4>
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
          <div className="text-right ml-4">
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
      <div className="mb-4 flex flex-wrap gap-2">
        {mustDoCount > 0 && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
            {mustDoCount} must do
          </span>
        )}
        {interestedCount > mustDoCount && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
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

      {/* Individual Ratings */}
      <div>
        <div className="text-sm font-semibold text-gray-700 mb-3">Individual Ratings:</div>
        <div className="space-y-3">
          {participants.map(participant => {
            const participantRating = ratings[participant];
            const participantConfig = ratingConfig[participantRating];
            
            return (
              <div key={participant} className="flex items-center justify-between p-3 bg-white bg-opacity-70 rounded-lg backdrop-blur-sm">
                <span className="text-sm font-medium text-gray-900 min-w-0 flex-1">
                  {participant}
                </span>
                <div className="flex items-center gap-1 ml-4">
                  {[0, 1, 2, 3, 4, 5].map(rating => {
                    const config = ratingConfig[rating];
                    const isActive = participantRating === rating;
                    
                    return (
                      <button
                        key={rating}
                        onClick={() => handleRatingClick(participant, rating)}
                        className={`
                          w-8 h-8 text-xs border-2 rounded-md font-bold
                          transition-all duration-200 ease-in-out
                          transform hover:scale-110 active:scale-95
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
                  <span className={`ml-3 text-xs font-semibold ${participantConfig.textColor}`}>
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
        <div className="text-xs text-gray-500 text-center">
          <span className="font-medium">Rating Scale:</span> 
          <span className="mx-1">0=Won't do</span> • 
          <span className="mx-1">1=Don't want</span> • 
          <span className="mx-1">2=Indifferent</span> • 
          <span className="mx-1">3=Interested</span> • 
          <span className="mx-1">4=Really want</span> • 
          <span className="mx-1">5=Must do</span>
        </div>
      </div>
    </div>
  );
};

export default ActivityRating;