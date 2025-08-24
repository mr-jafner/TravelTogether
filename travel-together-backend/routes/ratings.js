const express = require('express');
const router = express.Router();
const database = require('../database/init.js');
const Trip = require('../models/Trip.js');

// Initialize trip model
const tripModel = new Trip(database);

// POST /api/trips/:tripId/activities/:activityId/rate - Rate an activity
router.post('/trips/:tripId/activities/:activityId/rate', async (req, res) => {
  try {
    const tripId = parseInt(req.params.tripId);
    const activityId = parseInt(req.params.activityId);
    const { participantName, rating } = req.body;

    // Validate parameters
    if (isNaN(tripId)) {
      return res.status(400).json({ error: 'Invalid trip ID' });
    }
    if (isNaN(activityId)) {
      return res.status(400).json({ error: 'Invalid activity ID' });
    }
    if (!participantName) {
      return res.status(400).json({ error: 'Participant name is required' });
    }
    if (rating === undefined || rating < 0 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 0 and 5' });
    }

    // Check if trip exists
    const trip = await tripModel.getById(tripId);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    // Check if activity exists in the trip
    const activity = trip.activities.find(a => a.id === activityId);
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found in this trip' });
    }

    // Check if participant exists in the trip
    if (!trip.participants.includes(participantName)) {
      return res.status(400).json({ error: 'Participant not found in this trip' });
    }

    await tripModel.rateActivity(tripId, activityId, participantName, parseInt(rating));

    res.json({ message: 'Activity rated successfully' });
  } catch (error) {
    console.error('Error rating activity:', error);
    res.status(500).json({ error: 'Failed to rate activity' });
  }
});

// POST /api/trips/:tripId/restaurants/:restaurantId/rate - Rate a restaurant
router.post('/trips/:tripId/restaurants/:restaurantId/rate', async (req, res) => {
  try {
    const tripId = parseInt(req.params.tripId);
    const restaurantId = parseInt(req.params.restaurantId);
    const { participantName, rating } = req.body;

    // Validate parameters
    if (isNaN(tripId)) {
      return res.status(400).json({ error: 'Invalid trip ID' });
    }
    if (isNaN(restaurantId)) {
      return res.status(400).json({ error: 'Invalid restaurant ID' });
    }
    if (!participantName) {
      return res.status(400).json({ error: 'Participant name is required' });
    }
    if (rating === undefined || rating < 0 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 0 and 5' });
    }

    // Check if trip exists
    const trip = await tripModel.getById(tripId);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    // Check if restaurant exists in the trip
    const restaurant = trip.restaurants.find(r => r.id === restaurantId);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found in this trip' });
    }

    // Check if participant exists in the trip
    if (!trip.participants.includes(participantName)) {
      return res.status(400).json({ error: 'Participant not found in this trip' });
    }

    await tripModel.rateRestaurant(tripId, restaurantId, participantName, parseInt(rating));

    res.json({ message: 'Restaurant rated successfully' });
  } catch (error) {
    console.error('Error rating restaurant:', error);
    res.status(500).json({ error: 'Failed to rate restaurant' });
  }
});

// GET /api/trips/:tripId/activities/:activityId/ratings - Get activity ratings
router.get('/trips/:tripId/activities/:activityId/ratings', async (req, res) => {
  try {
    const tripId = parseInt(req.params.tripId);
    const activityId = parseInt(req.params.activityId);

    if (isNaN(tripId) || isNaN(activityId)) {
      return res.status(400).json({ error: 'Invalid trip or activity ID' });
    }

    const ratings = await database.all(`
      SELECT 
        ar.rating,
        p.name as participant_name,
        ar.created_at
      FROM activity_ratings ar
      JOIN participants p ON ar.participant_id = p.id
      WHERE ar.activity_id = ? AND p.trip_id = ?
      ORDER BY ar.created_at DESC
    `, [activityId, tripId]);

    res.json(ratings);
  } catch (error) {
    console.error('Error fetching activity ratings:', error);
    res.status(500).json({ error: 'Failed to fetch activity ratings' });
  }
});

// GET /api/trips/:tripId/restaurants/:restaurantId/ratings - Get restaurant ratings
router.get('/trips/:tripId/restaurants/:restaurantId/ratings', async (req, res) => {
  try {
    const tripId = parseInt(req.params.tripId);
    const restaurantId = parseInt(req.params.restaurantId);

    if (isNaN(tripId) || isNaN(restaurantId)) {
      return res.status(400).json({ error: 'Invalid trip or restaurant ID' });
    }

    const ratings = await database.all(`
      SELECT 
        rr.rating,
        p.name as participant_name,
        rr.created_at
      FROM restaurant_ratings rr
      JOIN participants p ON rr.participant_id = p.id
      WHERE rr.restaurant_id = ? AND p.trip_id = ?
      ORDER BY rr.created_at DESC
    `, [restaurantId, tripId]);

    res.json(ratings);
  } catch (error) {
    console.error('Error fetching restaurant ratings:', error);
    res.status(500).json({ error: 'Failed to fetch restaurant ratings' });
  }
});

module.exports = router;