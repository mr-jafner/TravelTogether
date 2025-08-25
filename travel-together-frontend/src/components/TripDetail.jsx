import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ActivityRating from './ActivityRating';
import RestaurantRating from './RestaurantRating';
import ActivityForm from './ActivityForm';
import RestaurantForm from './RestaurantForm';
import { tripApi, transformTripForFrontend } from '../services/api';

const TripDetail = () => {
  const { tripId } = useParams();
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [showRestaurantForm, setShowRestaurantForm] = useState(false);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Fetch trip data function (reusable)
  const fetchTripData = async () => {
    try {
      setLoading(true);
      setError(null);
      const tripData = await tripApi.getTripById(parseInt(tripId));
      const transformedTrip = transformTripForFrontend(tripData);
      setCurrentTrip(transformedTrip);
    } catch (err) {
      console.error('Failed to fetch trip:', err);
      setError('Failed to load trip details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch trip data from API
  useEffect(() => {
    if (tripId) {
      fetchTripData();
    }
  }, [tripId, refreshKey]);

  // Same formatDate function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const trip = currentTrip;

  // Initialize state AFTER trip is found
  const [activityRatings, setActivityRatings] = useState(() => {
    if (!trip || !trip.activities) return {};
    
    const initialRatings = {};
    trip.activities.forEach(activity => {
      const participantRatings = {};
      trip.participants.forEach(participant => {
        participantRatings[participant] = Math.floor(Math.random() * 6);
      });
      initialRatings[activity.id] = participantRatings;
    });
    return initialRatings;
  });

  const [restaurantRatings, setRestaurantRatings] = useState(() => {
    if (!trip || !trip.restaurants) return {};
    
    const initialRatings = {};
    trip.restaurants.forEach(restaurant => {
      const participantRatings = {};
      trip.participants.forEach(participant => {
        participantRatings[participant] = Math.floor(Math.random() * 6);
      });
      initialRatings[restaurant.id] = participantRatings;
    });
    return initialRatings;
  });

  const handleActivityRatingChange = (activityId, ratings) => {
    setActivityRatings(prev => ({
      ...prev,
      [activityId]: ratings
    }));
  };

  const handleRestaurantRatingChange = (restaurantId, ratings) => {
    setRestaurantRatings(prev => ({
      ...prev,
      [restaurantId]: ratings
    }));
  };

  const handleAddActivity = async (newActivity) => {
    try {
      // Use API to add activity to trip
      await tripApi.addActivity(tripId, newActivity);
      
      // Refresh trip data to get updated activities list
      await fetchTripData();
      
      setShowActivityForm(false);
    } catch (error) {
      console.error('Failed to add activity:', error);
      // Show error to user but don't close form so they can retry
      setError(`Failed to add activity: ${error.message}`);
    }
  };

  const handleAddRestaurant = async (newRestaurant) => {
    try {
      // Use API to add restaurant to trip
      await tripApi.addRestaurant(tripId, newRestaurant);
      
      // Refresh trip data to get updated restaurants list
      await fetchTripData();
      
      setShowRestaurantForm(false);
    } catch (error) {
      console.error('Failed to add restaurant:', error);
      // Show error to user but don't close form so they can retry
      setError(`Failed to add restaurant: ${error.message}`);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 mb-4">Loading trip...</div>
          <div className="text-gray-600">Please wait while we fetch your trip details.</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Trip</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-x-4">
            <button 
              onClick={() => setRefreshKey(prev => prev + 1)}
              className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Try Again
            </button>
            <Link 
              to="/trips" 
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              ← Back to My Trips
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Trip not found state
  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Trip not found</h2>
          <Link 
            to="/trips" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Back to My Trips
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6 sm:p-8">
        {/* Back Navigation */}
        <Link 
          to="/trips" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors group"
        >
          <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to My Trips
        </Link>
        
        {/* Trip Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {trip.name}
          </h1>
          <div className="flex items-center text-lg text-gray-600 mb-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {trip.destination}
          </div>
          <div className="flex items-center text-gray-600">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-medium">{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
          </div>
        </div>
        
        {/* Participants Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Participants ({trip.participants.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {trip.participants.map((participant, index) => (
              <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium text-sm mr-3">
                  {participant.split(' ').map(n => n[0]).join('')}
                </div>
                <span className="text-gray-900 font-medium">{participant}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Activities Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
            <svg className="w-7 h-7 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            Activities ({trip.activities?.length || 0}) - Rate 0-5
          </h3>
          
          {trip.activities && trip.activities.length > 0 ? (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>How it works:</strong> Rate each activity from 0-5 based on your interest level. 
                  The system automatically calculates group consensus and highlights popular activities vs. those that might work better for subgroups.
                </p>
              </div>
              
              {trip.activities.map(activity => (
                <ActivityRating
                  key={activity.id}
                  activity={activity}
                  participants={trip.participants}
                  currentUser={trip.currentUser}
                  onRatingChange={handleActivityRatingChange}
                  tripId={trip.id}
                />
              ))}
            </>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        {/* Restaurants Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
            <svg className="w-7 h-7 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Restaurants ({trip.restaurants?.length || 0}) - Rate 0-5
          </h3>
          
          {trip.restaurants && trip.restaurants.length > 0 ? (
            <>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-orange-800">
                  <strong>How it works:</strong> Rate each restaurant from 0-5 based on your interest level. 
                  The system helps identify dining preferences and finds restaurants that work for the whole group or suggest subgroup dining.
                </p>
              </div>
              
              {trip.restaurants.map(restaurant => (
                <RestaurantRating
                  key={restaurant.id}
                  restaurant={restaurant}
                  participants={trip.participants}
                  currentUser={trip.currentUser}
                  onRatingChange={handleRestaurantRatingChange}
                  tripId={trip.id}
                />
              ))}
            </>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        {/* Activity Form */}
        {showActivityForm && (
          <ActivityForm 
            onAddActivity={handleAddActivity}
            onCancel={() => setShowActivityForm(false)}
          />
        )}

        {/* Restaurant Form */}
        {showRestaurantForm && (
          <RestaurantForm 
            onAddRestaurant={handleAddRestaurant}
            onCancel={() => setShowRestaurantForm(false)}
          />
        )}

        {/* Group Analysis Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Group Analysis
          </h3>
          {(() => {
            // Calculate consensus data for activities
            const activityConsensusData = (trip.activities || []).map(activity => {
              const ratings = activityRatings[activity.id] || {};
              const values = Object.values(ratings);
              const avg = values.length ? values.reduce((sum, r) => sum + r, 0) / values.length : 2.5;
              const interested = values.filter(r => r >= 3).length;
              const mustDo = values.filter(r => r === 5).length;
              return { ...activity, avg, interested, mustDo, total: trip.participants.length, type: 'activity' };
            }).sort((a, b) => b.avg - a.avg);

            // Calculate consensus data for restaurants
            const restaurantConsensusData = (trip.restaurants || []).map(restaurant => {
              const ratings = restaurantRatings[restaurant.id] || {};
              const values = Object.values(ratings);
              const avg = values.length ? values.reduce((sum, r) => sum + r, 0) / values.length : 2.5;
              const interested = values.filter(r => r >= 3).length;
              const mustEat = values.filter(r => r === 5).length;
              return { ...restaurant, avg, interested, mustEat, total: trip.participants.length, type: 'restaurant' };
            }).sort((a, b) => b.avg - a.avg);

            const strongActivityConsensus = activityConsensusData.filter(a => a.avg >= 4);
            const strongRestaurantConsensus = restaurantConsensusData.filter(r => r.avg >= 4);
            const divisiveActivities = activityConsensusData.filter(a => a.interested > 0 && a.interested < a.total * 0.6);
            const divisiveRestaurants = restaurantConsensusData.filter(r => r.interested > 0 && r.interested < r.total * 0.6);

            return (
              <div className="space-y-4">
                {(strongActivityConsensus.length > 0 || strongRestaurantConsensus.length > 0) && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-bold text-green-800 mb-3 flex items-center">
                      <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                      Strong Group Consensus
                    </h4>
                    <div className="space-y-3">
                      {strongActivityConsensus.length > 0 && (
                        <div>
                          <h5 className="text-sm font-semibold text-green-700 mb-2">Activities:</h5>
                          <div className="space-y-1">
                            {strongActivityConsensus.map(activity => (
                              <div key={`activity-${activity.id}`} className="text-sm text-green-700 flex justify-between">
                                <span className="font-medium">{activity.name}</span>
                                <span className="text-green-600">
                                  {activity.avg.toFixed(1)}/5 avg • {activity.interested}/{activity.total} interested
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {strongRestaurantConsensus.length > 0 && (
                        <div>
                          <h5 className="text-sm font-semibold text-green-700 mb-2">Restaurants:</h5>
                          <div className="space-y-1">
                            {strongRestaurantConsensus.map(restaurant => (
                              <div key={`restaurant-${restaurant.id}`} className="text-sm text-green-700 flex justify-between">
                                <span className="font-medium">{restaurant.name}</span>
                                <span className="text-green-600">
                                  {restaurant.avg.toFixed(1)}/5 avg • {restaurant.interested}/{restaurant.total} interested
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {(divisiveActivities.length > 0 || divisiveRestaurants.length > 0) && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-bold text-yellow-800 mb-3 flex items-center">
                      <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                      Mixed Opinions - Consider Subgroups
                    </h4>
                    <div className="space-y-3">
                      {divisiveActivities.length > 0 && (
                        <div>
                          <h5 className="text-sm font-semibold text-yellow-700 mb-2">Activities:</h5>
                          <div className="space-y-1">
                            {divisiveActivities.map(activity => (
                              <div key={`div-activity-${activity.id}`} className="text-sm text-yellow-700 flex justify-between">
                                <span className="font-medium">{activity.name}</span>
                                <span className="text-yellow-600">
                                  {activity.interested}/{activity.total} interested
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {divisiveRestaurants.length > 0 && (
                        <div>
                          <h5 className="text-sm font-semibold text-yellow-700 mb-2">Restaurants:</h5>
                          <div className="space-y-1">
                            {divisiveRestaurants.map(restaurant => (
                              <div key={`div-restaurant-${restaurant.id}`} className="text-sm text-yellow-700 flex justify-between">
                                <span className="font-medium">{restaurant.name}</span>
                                <span className="text-yellow-600">
                                  {restaurant.interested}/{restaurant.total} interested
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {strongActivityConsensus.length === 0 && strongRestaurantConsensus.length === 0 && 
                 divisiveActivities.length === 0 && divisiveRestaurants.length === 0 && (
                  <div className="text-center text-gray-500 py-4">
                    <p>Start rating activities and restaurants to see group analysis!</p>
                  </div>
                )}
              </div>
            );
          })()}
        </div>

        {/* Trip Info Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Trip Information
          </h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-600 mb-2">Trip logistics panel coming soon...</p>
            <p className="text-sm text-gray-500">
              <em>This will include: Wi-Fi passwords, room numbers, flight details, important notes, and more.</em>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetail;