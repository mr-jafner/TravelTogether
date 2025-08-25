import React, { useState } from 'react';

const LogisticsTab = ({ trip }) => {
  const [logisticsInfo, setLogisticsInfo] = useState({
    wifiNetworks: [
      { id: 1, location: 'Hotel WiFi', network: '', password: '', notes: '' }
    ],
    emergencyContacts: [
      { id: 1, name: '', phone: '', relationship: '', notes: '' }
    ],
    importantNumbers: [
      { id: 1, label: 'Hotel Front Desk', number: '', notes: '' },
      { id: 2, label: 'Local Emergency', number: '911', notes: 'US Emergency Services' },
      { id: 3, label: 'Rental Car Company', number: '', notes: '' }
    ],
    documents: [
      { id: 1, type: 'Passport/ID', location: '', notes: '', isImportant: true },
      { id: 2, type: 'Travel Insurance', location: '', notes: '', isImportant: true },
      { id: 3, type: 'Flight Tickets', location: '', notes: '', isImportant: true }
    ],
    generalNotes: ''
  });

  const [showAddForms, setShowAddForms] = useState({
    wifi: false,
    contact: false,
    number: false,
    document: false
  });

  const handleAddWifi = (newWifi) => {
    setLogisticsInfo(prev => ({
      ...prev,
      wifiNetworks: [...prev.wifiNetworks, { ...newWifi, id: Date.now() }]
    }));
    setShowAddForms(prev => ({ ...prev, wifi: false }));
  };

  const handleAddContact = (newContact) => {
    setLogisticsInfo(prev => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, { ...newContact, id: Date.now() }]
    }));
    setShowAddForms(prev => ({ ...prev, contact: false }));
  };

  const handleAddNumber = (newNumber) => {
    setLogisticsInfo(prev => ({
      ...prev,
      importantNumbers: [...prev.importantNumbers, { ...newNumber, id: Date.now() }]
    }));
    setShowAddForms(prev => ({ ...prev, number: false }));
  };

  const handleAddDocument = (newDocument) => {
    setLogisticsInfo(prev => ({
      ...prev,
      documents: [...prev.documents, { ...newDocument, id: Date.now() }]
    }));
    setShowAddForms(prev => ({ ...prev, document: false }));
  };

  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
        <svg className="w-7 h-7 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Trip Logistics & Information
      </h3>

      {/* WiFi Networks Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xl font-semibold text-indigo-800 flex items-center">
            📶 WiFi Networks
          </h4>
          <button
            onClick={() => setShowAddForms(prev => ({ ...prev, wifi: true }))}
            className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium py-1 px-3 rounded-lg transition-colors"
          >
            Add WiFi
          </button>
        </div>
        <div className="space-y-3">
          {logisticsInfo.wifiNetworks.map(wifi => (
            <div key={wifi.id} className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-indigo-700">Location:</label>
                  <input
                    type="text"
                    value={wifi.location}
                    onChange={(e) => {
                      const updated = logisticsInfo.wifiNetworks.map(w => 
                        w.id === wifi.id ? { ...w, location: e.target.value } : w
                      );
                      setLogisticsInfo(prev => ({ ...prev, wifiNetworks: updated }));
                    }}
                    placeholder="e.g., Hotel Lobby"
                    className="w-full px-3 py-2 border border-indigo-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-indigo-700">Network Name:</label>
                  <input
                    type="text"
                    value={wifi.network}
                    onChange={(e) => {
                      const updated = logisticsInfo.wifiNetworks.map(w => 
                        w.id === wifi.id ? { ...w, network: e.target.value } : w
                      );
                      setLogisticsInfo(prev => ({ ...prev, wifiNetworks: updated }));
                    }}
                    placeholder="WiFi network name"
                    className="w-full px-3 py-2 border border-indigo-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-indigo-700">Password:</label>
                  <input
                    type="text"
                    value={wifi.password}
                    onChange={(e) => {
                      const updated = logisticsInfo.wifiNetworks.map(w => 
                        w.id === wifi.id ? { ...w, password: e.target.value } : w
                      );
                      setLogisticsInfo(prev => ({ ...prev, wifiNetworks: updated }));
                    }}
                    placeholder="WiFi password"
                    className="w-full px-3 py-2 border border-indigo-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Contacts Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xl font-semibold text-red-800 flex items-center">
            🆘 Emergency Contacts
          </h4>
          <button
            onClick={() => setShowAddForms(prev => ({ ...prev, contact: true }))}
            className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-1 px-3 rounded-lg transition-colors"
          >
            Add Contact
          </button>
        </div>
        <div className="space-y-3">
          {logisticsInfo.emergencyContacts.map(contact => (
            <div key={contact.id} className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-sm font-medium text-red-700">Name:</label>
                  <input
                    type="text"
                    value={contact.name}
                    onChange={(e) => {
                      const updated = logisticsInfo.emergencyContacts.map(c => 
                        c.id === contact.id ? { ...c, name: e.target.value } : c
                      );
                      setLogisticsInfo(prev => ({ ...prev, emergencyContacts: updated }));
                    }}
                    placeholder="Contact name"
                    className="w-full px-3 py-2 border border-red-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-red-700">Phone:</label>
                  <input
                    type="tel"
                    value={contact.phone}
                    onChange={(e) => {
                      const updated = logisticsInfo.emergencyContacts.map(c => 
                        c.id === contact.id ? { ...c, phone: e.target.value } : c
                      );
                      setLogisticsInfo(prev => ({ ...prev, emergencyContacts: updated }));
                    }}
                    placeholder="Phone number"
                    className="w-full px-3 py-2 border border-red-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-red-700">Relationship:</label>
                  <input
                    type="text"
                    value={contact.relationship}
                    onChange={(e) => {
                      const updated = logisticsInfo.emergencyContacts.map(c => 
                        c.id === contact.id ? { ...c, relationship: e.target.value } : c
                      );
                      setLogisticsInfo(prev => ({ ...prev, emergencyContacts: updated }));
                    }}
                    placeholder="e.g., Spouse, Parent"
                    className="w-full px-3 py-2 border border-red-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-red-700">Notes:</label>
                  <input
                    type="text"
                    value={contact.notes}
                    onChange={(e) => {
                      const updated = logisticsInfo.emergencyContacts.map(c => 
                        c.id === contact.id ? { ...c, notes: e.target.value } : c
                      );
                      setLogisticsInfo(prev => ({ ...prev, emergencyContacts: updated }));
                    }}
                    placeholder="Additional info"
                    className="w-full px-3 py-2 border border-red-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Important Numbers Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xl font-semibold text-green-800 flex items-center">
            ☎️ Important Numbers
          </h4>
          <button
            onClick={() => setShowAddForms(prev => ({ ...prev, number: true }))}
            className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-1 px-3 rounded-lg transition-colors"
          >
            Add Number
          </button>
        </div>
        <div className="space-y-3">
          {logisticsInfo.importantNumbers.map(number => (
            <div key={number.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-green-700">Label:</label>
                  <input
                    type="text"
                    value={number.label}
                    onChange={(e) => {
                      const updated = logisticsInfo.importantNumbers.map(n => 
                        n.id === number.id ? { ...n, label: e.target.value } : n
                      );
                      setLogisticsInfo(prev => ({ ...prev, importantNumbers: updated }));
                    }}
                    placeholder="e.g., Hotel Front Desk"
                    className="w-full px-3 py-2 border border-green-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-700">Number:</label>
                  <input
                    type="tel"
                    value={number.number}
                    onChange={(e) => {
                      const updated = logisticsInfo.importantNumbers.map(n => 
                        n.id === number.id ? { ...n, number: e.target.value } : n
                      );
                      setLogisticsInfo(prev => ({ ...prev, importantNumbers: updated }));
                    }}
                    placeholder="Phone number"
                    className="w-full px-3 py-2 border border-green-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-700">Notes:</label>
                  <input
                    type="text"
                    value={number.notes}
                    onChange={(e) => {
                      const updated = logisticsInfo.importantNumbers.map(n => 
                        n.id === number.id ? { ...n, notes: e.target.value } : n
                      );
                      setLogisticsInfo(prev => ({ ...prev, importantNumbers: updated }));
                    }}
                    placeholder="Additional info"
                    className="w-full px-3 py-2 border border-green-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Important Documents Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xl font-semibold text-yellow-800 flex items-center">
            📄 Important Documents
          </h4>
          <button
            onClick={() => setShowAddForms(prev => ({ ...prev, document: true }))}
            className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium py-1 px-3 rounded-lg transition-colors"
          >
            Add Document
          </button>
        </div>
        <div className="space-y-3">
          {logisticsInfo.documents.map(document => (
            <div key={document.id} className={`border rounded-lg p-4 ${
              document.isImportant ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-yellow-700">Document Type:</label>
                  <input
                    type="text"
                    value={document.type}
                    onChange={(e) => {
                      const updated = logisticsInfo.documents.map(d => 
                        d.id === document.id ? { ...d, type: e.target.value } : d
                      );
                      setLogisticsInfo(prev => ({ ...prev, documents: updated }));
                    }}
                    placeholder="e.g., Passport, Insurance"
                    className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-yellow-700">Location/Status:</label>
                  <input
                    type="text"
                    value={document.location}
                    onChange={(e) => {
                      const updated = logisticsInfo.documents.map(d => 
                        d.id === document.id ? { ...d, location: e.target.value } : d
                      );
                      setLogisticsInfo(prev => ({ ...prev, documents: updated }));
                    }}
                    placeholder="e.g., In wallet, Email attachment"
                    className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-yellow-700">Notes:</label>
                  <input
                    type="text"
                    value={document.notes}
                    onChange={(e) => {
                      const updated = logisticsInfo.documents.map(d => 
                        d.id === document.id ? { ...d, notes: e.target.value } : d
                      );
                      setLogisticsInfo(prev => ({ ...prev, documents: updated }));
                    }}
                    placeholder="Expiry date, policy number, etc."
                    className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* General Notes Section */}
      <div>
        <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          📝 General Trip Notes
        </h4>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <textarea
            value={logisticsInfo.generalNotes}
            onChange={(e) => setLogisticsInfo(prev => ({ ...prev, generalNotes: e.target.value }))}
            placeholder="Add any general notes, reminders, or important information about the trip..."
            rows="6"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500 resize-vertical"
          />
        </div>
      </div>
    </div>
  );
};

export default LogisticsTab;