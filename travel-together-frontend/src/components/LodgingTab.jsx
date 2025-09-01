import React, { useState, useEffect } from 'react';
import { tripApi } from '../services/api';

const LodgingTab = ({ trip, onLodgingUpdate }) => {
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const [showAddForm, setShowAddForm] = useState(false);
  const [newAccommodation, setNewAccommodation] = useState({
    type: 'Hotel',
    name: '',
    address: '',
    checkIn: '',
    checkOut: '',
    roomType: '',
    cost: '',
    confirmationNumber: '',
    notes: ''
  });

  const accommodationTypes = [
    'Hotel', 'Motel', 'Resort', 'Vacation Rental', 'Airbnb', 
    'Hostel', 'Bed & Breakfast', 'Camping', 'RV Park', 'Other'
  ];

  const roomTypes = [
    'Single Room', 'Double Room', 'Suite', 'Family Room', 
    'Deluxe Room', 'Standard Room', 'Apartment', 'House', 'Other'
  ];

  // Load lodging data on component mount
  useEffect(() => {
    const loadLodgingData = async () => {
      if (!trip?.id) return;
      
      try {
        setLoading(true);
        setError(null);
        const lodgingData = await tripApi.getLodgingInfo(trip.id);
        setAccommodations(lodgingData || []);
      } catch (error) {
        console.error('Failed to load lodging data:', error);
        setError('Failed to load lodging information');
      } finally {
        setLoading(false);
      }
    };

    loadLodgingData();
  }, [trip?.id]);

  const handleAddAccommodation = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Prepare lodging data for backend
      const lodgingData = {
        type: newAccommodation.type,
        name: newAccommodation.name,
        location: newAccommodation.address, // Backend expects 'location'
        checkIn: newAccommodation.checkIn || null,
        checkOut: newAccommodation.checkOut || null,
        cost: newAccommodation.cost || null,
        confirmationNumber: newAccommodation.confirmationNumber,
        notes: newAccommodation.notes
      };

      const result = await tripApi.addLodgingInfo(trip.id, lodgingData);
      setAccommodations([...accommodations, result]);
      
      setNewAccommodation({
        type: 'Hotel',
        name: '',
        address: '',
        checkIn: '',
        checkOut: '',
        roomType: '',
        cost: '',
        confirmationNumber: '',
        notes: ''
      });
      setShowAddForm(false);
      
      if (onLodgingUpdate) {
        onLodgingUpdate();
      }
    } catch (error) {
      console.error('Failed to add accommodation:', error);
      setError('Failed to add accommodation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item.id);
    setEditFormData({
      type: item.type || '',
      name: item.name || '',
      address: item.location || item.address || '',
      checkIn: item.check_in || item.check_in_date || '',
      checkOut: item.check_out || item.check_out_date || '',
      roomType: item.room_type || '',
      cost: item.cost ? item.cost.toString() : '',
      confirmationNumber: item.confirmation_number || '',
      notes: item.notes || ''
    });
  };

  const handleSaveEdit = async (itemId) => {
    try {
      setLoading(true);
      setError(null);
      
      const lodgingData = {
        type: editFormData.type,
        name: editFormData.name,
        location: editFormData.address,
        checkIn: editFormData.checkIn || null,
        checkOut: editFormData.checkOut || null,
        cost: editFormData.cost || null,
        confirmationNumber: editFormData.confirmationNumber,
        notes: editFormData.notes
      };

      await tripApi.updateLodgingInfo(trip.id, itemId, lodgingData);
      
      // Refresh the data
      const lodgingData_updated = await tripApi.getLodgingInfo(trip.id);
      setAccommodations(lodgingData_updated || []);
      
      setEditingItem(null);
      setEditFormData({});
      
      if (onLodgingUpdate) {
        onLodgingUpdate();
      }
    } catch (error) {
      console.error('Failed to update lodging item:', error);
      setError('Failed to update lodging item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditFormData({});
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this lodging item?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await tripApi.deleteLodgingInfo(trip.id, itemId);
      
      // Refresh the data
      const lodgingData = await tripApi.getLodgingInfo(trip.id);
      setAccommodations(lodgingData || []);
      
      if (onLodgingUpdate) {
        onLodgingUpdate();
      }
    } catch (error) {
      console.error('Failed to delete lodging item:', error);
      setError('Failed to delete lodging item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getAccommodationIcon = (type) => {
    const icons = {
      Hotel: '🏨',
      Motel: '🏨',
      Resort: '🏖️',
      'Vacation Rental': '🏠',
      Airbnb: '🏡',
      Hostel: '🏠',
      'Bed & Breakfast': '🛏️',
      Camping: '⛺',
      'RV Park': '🚐',
      Other: '🏠'
    };
    return icons[type] || '🏨';
  };

  const calculateNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return '';
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return nights > 0 ? `${nights} night${nights > 1 ? 's' : ''}` : '';
  };

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
        <svg className="w-7 h-7 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        Lodging & Accommodations ({accommodations.length})
      </h3>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Add Accommodation Button */}
      <div className="mb-6">
        <button 
          onClick={() => setShowAddForm(true)}
          className={`${
            accommodations.length > 0 
              ? 'bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-2 text-sm border border-purple-300' 
              : 'bg-purple-500 hover:bg-purple-600 text-white px-4 py-2'
          } font-medium rounded-lg transition-colors flex items-center`}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {accommodations.length > 0 ? 'Add More Accommodation' : 'Add Accommodation'}
        </button>
      </div>

      {/* Add Accommodation Form */}
      {showAddForm && (
        <div className="mb-6 bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-purple-900 mb-4">Add Accommodation</h4>
          <form onSubmit={(e) => { e.preventDefault(); handleAddAccommodation(); }} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type <span className="text-red-500">*</span></label>
                <select value={newAccommodation.type} onChange={(e) => setNewAccommodation({ ...newAccommodation, type: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" required>
                  {accommodationTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
                <input type="text" value={newAccommodation.name} onChange={(e) => setNewAccommodation({ ...newAccommodation, name: e.target.value })} placeholder="e.g., Grand Hotel Orlando" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address <span className="text-red-500">*</span></label>
                <input type="text" value={newAccommodation.address} onChange={(e) => setNewAccommodation({ ...newAccommodation, address: e.target.value })} placeholder="Full address" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cost/Night</label>
                <input type="number" step="0.01" value={newAccommodation.cost} onChange={(e) => setNewAccommodation({ ...newAccommodation, cost: e.target.value })} placeholder="Optional" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                <input type="date" value={newAccommodation.checkIn} onChange={(e) => setNewAccommodation({ ...newAccommodation, checkIn: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                <input type="date" value={newAccommodation.checkOut} onChange={(e) => setNewAccommodation({ ...newAccommodation, checkOut: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                <select value={newAccommodation.roomType} onChange={(e) => setNewAccommodation({ ...newAccommodation, roomType: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                  <option value="">Select room type</option>
                  {roomTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmation Number</label>
                <input type="text" value={newAccommodation.confirmationNumber} onChange={(e) => setNewAccommodation({ ...newAccommodation, confirmationNumber: e.target.value })} placeholder="Booking confirmation" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea value={newAccommodation.notes} onChange={(e) => setNewAccommodation({ ...newAccommodation, notes: e.target.value })} placeholder="Booking confirmations, special requests, etc." rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={loading} className="bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                {loading ? 'Adding...' : 'Add Accommodation'}
              </button>
              <button type="button" onClick={() => setShowAddForm(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Accommodations List */}
      <div className="space-y-4">
        {loading && accommodations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Loading accommodation information...
          </div>
        ) : accommodations.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h4 className="text-lg font-semibold text-gray-700 mb-2">No Accommodations Added</h4>
            <p className="text-gray-500 mb-4">
              Start adding places to stay for this trip. Include hotels, vacation rentals, and more!
            </p>
          </div>
        ) : (
          accommodations.map(accommodation => (
            <div key={accommodation.id} className="p-4 rounded-lg border border-purple-200 bg-purple-50">
              {editingItem === accommodation.id ? (
                // Edit Form
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-semibold text-purple-900">Edit Accommodation</h4>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSaveEdit(accommodation.id)}
                        disabled={loading}
                        className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white px-3 py-1 rounded text-sm"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      >
                        {accommodationTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={editFormData.name}
                        onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <input
                        type="text"
                        value={editFormData.address}
                        onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
                      <input
                        type="date"
                        value={editFormData.checkIn}
                        onChange={(e) => setEditFormData({ ...editFormData, checkIn: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
                      <input
                        type="date"
                        value={editFormData.checkOut}
                        onChange={(e) => setEditFormData({ ...editFormData, checkOut: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                      <select
                        value={editFormData.roomType}
                        onChange={(e) => setEditFormData({ ...editFormData, roomType: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="">Select room type</option>
                        {roomTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cost ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={editFormData.cost}
                        onChange={(e) => setEditFormData({ ...editFormData, cost: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirmation Number</label>
                      <input
                        type="text"
                        value={editFormData.confirmationNumber}
                        onChange={(e) => setEditFormData({ ...editFormData, confirmationNumber: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      value={editFormData.notes}
                      onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
              ) : (
                // Display Mode
                <>
                  <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getAccommodationIcon(accommodation.type)}</span>
                  <div>
                    <h4 className="font-semibold text-purple-800">
                      {accommodation.name || accommodation.type}
                    </h4>
                    {(accommodation.location || accommodation.address) && (
                      <p className="text-sm text-purple-700 mt-1">{accommodation.location || accommodation.address}</p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditItem(accommodation)}
                    className="text-blue-600 hover:text-blue-800 p-1"
                    title="Edit lodging item"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteItem(accommodation.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                    title="Delete lodging item"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            
              {(accommodation.check_in_date || accommodation.check_out_date || accommodation.room_type || accommodation.cost) && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm mb-3">
                  {accommodation.check_in_date && (
                    <div>
                      <span className="font-medium text-gray-600">Check-in: </span>
                      <span className="text-purple-700">{accommodation.check_in_date}</span>
                    </div>
                  )}
                  {accommodation.check_out_date && (
                    <div>
                      <span className="font-medium text-gray-600">Check-out: </span>
                      <span className="text-purple-700">{accommodation.check_out_date}</span>
                      {accommodation.check_in_date && accommodation.check_out_date && (
                        <div className="text-xs text-purple-600 mt-1">
                          {calculateNights(accommodation.check_in_date, accommodation.check_out_date)}
                        </div>
                      )}
                    </div>
                  )}
                  {accommodation.room_type && (
                    <div>
                      <span className="font-medium text-gray-600">Room: </span>
                      <span className="text-purple-700">{accommodation.room_type}</span>
                    </div>
                  )}
                  {accommodation.cost && (
                    <div>
                      <span className="font-medium text-gray-600">Cost: </span>
                      <span className="text-purple-700">${accommodation.cost}</span>
                    </div>
                  )}
                </div>
              )}

              {(accommodation.confirmation_number || accommodation.notes) && (
                <div className="space-y-2 text-sm">
                  {accommodation.confirmation_number && (
                    <div>
                      <span className="font-medium text-gray-600">Confirmation: </span>
                      <span className="text-purple-700 font-mono">{accommodation.confirmation_number}</span>
                    </div>
                  )}
                  {accommodation.notes && (
                    <div>
                      <span className="font-medium text-gray-600">Notes: </span>
                      <span className="text-purple-700">{accommodation.notes}</span>
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

    </div>
  );
};

export default LodgingTab;