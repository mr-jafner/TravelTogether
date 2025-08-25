import React, { useState } from 'react';

const RestaurantForm = ({ onAddRestaurant, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    cuisine: '',
    location: '',
    cost: '',
    priceRange: '',
    dietaryOptions: [],
    groupCapacity: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cuisines = [
    'American', 'Italian', 'Mexican', 'Chinese', 'Japanese', 'Indian', 'Thai',
    'French', 'Mediterranean', 'Greek', 'Spanish', 'Korean', 'Vietnamese',
    'Fast Food', 'Pizza', 'Seafood', 'Steakhouse', 'BBQ', 'Cafe', 'Fine Dining',
    'International', 'Fusion', 'Vegetarian', 'Vegan'
  ];

  const priceRanges = ['$', '$$', '$$$', '$$$$'];

  const dietaryOptionsList = ['vegetarian', 'vegan', 'gluten-free', 'kids-friendly'];

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

  const handleDietaryOptionChange = (option) => {
    setFormData(prev => ({
      ...prev,
      dietaryOptions: prev.dietaryOptions.includes(option)
        ? prev.dietaryOptions.filter(o => o !== option)
        : [...prev.dietaryOptions, option]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Restaurant name is required';
    }

    if (!formData.cuisine) {
      newErrors.cuisine = 'Cuisine type is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.cost || isNaN(formData.cost) || formData.cost < 0) {
      newErrors.cost = 'Valid cost per person is required';
    }

    if (!formData.priceRange) {
      newErrors.priceRange = 'Price range is required';
    }

    if (!formData.groupCapacity || isNaN(formData.groupCapacity) || formData.groupCapacity < 1) {
      newErrors.groupCapacity = 'Valid group capacity is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const newRestaurant = {
          name: formData.name,
          cuisine: formData.cuisine,
          location: formData.location,
          cost: parseFloat(formData.cost),
          priceRange: formData.priceRange,
          dietaryOptions: formData.dietaryOptions,
          groupCapacity: parseInt(formData.groupCapacity)
        };
        await onAddRestaurant(newRestaurant);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-6">
      <h4 className="text-lg font-semibold text-orange-900 mb-4">Add New Restaurant</h4>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Restaurant Name */}
        <div>
          <label htmlFor="restaurantName" className="block text-sm font-medium text-gray-700 mb-1">
            Restaurant Name *
          </label>
          <input
            type="text"
            id="restaurantName"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
              errors.name ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="e.g., Joe's Pizza, The French Bistro, Sushi Palace"
          />
          {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Cuisine and Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="restaurantCuisine" className="block text-sm font-medium text-gray-700 mb-1">
              Cuisine Type *
            </label>
            <select
              id="restaurantCuisine"
              name="cuisine"
              value={formData.cuisine}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                errors.cuisine ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select cuisine</option>
              {cuisines.map(cuisine => (
                <option key={cuisine} value={cuisine}>{cuisine}</option>
              ))}
            </select>
            {errors.cuisine && <p className="text-red-600 text-xs mt-1">{errors.cuisine}</p>}
          </div>

          <div>
            <label htmlFor="restaurantLocation" className="block text-sm font-medium text-gray-700 mb-1">
              Location *
            </label>
            <input
              type="text"
              id="restaurantLocation"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                errors.location ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="e.g., Downtown, Main Street"
            />
            {errors.location && <p className="text-red-600 text-xs mt-1">{errors.location}</p>}
          </div>
        </div>

        {/* Cost, Price Range, and Group Capacity */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="restaurantCost" className="block text-sm font-medium text-gray-700 mb-1">
              Cost per Person ($) *
            </label>
            <input
              type="number"
              id="restaurantCost"
              name="cost"
              value={formData.cost}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                errors.cost ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="0.00"
            />
            {errors.cost && <p className="text-red-600 text-xs mt-1">{errors.cost}</p>}
          </div>

          <div>
            <label htmlFor="restaurantPriceRange" className="block text-sm font-medium text-gray-700 mb-1">
              Price Range *
            </label>
            <select
              id="restaurantPriceRange"
              name="priceRange"
              value={formData.priceRange}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                errors.priceRange ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select range</option>
              {priceRanges.map(range => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
            {errors.priceRange && <p className="text-red-600 text-xs mt-1">{errors.priceRange}</p>}
          </div>

          <div>
            <label htmlFor="restaurantCapacity" className="block text-sm font-medium text-gray-700 mb-1">
              Group Capacity *
            </label>
            <input
              type="number"
              id="restaurantCapacity"
              name="groupCapacity"
              value={formData.groupCapacity}
              onChange={handleInputChange}
              min="1"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                errors.groupCapacity ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Max people"
            />
            {errors.groupCapacity && <p className="text-red-600 text-xs mt-1">{errors.groupCapacity}</p>}
          </div>
        </div>

        {/* Dietary Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dietary Options
          </label>
          <div className="flex flex-wrap gap-2">
            {dietaryOptionsList.map(option => (
              <label key={option} className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={formData.dietaryOptions.includes(option)}
                  onChange={() => handleDietaryOptionChange(option)}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="ml-2 text-sm text-gray-700 capitalize">
                  {option.replace('-', ' ')}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`font-medium py-2 px-4 rounded-lg transition-colors ${
              isSubmitting 
                ? 'bg-orange-300 text-white cursor-not-allowed' 
                : 'bg-orange-500 hover:bg-orange-600 text-white'
            }`}
          >
            {isSubmitting ? 'Adding Restaurant...' : 'Add Restaurant'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className={`font-medium py-2 px-4 rounded-lg transition-colors ${
              isSubmitting 
                ? 'bg-gray-50 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default RestaurantForm;