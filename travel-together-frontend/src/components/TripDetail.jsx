import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ActivityRating from './ActivityRating';
import RestaurantRating from './RestaurantRating';
import ActivityForm from './ActivityForm';
import RestaurantForm from './RestaurantForm';
import { tripApi, ratingApi, transformTripForFrontend } from '../services/api';
import TabNavigation from './TabNavigation';
import ActivitiesTab from './ActivitiesTab';
import FoodTab from './FoodTab';
import TravelTab from './TravelTab';
import LodgingTab from './LodgingTab';
import LogisticsTab from './LogisticsTab';
import ItineraryTab from './ItineraryTab';
import GroupAnalysisTab from './GroupAnalysisTab';

const TripDetail = () => {
  const { tripId } = useParams();
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [showRestaurantForm, setShowRestaurantForm] = useState(false);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState('activities');
  
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

  // Initialize rating states with simple vote counts from API
  const [activityRatings, setActivityRatings] = useState({});
  const [restaurantRatings, setRestaurantRatings] = useState({});

  // Fetch actual participant ratings from API
  useEffect(() => {
    const fetchActivityRatings = async () => {
      if (trip && trip.activities) {
        console.log('🏠 TripDetail: Fetching activity ratings for trip', trip.id);
        const ratingsData = {};
        
        for (const activity of trip.activities) {
          try {
            const ratings = await ratingApi.getActivityRatings(trip.id, activity.id);
            console.log(`📊 Activity ${activity.id} ratings from API:`, ratings);
            ratingsData[activity.id] = ratings || {}; // Should be {[participant]: rating}
          } catch (error) {
            console.error(`Failed to fetch ratings for activity ${activity.id}:`, error);
            ratingsData[activity.id] = {}; // Empty ratings as fallback
          }
        }
        
        console.log('🏠 TripDetail: Setting activity ratings:', ratingsData);
        setActivityRatings(ratingsData);
      }
    };
    
    fetchActivityRatings();
  }, [trip]);

  // Fetch actual restaurant ratings from API
  useEffect(() => {
    const fetchRestaurantRatings = async () => {
      if (trip && trip.restaurants) {
        console.log('🏠 TripDetail: Fetching restaurant ratings for trip', trip.id);
        const ratingsData = {};
        
        for (const restaurant of trip.restaurants) {
          try {
            const ratings = await ratingApi.getRestaurantRatings(trip.id, restaurant.id);
            console.log(`📊 Restaurant ${restaurant.id} ratings from API:`, ratings);
            ratingsData[restaurant.id] = ratings || {}; // Should be {[participant]: rating}
          } catch (error) {
            console.error(`Failed to fetch ratings for restaurant ${restaurant.id}:`, error);
            ratingsData[restaurant.id] = {}; // Empty ratings as fallback
          }
        }
        
        console.log('🏠 TripDetail: Setting restaurant ratings:', ratingsData);
        setRestaurantRatings(ratingsData);
      }
    };
    
    fetchRestaurantRatings();
  }, [trip]);

  const handleActivityRatingChange = (activityId, ratings) => {
    console.log('🏠 TripDetail: Activity rating change received', { activityId, ratings });
    setActivityRatings(prev => {
      const newState = {
        ...prev,
        [activityId]: ratings
      };
      console.log('🏠 TripDetail: New activity ratings state', newState);
      return newState;
    });
    
    // Optional: Force refresh trip data to ensure backend sync
    // Commented out for now to prevent race conditions
    // setRefreshKey(prev => prev + 1);
  };

  const handleRestaurantRatingChange = (restaurantId, ratings) => {
    console.log('🏠 TripDetail: Restaurant rating change received', { restaurantId, ratings });
    setRestaurantRatings(prev => {
      const newState = {
        ...prev,
        [restaurantId]: ratings
      };
      console.log('🏠 TripDetail: New restaurant ratings state', newState);
      return newState;
    });
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

        {/* Tabbed Interface */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          {(() => {
            const tabs = [
              { 
                id: 'activities', 
                name: 'Activities', 
                count: trip.activities?.length || 0,
                icon: '🎯'
              },
              { 
                id: 'food', 
                name: 'Food', 
                count: trip.restaurants?.length || 0,
                icon: '🍽️'
              },
              { 
                id: 'travel', 
                name: 'Travel', 
                count: 0,
                icon: '✈️'
              },
              { 
                id: 'lodging', 
                name: 'Lodging', 
                count: 0,
                icon: '🏨'
              },
              { 
                id: 'logistics', 
                name: 'Logistics', 
                count: 0,
                icon: '📋'
              },
              { 
                id: 'itinerary', 
                name: 'Itinerary', 
                count: 0,
                icon: '📅'
              },
              { 
                id: 'analysis', 
                name: 'Group Analysis', 
                count: 0,
                icon: '📊'
              }
            ];

            return (
              <>
                <TabNavigation 
                  activeTab={activeTab} 
                  setActiveTab={setActiveTab} 
                  tabs={tabs} 
                />
                
                {activeTab === 'activities' && (
                  <ActivitiesTab
                    trip={trip}
                    activityRatings={activityRatings}
                    onActivityRatingChange={handleActivityRatingChange}
                    showActivityForm={showActivityForm}
                    setShowActivityForm={setShowActivityForm}
                    onAddActivity={handleAddActivity}
                  />
                )}
                
                {activeTab === 'food' && (
                  <FoodTab
                    trip={trip}
                    restaurantRatings={restaurantRatings}
                    onRestaurantRatingChange={handleRestaurantRatingChange}
                    showRestaurantForm={showRestaurantForm}
                    setShowRestaurantForm={setShowRestaurantForm}
                    onAddRestaurant={handleAddRestaurant}
                  />
                )}
                
                {activeTab === 'travel' && (
                  <TravelTab trip={trip} />
                )}
                
                {activeTab === 'lodging' && (
                  <LodgingTab trip={trip} />
                )}
                
                {activeTab === 'logistics' && (
                  <LogisticsTab trip={trip} />
                )}
                
                {activeTab === 'itinerary' && (
                  <ItineraryTab trip={trip} />
                )}
                
                {activeTab === 'analysis' && (
                  <GroupAnalysisTab
                    trip={trip}
                    activityRatings={activityRatings}
                    restaurantRatings={restaurantRatings}
                  />
                )}
                
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
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default TripDetail;