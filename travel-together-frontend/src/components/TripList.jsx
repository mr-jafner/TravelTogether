import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const TripList = () => {
  const [userTrips, setUserTrips] = useState([]);

  // Load user trips from localStorage on component mount
  useEffect(() => {
    const savedTrips = JSON.parse(localStorage.getItem('userTrips') || '[]');
    setUserTrips(savedTrips);
  }, []);

  // Sample trip data - realistic scenarios for development/testing
  const sampleTrips = [
    {
      id: 1,
      name: "Summer Family Vacation",
      destination: "Orlando, Florida",
      startDate: "2025-07-15",
      endDate: "2025-07-22",
      participants: ["Sarah Johnson", "Mike Johnson", "Emma Johnson", "Lucas Johnson"],
      activities: [
        {
          id: 101,
          name: "Magic Kingdom",
          category: "Entertainment",
          location: "Bay Lake, FL",
          cost: 109,
          duration: "Full Day",
          votes: 4
        },
        {
          id: 102,
          name: "Universal Studios",
          category: "Entertainment", 
          location: "Orlando, FL",
          cost: 115,
          duration: "Full Day",
          votes: 3
        },
        {
          id: 103,
          name: "Disney's Blizzard Beach",
          category: "Recreation",
          location: "Orlando, FL", 
          cost: 75,
          duration: "Half Day",
          votes: 4
        },
        {
          id: 104,
          name: "Character Breakfast at Chef Mickey's",
          category: "Dining",
          location: "Orlando, FL",
          cost: 62,
          duration: "2 hours",
          votes: 2
        }
      ]
    },
    {
      id: 2,
      name: "Bachelor Party Weekend",
      destination: "Las Vegas, Nevada",
      startDate: "2025-09-12",
      endDate: "2025-09-14",
      participants: ["Alex Chen", "David Martinez", "Ryan Thompson", "Kevin Park", "Jordan Williams"],
      activities: [
        {
          id: 201,
          name: "Cirque du Soleil Show",
          category: "Entertainment",
          location: "The Strip, Las Vegas",
          cost: 89,
          duration: "3 hours",
          votes: 5
        },
        {
          id: 202,
          name: "High Roller Observation Wheel",
          category: "Sightseeing",
          location: "The LINQ, Las Vegas",
          cost: 35,
          duration: "1 hour",
          votes: 4
        },
        {
          id: 203,
          name: "Pool Party at Marquee Dayclub",
          category: "Entertainment",
          location: "The Cosmopolitan, Las Vegas",
          cost: 75,
          duration: "4 hours", 
          votes: 3
        },
        {
          id: 204,
          name: "Steakhouse Dinner",
          category: "Dining",
          location: "Gordon Ramsay Hell's Kitchen",
          cost: 150,
          duration: "2 hours",
          votes: 5
        }
      ]
    },
    {
      id: 3,
      name: "European Adventure",
      destination: "Paris, France",
      startDate: "2025-10-05",
      endDate: "2025-10-18",
      participants: ["Jessica Brown", "Amanda Davis"],
      activities: [
        {
          id: 301,
          name: "Eiffel Tower Visit",
          category: "Sightseeing",
          location: "Champ de Mars, Paris",
          cost: 29,
          duration: "3 hours",
          votes: 2
        },
        {
          id: 302,
          name: "Louvre Museum",
          category: "Culture",
          location: "1st Arrondissement, Paris",
          cost: 22,
          duration: "4 hours",
          votes: 2
        },
        {
          id: 303,
          name: "Seine River Cruise",
          category: "Sightseeing",
          location: "Seine River, Paris",
          cost: 15,
          duration: "1.5 hours",
          votes: 2
        },
        {
          id: 304,
          name: "Wine Tasting in Montmartre",
          category: "Dining",
          location: "Montmartre, Paris",
          cost: 65,
          duration: "2 hours",
          votes: 1
        },
        {
          id: 305,
          name: "Day Trip to Versailles",
          category: "Culture",
          location: "Versailles, France",
          cost: 35,
          duration: "Full Day",
          votes: 1
        }
      ]
    },
    {
      id: 4,
      name: "Company Retreat",
      destination: "Aspen, Colorado",
      startDate: "2025-11-08",
      endDate: "2025-11-10",
      participants: ["Jennifer Lee", "Mark Wilson", "Lisa Garcia", "Tom Anderson", "Rachel Kim", "Steve Miller", "Monica Rodriguez", "Chris Taylor"],
      activities: [
        {
          id: 401,
          name: "Team Building Ropes Course",
          category: "Team Building",
          location: "Aspen Recreation Center",
          cost: 45,
          duration: "3 hours",
          votes: 6
        },
        {
          id: 402,
          name: "Scenic Gondola Ride",
          category: "Sightseeing",
          location: "Aspen Mountain",
          cost: 32,
          duration: "2 hours",
          votes: 8
        },
        {
          id: 403,
          name: "Group Dinner at The Little Nell",
          category: "Dining",
          location: "Aspen, CO",
          cost: 95,
          duration: "2.5 hours",
          votes: 7
        },
        {
          id: 404,
          name: "Morning Yoga Session",
          category: "Wellness",
          location: "Hotel Conference Room",
          cost: 0,
          duration: "1 hour",
          votes: 4
        },
        {
          id: 405,
          name: "Strategic Planning Workshop",
          category: "Business",
          location: "Hotel Meeting Room",
          cost: 0,
          duration: "4 hours",
          votes: 8
        }
      ]
    }
  ];

  // Helper function to format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Combine user trips and sample trips
  const allTrips = [...userTrips, ...sampleTrips];

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
                <strong>Activities ({trip.activities.length}):</strong> Click to view details
              </div> 
            </Link>
            </li>
        ))}
      </ul>
    </div>
  );
};

export default TripList;