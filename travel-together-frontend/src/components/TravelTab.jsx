import React, { useState } from 'react';

const TravelTab = ({ trip }) => {
  const [transportationItems, setTransportationItems] = useState([
    {
      id: 1,
      type: 'Flight',
      description: 'Outbound Flight',
      details: '',
      date: '',
      time: '',
      cost: '',
      notes: '',
      isPlaceholder: true
    },
    {
      id: 2,
      type: 'Flight',
      description: 'Return Flight',
      details: '',
      date: '',
      time: '',
      cost: '',
      notes: '',
      isPlaceholder: true
    }
  ]);

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

  const handleAddTransportation = () => {
    const newItem = {
      ...newTransportation,
      id: Date.now(),
      isPlaceholder: false
    };
    setTransportationItems([...transportationItems, newItem]);
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
        Travel & Transportation
      </h3>

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
        {transportationItems.map(item => (
          <div key={item.id} className={`p-4 rounded-lg border ${
            item.isPlaceholder 
              ? 'border-dashed border-gray-300 bg-gray-50' 
              : 'border-green-200 bg-green-50'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getTransportationIcon(item.type)}</span>
                <div>
                  <h4 className={`font-semibold ${
                    item.isPlaceholder ? 'text-gray-500' : 'text-green-800'
                  }`}>
                    {item.description || `${item.type} - Add Details`}
                  </h4>
                  {item.details && (
                    <p className="text-sm text-green-700 mt-1">{item.details}</p>
                  )}
                </div>
              </div>
              {item.isPlaceholder && (
                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                  Placeholder
                </span>
              )}
            </div>
            
            {(item.date || item.time || item.cost || item.notes) && (
              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                {item.date && (
                  <div>
                    <span className="font-medium text-gray-600">Date: </span>
                    <span className="text-green-700">{item.date}</span>
                  </div>
                )}
                {item.time && (
                  <div>
                    <span className="font-medium text-gray-600">Time: </span>
                    <span className="text-green-700">{item.time}</span>
                  </div>
                )}
                {item.cost && (
                  <div>
                    <span className="font-medium text-gray-600">Cost: </span>
                    <span className="text-green-700">${item.cost}</span>
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
          </div>
        ))}
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
                className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Add Transportation
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