const express = require('express');
const router = express.Router();
const database = require('../database/init.js');
const Trip = require('../models/Trip.js');

// Initialize trip model
const tripModel = new Trip(database);

// GET /api/trips - Get all trips
router.get('/', async (req, res) => {
  try {
    const trips = await tripModel.getAll();
    res.json(trips);
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({ error: 'Failed to fetch trips' });
  }
});

// GET /api/trips/:id - Get single trip with full details
router.get('/:id', async (req, res) => {
  try {
    const tripId = parseInt(req.params.id);
    if (isNaN(tripId)) {
      return res.status(400).json({ error: 'Invalid trip ID' });
    }

    const trip = await tripModel.getById(tripId);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    res.json(trip);
  } catch (error) {
    console.error('Error fetching trip:', error);
    res.status(500).json({ error: 'Failed to fetch trip' });
  }
});

// POST /api/trips - Create new trip
router.post('/', async (req, res) => {
  try {
    const { name, destinations, startDate, endDate, participants } = req.body;

    // Validate required fields
    if (!name || !destinations || !startDate || !endDate) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, destinations, startDate, endDate' 
      });
    }

    // Validate destinations is an array
    if (!Array.isArray(destinations) || destinations.length === 0) {
      return res.status(400).json({ 
        error: 'Destinations must be a non-empty array' 
      });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
      return res.status(400).json({ 
        error: 'End date must be after start date' 
      });
    }

    const trip = await tripModel.create({
      name,
      destinations,
      startDate,
      endDate,
      participants: participants || []
    });

    res.status(201).json(trip);
  } catch (error) {
    console.error('Error creating trip:', error);
    res.status(500).json({ error: 'Failed to create trip' });
  }
});

// PUT /api/trips/:id - Update trip
router.put('/:id', async (req, res) => {
  try {
    const tripId = parseInt(req.params.id);
    if (isNaN(tripId)) {
      return res.status(400).json({ error: 'Invalid trip ID' });
    }

    const { name, destinations, startDate, endDate, participants } = req.body;

    // Check if trip exists
    const existingTrip = await tripModel.getById(tripId);
    if (!existingTrip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    // Validate dates if provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start >= end) {
        return res.status(400).json({ 
          error: 'End date must be after start date' 
        });
      }
    }

    // Validate destinations if provided
    if (destinations && (!Array.isArray(destinations) || destinations.length === 0)) {
      return res.status(400).json({ 
        error: 'Destinations must be a non-empty array' 
      });
    }

    // Validate participants if provided
    if (participants && !Array.isArray(participants)) {
      return res.status(400).json({ 
        error: 'Participants must be an array' 
      });
    }

    // Check for duplicate participant names if provided
    if (participants && participants.length > 0) {
      const uniqueParticipants = [...new Set(participants)];
      if (uniqueParticipants.length !== participants.length) {
        return res.status(400).json({ 
          error: 'Duplicate participant names are not allowed' 
        });
      }
    }

    const updatedTrip = await tripModel.update(tripId, {
      name,
      destinations,
      startDate,
      endDate,
      participants
    });

    res.json(updatedTrip);
  } catch (error) {
    console.error('Error updating trip:', error);
    console.error('Request body:', req.body);
    res.status(500).json({ 
      error: 'Failed to update trip', 
      details: error.message 
    });
  }
});

// DELETE /api/trips/:id - Delete trip
router.delete('/:id', async (req, res) => {
  try {
    const tripId = parseInt(req.params.id);
    if (isNaN(tripId)) {
      return res.status(400).json({ error: 'Invalid trip ID' });
    }

    const deleted = await tripModel.delete(tripId);
    if (!deleted) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Error deleting trip:', error);
    res.status(500).json({ error: 'Failed to delete trip' });
  }
});

// POST /api/trips/:id/activities - Add activity to trip
router.post('/:id/activities', async (req, res) => {
  try {
    const tripId = parseInt(req.params.id);
    if (isNaN(tripId)) {
      return res.status(400).json({ error: 'Invalid trip ID' });
    }

    const { name, category, location, cost, duration } = req.body;

    // Validate required fields
    if (!name || !category || !location) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, category, location' 
      });
    }

    // Check if trip exists
    const existingTrip = await tripModel.getById(tripId);
    if (!existingTrip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const activityId = await tripModel.addActivity(tripId, {
      name,
      category,
      location,
      cost: cost ? parseFloat(cost) : null,
      duration
    });

    res.status(201).json({ id: activityId, message: 'Activity added successfully' });
  } catch (error) {
    console.error('Error adding activity:', error);
    res.status(500).json({ error: 'Failed to add activity' });
  }
});

// POST /api/trips/:id/restaurants - Add restaurant to trip
router.post('/:id/restaurants', async (req, res) => {
  try {
    const tripId = parseInt(req.params.id);
    if (isNaN(tripId)) {
      return res.status(400).json({ error: 'Invalid trip ID' });
    }

    const { name, cuisine, location, cost, priceRange, groupCapacity, dietaryOptions } = req.body;

    // Validate required fields
    if (!name || !cuisine || !location) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, cuisine, location' 
      });
    }

    // Check if trip exists
    const existingTrip = await tripModel.getById(tripId);
    if (!existingTrip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const restaurantId = await tripModel.addRestaurant(tripId, {
      name,
      cuisine,
      location,
      cost: cost ? parseFloat(cost) : null,
      priceRange,
      groupCapacity: groupCapacity ? parseInt(groupCapacity) : null,
      dietaryOptions: dietaryOptions || []
    });

    res.status(201).json({ id: restaurantId, message: 'Restaurant added successfully' });
  } catch (error) {
    console.error('Error adding restaurant:', error);
    res.status(500).json({ error: 'Failed to add restaurant' });
  }
});

// PUT /api/trips/:id/activities/:activityId - Update activity
router.put('/:id/activities/:activityId', async (req, res) => {
  try {
    const tripId = parseInt(req.params.id);
    const activityId = parseInt(req.params.activityId);
    
    if (isNaN(tripId) || isNaN(activityId)) {
      return res.status(400).json({ error: 'Invalid trip or activity ID' });
    }

    const { name, category, location, cost, duration } = req.body;

    // Check if trip and activity exist
    const existingTrip = await tripModel.getById(tripId);
    if (!existingTrip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const updated = await tripModel.updateActivity(activityId, {
      name, category, location, 
      cost: cost ? parseFloat(cost) : null, 
      duration
    });

    if (!updated) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    res.json({ message: 'Activity updated successfully' });
  } catch (error) {
    console.error('Error updating activity:', error);
    res.status(500).json({ error: 'Failed to update activity' });
  }
});

// DELETE /api/trips/:id/activities/:activityId - Delete activity
router.delete('/:id/activities/:activityId', async (req, res) => {
  try {
    const tripId = parseInt(req.params.id);
    const activityId = parseInt(req.params.activityId);
    
    if (isNaN(tripId) || isNaN(activityId)) {
      return res.status(400).json({ error: 'Invalid trip or activity ID' });
    }

    // Check if trip exists
    const existingTrip = await tripModel.getById(tripId);
    if (!existingTrip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const deleted = await tripModel.deleteActivity(activityId);
    if (!deleted) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    console.error('Error deleting activity:', error);
    res.status(500).json({ error: 'Failed to delete activity' });
  }
});

// PUT /api/trips/:id/restaurants/:restaurantId - Update restaurant
router.put('/:id/restaurants/:restaurantId', async (req, res) => {
  try {
    const tripId = parseInt(req.params.id);
    const restaurantId = parseInt(req.params.restaurantId);
    
    if (isNaN(tripId) || isNaN(restaurantId)) {
      return res.status(400).json({ error: 'Invalid trip or restaurant ID' });
    }

    const { name, cuisine, location, cost, priceRange, groupCapacity, dietaryOptions } = req.body;

    // Check if trip exists
    const existingTrip = await tripModel.getById(tripId);
    if (!existingTrip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const updated = await tripModel.updateRestaurant(restaurantId, {
      name, cuisine, location,
      cost: cost ? parseFloat(cost) : null,
      priceRange,
      groupCapacity: groupCapacity ? parseInt(groupCapacity) : null,
      dietaryOptions: dietaryOptions || []
    });

    if (!updated) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    res.json({ message: 'Restaurant updated successfully' });
  } catch (error) {
    console.error('Error updating restaurant:', error);
    res.status(500).json({ error: 'Failed to update restaurant' });
  }
});

// DELETE /api/trips/:id/restaurants/:restaurantId - Delete restaurant
router.delete('/:id/restaurants/:restaurantId', async (req, res) => {
  try {
    const tripId = parseInt(req.params.id);
    const restaurantId = parseInt(req.params.restaurantId);
    
    if (isNaN(tripId) || isNaN(restaurantId)) {
      return res.status(400).json({ error: 'Invalid trip or restaurant ID' });
    }

    // Check if trip exists
    const existingTrip = await tripModel.getById(tripId);
    if (!existingTrip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const deleted = await tripModel.deleteRestaurant(restaurantId);
    if (!deleted) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    res.json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    res.status(500).json({ error: 'Failed to delete restaurant' });
  }
});

// TRAVEL ENDPOINTS
// GET /api/trips/:id/travel - Get travel information for trip
router.get('/:id/travel', async (req, res) => {
  try {
    const tripId = parseInt(req.params.id);
    if (isNaN(tripId)) {
      return res.status(400).json({ error: 'Invalid trip ID' });
    }

    const travel = await tripModel.getTravelInfo(tripId);
    res.json(travel);
  } catch (error) {
    console.error('Error fetching travel info:', error);
    res.status(500).json({ error: 'Failed to fetch travel information' });
  }
});

// POST /api/trips/:id/travel - Add travel information
router.post('/:id/travel', async (req, res) => {
  try {
    const tripId = parseInt(req.params.id);
    if (isNaN(tripId)) {
      return res.status(400).json({ error: 'Invalid trip ID' });
    }

    const { type, details, fromLocation, toLocation, dateTime, cost, confirmationNumber, notes } = req.body;

    if (!type || !details) {
      return res.status(400).json({ error: 'Missing required fields: type, details' });
    }

    const travelId = await tripModel.addTravelInfo(tripId, {
      type, details, fromLocation, toLocation, dateTime, 
      cost: cost ? parseFloat(cost) : null, confirmationNumber, notes
    });

    res.status(201).json({ id: travelId, message: 'Travel information added successfully' });
  } catch (error) {
    console.error('Error adding travel info:', error);
    res.status(500).json({ error: 'Failed to add travel information' });
  }
});

// PUT /api/trips/:id/travel/:travelId - Update travel information
router.put('/:id/travel/:travelId', async (req, res) => {
  try {
    const tripId = parseInt(req.params.id);
    const travelId = parseInt(req.params.travelId);
    
    if (isNaN(tripId) || isNaN(travelId)) {
      return res.status(400).json({ error: 'Invalid trip or travel ID' });
    }

    const { type, details, fromLocation, toLocation, dateTime, cost, confirmationNumber, notes } = req.body;

    const updated = await tripModel.updateTravelInfo(travelId, {
      type, details, fromLocation, toLocation, dateTime,
      cost: cost ? parseFloat(cost) : null, confirmationNumber, notes
    });

    if (!updated) {
      return res.status(404).json({ error: 'Travel information not found' });
    }

    res.json({ message: 'Travel information updated successfully' });
  } catch (error) {
    console.error('Error updating travel info:', error);
    res.status(500).json({ error: 'Failed to update travel information' });
  }
});

// DELETE /api/trips/:id/travel/:travelId - Delete travel information
router.delete('/:id/travel/:travelId', async (req, res) => {
  try {
    const tripId = parseInt(req.params.id);
    const travelId = parseInt(req.params.travelId);
    
    if (isNaN(tripId) || isNaN(travelId)) {
      return res.status(400).json({ error: 'Invalid trip or travel ID' });
    }

    const deleted = await tripModel.deleteTravelInfo(travelId);
    if (!deleted) {
      return res.status(404).json({ error: 'Travel information not found' });
    }

    res.json({ message: 'Travel information deleted successfully' });
  } catch (error) {
    console.error('Error deleting travel info:', error);
    res.status(500).json({ error: 'Failed to delete travel information' });
  }
});

// LODGING ENDPOINTS
// GET /api/trips/:id/lodging - Get lodging information for trip
router.get('/:id/lodging', async (req, res) => {
  try {
    const tripId = parseInt(req.params.id);
    if (isNaN(tripId)) {
      return res.status(400).json({ error: 'Invalid trip ID' });
    }

    const lodging = await tripModel.getLodgingInfo(tripId);
    res.json(lodging);
  } catch (error) {
    console.error('Error fetching lodging info:', error);
    res.status(500).json({ error: 'Failed to fetch lodging information' });
  }
});

// POST /api/trips/:id/lodging - Add lodging information
router.post('/:id/lodging', async (req, res) => {
  try {
    const tripId = parseInt(req.params.id);
    if (isNaN(tripId)) {
      return res.status(400).json({ error: 'Invalid trip ID' });
    }

    const { name, type, location, checkIn, checkOut, cost, confirmationNumber, contactInfo, wifiInfo, notes } = req.body;

    if (!name || !type || !location) {
      return res.status(400).json({ error: 'Missing required fields: name, type, location' });
    }

    const lodgingId = await tripModel.addLodgingInfo(tripId, {
      name, type, location, checkIn, checkOut,
      cost: cost ? parseFloat(cost) : null, confirmationNumber, contactInfo, wifiInfo, notes
    });

    res.status(201).json({ id: lodgingId, message: 'Lodging information added successfully' });
  } catch (error) {
    console.error('Error adding lodging info:', error);
    res.status(500).json({ error: 'Failed to add lodging information' });
  }
});

// PUT /api/trips/:id/lodging/:lodgingId - Update lodging information
router.put('/:id/lodging/:lodgingId', async (req, res) => {
  try {
    const tripId = parseInt(req.params.id);
    const lodgingId = parseInt(req.params.lodgingId);
    
    if (isNaN(tripId) || isNaN(lodgingId)) {
      return res.status(400).json({ error: 'Invalid trip or lodging ID' });
    }

    const { name, type, location, checkIn, checkOut, cost, confirmationNumber, contactInfo, wifiInfo, notes } = req.body;

    const updated = await tripModel.updateLodgingInfo(lodgingId, {
      name, type, location, checkIn, checkOut,
      cost: cost ? parseFloat(cost) : null, confirmationNumber, contactInfo, wifiInfo, notes
    });

    if (!updated) {
      return res.status(404).json({ error: 'Lodging information not found' });
    }

    res.json({ message: 'Lodging information updated successfully' });
  } catch (error) {
    console.error('Error updating lodging info:', error);
    res.status(500).json({ error: 'Failed to update lodging information' });
  }
});

// DELETE /api/trips/:id/lodging/:lodgingId - Delete lodging information
router.delete('/:id/lodging/:lodgingId', async (req, res) => {
  try {
    const tripId = parseInt(req.params.id);
    const lodgingId = parseInt(req.params.lodgingId);
    
    if (isNaN(tripId) || isNaN(lodgingId)) {
      return res.status(400).json({ error: 'Invalid trip or lodging ID' });
    }

    const deleted = await tripModel.deleteLodgingInfo(lodgingId);
    if (!deleted) {
      return res.status(404).json({ error: 'Lodging information not found' });
    }

    res.json({ message: 'Lodging information deleted successfully' });
  } catch (error) {
    console.error('Error deleting lodging info:', error);
    res.status(500).json({ error: 'Failed to delete lodging information' });
  }
});

// LOGISTICS ENDPOINTS  
// GET /api/trips/:id/logistics - Get logistics information for trip
router.get('/:id/logistics', async (req, res) => {
  try {
    const tripId = parseInt(req.params.id);
    if (isNaN(tripId)) {
      return res.status(400).json({ error: 'Invalid trip ID' });
    }

    const logistics = await tripModel.getLogisticsInfo(tripId);
    res.json(logistics);
  } catch (error) {
    console.error('Error fetching logistics info:', error);
    res.status(500).json({ error: 'Failed to fetch logistics information' });
  }
});

// POST /api/trips/:id/logistics - Add logistics information
router.post('/:id/logistics', async (req, res) => {
  try {
    const tripId = parseInt(req.params.id);
    if (isNaN(tripId)) {
      return res.status(400).json({ error: 'Invalid trip ID' });
    }

    const { category, name, details, additionalInfo } = req.body;

    if (!category || !name) {
      return res.status(400).json({ error: 'Missing required fields: category, name' });
    }

    const logisticsId = await tripModel.addLogisticsInfo(tripId, {
      category, name, details, additionalInfo
    });

    res.status(201).json({ id: logisticsId, message: 'Logistics information added successfully' });
  } catch (error) {
    console.error('Error adding logistics info:', error);
    res.status(500).json({ error: 'Failed to add logistics information' });
  }
});

// PUT /api/trips/:id/logistics/:logisticsId - Update logistics information
router.put('/:id/logistics/:logisticsId', async (req, res) => {
  try {
    const tripId = parseInt(req.params.id);
    const logisticsId = parseInt(req.params.logisticsId);
    
    if (isNaN(tripId) || isNaN(logisticsId)) {
      return res.status(400).json({ error: 'Invalid trip or logistics ID' });
    }

    const { category, name, details, additionalInfo } = req.body;

    const updated = await tripModel.updateLogisticsInfo(logisticsId, {
      category, name, details, additionalInfo
    });

    if (!updated) {
      return res.status(404).json({ error: 'Logistics information not found' });
    }

    res.json({ message: 'Logistics information updated successfully' });
  } catch (error) {
    console.error('Error updating logistics info:', error);
    res.status(500).json({ error: 'Failed to update logistics information' });
  }
});

// DELETE /api/trips/:id/logistics/:logisticsId - Delete logistics information
router.delete('/:id/logistics/:logisticsId', async (req, res) => {
  try {
    const tripId = parseInt(req.params.id);
    const logisticsId = parseInt(req.params.logisticsId);
    
    if (isNaN(tripId) || isNaN(logisticsId)) {
      return res.status(400).json({ error: 'Invalid trip or logistics ID' });
    }

    const deleted = await tripModel.deleteLogisticsInfo(logisticsId);
    if (!deleted) {
      return res.status(404).json({ error: 'Logistics information not found' });
    }

    res.json({ message: 'Logistics information deleted successfully' });
  } catch (error) {
    console.error('Error deleting logistics info:', error);
    res.status(500).json({ error: 'Failed to delete logistics information' });
  }
});

// GET /api/trips/:id/export - Export complete trip data
router.get('/:id/export', async (req, res) => {
  try {
    const tripId = parseInt(req.params.id);
    if (isNaN(tripId)) {
      return res.status(400).json({ error: 'Invalid trip ID' });
    }

    // Get complete trip data including all tabs
    const trip = await tripModel.getById(tripId);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    // Calculate average ratings for activities and restaurants
    const calculateAverage = (ratings) => {
      if (!ratings || ratings.length === 0) return 0;
      const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
      return Math.round((sum / ratings.length) * 10) / 10;
    };

    // Structure export data with all tab information
    const exportData = {
      tripInfo: {
        id: trip.id,
        name: trip.name,
        destinations: trip.destinations,
        startDate: trip.startDate,
        endDate: trip.endDate,
        participants: trip.participants
      },
      activities: (trip.activities || []).map(activity => ({
        id: activity.id,
        name: activity.name,
        category: activity.category,
        location: activity.location,
        cost: activity.cost,
        duration: activity.duration,
        ratings: (activity.ratings || []).map(r => ({
          user: r.userName,
          rating: r.rating
        })),
        averageRating: calculateAverage(activity.ratings)
      })),
      restaurants: (trip.restaurants || []).map(restaurant => ({
        id: restaurant.id,
        name: restaurant.name,
        cuisine: restaurant.cuisine,
        location: restaurant.location,
        cost: restaurant.cost,
        priceRange: restaurant.priceRange,
        groupCapacity: restaurant.groupCapacity,
        dietaryOptions: restaurant.dietaryOptions,
        ratings: (restaurant.ratings || []).map(r => ({
          user: r.userName,
          rating: r.rating
        })),
        averageRating: calculateAverage(restaurant.ratings)
      })),
      travel: trip.travel || [],
      lodging: trip.lodging || [],
      logistics: trip.logistics || [],
      itinerary: trip.itinerary || [],
      exportMetadata: {
        exportedAt: new Date().toISOString(),
        exportedBy: 'TravelTogether Export System',
        version: '1.0'
      }
    };

    res.json(exportData);
  } catch (error) {
    console.error('Error exporting trip:', error);
    res.status(500).json({ error: 'Failed to export trip data' });
  }
});

module.exports = router;