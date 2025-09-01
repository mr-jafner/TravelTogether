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
          GROUP_CONCAT(DISTINCT rdo.dietary_option) as dietary_options
        FROM restaurants r
        LEFT JOIN restaurant_ratings rr ON r.id = rr.restaurant_id
        LEFT JOIN restaurant_dietary_options rdo ON r.id = rdo.restaurant_id
        WHERE r.trip_id = ?
        GROUP BY r.id
        ORDER BY r.created_at
      `, [id]);
      
      // Get travel information
      const travel = await this.db.all(`
        SELECT * FROM trip_travel 
        WHERE trip_id = ? 
        ORDER BY created_at
      `, [id]);
      
      // Get lodging information
      const lodging = await this.db.all(`
        SELECT * FROM trip_lodging 
        WHERE trip_id = ? 
        ORDER BY created_at
      `, [id]);
      
      // Get logistics information
      const logistics = await this.db.all(`
        SELECT * FROM trip_logistics 
        WHERE trip_id = ? 
        ORDER BY created_at
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
        travel: travel || [],
        lodging: lodging || [],
        logistics: logistics || [],
        createdAt: trip.created_at
      };
    } catch (error) {
      throw new Error(`Failed to get trip: ${error.message}`);
    }
  }

  // Update trip
  async update(id, tripData) {
    const { name, destinations, startDate, endDate, participants } = tripData;
    
    try {
      // Only update basic trip info if any basic fields are provided
      const basicFields = [];
      const basicValues = [];
      
      if (name !== undefined) {
        basicFields.push('name = ?');
        basicValues.push(name);
      }
      if (startDate !== undefined) {
        basicFields.push('start_date = ?');
        basicValues.push(startDate);
      }
      if (endDate !== undefined) {
        basicFields.push('end_date = ?');
        basicValues.push(endDate);
      }
      
      if (basicFields.length > 0) {
        basicFields.push('updated_at = CURRENT_TIMESTAMP');
        basicValues.push(id);
        
        await this.db.run(`
          UPDATE trips 
          SET ${basicFields.join(', ')}
          WHERE id = ?
        `, basicValues);
      }
      
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

      // Update participants if provided
      if (participants && participants.length > 0) {
        // Get current participants to preserve is_current_user flags
        const currentParticipants = await this.db.all(`
          SELECT name, is_current_user FROM participants WHERE trip_id = ?
        `, [id]);
        
        // Remove existing participants
        await this.db.run(`DELETE FROM participants WHERE trip_id = ?`, [id]);
        
        // Insert updated participants, preserving is_current_user flags
        for (let i = 0; i < participants.length; i++) {
          const participantName = participants[i];
          const existingParticipant = currentParticipants.find(p => p.name === participantName);
          const isCurrentUser = existingParticipant ? existingParticipant.is_current_user : (i === 0 ? 1 : 0);
          
          await this.db.run(
            `INSERT INTO participants (trip_id, name, is_current_user) 
             VALUES (?, ?, ?)`,
            [id, participantName, isCurrentUser]
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

  // Update activity
  async updateActivity(activityId, activityData) {
    const { name, category, location, cost, duration } = activityData;
    
    try {
      const result = await this.db.run(`
        UPDATE activities 
        SET name = ?, category = ?, location = ?, cost = ?, duration = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [name, category, location, cost, duration, activityId]);
      
      return result.changes > 0;
    } catch (error) {
      throw new Error(`Failed to update activity: ${error.message}`);
    }
  }

  // Delete activity
  async deleteActivity(activityId) {
    try {
      const result = await this.db.run(`DELETE FROM activities WHERE id = ?`, [activityId]);
      return result.changes > 0;
    } catch (error) {
      throw new Error(`Failed to delete activity: ${error.message}`);
    }
  }

  // Update restaurant
  async updateRestaurant(restaurantId, restaurantData) {
    const { name, cuisine, location, cost, priceRange, groupCapacity, dietaryOptions } = restaurantData;
    
    try {
      // Update restaurant basic info
      const result = await this.db.run(`
        UPDATE restaurants 
        SET name = ?, cuisine = ?, location = ?, cost = ?, price_range = ?, group_capacity = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [name, cuisine, location, cost, priceRange, groupCapacity, restaurantId]);
      
      if (result.changes === 0) {
        return false;
      }

      // Update dietary options - delete old ones and insert new ones
      await this.db.run(`DELETE FROM restaurant_dietary_options WHERE restaurant_id = ?`, [restaurantId]);
      
      if (dietaryOptions && dietaryOptions.length > 0) {
        for (const option of dietaryOptions) {
          await this.db.run(`
            INSERT INTO restaurant_dietary_options (restaurant_id, dietary_option)
            VALUES (?, ?)
          `, [restaurantId, option]);
        }
      }
      
      return true;
    } catch (error) {
      throw new Error(`Failed to update restaurant: ${error.message}`);
    }
  }

  // Delete restaurant
  async deleteRestaurant(restaurantId) {
    try {
      const result = await this.db.run(`DELETE FROM restaurants WHERE id = ?`, [restaurantId]);
      return result.changes > 0;
    } catch (error) {
      throw new Error(`Failed to delete restaurant: ${error.message}`);
    }
  }

  // TRAVEL INFORMATION METHODS
  async getTravelInfo(tripId) {
    try {
      const travel = await this.db.all(
        `SELECT * FROM trip_travel WHERE trip_id = ? ORDER BY date_time ASC`,
        [tripId]
      );
      return travel;
    } catch (error) {
      throw new Error(`Failed to get travel info: ${error.message}`);
    }
  }

  async addTravelInfo(tripId, travelData) {
    const { type, details, fromLocation, toLocation, dateTime, cost, confirmationNumber, notes } = travelData;
    
    try {
      const result = await this.db.run(`
        INSERT INTO trip_travel (trip_id, type, details, from_location, to_location, date_time, cost, confirmation_number, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [tripId, type, details, fromLocation, toLocation, dateTime, cost, confirmationNumber, notes]);
      
      return result.id;
    } catch (error) {
      throw new Error(`Failed to add travel info: ${error.message}`);
    }
  }

  async updateTravelInfo(travelId, travelData) {
    const { type, details, fromLocation, toLocation, dateTime, cost, confirmationNumber, notes } = travelData;
    
    try {
      const result = await this.db.run(`
        UPDATE trip_travel 
        SET type = ?, details = ?, from_location = ?, to_location = ?, date_time = ?, cost = ?, confirmation_number = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [type, details, fromLocation, toLocation, dateTime, cost, confirmationNumber, notes, travelId]);
      
      return result.changes > 0;
    } catch (error) {
      throw new Error(`Failed to update travel info: ${error.message}`);
    }
  }

  async deleteTravelInfo(travelId) {
    try {
      const result = await this.db.run(`DELETE FROM trip_travel WHERE id = ?`, [travelId]);
      return result.changes > 0;
    } catch (error) {
      throw new Error(`Failed to delete travel info: ${error.message}`);
    }
  }

  // LODGING INFORMATION METHODS
  async getLodgingInfo(tripId) {
    try {
      const lodging = await this.db.all(
        `SELECT * FROM trip_lodging WHERE trip_id = ? ORDER BY check_in ASC`,
        [tripId]
      );
      return lodging;
    } catch (error) {
      throw new Error(`Failed to get lodging info: ${error.message}`);
    }
  }

  async addLodgingInfo(tripId, lodgingData) {
    const { name, type, location, checkIn, checkOut, cost, confirmationNumber, contactInfo, wifiInfo, notes } = lodgingData;
    
    try {
      const result = await this.db.run(`
        INSERT INTO trip_lodging (trip_id, name, type, location, check_in, check_out, cost, confirmation_number, contact_info, wifi_info, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [tripId, name, type, location, checkIn, checkOut, cost, confirmationNumber, contactInfo, wifiInfo, notes]);
      
      return result.id;
    } catch (error) {
      throw new Error(`Failed to add lodging info: ${error.message}`);
    }
  }

  async updateLodgingInfo(lodgingId, lodgingData) {
    const { name, type, location, checkIn, checkOut, cost, confirmationNumber, contactInfo, wifiInfo, notes } = lodgingData;
    
    try {
      const result = await this.db.run(`
        UPDATE trip_lodging 
        SET name = ?, type = ?, location = ?, check_in = ?, check_out = ?, cost = ?, confirmation_number = ?, contact_info = ?, wifi_info = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [name, type, location, checkIn, checkOut, cost, confirmationNumber, contactInfo, wifiInfo, notes, lodgingId]);
      
      return result.changes > 0;
    } catch (error) {
      throw new Error(`Failed to update lodging info: ${error.message}`);
    }
  }

  async deleteLodgingInfo(lodgingId) {
    try {
      const result = await this.db.run(`DELETE FROM trip_lodging WHERE id = ?`, [lodgingId]);
      return result.changes > 0;
    } catch (error) {
      throw new Error(`Failed to delete lodging info: ${error.message}`);
    }
  }

  // LOGISTICS INFORMATION METHODS
  async getLogisticsInfo(tripId) {
    try {
      const logistics = await this.db.all(
        `SELECT * FROM trip_logistics WHERE trip_id = ? ORDER BY category ASC, name ASC`,
        [tripId]
      );
      return logistics;
    } catch (error) {
      throw new Error(`Failed to get logistics info: ${error.message}`);
    }
  }

  async addLogisticsInfo(tripId, logisticsData) {
    const { category, name, details, additionalInfo } = logisticsData;
    
    try {
      const result = await this.db.run(`
        INSERT INTO trip_logistics (trip_id, category, name, details, additional_info)
        VALUES (?, ?, ?, ?, ?)
      `, [tripId, category, name, details, additionalInfo]);
      
      return result.id;
    } catch (error) {
      throw new Error(`Failed to add logistics info: ${error.message}`);
    }
  }

  async updateLogisticsInfo(logisticsId, logisticsData) {
    const { category, name, details, additionalInfo } = logisticsData;
    
    try {
      const result = await this.db.run(`
        UPDATE trip_logistics 
        SET category = ?, name = ?, details = ?, additional_info = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [category, name, details, additionalInfo, logisticsId]);
      
      return result.changes > 0;
    } catch (error) {
      throw new Error(`Failed to update logistics info: ${error.message}`);
    }
  }

  async deleteLogisticsInfo(logisticsId) {
    try {
      const result = await this.db.run(`DELETE FROM trip_logistics WHERE id = ?`, [logisticsId]);
      return result.changes > 0;
    } catch (error) {
      throw new Error(`Failed to delete logistics info: ${error.message}`);
    }
  }
}

module.exports = Trip;