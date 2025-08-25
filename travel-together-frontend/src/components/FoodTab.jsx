import React from 'react';
import RestaurantRating from './RestaurantRating';
import RestaurantForm from './RestaurantForm';

const FoodTab = ({ 
  trip, 
  restaurantRatings, 
  onRestaurantRatingChange, 
  showRestaurantForm, 
  setShowRestaurantForm, 
  onAddRestaurant 
}) => {
  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
        <svg className="w-7 h-7 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        Restaurants & Food ({trip.restaurants?.length || 0}) - Rate 0-5
      </h3>
      
      {trip.restaurants && trip.restaurants.length > 0 ? (
        <div className="space-y-4">
          {/* Add New Restaurant Button */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <button 
              onClick={() => setShowRestaurantForm(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Another Restaurant
            </button>
          </div>

          {/* Restaurants List */}
          <div className="space-y-6">
            {trip.restaurants.map(restaurant => (
              <RestaurantRating
                key={restaurant.id}
                restaurant={restaurant}
                participants={trip.participants}
                ratings={restaurantRatings[restaurant.id] || {}}
                onRatingChange={(ratings) => onRestaurantRatingChange(restaurant.id, ratings)}
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
          <h4 className="text-lg font-semibold text-gray-700 mb-2">No Restaurants Yet</h4>
          <p className="text-gray-500 mb-4">
            Add restaurants you'd like to try on this trip. Your group can vote on their dining preferences!
          </p>
          <button 
            onClick={() => setShowRestaurantForm(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Add First Restaurant
          </button>
        </div>
      )}

      {/* Restaurant Form */}
      {showRestaurantForm && (
        <div className="mt-6">
          <RestaurantForm 
            onAddRestaurant={onAddRestaurant}
            onCancel={() => setShowRestaurantForm(false)}
          />
        </div>
      )}
    </div>
  );
};

export default FoodTab;