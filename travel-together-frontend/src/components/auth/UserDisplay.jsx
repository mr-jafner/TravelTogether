import React, { useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import UsernameEditModal from './UsernameEditModal';

const UserDisplay = () => {
  const { username, isLoggedIn, logout } = useUser();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  if (!isLoggedIn) {
    return null;
  }

  const handleLogout = () => {
    const result = logout();
    if (result.success) {
      setShowDropdown(false);
      // Force page refresh to trigger login modal
      window.location.reload();
    }
  };

  const handleEditUsername = () => {
    setShowDropdown(false);
    setShowEditModal(true);
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
  };

  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  return (
    <div className="relative">
      {/* User Info Button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
      >
        {/* Avatar */}
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-semibold">
            {getInitials(username)}
          </span>
        </div>
        
        {/* Username */}
        <div className="flex flex-col items-start min-w-0">
          <span className="text-xs text-blue-600 font-medium">Logged in as:</span>
          <span className="text-sm font-semibold text-gray-900 truncate max-w-32">
            {username}
          </span>
        </div>
        
        {/* Dropdown Arrow */}
        <svg
          className={`w-4 h-4 text-blue-600 transform transition-transform ${
            showDropdown ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <>
          {/* Backdrop to close dropdown */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />
          
          {/* Dropdown Content */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="p-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">{username}</p>
              <p className="text-xs text-gray-500">TravelTogether User</p>
            </div>
            
            <div className="p-2">
              <button
                onClick={handleEditUsername}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors mb-1"
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Edit Username</span>
                </div>
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Logout</span>
                </div>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Username Edit Modal */}
      <UsernameEditModal 
        isOpen={showEditModal} 
        onClose={handleEditModalClose}
        adminMode={false}
      />
    </div>
  );
};

export default UserDisplay;