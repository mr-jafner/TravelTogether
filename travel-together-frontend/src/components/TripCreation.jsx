import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const TripCreation = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    destination: '',
    startDate: '',
    endDate: '',
    participants: ['You'] // Start with current user
  });
  const [newParticipant, setNewParticipant] = useState('');
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const addParticipant = () => {
    if (newParticipant.trim() && !formData.participants.includes(newParticipant.trim())) {
      setFormData(prev => ({
        ...prev,
        participants: [...prev.participants, newParticipant.trim()]
      }));
      setNewParticipant('');
    }
  };

  const removeParticipant = (participantToRemove) => {
    if (participantToRemove === 'You') return; // Don't allow removing current user
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.filter(p => p !== participantToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Trip name is required';
    }

    if (!formData.destination.trim()) {
      newErrors.destination = 'Destination is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate && formData.endDate < formData.startDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    if (formData.participants.length < 2) {
      newErrors.participants = 'Add at least one other participant';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Create new trip object
      const newTrip = {
        id: Date.now(), // Simple ID generation for demo
        name: formData.name,
        destination: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        participants: formData.participants,
        currentUser: 'You',
        restaurants: [],
        activities: []
      };

      // Get existing trips from localStorage or use empty array
      const existingTrips = JSON.parse(localStorage.getItem('userTrips') || '[]');
      const updatedTrips = [...existingTrips, newTrip];
      localStorage.setItem('userTrips', JSON.stringify(updatedTrips));

      // Navigate to the new trip detail page
      navigate(`/trips/${newTrip.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-6 sm:p-8">
        {/* Back Navigation */}
        <Link 
          to="/trips" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors group"
        >
          <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to My Trips
        </Link>

        {/* Form Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Create New Trip
          </h1>
          <p className="text-gray-600">
            Plan your next adventure with friends. Add trip details and invite participants to start collaborative planning.
          </p>
        </div>

        {/* Trip Creation Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8">
          {/* Trip Name */}
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
              Trip Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="e.g., Summer Family Vacation, Weekend Getaway, Company Retreat"
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Destination */}
          <div className="mb-6">
            <label htmlFor="destination" className="block text-sm font-semibold text-gray-700 mb-2">
              Destination *
            </label>
            <input
              type="text"
              id="destination"
              name="destination"
              value={formData.destination}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.destination ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="e.g., Orlando, Florida, Paris, France, Aspen, Colorado"
            />
            {errors.destination && <p className="text-red-600 text-sm mt-1">{errors.destination}</p>}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="startDate" className="block text-sm font-semibold text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.startDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.startDate && <p className="text-red-600 text-sm mt-1">{errors.startDate}</p>}
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-semibold text-gray-700 mb-2">
                End Date *
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.endDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.endDate && <p className="text-red-600 text-sm mt-1">{errors.endDate}</p>}
            </div>
          </div>

          {/* Participants */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Trip Participants *
            </label>
            <p className="text-sm text-gray-500 mb-4">
              Add friends, family, or colleagues who will be joining this trip. They'll be able to vote on activities and restaurants.
            </p>

            {/* Add Participant Input */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newParticipant}
                onChange={(e) => setNewParticipant(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addParticipant())}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter participant name"
              />
              <button
                type="button"
                onClick={addParticipant}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                Add
              </button>
            </div>

            {/* Participant Chips */}
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.participants.map((participant, index) => (
                <div
                  key={index}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    participant === 'You' 
                      ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {participant}
                  {participant !== 'You' && (
                    <button
                      type="button"
                      onClick={() => removeParticipant(participant)}
                      className="ml-2 text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
            {errors.participants && <p className="text-red-600 text-sm mt-1">{errors.participants}</p>}
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              className="flex-1 sm:flex-none bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg"
            >
              Create Trip & Start Planning
            </button>
            <Link
              to="/trips"
              className="flex-1 sm:flex-none text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TripCreation;