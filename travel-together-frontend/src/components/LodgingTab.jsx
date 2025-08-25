import React, { useState } from 'react';

const LodgingTab = ({ trip }) => {
  const [accommodations, setAccommodations] = useState([
    {
      id: 1,
      type: 'Hotel',
      name: '',
      address: '',
      checkIn: '',
      checkOut: '',
      roomType: '',
      cost: '',
      confirmationNumber: '',
      notes: '',
      isPlaceholder: true
    }
  ]);

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

  const handleAddAccommodation = () => {
    const newItem = {
      ...newAccommodation,
      id: Date.now(),
      isPlaceholder: false
    };
    setAccommodations([...accommodations, newItem]);
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
        Lodging & Accommodations
      </h3>

      {/* Add Accommodation Button */}
      <div className="mb-6">
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Accommodation
        </button>
      </div>

      {/* Accommodations List */}
      <div className="space-y-4">
        {accommodations.map(accommodation => (
          <div key={accommodation.id} className={`p-4 rounded-lg border ${
            accommodation.isPlaceholder 
              ? 'border-dashed border-gray-300 bg-gray-50' 
              : 'border-purple-200 bg-purple-50'
          }`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getAccommodationIcon(accommodation.type)}</span>
                <div>
                  <h4 className={`font-semibold ${
                    accommodation.isPlaceholder ? 'text-gray-500' : 'text-purple-800'
                  }`}>
                    {accommodation.name || `${accommodation.type} - Add Details`}
                  </h4>
                  {accommodation.address && (
                    <p className="text-sm text-purple-700 mt-1">{accommodation.address}</p>
                  )}
                </div>
              </div>
              {accommodation.isPlaceholder && (
                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                  Placeholder
                </span>
              )}
            </div>
            
            {(accommodation.checkIn || accommodation.checkOut || accommodation.roomType || accommodation.cost) && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm mb-3">
                {accommodation.checkIn && (
                  <div>
                    <span className="font-medium text-gray-600">Check-in: </span>
                    <span className="text-purple-700">{accommodation.checkIn}</span>
                  </div>
                )}
                {accommodation.checkOut && (
                  <div>
                    <span className="font-medium text-gray-600">Check-out: </span>
                    <span className="text-purple-700">{accommodation.checkOut}</span>
                    {accommodation.checkIn && accommodation.checkOut && (
                      <div className="text-xs text-purple-600 mt-1">
                        {calculateNights(accommodation.checkIn, accommodation.checkOut)}
                      </div>
                    )}
                  </div>
                )}
                {accommodation.roomType && (
                  <div>
                    <span className="font-medium text-gray-600">Room: </span>
                    <span className="text-purple-700">{accommodation.roomType}</span>
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

            {(accommodation.confirmationNumber || accommodation.notes) && (
              <div className="space-y-2 text-sm">
                {accommodation.confirmationNumber && (
                  <div>
                    <span className="font-medium text-gray-600">Confirmation: </span>
                    <span className="text-purple-700 font-mono">{accommodation.confirmationNumber}</span>
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
          </div>
        ))}
      </div>

      {/* Add Accommodation Form */}
      {showAddForm && (
        <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-purple-900 mb-4">Add Accommodation</h4>
          
          <form onSubmit={(e) => { e.preventDefault(); handleAddAccommodation(); }} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Accommodation Type
                </label>
                <select
                  value={newAccommodation.type}
                  onChange={(e) => setNewAccommodation({ ...newAccommodation, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  {accommodationTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={newAccommodation.name}
                  onChange={(e) => setNewAccommodation({ ...newAccommodation, name: e.target.value })}
                  placeholder="e.g., Grand Hotel Orlando"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={newAccommodation.address}
                  onChange={(e) => setNewAccommodation({ ...newAccommodation, address: e.target.value })}
                  placeholder="Full address or location"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-in Date
                </label>
                <input
                  type="date"
                  value={newAccommodation.checkIn}
                  onChange={(e) => setNewAccommodation({ ...newAccommodation, checkIn: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-out Date
                </label>
                <input
                  type="date"
                  value={newAccommodation.checkOut}
                  onChange={(e) => setNewAccommodation({ ...newAccommodation, checkOut: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room Type
                </label>
                <select
                  value={newAccommodation.roomType}
                  onChange={(e) => setNewAccommodation({ ...newAccommodation, roomType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Select room type</option>
                  {roomTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Cost ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newAccommodation.cost}
                  onChange={(e) => setNewAccommodation({ ...newAccommodation, cost: e.target.value })}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmation Number
                </label>
                <input
                  type="text"
                  value={newAccommodation.confirmationNumber}
                  onChange={(e) => setNewAccommodation({ ...newAccommodation, confirmationNumber: e.target.value })}
                  placeholder="Booking confirmation number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={newAccommodation.notes}
                onChange={(e) => setNewAccommodation({ ...newAccommodation, notes: e.target.value })}
                placeholder="Additional notes, amenities, special requests, etc."
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Add Accommodation
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

export default LodgingTab;