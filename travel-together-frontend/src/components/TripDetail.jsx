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
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  
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
        const ratingsData = {};
        
        for (const activity of trip.activities) {
          try {
            const ratings = await ratingApi.getActivityRatings(trip.id, activity.id);
            ratingsData[activity.id] = ratings || {}; // Should be {[participant]: rating}
          } catch (error) {
            console.error(`Failed to fetch ratings for activity ${activity.id}:`, error);
            ratingsData[activity.id] = {}; // Empty ratings as fallback
          }
        }
        
        setActivityRatings(ratingsData);
      }
    };
    
    fetchActivityRatings();
  }, [trip]);

  // Fetch actual restaurant ratings from API
  useEffect(() => {
    const fetchRestaurantRatings = async () => {
      if (trip && trip.restaurants) {
        const ratingsData = {};
        
        for (const restaurant of trip.restaurants) {
          try {
            const ratings = await ratingApi.getRestaurantRatings(trip.id, restaurant.id);
            ratingsData[restaurant.id] = ratings || {}; // Should be {[participant]: rating}
          } catch (error) {
            console.error(`Failed to fetch ratings for restaurant ${restaurant.id}:`, error);
            ratingsData[restaurant.id] = {}; // Empty ratings as fallback
          }
        }
        
        setRestaurantRatings(ratingsData);
      }
    };
    
    fetchRestaurantRatings();
  }, [trip]);

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

  const handleEditTrip = () => {
    setEditFormData({
      name: trip.name,
      destination: trip.destination,
      startDate: trip.startDate,
      endDate: trip.endDate
    });
    setIsEditing(true);
  };

  const handleSaveTrip = async () => {
    try {
      setError(null);
      await tripApi.updateTrip(tripId, editFormData);
      await fetchTripData(); // Refresh data
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update trip:', error);
      setError(`Failed to update trip: ${error.message}`);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFormData({});
  };

  const handleDeleteTrip = async () => {
    if (!window.confirm('Are you sure you want to delete this trip? This action cannot be undone.')) {
      return;
    }

    try {
      setError(null);
      await tripApi.deleteTrip(tripId);
      // Redirect to trip list after successful deletion
      window.location.href = '/traveltogether/trips';
    } catch (error) {
      console.error('Failed to delete trip:', error);
      setError(`Failed to delete trip: ${error.message}`);
    }
  };

  const handleEditActivity = async (activityId, activityData) => {
    try {
      setError(null);
      await tripApi.updateActivity(tripId, activityId, activityData);
      await fetchTripData(); // Refresh data to show updated activity
    } catch (error) {
      console.error('Failed to update activity:', error);
      setError(`Failed to update activity: ${error.message}`);
      throw error; // Re-throw to let child component handle UI state
    }
  };

  const handleDeleteActivity = async (activityId) => {
    try {
      setError(null);
      await tripApi.deleteActivity(tripId, activityId);
      await fetchTripData(); // Refresh data to remove deleted activity
    } catch (error) {
      console.error('Failed to delete activity:', error);
      setError(`Failed to delete activity: ${error.message}`);
      throw error; // Re-throw to let child component handle UI state
    }
  };

  const handleEditRestaurant = async (restaurantId, restaurantData) => {
    try {
      setError(null);
      await tripApi.updateRestaurant(tripId, restaurantId, restaurantData);
      await fetchTripData(); // Refresh data to show updated restaurant
    } catch (error) {
      console.error('Failed to update restaurant:', error);
      setError(`Failed to update restaurant: ${error.message}`);
      throw error; // Re-throw to let child component handle UI state
    }
  };

  const handleDeleteRestaurant = async (restaurantId) => {
    try {
      setError(null);
      await tripApi.deleteRestaurant(tripId, restaurantId);
      await fetchTripData(); // Refresh data to remove deleted restaurant
    } catch (error) {
      console.error('Failed to delete restaurant:', error);
      setError(`Failed to delete restaurant: ${error.message}`);
      throw error; // Re-throw to let child component handle UI state
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
          {!isEditing ? (
            <>
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {trip.name}
                </h1>
                <div className="flex space-x-2">
                  <button
                    onClick={handleEditTrip}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={handleDeleteTrip}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
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
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Edit Trip</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveTrip}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trip Name</label>
                  <input
                    type="text"
                    value={editFormData.name || ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter trip name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                  <input
                    type="text"
                    value={editFormData.destination || ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, destination: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter destination"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={editFormData.startDate || ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={editFormData.endDate || ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
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
                count: trip.travel?.length || 0,
                icon: '✈️'
              },
              { 
                id: 'lodging', 
                name: 'Lodging', 
                count: trip.lodging?.length || 0,
                icon: '🏨'
              },
              { 
                id: 'logistics', 
                name: 'Logistics', 
                count: trip.logistics?.length || 0,
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
                    onEditActivity={handleEditActivity}
                    onDeleteActivity={handleDeleteActivity}
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
                    onEditRestaurant={handleEditRestaurant}
                    onDeleteRestaurant={handleDeleteRestaurant}
                  />
                )}
                
                {activeTab === 'travel' && (
                  <TravelTab 
                    trip={trip} 
                    onTravelUpdate={fetchTripData}
                  />
                )}
                
                {activeTab === 'lodging' && (
                  <LodgingTab 
                    trip={trip} 
                    onLodgingUpdate={fetchTripData}
                  />
                )}
                
                {activeTab === 'logistics' && (
                  <LogisticsTab 
                    trip={trip}
                    onLogisticsUpdate={fetchTripData}
                  />
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