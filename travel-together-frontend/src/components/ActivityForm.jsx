import React, { useState } from 'react';

const ActivityForm = ({ onAddActivity, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    location: '',
    cost: '',
    duration: ''
  });
  const [errors, setErrors] = useState({});

  const categories = [
    'Entertainment', 'Sightseeing', 'Culture', 'Recreation', 
    'Dining', 'Shopping', 'Wellness', 'Adventure', 'Team Building'
  ];

  const durations = [
    '30 minutes', '1 hour', '1.5 hours', '2 hours', '3 hours', 
    '4 hours', 'Half Day', 'Full Day', 'Multiple Days'
  ];

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Activity name is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.cost || isNaN(formData.cost) || formData.cost < 0) {
      newErrors.cost = 'Valid cost is required';
    }

    if (!formData.duration) {
      newErrors.duration = 'Duration is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const newActivity = {
        id: Date.now(), // Simple ID generation
        name: formData.name,
        category: formData.category,
        location: formData.location,
        cost: parseFloat(formData.cost),
        duration: formData.duration,
        votes: 0
      };
      onAddActivity(newActivity);
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
      <h4 className="text-lg font-semibold text-blue-900 mb-4">Add New Activity</h4>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Activity Name */}
        <div>
          <label htmlFor="activityName" className="block text-sm font-medium text-gray-700 mb-1">
            Activity Name *
          </label>
          <input
            type="text"
            id="activityName"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.name ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="e.g., Visit Central Park, Museum Tour, Beach Day"
          />
          {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Category and Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="activityCategory" className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              id="activityCategory"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.category ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-600 text-xs mt-1">{errors.category}</p>}
          </div>

          <div>
            <label htmlFor="activityLocation" className="block text-sm font-medium text-gray-700 mb-1">
              Location *
            </label>
            <input
              type="text"
              id="activityLocation"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.location ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="e.g., Downtown, Times Square"
            />
            {errors.location && <p className="text-red-600 text-xs mt-1">{errors.location}</p>}
          </div>
        </div>

        {/* Cost and Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="activityCost" className="block text-sm font-medium text-gray-700 mb-1">
              Cost per Person ($) *
            </label>
            <input
              type="number"
              id="activityCost"
              name="cost"
              value={formData.cost}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.cost ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="0.00"
            />
            {errors.cost && <p className="text-red-600 text-xs mt-1">{errors.cost}</p>}
          </div>

          <div>
            <label htmlFor="activityDuration" className="block text-sm font-medium text-gray-700 mb-1">
              Duration *
            </label>
            <select
              id="activityDuration"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.duration ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select duration</option>
              {durations.map(dur => (
                <option key={dur} value={dur}>{dur}</option>
              ))}
            </select>
            {errors.duration && <p className="text-red-600 text-xs mt-1">{errors.duration}</p>}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Add Activity
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ActivityForm;