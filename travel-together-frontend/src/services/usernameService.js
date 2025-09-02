// Username management service for TravelTogether
// Handles user registry, duplicate prevention, and validation

class UsernameService {
  constructor() {
    this.storageKey = 'traveltogether_username';
    this.cachedParticipants = null;
    this.lastFetchTime = null;
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // Fetch all participants from live API data (includes production data)
  async fetchExistingParticipants(apiService) {
    try {
      const trips = await apiService.tripApi.getAllTrips();
      
      // Extract all unique participants from all trips
      const allParticipants = trips.flatMap(trip => trip.participants || []);
      const uniqueParticipants = [...new Set(allParticipants)].sort();
      
      // Cache the results
      this.cachedParticipants = uniqueParticipants;
      this.lastFetchTime = Date.now();
      
      console.log(`Found ${uniqueParticipants.length} unique participants across ${trips.length} trips`);
      return uniqueParticipants;
      
    } catch (error) {
      console.error('Error fetching participants from API:', error);
      
      // Fallback to hardcoded sample data if API fails
      return this.getFallbackParticipants();
    }
  }

  // Get cached participants or fetch fresh data
  async getExistingParticipants(apiService) {
    const now = Date.now();
    
    // Return cached data if still fresh
    if (this.cachedParticipants && 
        this.lastFetchTime && 
        (now - this.lastFetchTime) < this.cacheTimeout) {
      return this.cachedParticipants;
    }
    
    // Fetch fresh data
    return await this.fetchExistingParticipants(apiService);
  }

  // Fallback data in case API is unavailable (original sample data)
  getFallbackParticipants() {
    return [
      // Orlando trip - Summer Family Vacation
      "Sarah Johnson", "Mike Johnson", "Emma Johnson", "Lucas Johnson",
      
      // Vegas trip - Bachelor Party Weekend  
      "Alex Chen", "David Martinez", "Ryan Thompson", "Kevin Park", "Jordan Williams",
      
      // Paris trip - European Adventure
      "Jessica Brown", "Amanda Davis",
      
      // Aspen trip - Company Retreat
      "Jennifer Lee", "Mark Wilson", "Lisa Garcia", "Tom Anderson", 
      "Rachel Kim", "Steve Miller", "Monica Rodriguez", "Chris Taylor"
    ].sort();
  }

  // Check if username is available in a specific trip context
  isUsernameAvailable(newUsername, tripParticipants, currentUsername = null) {
    if (!newUsername || newUsername.trim() === '') {
      return false;
    }

    const trimmedUsername = newUsername.trim();
    
    // Allow if it's the user's current name
    if (currentUsername && trimmedUsername === currentUsername) {
      return true;
    }
    
    // Check if username conflicts with participants in this trip
    const conflict = tripParticipants.some(participant => 
      participant.toLowerCase() === trimmedUsername.toLowerCase()
    );
    
    return !conflict;
  }

  // Check if username is available globally (across all existing participants)
  async isUsernameAvailableGlobally(newUsername, apiService, currentUsername = null) {
    if (!newUsername || newUsername.trim() === '') {
      return { available: false, reason: 'Username cannot be empty' };
    }

    const trimmedUsername = newUsername.trim();
    
    // Allow if it's the user's current name
    if (currentUsername && trimmedUsername.toLowerCase() === currentUsername.toLowerCase()) {
      return { available: true };
    }

    try {
      // Get all existing participants
      const existingParticipants = await this.getExistingParticipants(apiService);
      
      // Check for exact match (case insensitive)
      const conflict = existingParticipants.find(participant => 
        participant.toLowerCase() === trimmedUsername.toLowerCase()
      );

      if (conflict) {
        return { 
          available: false, 
          reason: `Username "${trimmedUsername}" is already taken by "${conflict}"`,
          conflictingParticipant: conflict
        };
      }

      return { available: true };
      
    } catch (error) {
      console.warn('Could not check global username availability:', error);
      // In case of API failure, allow the username but warn
      return { 
        available: true, 
        warning: 'Could not verify username availability. Proceeding with caution.' 
      };
    }
  }

  // Get username suggestions based on existing participants
  async getUsernameSuggestions(apiService, filterText = '') {
    const existing = await this.getExistingParticipants(apiService);
    
    if (!filterText) {
      return existing;
    }
    
    const filter = filterText.toLowerCase();
    return existing.filter(name => 
      name.toLowerCase().includes(filter)
    );
  }

  // Validate username format
  isValidUsernameFormat(username) {
    if (!username || typeof username !== 'string') {
      return false;
    }
    
    const trimmed = username.trim();
    
    // Must be 2-50 characters
    if (trimmed.length < 2 || trimmed.length > 50) {
      return false;
    }
    
    // Allow letters, numbers, spaces, hyphens, apostrophes
    const validFormat = /^[a-zA-Z0-9\s\-']+$/.test(trimmed);
    
    return validFormat;
  }

  // Store username in localStorage
  saveUsername(username) {
    if (!username || typeof username !== 'string') {
      throw new Error('Invalid username provided');
    }
    
    const trimmed = username.trim();
    
    if (!this.isValidUsernameFormat(trimmed)) {
      throw new Error('Username format is invalid');
    }
    
    localStorage.setItem(this.storageKey, trimmed);
    return trimmed;
  }

  // Get stored username from localStorage
  getStoredUsername() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? stored.trim() : null;
    } catch (error) {
      console.warn('Could not retrieve stored username:', error);
      return null;
    }
  }

  // Clear stored username (logout)
  clearStoredUsername() {
    try {
      localStorage.removeItem(this.storageKey);
      return true;
    } catch (error) {
      console.warn('Could not clear stored username:', error);
      return false;
    }
  }

  // Check if user has a stored username
  hasStoredUsername() {
    const username = this.getStoredUsername();
    return username !== null && username !== '';
  }

  // Validate username availability across all trips the user participates in
  async validateUsernameChange(newUsername, currentUsername, apiService) {
    if (!this.isValidUsernameFormat(newUsername)) {
      throw new Error('Username format is invalid. Use 2-50 characters: letters, numbers, spaces, hyphens, and apostrophes only.');
    }

    const trimmedUsername = newUsername.trim();
    
    // Allow if it's the same name
    if (currentUsername && trimmedUsername.toLowerCase() === currentUsername.toLowerCase()) {
      return { valid: true, conflicts: [] };
    }

    try {
      // Get existing participants from production data
      const existingParticipants = await this.getExistingParticipants(apiService);
      
      // Check for case-insensitive match with existing participants (excluding current user)
      const conflict = existingParticipants.find(participant => 
        participant.toLowerCase() === trimmedUsername.toLowerCase() &&
        participant.toLowerCase() !== (currentUsername || '').toLowerCase()
      );

      if (conflict) {
        // Find which trips contain this participant
        const trips = await apiService.tripApi.getAllTrips();
        const conflictTrips = trips.filter(trip => 
          trip.participants?.some(p => p.toLowerCase() === conflict.toLowerCase())
        );

        // Important: For user self-editing, this is just a warning
        // The user can choose to "reclaim" a username they used before
        return {
          valid: false,
          conflicts: conflictTrips.map(trip => ({
            tripId: trip.id,
            tripName: trip.name,
            conflictingParticipant: conflict
          })),
          isReclaim: true, // Flag to indicate this might be reclaiming their own old username
          warning: `"${trimmedUsername}" exists in trip data. You can still use this name, but it may cause confusion with existing trip participants.`
        };
      }

      return { valid: true, conflicts: [] };
      
    } catch (error) {
      console.error('Error validating username change:', error);
      throw new Error('Could not validate username change. Please try again.');
    }
  }

  // Generate unique username suggestions if there are conflicts
  generateAlternativeUsernames(desiredUsername, tripParticipants) {
    const alternatives = [];
    const base = desiredUsername.trim();
    
    // Try adding numbers
    for (let i = 1; i <= 99; i++) {
      const alternative = `${base} ${i}`;
      if (this.isUsernameAvailable(alternative, tripParticipants)) {
        alternatives.push(alternative);
        if (alternatives.length >= 5) break;
      }
    }
    
    // Try variations with common suffixes
    const suffixes = ['Jr', 'Sr', 'II', 'III'];
    suffixes.forEach(suffix => {
      const alternative = `${base} ${suffix}`;
      if (this.isUsernameAvailable(alternative, tripParticipants) && 
          alternatives.length < 5) {
        alternatives.push(alternative);
      }
    });
    
    return alternatives;
  }

  // Clear cache to force fresh data fetch
  clearCache() {
    this.cachedParticipants = null;
    this.lastFetchTime = null;
  }
}

// Export singleton instance
const usernameService = new UsernameService();
export default usernameService;