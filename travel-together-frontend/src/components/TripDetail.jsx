import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ActivityRating from './ActivityRating'; // Add this import

const TripDetail = () => {
  const { tripId } = useParams();

  // Add state to track all activity ratings

  
  // Same exact data structure as your TripList
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

   const [activityRatings, setActivityRatings] = useState(() => {
    if (!trip) return {};
    
    const initialRatings = {};
    trip.activities.forEach(activity => {
      const participantRatings = {};
      trip.participants.forEach(participant => {
        // Generate realistic sample ratings (0-5) for demo
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
      <div style={{ padding: '2rem' }}>
        <h2>Trip not found</h2>
        <Link to="/trips">← Back to My Trips</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <Link to="/trips" style={{ marginBottom: '1rem', display: 'inline-block' }}>← Back to My Trips</Link>
      
      <h1>{trip.name}</h1>
      <h2>📍 {trip.destination}</h2>
      <p><strong>Dates:</strong> {formatDate(trip.startDate)} - {formatDate(trip.endDate)}</p>
      
      <div style={{ marginTop: '2rem' }}>
        <h3>👥 Participants ({trip.participants.length})</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {trip.participants.map((participant, index) => (
            <li key={index}>{participant}</li>
          ))}
        </ul>
      </div>
      
      <div style={{ marginTop: '2rem' }}>
        <h3>🎯 Activities ({trip.activities.length}) - Rate 0-5</h3>
        <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
          <strong>Rating Scale:</strong> 0=Won't do • 1=Don't want • 2=Indifferent • 3=Interested • 4=Really want • 5=Must do
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

      
    {/* Group Analysis Section - Add this before Trip Info */}
<div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '0.5rem', border: '1px solid #0ea5e9' }}>
  <h3>📊 Group Analysis</h3>
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
      <div>
        {strongConsensus.length > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <h4 style={{ color: '#059669', margin: '0 0 0.5rem 0' }}>🟢 Strong Group Consensus</h4>
            {strongConsensus.map(activity => (
              <div key={activity.id} style={{ fontSize: '0.875rem', marginLeft: '1rem' }}>
                • <strong>{activity.name}</strong> ({activity.avg.toFixed(1)}/5 avg, {activity.interested}/{activity.total} interested)
              </div>
            ))}
          </div>
        )}
        
        {divisive.length > 0 && (
          <div>
            <h4 style={{ color: '#dc2626', margin: '0 0 0.5rem 0' }}>🟡 Mixed Opinions</h4>
            {divisive.map(activity => (
              <div key={activity.id} style={{ fontSize: '0.875rem', marginLeft: '1rem' }}>
                • <strong>{activity.name}</strong> ({activity.interested}/{activity.total} interested - consider subgroups)
              </div>
            ))}
          </div>
        )}
      </div>
    );
  })()}
</div>

      {/* Placeholder sections for future features */}
      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '0.5rem' }}>
        <h3>📋 Trip Info</h3>
        <p>Trip logistics panel coming soon...</p>
        <p><em>This will include: Wi-Fi passwords, room numbers, flight details, important notes, etc.</em></p>
      </div>
    </div>
  );
};

export default TripDetail;