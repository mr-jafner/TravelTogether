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
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/trips" element={<MyTrips />} />
          <Route path="/trips/:tripId" element={<TripDetail />} />
          <Route path="/feed" element={<Feed />} />
          {/* Add more routes as you build components */}
        </Routes>
        
        <div className="bg-blue-500 text-white p-4">
      <h1 className="text-2xl font-bold">TravelTogether ✈️</h1>
      <p className="mt-2">Tailwind should be working now!</p>
    </div>

      </main>
    </BrowserRouter>

    
  );
}

export default App;
