// API service layer for TravelTogether backend communication
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

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
    return apiRequest(`/trips/${tripId}/activities/${activityId}/rate`, {
      method: 'POST',
      body: JSON.stringify({ participantName, rating }),
    });
  },

  // Rate a restaurant
  rateRestaurant: async (tripId, restaurantId, participantName, rating) => {
    return apiRequest(`/trips/${tripId}/restaurants/${restaurantId}/rate`, {
      method: 'POST',
      body: JSON.stringify({ participantName, rating }),
    });
  },

  // Get activity ratings
  getActivityRatings: async (tripId, activityId) => {
    return apiRequest(`/trips/${tripId}/activities/${activityId}/ratings`);
  },

  // Get restaurant ratings
  getRestaurantRatings: async (tripId, restaurantId) => {
    return apiRequest(`/trips/${tripId}/restaurants/${restaurantId}/ratings`);
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