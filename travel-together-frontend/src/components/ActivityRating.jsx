import React, { useState } from 'react';

const ActivityRating = ({ activity, participants, onRatingChange }) => {
  // Initialize ratings state - each participant starts with rating 2 (indifferent)
  const [ratings, setRatings] = useState(() => {
    const initialRatings = {};
    participants.forEach(participant => {
      // Convert existing votes to mock individual ratings for demo
      initialRatings[participant] = Math.floor(Math.random() * 6); // 0-5 random for now
    });
    return initialRatings;
  });

  const handleRatingClick = (participant, rating) => {
    const newRatings = { ...ratings, [participant]: rating };
    setRatings(newRatings);
    if (onRatingChange) {
      onRatingChange(activity.id, newRatings);
    }
  };

  // Calculate group stats
  const ratingValues = Object.values(ratings);
  const averageRating = ratingValues.reduce((sum, rating) => sum + rating, 0) / ratingValues.length;
  const interestedCount = ratingValues.filter(rating => rating >= 3).length;
  const mustDoCount = ratingValues.filter(rating => rating === 5).length;
  const wontDoCount = ratingValues.filter(rating => rating === 0).length;

  // Rating labels and colors
  const ratingConfig = {
    0: { label: "Won't do", color: "#ef4444", bgColor: "#fef2f2" },
    1: { label: "Don't want", color: "#f97316", bgColor: "#fff7ed" },
    2: { label: "Indifferent", color: "#6b7280", bgColor: "#f9fafb" },
    3: { label: "Interested", color: "#3b82f6", bgColor: "#eff6ff" },
    4: { label: "Really want", color: "#10b981", bgColor: "#f0fdf4" },
    5: { label: "Must do", color: "#8b5cf6", bgColor: "#faf5ff" }
  };

  return (
    <div style={{ 
      border: '1px solid #e5e7eb', 
      borderRadius: '0.5rem', 
      padding: '1rem', 
      marginBottom: '1rem',
      backgroundColor: ratingConfig[Math.round(averageRating)].bgColor
    }}>
      {/* Activity Header */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 'bold' }}>
              {activity.name}
            </h4>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              <span style={{ 
                backgroundColor: '#e5e7eb', 
                padding: '0.25rem 0.5rem', 
                borderRadius: '0.25rem',
                marginRight: '0.5rem'
              }}>
                {activity.category}
              </span>
              💰 ${activity.cost} • ⏱️ {activity.duration} • 📍 {activity.location}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: ratingConfig[Math.round(averageRating)].color }}>
              {averageRating.toFixed(1)}/5
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              {interestedCount}/{participants.length} interested
            </div>
          </div>
        </div>
      </div>

      {/* Group Summary */}
      <div style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>
        {mustDoCount > 0 && <span style={{ color: '#8b5cf6', marginRight: '1rem' }}>🟣 {mustDoCount} must do</span>}
        {interestedCount > mustDoCount && <span style={{ color: '#10b981', marginRight: '1rem' }}>🟢 {interestedCount - mustDoCount} interested</span>}
        {wontDoCount > 0 && <span style={{ color: '#ef4444' }}>🔴 {wontDoCount} won't do</span>}
      </div>

      {/* Individual Ratings */}
      <div>
        <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Individual Ratings:</div>
        {participants.map(participant => (
          <div key={participant} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '0.5rem',
            padding: '0.5rem',
            backgroundColor: 'rgba(255,255,255,0.7)',
            borderRadius: '0.25rem'
          }}>
            <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{participant}</span>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              {[0, 1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  onClick={() => handleRatingClick(participant, rating)}
                  style={{
                    width: '30px',
                    height: '24px',
                    fontSize: '0.75rem',
                    border: `2px solid ${ratings[participant] === rating ? ratingConfig[rating].color : '#d1d5db'}`,
                    backgroundColor: ratings[participant] === rating ? ratingConfig[rating].color : 'white',
                    color: ratings[participant] === rating ? 'white' : '#374151',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                  title={ratingConfig[rating].label}
                >
                  {rating}
                </button>
              ))}
              <span style={{ 
                marginLeft: '0.5rem', 
                fontSize: '0.75rem', 
                color: ratingConfig[ratings[participant]].color,
                fontWeight: '600'
              }}>
                {ratingConfig[ratings[participant]].label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityRating;