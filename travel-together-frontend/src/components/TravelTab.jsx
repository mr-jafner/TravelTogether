import React, { useState, useEffect } from 'react';
import { tripApi } from '../services/api';

const TravelTab = ({ trip, onTravelUpdate }) => {
  const [transportationItems, setTransportationItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTransportation, setNewTransportation] = useState({
    type: 'Flight',
    description: '',
    details: '',
    date: '',
    time: '',
    cost: '',
    notes: ''
  });

  const transportationTypes = [
    'Flight', 'Train', 'Bus', 'Car Rental', 'Rideshare', 
    'Public Transit', 'Ferry', 'Taxi', 'Walking', 'Other'
  ];

  // Load travel data on component mount
  useEffect(() => {
    const loadTravelData = async () => {
      if (!trip?.id) return;
      
      try {
        setLoading(true);
        setError(null);
        const travelData = await tripApi.getTravelInfo(trip.id);
        setTransportationItems(travelData || []);
      } catch (error) {
        console.error('Failed to load travel data:', error);
        setError('Failed to load travel information');
      } finally {
        setLoading(false);
      }
    };

    loadTravelData();
  }, [trip?.id]);

  const handleAddTransportation = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Prepare travel data for backend
      const travelData = {
        type: newTransportation.type,
        details: `${newTransportation.description} - ${newTransportation.details}`.trim(),
        from_location: '', // Could be extracted from details
        to_location: '', // Could be extracted from details
        date_time: newTransportation.date && newTransportation.time 
          ? `${newTransportation.date} ${newTransportation.time}` 
          : newTransportation.date || null,
        cost: newTransportation.cost || null,
        confirmation_number: '', // Could add this field to form
        notes: newTransportation.notes
      };

      const result = await tripApi.addTravelInfo(trip.id, travelData);
      setTransportationItems([...transportationItems, result]);
      
      setNewTransportation({
        type: 'Flight',
        description: '',
        details: '',
        date: '',
        time: '',
        cost: '',
        notes: ''
      });
      setShowAddForm(false);
      
      if (onTravelUpdate) {
        onTravelUpdate();
      }
    } catch (error) {
      console.error('Failed to add transportation:', error);
      setError('Failed to add transportation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item.id);
    
    // Parse description and details from the combined details field
    let description = '';
    let details = '';
    if (item.details) {
      const parts = item.details.split(' - ');
      description = parts[0] || '';
      details = parts.slice(1).join(' - ') || '';
    }
    
    // Parse date and time from date_time field
    let date = '';
    let time = '';
    if (item.date_time) {
      const parts = item.date_time.split(' ');
      date = parts[0] || '';
      time = parts[1] || '';
    }
    
    setEditFormData({
      type: item.type || '',
      description: description,
      details: details,
      date: date,
      time: time,
      cost: item.cost ? item.cost.toString() : '',
      notes: item.notes || ''
    });
  };

  const handleSaveEdit = async (itemId) => {
    try {
      setLoading(true);
      setError(null);
      
      // Prepare travel data for backend
      const travelData = {
        type: editFormData.type,
        details: `${editFormData.description} - ${editFormData.details}`.trim(),
        from_location: '', // Could be extracted from details
        to_location: '', // Could be extracted from details
        date_time: editFormData.date && editFormData.time 
          ? `${editFormData.date} ${editFormData.time}` 
          : editFormData.date || null,
        cost: editFormData.cost || null,
        confirmation_number: '', // Could add this field to form
        notes: editFormData.notes
      };

      await tripApi.updateTravelInfo(trip.id, itemId, travelData);
      
      // Refresh the data
      const travelData_updated = await tripApi.getTravelInfo(trip.id);
      setTransportationItems(travelData_updated || []);
      
      setEditingItem(null);
      setEditFormData({});
      
      if (onTravelUpdate) {
        onTravelUpdate();
      }
    } catch (error) {
      console.error('Failed to update travel item:', error);
      setError('Failed to update travel item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditFormData({});
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this travel item?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await tripApi.deleteTravelInfo(trip.id, itemId);
      
      // Refresh the data
      const travelData = await tripApi.getTravelInfo(trip.id);
      setTransportationItems(travelData || []);
      
      if (onTravelUpdate) {
        onTravelUpdate();
      }
    } catch (error) {
      console.error('Failed to delete travel item:', error);
      setError('Failed to delete travel item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTransportationIcon = (type) => {
    const icons = {
      Flight: '✈️',
      Train: '🚆',
      Bus: '🚌',
      'Car Rental': '🚗',
      Rideshare: '🚖',
      'Public Transit': '🚇',
      Ferry: '⛴️',
      Taxi: '🚕',
      Walking: '🚶',
      Other: '🚶'
    };
    return icons[type] || '🚗';
  };

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
        <svg className="w-7 h-7 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Travel & Transportation ({transportationItems.length})
      </h3>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Add Transportation Button */}
      <div className="mb-6">
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Transportation
        </button>
      </div>

      {/* Transportation Items */}
      <div className="space-y-4">
        {loading && transportationItems.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Loading transportation information...
          </div>
        ) : transportationItems.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h4 className="text-lg font-semibold text-gray-700 mb-2">No Transportation Added</h4>
            <p className="text-gray-500 mb-4">
              Start adding travel arrangements for this trip. Include flights, trains, car rentals, and more!
            </p>
          </div>
        ) : (
          transportationItems.map(item => (
            <div key={item.id} className="p-4 rounded-lg border border-green-200 bg-green-50">
              {editingItem === item.id ? (
                // Edit Form
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                    <h4 className="text-lg font-semibold text-green-900">Edit Travel Item</h4>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSaveEdit(item.id)}
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white px-3 py-1 rounded text-sm"
                      >
                        {loading ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-1 rounded text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                      <select
                        value={editFormData.type}
                        onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        {transportationTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <input
                        type="text"
                        value={editFormData.description}
                        onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="date"
                        value={editFormData.date}
                        onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                      <input
                        type="time"
                        value={editFormData.time}
                        onChange={(e) => setEditFormData({ ...editFormData, time: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cost ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={editFormData.cost}
                        onChange={(e) => setEditFormData({ ...editFormData, cost: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
                      <input
                        type="text"
                        value={editFormData.details}
                        onChange={(e) => setEditFormData({ ...editFormData, details: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      value={editFormData.notes}
                      onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
              ) : (
                // Display Mode
                <>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getTransportationIcon(item.type)}</span>
                      <div>
                        <h4 className="font-semibold text-green-800">
                          {item.type}
                        </h4>
                        {item.details && (
                          <p className="text-sm text-green-700 mt-1">{item.details}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditItem(item)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Edit travel item"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Delete travel item"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {(item.date_time || item.cost || item.notes || item.confirmation_number) && (
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      {item.date_time && (
                        <div>
                          <span className="font-medium text-gray-600">Date/Time: </span>
                          <span className="text-green-700">
                            {new Date(item.date_time).toLocaleString()}
                          </span>
                        </div>
                      )}
                      {item.cost && (
                        <div>
                          <span className="font-medium text-gray-600">Cost: </span>
                          <span className="text-green-700">${item.cost}</span>
                        </div>
                      )}
                      {item.confirmation_number && (
                        <div>
                          <span className="font-medium text-gray-600">Confirmation: </span>
                          <span className="text-green-700 font-mono">{item.confirmation_number}</span>
                        </div>
                      )}
                      {item.notes && (
                        <div className="md:col-span-3">
                          <span className="font-medium text-gray-600">Notes: </span>
                          <span className="text-green-700">{item.notes}</span>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Transportation Form */}
      {showAddForm && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-green-900 mb-4">Add Transportation</h4>
          
          <form onSubmit={(e) => { e.preventDefault(); handleAddTransportation(); }} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transportation Type
                </label>
                <select
                  value={newTransportation.type}
                  onChange={(e) => setNewTransportation({ ...newTransportation, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  {transportationTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={newTransportation.description}
                  onChange={(e) => setNewTransportation({ ...newTransportation, description: e.target.value })}
                  placeholder="e.g., Flight to Orlando"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={newTransportation.date}
                  onChange={(e) => setNewTransportation({ ...newTransportation, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  value={newTransportation.time}
                  onChange={(e) => setNewTransportation({ ...newTransportation, time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cost per Person ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newTransportation.cost}
                  onChange={(e) => setNewTransportation({ ...newTransportation, cost: e.target.value })}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Details
                </label>
                <input
                  type="text"
                  value={newTransportation.details}
                  onChange={(e) => setNewTransportation({ ...newTransportation, details: e.target.value })}
                  placeholder="e.g., Flight AA123, Terminal B"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={newTransportation.notes}
                onChange={(e) => setNewTransportation({ ...newTransportation, notes: e.target.value })}
                placeholder="Additional notes, confirmation numbers, etc."
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {loading ? 'Adding...' : 'Add Transportation'}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TravelTab;