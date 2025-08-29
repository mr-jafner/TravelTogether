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

    const { name, destinations, startDate, endDate } = req.body;

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

    const updatedTrip = await tripModel.update(tripId, {
      name,
      destinations,
      startDate,
      endDate
    });

    res.json(updatedTrip);
  } catch (error) {
    console.error('Error updating trip:', error);
    res.status(500).json({ error: 'Failed to update trip' });
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

module.exports = router;