import React, { useState } from 'react';

const ItineraryTab = ({ trip }) => {
  const [scheduleItems, setScheduleItems] = useState([
    {
      id: 1,
      date: trip.startDate,
      time: '09:00',
      title: 'Check-in / Arrival',
      type: 'logistics',
      duration: '1 hour',
      notes: '',
      isPlaceholder: true
    },
    {
      id: 2,
      date: trip.endDate,
      time: '11:00',
      title: 'Check-out / Departure',
      type: 'logistics',
      duration: '2 hours',
      notes: '',
      isPlaceholder: true
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newScheduleItem, setNewScheduleItem] = useState({
    date: trip.startDate || '',
    time: '',
    title: '',
    type: 'activity',
    duration: '',
    notes: ''
  });

  const itemTypes = [
    { value: 'activity', label: 'Activity', color: 'blue', icon: '🎯' },
    { value: 'meal', label: 'Meal/Restaurant', color: 'orange', icon: '🍽️' },
    { value: 'travel', label: 'Travel/Transport', color: 'green', icon: '🚗' },
    { value: 'lodging', label: 'Check-in/out', color: 'purple', icon: '🏨' },
    { value: 'logistics', label: 'Logistics', color: 'gray', icon: '📋' },
    { value: 'free', label: 'Free Time', color: 'yellow', icon: '🌟' }
  ];

  const handleAddScheduleItem = () => {
    const newItem = {
      ...newScheduleItem,
      id: Date.now(),
      isPlaceholder: false
    };
    setScheduleItems(prev => [...prev, newItem].sort((a, b) => 
      new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`)
    ));
    setNewScheduleItem({
      date: trip.startDate || '',
      time: '',
      title: '',
      type: 'activity',
      duration: '',
      notes: ''
    });
    setShowAddForm(false);
  };

  const getTypeConfig = (type) => {
    return itemTypes.find(t => t.value === type) || itemTypes[0];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Group items by date
  const itemsByDate = scheduleItems.reduce((groups, item) => {
    const date = item.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {});

  // Sort dates
  const sortedDates = Object.keys(itemsByDate).sort((a, b) => new Date(a) - new Date(b));

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
        <svg className="w-7 h-7 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Trip Itinerary & Schedule
      </h3>

      {/* Add Schedule Item Button */}
      <div className="mb-6">
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add to Schedule
        </button>
      </div>

      {/* Timeline View */}
      <div className="space-y-6">
        {sortedDates.map(date => (
          <div key={date} className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Date Header */}
            <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
              <h4 className="text-lg font-semibold text-gray-800">
                {formatDate(date)}
              </h4>
            </div>

            {/* Timeline Items */}
            <div className="divide-y divide-gray-200">
              {itemsByDate[date]
                .sort((a, b) => (a.time || '00:00').localeCompare(b.time || '00:00'))
                .map((item, index) => {
                  const typeConfig = getTypeConfig(item.type);
                  return (
                    <div key={item.id} className="px-6 py-4 flex items-start space-x-4">
                      {/* Timeline Dot */}
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full bg-${typeConfig.color}-100 border-2 border-${typeConfig.color}-300 flex items-center justify-center text-lg`}>
                          {typeConfig.icon}
                        </div>
                        {index < itemsByDate[date].length - 1 && (
                          <div className="w-px h-8 bg-gray-300 mt-2"></div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              {item.time && (
                                <span className={`text-sm font-medium text-${typeConfig.color}-600`}>
                                  {formatTime(item.time)}
                                </span>
                              )}
                              <span className={`text-xs px-2 py-1 rounded-full bg-${typeConfig.color}-100 text-${typeConfig.color}-800`}>
                                {typeConfig.label}
                              </span>
                              {item.isPlaceholder && (
                                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                                  Placeholder
                                </span>
                              )}
                            </div>
                            <h5 className={`text-lg font-semibold mt-1 ${
                              item.isPlaceholder ? 'text-gray-500' : `text-${typeConfig.color}-900`
                            }`}>
                              {item.title || 'Add details...'}
                            </h5>
                            {item.duration && (
                              <p className="text-sm text-gray-600 mt-1">
                                Duration: {item.duration}
                              </p>
                            )}
                            {item.notes && (
                              <p className="text-sm text-gray-700 mt-2">
                                {item.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      {/* Add Schedule Item Form */}
      {showAddForm && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-blue-900 mb-4">Add Schedule Item</h4>
          
          <form onSubmit={(e) => { e.preventDefault(); handleAddScheduleItem(); }} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={newScheduleItem.date}
                  onChange={(e) => setNewScheduleItem({ ...newScheduleItem, date: e.target.value })}
                  min={trip.startDate}
                  max={trip.endDate}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  value={newScheduleItem.time}
                  onChange={(e) => setNewScheduleItem({ ...newScheduleItem, time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={newScheduleItem.type}
                  onChange={(e) => setNewScheduleItem({ ...newScheduleItem, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {itemTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newScheduleItem.title}
                  onChange={(e) => setNewScheduleItem({ ...newScheduleItem, title: e.target.value })}
                  placeholder="e.g., Visit Central Park, Dinner at Italian Restaurant"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  value={newScheduleItem.duration}
                  onChange={(e) => setNewScheduleItem({ ...newScheduleItem, duration: e.target.value })}
                  placeholder="e.g., 2 hours, All day"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={newScheduleItem.notes}
                onChange={(e) => setNewScheduleItem({ ...newScheduleItem, notes: e.target.value })}
                placeholder="Additional notes, location details, reminders, etc."
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Add to Schedule
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

      {/* Quick Actions for Adding from Other Tabs */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h5 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions:</h5>
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="text-gray-600">💡 Tip: Add activities and restaurants from their respective tabs to automatically include them in your schedule.</span>
        </div>
      </div>
    </div>
  );
};

export default ItineraryTab;