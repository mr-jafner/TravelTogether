import React, { useState, useEffect } from 'react';
import { tripApi } from '../services/api';

const LogisticsTab = ({ trip, onLogisticsUpdate }) => {
  const [logisticsItems, setLogisticsItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [newLogisticsItem, setNewLogisticsItem] = useState({
    type: 'contact',
    details: '',
    notes: ''
  });

  const logisticsTypes = [
    'contact', 'document', 'wifi', 'important-number', 'note', 'other'
  ];

  // Load logistics data on component mount
  useEffect(() => {
    const loadLogisticsData = async () => {
      if (!trip?.id) return;
      
      try {
        setLoading(true);
        setError(null);
        const logisticsData = await tripApi.getLogisticsInfo(trip.id);
        setLogisticsItems(logisticsData || []);
      } catch (error) {
        console.error('Failed to load logistics data:', error);
        setError('Failed to load logistics information');
      } finally {
        setLoading(false);
      }
    };

    loadLogisticsData();
  }, [trip?.id]);

  const handleAddLogisticsItem = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Prepare logistics data for backend
      const logisticsData = {
        category: newLogisticsItem.type, // Backend expects 'category'
        name: newLogisticsItem.details,  // Backend expects 'name' 
        details: newLogisticsItem.notes,
        additionalInfo: null
      };

      const result = await tripApi.addLogisticsInfo(trip.id, logisticsData);
      setLogisticsItems([...logisticsItems, result]);
      
      setNewLogisticsItem({
        type: 'contact',
        details: '',
        notes: ''
      });
      setShowAddForm(false);
      
      if (onLogisticsUpdate) {
        onLogisticsUpdate();
      }
    } catch (error) {
      console.error('Failed to add logistics item:', error);
      setError('Failed to add logistics item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item.id);
    setEditFormData({
      type: item.category || item.type || 'contact',
      details: item.name || '',
      notes: item.details || item.additional_info || ''
    });
  };

  const handleSaveEdit = async (itemId) => {
    try {
      setLoading(true);
      setError(null);
      
      const logisticsData = {
        category: editFormData.type,
        name: editFormData.details,
        details: editFormData.notes,
        additionalInfo: null
      };

      await tripApi.updateLogisticsInfo(trip.id, itemId, logisticsData);
      
      // Refresh the data
      const logisticsData_updated = await tripApi.getLogisticsInfo(trip.id);
      setLogisticsItems(logisticsData_updated || []);
      
      setEditingItem(null);
      setEditFormData({});
      
      if (onLogisticsUpdate) {
        onLogisticsUpdate();
      }
    } catch (error) {
      console.error('Failed to update logistics item:', error);
      setError('Failed to update logistics item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditFormData({});
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this logistics item?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await tripApi.deleteLogisticsInfo(trip.id, itemId);
      
      // Refresh the data
      const logisticsData = await tripApi.getLogisticsInfo(trip.id);
      setLogisticsItems(logisticsData || []);
      
      if (onLogisticsUpdate) {
        onLogisticsUpdate();
      }
    } catch (error) {
      console.error('Failed to delete logistics item:', error);
      setError('Failed to delete logistics item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getLogisticsIcon = (type) => {
    const icons = {
      contact: '👤',
      document: '📄',
      wifi: '📶',
      'important-number': '☎️',
      note: '📝',
      other: '📋'
    };
    return icons[type] || '📋';
  };

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
        <svg className="w-7 h-7 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Trip Logistics & Information ({logisticsItems.length})
      </h3>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Add Logistics Item Button */}
      <div className="mb-6">
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Logistics Item
        </button>
      </div>

      {/* Logistics Items */}
      <div className="space-y-4">
        {loading && logisticsItems.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Loading logistics information...
          </div>
        ) : logisticsItems.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h4 className="text-lg font-semibold text-gray-700 mb-2">No Logistics Information Added</h4>
            <p className="text-gray-500 mb-4">
              Start adding important trip information like contacts, documents, and notes!
            </p>
          </div>
        ) : (
          logisticsItems.map(item => (
            <div key={item.id} className="p-4 rounded-lg border border-indigo-200 bg-indigo-50">
              {editingItem === item.id ? (
                // Edit Form
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-semibold text-indigo-900">Edit Logistics Item</h4>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSaveEdit(item.id)}
                        disabled={loading}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white px-3 py-1 rounded text-sm"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        {logisticsTypes.map(type => (
                          <option key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
                      <input
                        type="text"
                        value={editFormData.details}
                        onChange={(e) => setEditFormData({ ...editFormData, details: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      value={editFormData.notes}
                      onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              ) : (
                // Display Mode
                <>
                  <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getLogisticsIcon(item.category || item.type)}</span>
                  <div>
                    <h4 className="font-semibold text-indigo-800 capitalize">
                      {item.name || (item.category || item.type).replace('-', ' ')}
                    </h4>
                    {item.details && (
                      <p className="text-sm text-indigo-700 mt-1">{item.details}</p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditItem(item)}
                    className="text-blue-600 hover:text-blue-800 p-1"
                    title="Edit logistics item"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                    title="Delete logistics item"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {(item.notes || item.additional_info) && (
                <div className="mt-3 text-sm">
                  <span className="font-medium text-gray-600">Notes: </span>
                  <span className="text-indigo-700">{item.notes || item.additional_info}</span>
                </div>
              )}
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Logistics Item Form */}
      {showAddForm && (
        <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-indigo-900 mb-4">Add Logistics Item</h4>
          
          <form onSubmit={(e) => { e.preventDefault(); handleAddLogisticsItem(); }} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={newLogisticsItem.type}
                  onChange={(e) => setNewLogisticsItem({ ...newLogisticsItem, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {logisticsTypes.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Details
                </label>
                <input
                  type="text"
                  value={newLogisticsItem.details}
                  onChange={(e) => setNewLogisticsItem({ ...newLogisticsItem, details: e.target.value })}
                  placeholder="e.g., Emergency contact, WiFi password, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={newLogisticsItem.notes}
                onChange={(e) => setNewLogisticsItem({ ...newLogisticsItem, notes: e.target.value })}
                placeholder="Additional notes or information"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {loading ? 'Adding...' : 'Add Item'}
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

export default LogisticsTab;