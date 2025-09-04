import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { tripApi } from '../services/api';
import ParticipantAutocompleteInput from './common/ParticipantAutocompleteInput';

const TripCreation = () => {
  const navigate = useNavigate();
  const { username } = useUser();
  const [formData, setFormData] = useState({
    name: '',
    destination: '',
    startDate: '',
    endDate: '',
    participants: [username || 'You'] // Start with current user's actual username
  });
  const [newParticipant, setNewParticipant] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Update participants when username is available
  useEffect(() => {
    if (username && formData.participants[0] !== username) {
      setFormData(prev => ({
        ...prev,
        participants: [username, ...prev.participants.slice(1)]
      }));
    }
  }, [username]);

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

  const addParticipant = (participantName = null) => {
    const nameToAdd = participantName || newParticipant.trim();
    if (nameToAdd && !formData.participants.includes(nameToAdd)) {
      setFormData(prev => ({
        ...prev,
        participants: [...prev.participants, nameToAdd]
      }));
      setNewParticipant('');
    }
  };

  const removeParticipant = (participantToRemove) => {
    if (participantToRemove === username) return; // Don't allow removing current user
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        // Create trip data for API
        const tripData = {
          name: formData.name,
          destinations: [formData.destination], // Convert to array for backend
          startDate: formData.startDate,
          endDate: formData.endDate,
          participants: formData.participants
        };

        // Create trip via API
        const createdTrip = await tripApi.createTrip(tripData, username);
        
        // Navigate to the new trip detail page
        navigate(`/trips/${createdTrip.id}`);
      } catch (error) {
        console.error('Failed to create trip:', error);
        setErrors({ submit: 'Failed to create trip. Please try again.' });
      } finally {
        setLoading(false);
      }
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

            {/* Add Participant Input with Autocomplete */}
            <div className="flex gap-2 mb-4">
              <ParticipantAutocompleteInput
                value={newParticipant}
                onChange={setNewParticipant}
                onAdd={addParticipant}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addParticipant())}
                placeholder="Start typing participant name..."
                className="flex-1"
              />
              <button
                type="button"
                onClick={() => addParticipant()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                Add
              </button>
            </div>
            
            {/* Helper Text */}
            <p className="text-xs text-gray-500 mb-4">
              Start typing to see existing participants, or enter a new name to add them to the system.
            </p>

            {/* Participant Chips */}
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.participants.map((participant, index) => (
                <div
                  key={index}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    participant === username 
                      ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {participant === username ? `${participant} (you)` : participant}
                  {participant !== username && (
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

          {/* Submit Error Display */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 sm:flex-none ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-orange-500 hover:bg-orange-600 transform hover:-translate-y-1 hover:shadow-lg'
              } text-white font-medium py-3 px-6 rounded-lg transition-all duration-200`}
            >
              {loading ? 'Creating Trip...' : 'Create Trip & Start Planning'}
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