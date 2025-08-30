import React from 'react';
import RestaurantRating from './RestaurantRating';

const FoodTab = ({ 
  trip, 
  restaurantRatings, 
  onRestaurantRatingChange, 
  showRestaurantForm, 
  setShowRestaurantForm, 
  onAddRestaurant,
  onEditRestaurant,
  onDeleteRestaurant
}) => {
  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
        <svg className="w-7 h-7 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        Restaurants & Food ({trip.restaurants?.length || 0})
      </h3>
      
      {/* Rating Scale Reference */}
      <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg">
        <div className="text-center">
          <div className="text-sm font-semibold text-gray-700 mb-2">Rating Scale</div>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs">
            <span className="flex items-center px-2 py-1 bg-red-100 text-red-700 rounded-full">
              <span className="w-4 h-4 bg-red-500 rounded text-white text-xs flex items-center justify-center mr-1 font-bold">0</span>
              Won't eat
            </span>
            <span className="flex items-center px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
              <span className="w-4 h-4 bg-orange-500 rounded text-white text-xs flex items-center justify-center mr-1 font-bold">1</span>
              Not interested
            </span>
            <span className="flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
              <span className="w-4 h-4 bg-gray-500 rounded text-white text-xs flex items-center justify-center mr-1 font-bold">2</span>
              Neutral
            </span>
            <span className="flex items-center px-2 py-1 bg-cyan-100 text-cyan-700 rounded-full">
              <span className="w-4 h-4 bg-cyan-500 rounded text-white text-xs flex items-center justify-center mr-1 font-bold">3</span>
              Would try
            </span>
            <span className="flex items-center px-2 py-1 bg-teal-100 text-teal-700 rounded-full">
              <span className="w-4 h-4 bg-teal-500 rounded text-white text-xs flex items-center justify-center mr-1 font-bold">4</span>
              Want to go
            </span>
            <span className="flex items-center px-2 py-1 bg-amber-100 text-amber-700 rounded-full">
              <span className="w-4 h-4 bg-amber-500 rounded text-white text-xs flex items-center justify-center mr-1 font-bold">5</span>
              Must eat
            </span>
          </div>
        </div>
      </div>
      
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
                onEditRestaurant={onEditRestaurant}
                onDeleteRestaurant={onDeleteRestaurant}
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

    </div>
  );
};

export default FoodTab;