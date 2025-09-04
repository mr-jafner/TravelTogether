import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tripApi, transformTripForFrontend } from '../services/api';
import { useUserTripFiltering } from '../hooks/useUserTripFiltering';
import TripFilterToggle from './common/TripFilterToggle';
import TripContextMessage from './common/TripContextMessage';

const TripList = () => {
  const [allTrips, setAllTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Use the reusable filtering hook
  const {
    filteredTrips,
    tripStats,
    viewMode,
    setViewMode,
    isUserParticipant,
    username,
    isLoggedIn
  } = useUserTripFiltering(allTrips);

  // Render function for participant highlighting
  const renderParticipant = (participant, index, participants) => (
    <span 
      key={index}
      className={participant === username ? 'text-blue-600 font-semibold' : 'text-gray-700'}
    >
      {participant === username ? `${participant} (you)` : participant}
      {index < participants.length - 1 && ', '}
    </span>
  );

  // Load all trips from API on component mount
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        setError(null);
        const trips = await tripApi.getAllTrips();
        // Transform trips to frontend format and sort by creation date (newest first)
        const transformedTrips = trips.map(transformTripForFrontend)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setAllTrips(transformedTrips);
      } catch (err) {
        console.error('Failed to fetch trips:', err);
        setError('Failed to load trips. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);


  // Helper function to format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };


  // Loading state
  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '1.2rem', color: '#666' }}>Loading trips...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '1.2rem', color: '#e74c3c', marginBottom: '1rem' }}>
          {error}
        </div>
        <button 
          onClick={() => window.location.reload()}
          style={{
            backgroundColor: '#f97316',
            color: 'white',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 sm:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          TravelTogether Trips
        </h1>
        
        <TripContextMessage
          isLoggedIn={isLoggedIn}
          viewMode={viewMode}
          tripStats={tripStats}
          filteredTripsLength={filteredTrips.length}
          className="mb-6"
        />

        <TripFilterToggle
          viewMode={viewMode}
          setViewMode={setViewMode}
          tripStats={tripStats}
          isLoggedIn={isLoggedIn}
          className="mb-6"
        />
      </div>


      {/* Trip Grid */}
      {filteredTrips.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map(trip => (
            <Link 
              key={trip.id}
              to={`/trips/${trip.id}`} 
              className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                    {trip.name}
                  </h3>
                  {isUserParticipant(trip) && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                      Your Trip
                    </span>
                  )}
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {trip.destinations ? trip.destinations.join(', ') : trip.destination}
                  </div>
                  
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                  </div>
                  
                  <div className="flex items-start">
                    <svg className="w-4 h-4 mr-2 mt-0.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                    </svg>
                    <span className="flex flex-wrap">
                      {trip.participants && trip.participants.map((participant, index) => 
                        renderParticipant(participant, index, trip.participants)
                      )}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-4 text-xs text-gray-500">
                      <span>{trip.activities?.length || 0} activities</span>
                      <span>{trip.restaurants?.length || 0} restaurants</span>
                    </div>
                    <span className="text-xs text-orange-600 font-medium group-hover:text-orange-700">
                      View Details →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Create New Trip Button for non-logged-in users or when viewing all trips */}
      {(!isLoggedIn || viewMode === 'allTrips' || filteredTrips.length > 0) && (
        <div className="mt-8 text-center">
          <Link 
            to="/trips/new" 
            className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create New Trip
          </Link>
        </div>
      )}
    </div>
  );
};

export default TripList;