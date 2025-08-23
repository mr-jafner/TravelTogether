import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ActivityRating from './ActivityRating';
import RestaurantRating from './RestaurantRating';
import ActivityForm from './ActivityForm';
import RestaurantForm from './RestaurantForm';

const TripDetail = () => {
  const { tripId } = useParams();
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [showRestaurantForm, setShowRestaurantForm] = useState(false);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Your existing sampleTrips data stays exactly the same...
  const sampleTrips = [
    {
      id: 1,
      name: "Summer Family Vacation",
      destination: "Orlando, Florida",
      startDate: "2025-07-15",
      endDate: "2025-07-22",
      participants: ["Sarah Johnson", "Mike Johnson", "Emma Johnson", "Lucas Johnson"],
      currentUser: "Sarah Johnson",
      restaurants: [
        {
          id: 151,
          name: "Chef Mickey's",
          cuisine: "American",
          location: "Disney's Contemporary Resort",
          cost: 62,
          priceRange: "$$$",
          dietaryOptions: ["vegetarian", "kids-friendly"],
          groupCapacity: 8,
          votes: 4
        },
        {
          id: 152,
          name: "Ohana",
          cuisine: "Polynesian",
          location: "Disney's Polynesian Village Resort",
          cost: 65,
          priceRange: "$$$",
          dietaryOptions: ["gluten-free", "kids-friendly"],
          groupCapacity: 10,
          votes: 3
        },
        {
          id: 153,
          name: "Homecoming Kitchen",
          cuisine: "Southern",
          location: "Disney Springs",
          cost: 45,
          priceRange: "$$",
          dietaryOptions: ["vegetarian", "gluten-free"],
          groupCapacity: 6,
          votes: 2
        },
        {
          id: 154,
          name: "Cosmic Ray's Starlight Cafe",
          cuisine: "Fast Food",
          location: "Magic Kingdom",
          cost: 18,
          priceRange: "$",
          dietaryOptions: ["vegetarian", "kids-friendly"],
          groupCapacity: 12,
          votes: 4
        }
      ],
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
      currentUser: "Alex Chen",
      restaurants: [
        {
          id: 251,
          name: "Gordon Ramsay Hell's Kitchen",
          cuisine: "Fine Dining",
          location: "Caesars Palace",
          cost: 120,
          priceRange: "$$$$",
          dietaryOptions: ["gluten-free"],
          groupCapacity: 8,
          votes: 5
        },
        {
          id: 252,
          name: "The Buffet at Wynn",
          cuisine: "International",
          location: "Wynn Las Vegas",
          cost: 89,
          priceRange: "$$$",
          dietaryOptions: ["vegetarian", "gluten-free", "vegan"],
          groupCapacity: 15,
          votes: 4
        },
        {
          id: 253,
          name: "Hash House A Go Go",
          cuisine: "American",
          location: "The LINQ",
          cost: 35,
          priceRange: "$$",
          dietaryOptions: ["vegetarian"],
          groupCapacity: 10,
          votes: 3
        },
        {
          id: 254,
          name: "Yard House",
          cuisine: "Sports Bar",
          location: "The LINQ Promenade",
          cost: 28,
          priceRange: "$$",
          dietaryOptions: ["vegetarian", "gluten-free"],
          groupCapacity: 12,
          votes: 4
        }
      ],
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
      currentUser: "Jessica Brown",
      restaurants: [
        {
          id: 351,
          name: "Le Comptoir du Relais",
          cuisine: "French Bistro",
          location: "6th Arrondissement",
          cost: 45,
          priceRange: "$$",
          dietaryOptions: ["vegetarian"],
          groupCapacity: 4,
          votes: 2
        },
        {
          id: 352,
          name: "L'Ambroisie",
          cuisine: "Fine Dining",
          location: "Place des Vosges",
          cost: 180,
          priceRange: "$$$$",
          dietaryOptions: ["vegetarian", "gluten-free"],
          groupCapacity: 6,
          votes: 1
        },
        {
          id: 353,
          name: "Café de Flore",
          cuisine: "Café",
          location: "Saint-Germain-des-Prés",
          cost: 25,
          priceRange: "$",
          dietaryOptions: ["vegetarian", "vegan"],
          groupCapacity: 8,
          votes: 2
        },
        {
          id: 354,
          name: "Le Train Bleu",
          cuisine: "Brasserie",
          location: "Gare de Lyon",
          cost: 65,
          priceRange: "$$$",
          dietaryOptions: ["vegetarian", "gluten-free"],
          groupCapacity: 6,
          votes: 2
        }
      ],
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
      currentUser: "Jennifer Lee",
      restaurants: [
        {
          id: 451,
          name: "The Little Nell",
          cuisine: "Fine Dining",
          location: "Aspen, CO",
          cost: 95,
          priceRange: "$$$$",
          dietaryOptions: ["vegetarian", "gluten-free", "vegan"],
          groupCapacity: 12,
          votes: 7
        },
        {
          id: 452,
          name: "White House Tavern",
          cuisine: "American",
          location: "Aspen, CO",
          cost: 45,
          priceRange: "$$",
          dietaryOptions: ["vegetarian", "gluten-free"],
          groupCapacity: 15,
          votes: 6
        },
        {
          id: 453,
          name: "Ajax Tavern",
          cuisine: "Alpine",
          location: "Little Nell Hotel",
          cost: 65,
          priceRange: "$$$",
          dietaryOptions: ["vegetarian"],
          groupCapacity: 10,
          votes: 8
        },
        {
          id: 454,
          name: "Grateful Deli",
          cuisine: "Breakfast/Lunch",
          location: "Aspen, CO",
          cost: 22,
          priceRange: "$",
          dietaryOptions: ["vegetarian", "vegan", "gluten-free"],
          groupCapacity: 20,
          votes: 5
        }
      ],
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

  // Same formatDate function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Check both user trips and sample trips - use state for dynamic updates
  React.useEffect(() => {
    const userTrips = JSON.parse(localStorage.getItem('userTrips') || '[]');
    const allTrips = [...userTrips, ...sampleTrips];
    const foundTrip = allTrips.find(t => t.id === parseInt(tripId));
    setCurrentTrip(foundTrip);
  }, [tripId, refreshKey]);
  
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

  const handleAddActivity = (newActivity) => {
    // For user trips, save to localStorage and update state
    if (parseInt(tripId) < 1000) {
      const userTrips = JSON.parse(localStorage.getItem('userTrips') || '[]');
      const updatedTrips = userTrips.map(trip => {
        if (trip.id === parseInt(tripId)) {
          return {
            ...trip,
            activities: [...(trip.activities || []), newActivity]
          };
        }
        return trip;
      });
      localStorage.setItem('userTrips', JSON.stringify(updatedTrips));
      
      // Update state immediately
      setCurrentTrip(prev => ({
        ...prev,
        activities: [...(prev.activities || []), newActivity]
      }));
      
      // Initialize ratings for new activity
      const newRatings = {};
      trip.participants.forEach(participant => {
        newRatings[participant] = Math.floor(Math.random() * 6);
      });
      setActivityRatings(prev => ({
        ...prev,
        [newActivity.id]: newRatings
      }));
    }
    setShowActivityForm(false);
  };

  const handleAddRestaurant = (newRestaurant) => {
    // For user trips, save to localStorage and update state
    if (parseInt(tripId) < 1000) {
      const userTrips = JSON.parse(localStorage.getItem('userTrips') || '[]');
      const updatedTrips = userTrips.map(trip => {
        if (trip.id === parseInt(tripId)) {
          return {
            ...trip,
            restaurants: [...(trip.restaurants || []), newRestaurant]
          };
        }
        return trip;
      });
      localStorage.setItem('userTrips', JSON.stringify(updatedTrips));
      
      // Update state immediately
      setCurrentTrip(prev => ({
        ...prev,
        restaurants: [...(prev.restaurants || []), newRestaurant]
      }));
      
      // Initialize ratings for new restaurant
      const newRatings = {};
      trip.participants.forEach(participant => {
        newRatings[participant] = Math.floor(Math.random() * 6);
      });
      setRestaurantRatings(prev => ({
        ...prev,
        [newRestaurant.id]: newRatings
      }));
    }
    setShowRestaurantForm(false);
  };

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