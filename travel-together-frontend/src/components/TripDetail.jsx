import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ActivityRating from './ActivityRating';

const TripDetail = () => {
  const { tripId } = useParams();
  
  // Your existing sampleTrips data stays exactly the same...
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

  // Same formatDate function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const trip = sampleTrips.find(t => t.id === parseInt(tripId));

  // Initialize state AFTER trip is found
  const [activityRatings, setActivityRatings] = useState(() => {
    if (!trip) return {};
    
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

  const handleActivityRatingChange = (activityId, ratings) => {
    setActivityRatings(prev => ({
      ...prev,
      [activityId]: ratings
    }));
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
            Activities ({trip.activities.length}) - Rate 0-5
          </h3>
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
              onRatingChange={handleActivityRatingChange}
            />
          ))}
        </div>

        {/* Group Analysis Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Group Analysis
          </h3>
          {(() => {
            // Calculate consensus data
            const consensusData = trip.activities.map(activity => {
              const ratings = activityRatings[activity.id] || {};
              const values = Object.values(ratings);
              const avg = values.length ? values.reduce((sum, r) => sum + r, 0) / values.length : 2.5;
              const interested = values.filter(r => r >= 3).length;
              const mustDo = values.filter(r => r === 5).length;
              return { ...activity, avg, interested, mustDo, total: trip.participants.length };
            }).sort((a, b) => b.avg - a.avg);

            const strongConsensus = consensusData.filter(a => a.avg >= 4);
            const divisive = consensusData.filter(a => a.interested > 0 && a.interested < a.total * 0.6);

            return (
              <div className="space-y-4">
                {strongConsensus.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-bold text-green-800 mb-3 flex items-center">
                      <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                      Strong Group Consensus
                    </h4>
                    <div className="space-y-2">
                      {strongConsensus.map(activity => (
                        <div key={activity.id} className="text-sm text-green-700 flex justify-between">
                          <span className="font-medium">{activity.name}</span>
                          <span className="text-green-600">
                            {activity.avg.toFixed(1)}/5 avg • {activity.interested}/{activity.total} interested
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {divisive.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-bold text-yellow-800 mb-3 flex items-center">
                      <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                      Mixed Opinions - Consider Subgroups
                    </h4>
                    <div className="space-y-2">
                      {divisive.map(activity => (
                        <div key={activity.id} className="text-sm text-yellow-700 flex justify-between">
                          <span className="font-medium">{activity.name}</span>
                          <span className="text-yellow-600">
                            {activity.interested}/{activity.total} interested
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {strongConsensus.length === 0 && divisive.length === 0 && (
                  <div className="text-center text-gray-500 py-4">
                    <p>Start rating activities to see group analysis!</p>
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