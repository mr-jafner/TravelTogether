import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tripApi, transformTripForFrontend } from '../services/api';

const TripList = () => {
  const [allTrips, setAllTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Helper function to check if trip was created by current user
  const isUserTrip = (trip) => {
    // For now, we'll consider any trip created in the last hour as a "user trip"
    // In a real app, this would be based on user authentication
    const createdDate = new Date(trip.createdAt);
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return createdDate > oneHourAgo;
  };

  // Helper function to format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Separate user trips from sample trips based on creation time
  const userTrips = allTrips.filter(isUserTrip);
  const sampleTrips = allTrips.filter(trip => !isUserTrip(trip));

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
    <div>
      {userTrips.length > 0 && (
        <>
          <h2 style={{ color: '#f97316', marginBottom: '1rem' }}>Your Created Trips</h2>
          <ul style={{listStyle: 'none', padding: 0, marginBottom: '2rem'}}>
            {userTrips.map(trip => (
              <li key={trip.id}>
                <Link 
                  to={`/trips/${trip.id}`} 
                  style={{ 
                    textDecoration: 'none', 
                    color: 'inherit',
                    display: 'block',
                    padding: '1rem',
                    border: '2px solid #f97316',
                    borderRadius: '0.5rem',
                    marginBottom: '1rem',
                    background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(249, 115, 22, 0.05))',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(249, 115, 22, 0.1))';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(249, 115, 22, 0.05))';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <div>
                    <strong>{trip.name}</strong>
                    <span style={{ 
                      marginLeft: '0.5rem', 
                      fontSize: '0.75rem', 
                      backgroundColor: '#f97316', 
                      color: 'white', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '1rem' 
                    }}>
                      YOUR TRIP
                    </span>
                  </div>
                  <div>Destination: {trip.destination}</div>
                  <div>
                    Dates: {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                  </div>
                  <div>
                    Participants ({trip.participants.length}): {trip.participants.join(', ')}
                  </div>
                  <div>
                    <strong>Ready to plan activities and restaurants!</strong>
                  </div> 
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
      
      <h2>Sample Trips</h2>
      <ul style={{listStyle: 'none',padding:0}}>
        {sampleTrips.map(trip => (
          <li key={trip.id}>
             <Link 
              to={`/trips/${trip.id}`} 
              style={{ 
                textDecoration: 'none', 
                color: 'inherit',
                display: 'block',
                padding: '1rem',
                border: '1px solid rgba(23, 162, 184, 0.3)',
                borderRadius: '0.5rem',
                marginBottom: '1rem',
                background: 'linear-gradient(135deg, rgba(23, 162, 184, 0.1), rgba(253, 126, 20, 0.1))',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, rgba(23, 162, 184, 0.2), rgba(253, 126, 20, 0.2))';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, rgba(23, 162, 184, 0.1), rgba(253, 126, 20, 0.1))';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
              }}
            >
             <div>
                <strong>{trip.name}</strong>
              </div>
              <div>Destination: {trip.destination}</div>
              <div>
                Dates: {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
              </div>
              <div>
                Participants ({trip.participants.length}): {trip.participants.join(', ')}
              </div>
              <div>
                <strong>Activities ({trip.activityCount || 0}) & Restaurants ({trip.restaurantCount || 0}):</strong> Click to view details
              </div> 
            </Link>
            </li>
        ))}
      </ul>
    </div>
  );
};

export default TripList;