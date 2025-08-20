import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import TripList from './components/TripList'
import TripDetail from './components/TripDetail';

// Temporary placeholder components (you'll build these later)
function Dashboard() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dashboard</h1>
      <p>Welcome to TravelTogether! This is your main dashboard.</p>
      <p>You can add trip overviews, recent activity, and quick actions here.</p>
    </div>
  );
}

function MyTrips() {
  return (
    <div style={{ padding: '2rem' }}>
        <button style={{ 
        backgroundColor: '#2563eb', 
        color: 'white', 
        padding: '0.5rem 1rem', 
        border: 'none', 
        borderRadius: '0.375rem',
        cursor: 'pointer'
      }}>
        + Create New Trip
      </button>
      <h1>My Trips</h1>
      <p>Here you'll see all your trips - past, current, and upcoming.</p>
      <TripList />
    </div>
  );
}

function Feed() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Social Feed</h1>
      <p>See what other travelers are sharing and post your own updates!</p>
      <div style={{ 
        backgroundColor: '#f9fafb', 
        padding: '1rem', 
        borderRadius: '0.5rem', 
        marginTop: '1rem',
        border: '1px solid #e5e7eb'
      }}>
        <p><strong>Sample Post:</strong> "Just arrived in Paris! The weather is perfect 🌟"</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter  basename="/traveltogether">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/trips" element={<MyTrips />} />
          <Route path="/trips/:tripId" element={<TripDetail />} />
          <Route path="/feed" element={<Feed />} />
          {/* Add more routes as you build components */}
        </Routes>
        
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          TravelTogether ✈️
        </h1>
        <p className="text-gray-600 mb-6">
          Tailwind CSS is working! Ready to build amazing travel experiences.
        </p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
          Create Your First Trip
        </button>
      </div>
    </div>
      </main>
    </BrowserRouter>

    
  );
}

export default App;
