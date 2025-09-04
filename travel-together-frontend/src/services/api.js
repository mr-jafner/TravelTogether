// API service layer for TravelTogether backend communication
const API_BASE_URL = import.meta.env.VITE_API_URL || (
  window.location.hostname === 'jafner.com' 
    ? 'https://jafner.com/api'
    : 'http://localhost:3001/api'
);

// Generic API request handler with error handling
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error);
    throw error;
  }
}

// Trip API endpoints
export const tripApi = {
  // Get all trips
  getAllTrips: async () => {
    return apiRequest('/trips');
  },

  // Get single trip with full details
  getTripById: async (tripId) => {
    return apiRequest(`/trips/${tripId}`);
  },

  // Create new trip
  createTrip: async (tripData) => {
    // Convert single destination to array format for backend
    const backendTripData = {
      ...tripData,
      destinations: Array.isArray(tripData.destinations) 
        ? tripData.destinations 
        : [tripData.destination || tripData.destinations]
    };

    return apiRequest('/trips', {
      method: 'POST',
      body: JSON.stringify(backendTripData),
    });
  },

  // Update trip  
  updateTrip: async (tripId, tripData) => {
    const backendTripData = { ...tripData };
    
    // Convert single destination to array format for backend, but only if destinations are provided
    if (tripData.destinations !== undefined || tripData.destination !== undefined) {
      backendTripData.destinations = Array.isArray(tripData.destinations) 
        ? tripData.destinations 
        : [tripData.destination || tripData.destinations];
    }

    return apiRequest(`/trips/${tripId}`, {
      method: 'PUT',
      body: JSON.stringify(backendTripData),
    });
  },

  // Delete trip
  deleteTrip: async (tripId) => {
    return apiRequest(`/trips/${tripId}`, {
      method: 'DELETE',
    });
  },

  // Add activity to trip
  addActivity: async (tripId, activityData) => {
    return apiRequest(`/trips/${tripId}/activities`, {
      method: 'POST',
      body: JSON.stringify(activityData),
    });
  },

  // Add restaurant to trip
  addRestaurant: async (tripId, restaurantData) => {
    return apiRequest(`/trips/${tripId}/restaurants`, {
      method: 'POST',
      body: JSON.stringify(restaurantData),
    });
  },

  // Update activity
  updateActivity: async (tripId, activityId, activityData) => {
    return apiRequest(`/trips/${tripId}/activities/${activityId}`, {
      method: 'PUT',
      body: JSON.stringify(activityData),
    });
  },

  // Delete activity
  deleteActivity: async (tripId, activityId) => {
    return apiRequest(`/trips/${tripId}/activities/${activityId}`, {
      method: 'DELETE',
    });
  },

  // Update restaurant
  updateRestaurant: async (tripId, restaurantId, restaurantData) => {
    return apiRequest(`/trips/${tripId}/restaurants/${restaurantId}`, {
      method: 'PUT',
      body: JSON.stringify(restaurantData),
    });
  },

  // Delete restaurant
  deleteRestaurant: async (tripId, restaurantId) => {
    return apiRequest(`/trips/${tripId}/restaurants/${restaurantId}`, {
      method: 'DELETE',
    });
  },

  // Travel endpoints
  getTravelInfo: async (tripId) => {
    return apiRequest(`/trips/${tripId}/travel`);
  },

  addTravelInfo: async (tripId, travelData) => {
    return apiRequest(`/trips/${tripId}/travel`, {
      method: 'POST',
      body: JSON.stringify(travelData),
    });
  },

  updateTravelInfo: async (tripId, travelId, travelData) => {
    return apiRequest(`/trips/${tripId}/travel/${travelId}`, {
      method: 'PUT',
      body: JSON.stringify(travelData),
    });
  },

  deleteTravelInfo: async (tripId, travelId) => {
    return apiRequest(`/trips/${tripId}/travel/${travelId}`, {
      method: 'DELETE',
    });
  },

  // Lodging endpoints
  getLodgingInfo: async (tripId) => {
    return apiRequest(`/trips/${tripId}/lodging`);
  },

  addLodgingInfo: async (tripId, lodgingData) => {
    return apiRequest(`/trips/${tripId}/lodging`, {
      method: 'POST',
      body: JSON.stringify(lodgingData),
    });
  },

  updateLodgingInfo: async (tripId, lodgingId, lodgingData) => {
    return apiRequest(`/trips/${tripId}/lodging/${lodgingId}`, {
      method: 'PUT',
      body: JSON.stringify(lodgingData),
    });
  },

  deleteLodgingInfo: async (tripId, lodgingId) => {
    return apiRequest(`/trips/${tripId}/lodging/${lodgingId}`, {
      method: 'DELETE',
    });
  },

  // Logistics endpoints
  getLogisticsInfo: async (tripId) => {
    return apiRequest(`/trips/${tripId}/logistics`);
  },

  addLogisticsInfo: async (tripId, logisticsData) => {
    return apiRequest(`/trips/${tripId}/logistics`, {
      method: 'POST',
      body: JSON.stringify(logisticsData),
    });
  },

  updateLogisticsInfo: async (tripId, logisticsId, logisticsData) => {
    return apiRequest(`/trips/${tripId}/logistics/${logisticsId}`, {
      method: 'PUT',
      body: JSON.stringify(logisticsData),
    });
  },

  deleteLogisticsInfo: async (tripId, logisticsId) => {
    return apiRequest(`/trips/${tripId}/logistics/${logisticsId}`, {
      method: 'DELETE',
    });
  },
};

// Rating API endpoints
export const ratingApi = {
  // Rate an activity (legacy - requires participantName in body)
  rateActivity: async (tripId, activityId, participantName, rating) => {
    return apiRequest(`/trips/${tripId}/activities/${activityId}/rate`, {
      method: 'POST',
      body: JSON.stringify({ participantName, rating }),
    });
  },

  // Rate an activity as logged-in user (enhanced - uses username from URL)
  rateActivityAsUser: async (tripId, activityId, username, rating) => {
    return apiRequest(`/trips/${tripId}/activities/${activityId}/rate/${encodeURIComponent(username)}`, {
      method: 'POST',
      body: JSON.stringify({ rating }),
    });
  },

  // Rate a restaurant (legacy - requires participantName in body)
  rateRestaurant: async (tripId, restaurantId, participantName, rating) => {
    return apiRequest(`/trips/${tripId}/restaurants/${restaurantId}/rate`, {
      method: 'POST',
      body: JSON.stringify({ participantName, rating }),
    });
  },

  // Rate a restaurant as logged-in user (enhanced - uses username from URL)
  rateRestaurantAsUser: async (tripId, restaurantId, username, rating) => {
    return apiRequest(`/trips/${tripId}/restaurants/${restaurantId}/rate/${encodeURIComponent(username)}`, {
      method: 'POST',
      body: JSON.stringify({ rating }),
    });
  },

  // Get activity ratings (legacy - returns object format)
  getActivityRatings: async (tripId, activityId) => {
    const ratingsArray = await apiRequest(`/trips/${tripId}/activities/${activityId}/ratings`);
    
    // Transform array format to object format: {[participant]: rating}
    const ratingsObject = {};
    ratingsArray.forEach(ratingData => {
      ratingsObject[ratingData.participant_name] = ratingData.rating;
    });
    
    return ratingsObject;
  },

  // Get activity ratings with user context (enhanced - includes user vs group stats)
  getActivityRatingsWithUser: async (tripId, activityId, username) => {
    const data = await apiRequest(`/trips/${tripId}/activities/${activityId}/ratings/${encodeURIComponent(username)}`);
    
    // Transform allRatings array to object format for backward compatibility
    const ratingsObject = {};
    data.allRatings.forEach(ratingData => {
      ratingsObject[ratingData.participant_name] = ratingData.rating;
    });
    
    return {
      ratings: ratingsObject, // Backward compatible format
      userRating: data.userRating,
      groupAverage: data.groupAverage,
      totalRatings: data.totalRatings
    };
  },

  // Get restaurant ratings (legacy - returns object format)
  getRestaurantRatings: async (tripId, restaurantId) => {
    const ratingsArray = await apiRequest(`/trips/${tripId}/restaurants/${restaurantId}/ratings`);
    
    // Transform array format to object format: {[participant]: rating}
    const ratingsObject = {};
    ratingsArray.forEach(ratingData => {
      ratingsObject[ratingData.participant_name] = ratingData.rating;
    });
    
    return ratingsObject;
  },

  // Get restaurant ratings with user context (enhanced - includes user vs group stats)
  getRestaurantRatingsWithUser: async (tripId, restaurantId, username) => {
    const data = await apiRequest(`/trips/${tripId}/restaurants/${restaurantId}/ratings/${encodeURIComponent(username)}`);
    
    // Transform allRatings array to object format for backward compatibility
    const ratingsObject = {};
    data.allRatings.forEach(ratingData => {
      ratingsObject[ratingData.participant_name] = ratingData.rating;
    });
    
    return {
      ratings: ratingsObject, // Backward compatible format
      userRating: data.userRating,
      groupAverage: data.groupAverage,
      totalRatings: data.totalRatings
    };
  },
};

// Health check endpoint
export const healthApi = {
  checkHealth: async () => {
    return apiRequest('/health', { 
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001' 
    });
  },
};

// Utility function to transform backend trip data for frontend compatibility
export const transformTripForFrontend = (backendTrip) => {
  return {
    ...backendTrip,
    // Handle destinations array - join for single destination display or keep array
    destination: backendTrip.destinations?.length === 1 
      ? backendTrip.destinations[0] 
      : backendTrip.destinations?.join(' → ') || '',
    // Ensure activities and restaurants arrays exist
    activities: backendTrip.activities || [],
    restaurants: backendTrip.restaurants || [],
  };
};

// Utility function to transform frontend trip data for backend
export const transformTripForBackend = (frontendTrip) => {
  return {
    ...frontendTrip,
    // Convert destination string to destinations array
    destinations: typeof frontendTrip.destination === 'string'
      ? [frontendTrip.destination]
      : frontendTrip.destinations || [frontendTrip.destination],
  };
};

export default { tripApi, ratingApi, healthApi };