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
    // Convert single destination to array format for backend
    const backendTripData = {
      ...tripData,
      destinations: Array.isArray(tripData.destinations) 
        ? tripData.destinations 
        : [tripData.destination || tripData.destinations]
    };

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
};

// Rating API endpoints
export const ratingApi = {
  // Rate an activity
  rateActivity: async (tripId, activityId, participantName, rating) => {
    console.log('📡 API: Rating activity', { tripId, activityId, participantName, rating });
    const response = await apiRequest(`/trips/${tripId}/activities/${activityId}/rate`, {
      method: 'POST',
      body: JSON.stringify({ participantName, rating }),
    });
    console.log('✅ API: Activity rating response:', response);
    return response;
  },

  // Rate a restaurant
  rateRestaurant: async (tripId, restaurantId, participantName, rating) => {
    console.log('📡 API: Rating restaurant', { tripId, restaurantId, participantName, rating });
    const response = await apiRequest(`/trips/${tripId}/restaurants/${restaurantId}/rate`, {
      method: 'POST',
      body: JSON.stringify({ participantName, rating }),
    });
    console.log('✅ API: Restaurant rating response:', response);
    return response;
  },

  // Get activity ratings
  getActivityRatings: async (tripId, activityId) => {
    const ratingsArray = await apiRequest(`/trips/${tripId}/activities/${activityId}/ratings`);
    console.log('📊 Raw activity ratings from API:', ratingsArray);
    
    // Transform array format to object format: {[participant]: rating}
    const ratingsObject = {};
    ratingsArray.forEach(ratingData => {
      ratingsObject[ratingData.participant_name] = ratingData.rating;
    });
    
    console.log('🔄 Transformed activity ratings:', ratingsObject);
    return ratingsObject;
  },

  // Get restaurant ratings
  getRestaurantRatings: async (tripId, restaurantId) => {
    const ratingsArray = await apiRequest(`/trips/${tripId}/restaurants/${restaurantId}/ratings`);
    console.log('📊 Raw restaurant ratings from API:', ratingsArray);
    
    // Transform array format to object format: {[participant]: rating}
    const ratingsObject = {};
    ratingsArray.forEach(ratingData => {
      ratingsObject[ratingData.participant_name] = ratingData.rating;
    });
    
    console.log('🔄 Transformed restaurant ratings:', ratingsObject);
    return ratingsObject;
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