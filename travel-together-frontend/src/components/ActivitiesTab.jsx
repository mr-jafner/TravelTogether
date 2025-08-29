import React from 'react';
import ActivityRating from './ActivityRating';

const ActivitiesTab = ({ 
  trip, 
  activityRatings, 
  onActivityRatingChange, 
  showActivityForm, 
  setShowActivityForm, 
  onAddActivity 
}) => {
  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
        <svg className="w-7 h-7 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
        Activities ({trip.activities?.length || 0}) - Rate 0-5
      </h3>
      
      {trip.activities && trip.activities.length > 0 ? (
        <div className="space-y-4">
          {/* Add New Activity Button */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <button 
              onClick={() => setShowActivityForm(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Another Activity
            </button>
          </div>

          {/* Activities List */}
          <div className="space-y-6">
            {trip.activities.map(activity => (
              <ActivityRating
                key={activity.id}
                activity={activity}
                participants={trip.participants}
                ratings={activityRatings[activity.id] || {}}
                onRatingChange={(ratings) => onActivityRatingChange(activity.id, ratings)}
                currentUser={trip.currentUser}
                tripId={trip.id}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <h4 className="text-lg font-semibold text-gray-700 mb-2">No Activities Yet</h4>
          <p className="text-gray-500 mb-4">
            Start adding activities you'd like to do on this trip. Your group can then vote on their preferences!
          </p>
          <button 
            onClick={() => setShowActivityForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Add First Activity
          </button>
        </div>
      )}

    </div>
  );
};

export default ActivitiesTab;