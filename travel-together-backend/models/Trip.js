class Trip {
  constructor(database) {
    this.db = database;
  }

  // Create a new trip
  async create(tripData) {
    const { name, destinations, startDate, endDate, participants } = tripData;
    
    try {
      // Insert trip
      const tripResult = await this.db.run(
        `INSERT INTO trips (name, start_date, end_date) 
         VALUES (?, ?, ?)`,
        [name, startDate, endDate]
      );
      
      const tripId = tripResult.id;
      
      // Insert destinations
      if (destinations && destinations.length > 0) {
        for (let i = 0; i < destinations.length; i++) {
          await this.db.run(
            `INSERT INTO trip_destinations (trip_id, destination, order_index) 
             VALUES (?, ?, ?)`,
            [tripId, destinations[i], i]
          );
        }
      }
      
      // Insert participants
      if (participants && participants.length > 0) {
        for (let i = 0; i < participants.length; i++) {
          const participant = participants[i];
          const isCurrentUser = i === 0; // First participant is current user by default
          
          await this.db.run(
            `INSERT INTO participants (trip_id, name, is_current_user) 
             VALUES (?, ?, ?)`,
            [tripId, participant, isCurrentUser ? 1 : 0]
          );
        }
      }
      
      return await this.getById(tripId);
    } catch (error) {
      throw new Error(`Failed to create trip: ${error.message}`);
    }
  }

  // Get all trips with basic info
  async getAll() {
    try {
      const trips = await this.db.all(`
        SELECT 
          t.*,
          GROUP_CONCAT(DISTINCT td.destination ORDER BY td.order_index) as destinations,
          GROUP_CONCAT(DISTINCT p.name) as participants,
          COUNT(DISTINCT a.id) as activity_count,
          COUNT(DISTINCT r.id) as restaurant_count
        FROM trips t
        LEFT JOIN trip_destinations td ON t.id = td.trip_id
        LEFT JOIN participants p ON t.id = p.trip_id
        LEFT JOIN activities a ON t.id = a.trip_id
        LEFT JOIN restaurants r ON t.id = r.trip_id
        GROUP BY t.id
        ORDER BY t.created_at DESC
      `);
      
      return trips.map(trip => ({
        id: trip.id,
        name: trip.name,
        destinations: trip.destinations ? trip.destinations.split(',') : [],
        startDate: trip.start_date,
        endDate: trip.end_date,
        participants: trip.participants ? trip.participants.split(',') : [],
        activityCount: trip.activity_count || 0,
        restaurantCount: trip.restaurant_count || 0,
        createdAt: trip.created_at
      }));
    } catch (error) {
      throw new Error(`Failed to get trips: ${error.message}`);
    }
  }

  // Get trip by ID with full details
  async getById(id) {
    try {
      // Get trip basic info
      const trip = await this.db.get(`
        SELECT * FROM trips WHERE id = ?
      `, [id]);
      
      if (!trip) {
        return null;
      }
      
      // Get destinations
      const destinations = await this.db.all(`
        SELECT destination FROM trip_destinations 
        WHERE trip_id = ? 
        ORDER BY order_index
      `, [id]);
      
      // Get participants
      const participants = await this.db.all(`
        SELECT * FROM participants WHERE trip_id = ? ORDER BY is_current_user DESC, name
      `, [id]);
      
      // Get current user
      const currentUserRow = participants.find(p => p.is_current_user === 1);
      
      // Get activities with votes
      const activities = await this.db.all(`
        SELECT 
          a.*,
          COUNT(ar.rating) as votes
        FROM activities a
        LEFT JOIN activity_ratings ar ON a.id = ar.activity_id
        WHERE a.trip_id = ?
        GROUP BY a.id
        ORDER BY a.created_at
      `, [id]);
      
      // Get restaurants with votes and dietary options
      const restaurants = await this.db.all(`
        SELECT 
          r.*,
          COUNT(rr.rating) as votes,
          GROUP_CONCAT(rdo.dietary_option) as dietary_options
        FROM restaurants r
        LEFT JOIN restaurant_ratings rr ON r.id = rr.restaurant_id
        LEFT JOIN restaurant_dietary_options rdo ON r.id = rdo.restaurant_id
        WHERE r.trip_id = ?
        GROUP BY r.id
        ORDER BY r.created_at
      `, [id]);
      
      return {
        id: trip.id,
        name: trip.name,
        destinations: destinations.map(d => d.destination),
        startDate: trip.start_date,
        endDate: trip.end_date,
        participants: participants.map(p => p.name),
        currentUser: currentUserRow ? currentUserRow.name : null,
        activities: activities.map(a => ({
          id: a.id,
          name: a.name,
          category: a.category,
          location: a.location,
          cost: a.cost,
          duration: a.duration,
          votes: a.votes || 0
        })),
        restaurants: restaurants.map(r => ({
          id: r.id,
          name: r.name,
          cuisine: r.cuisine,
          location: r.location,
          cost: r.cost,
          priceRange: r.price_range,
          groupCapacity: r.group_capacity,
          dietaryOptions: r.dietary_options ? r.dietary_options.split(',') : [],
          votes: r.votes || 0
        })),
        createdAt: trip.created_at
      };
    } catch (error) {
      throw new Error(`Failed to get trip: ${error.message}`);
    }
  }

  // Update trip
  async update(id, tripData) {
    const { name, destinations, startDate, endDate } = tripData;
    
    try {
      // Update basic trip info
      await this.db.run(`
        UPDATE trips 
        SET name = ?, start_date = ?, end_date = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [name, startDate, endDate, id]);
      
      // Update destinations if provided
      if (destinations) {
        // Remove existing destinations
        await this.db.run(`DELETE FROM trip_destinations WHERE trip_id = ?`, [id]);
        
        // Insert new destinations
        for (let i = 0; i < destinations.length; i++) {
          await this.db.run(
            `INSERT INTO trip_destinations (trip_id, destination, order_index) 
             VALUES (?, ?, ?)`,
            [id, destinations[i], i]
          );
        }
      }
      
      return await this.getById(id);
    } catch (error) {
      throw new Error(`Failed to update trip: ${error.message}`);
    }
  }

  // Delete trip
  async delete(id) {
    try {
      const result = await this.db.run(`DELETE FROM trips WHERE id = ?`, [id]);
      return result.changes > 0;
    } catch (error) {
      throw new Error(`Failed to delete trip: ${error.message}`);
    }
  }

  // Add activity to trip
  async addActivity(tripId, activityData) {
    const { name, category, location, cost, duration } = activityData;
    
    try {
      const result = await this.db.run(`
        INSERT INTO activities (trip_id, name, category, location, cost, duration)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [tripId, name, category, location, cost, duration]);
      
      return result.id;
    } catch (error) {
      throw new Error(`Failed to add activity: ${error.message}`);
    }
  }

  // Add restaurant to trip
  async addRestaurant(tripId, restaurantData) {
    const { name, cuisine, location, cost, priceRange, groupCapacity, dietaryOptions } = restaurantData;
    
    try {
      const result = await this.db.run(`
        INSERT INTO restaurants (trip_id, name, cuisine, location, cost, price_range, group_capacity)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [tripId, name, cuisine, location, cost, priceRange, groupCapacity]);
      
      const restaurantId = result.id;
      
      // Add dietary options
      if (dietaryOptions && dietaryOptions.length > 0) {
        for (const option of dietaryOptions) {
          await this.db.run(`
            INSERT INTO restaurant_dietary_options (restaurant_id, dietary_option)
            VALUES (?, ?)
          `, [restaurantId, option]);
        }
      }
      
      return restaurantId;
    } catch (error) {
      throw new Error(`Failed to add restaurant: ${error.message}`);
    }
  }

  // Rate activity
  async rateActivity(tripId, activityId, participantName, rating) {
    try {
      // Get participant ID
      const participant = await this.db.get(`
        SELECT id FROM participants WHERE trip_id = ? AND name = ?
      `, [tripId, participantName]);
      
      if (!participant) {
        throw new Error('Participant not found');
      }
      
      // Insert or update rating
      await this.db.run(`
        INSERT OR REPLACE INTO activity_ratings (activity_id, participant_id, rating)
        VALUES (?, ?, ?)
      `, [activityId, participant.id, rating]);
      
      return true;
    } catch (error) {
      throw new Error(`Failed to rate activity: ${error.message}`);
    }
  }

  // Rate restaurant
  async rateRestaurant(tripId, restaurantId, participantName, rating) {
    try {
      // Get participant ID
      const participant = await this.db.get(`
        SELECT id FROM participants WHERE trip_id = ? AND name = ?
      `, [tripId, participantName]);
      
      if (!participant) {
        throw new Error('Participant not found');
      }
      
      // Insert or update rating
      await this.db.run(`
        INSERT OR REPLACE INTO restaurant_ratings (restaurant_id, participant_id, rating)
        VALUES (?, ?, ?)
      `, [restaurantId, participant.id, rating]);
      
      return true;
    } catch (error) {
      throw new Error(`Failed to rate restaurant: ${error.message}`);
    }
  }
}

module.exports = Trip;