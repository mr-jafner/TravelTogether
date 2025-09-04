const database = require('../database/init.js');

const requireParticipant = (tripId, username) => {
  return async (req, res, next) => {
    try {
      const participant = await database.get(
        'SELECT id, role FROM participants WHERE trip_id = ? AND name = ?',
        [tripId, username]
      );

      if (!participant) {
        return res.status(403).json({
          error: 'Access denied',
          message: 'You are not a participant in this trip'
        });
      }

      req.participant = participant;
      next();
    } catch (error) {
      console.error('Permission check failed:', error);
      res.status(500).json({
        error: 'Server error',
        message: 'Failed to verify permissions'
      });
    }
  };
};

const requireCreator = (tripId, username) => {
  return async (req, res, next) => {
    try {
      const participant = await database.get(
        'SELECT id, role FROM participants WHERE trip_id = ? AND name = ? AND role = ?',
        [tripId, username, 'creator']
      );

      if (!participant) {
        return res.status(403).json({
          error: 'Access denied',
          message: 'Only trip creators can perform this action'
        });
      }

      req.participant = participant;
      next();
    } catch (error) {
      console.error('Creator permission check failed:', error);
      res.status(500).json({
        error: 'Server error',
        message: 'Failed to verify creator permissions'
      });
    }
  };
};

const requireParticipantMW = async (req, res, next) => {
  try {
    const tripId = req.params.id || req.params.tripId;
    const username = req.params.username || req.body.username || req.query.username;

    if (!tripId || !username) {
      return res.status(400).json({
        error: 'Bad request',
        message: 'Trip ID and username are required'
      });
    }

    const participant = await database.get(
      'SELECT id, role FROM participants WHERE trip_id = ? AND name = ?',
      [tripId, username]
    );

    if (!participant) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You are not a participant in this trip'
      });
    }

    req.participant = participant;
    req.isCreator = participant.role === 'creator';
    next();
  } catch (error) {
    console.error('Permission check failed:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to verify permissions'
    });
  }
};

const requireCreatorMW = async (req, res, next) => {
  try {
    const tripId = req.params.id || req.params.tripId;
    const username = req.params.username || req.body.username || req.query.username;

    if (!tripId || !username) {
      return res.status(400).json({
        error: 'Bad request',
        message: 'Trip ID and username are required'
      });
    }

    const participant = await database.get(
      'SELECT id, role FROM participants WHERE trip_id = ? AND name = ? AND role = ?',
      [tripId, username, 'creator']
    );

    if (!participant) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Only trip creators can perform this action'
      });
    }

    req.participant = participant;
    req.isCreator = true;
    next();
  } catch (error) {
    console.error('Creator permission check failed:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to verify creator permissions'
    });
  }
};

module.exports = {
  requireTripAccess: requireParticipantMW,
  requireCreator: requireCreatorMW,
  requireParticipant: requireParticipantMW
};