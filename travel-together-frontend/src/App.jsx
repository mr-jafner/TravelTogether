import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import ttLogo from './assets/TT_logo_nobg.png'
import './App.css'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import TripList from './components/TripList'
import TripDetail from './components/TripDetail';
import TripCreation from './components/TripCreation';
import HomeDashboard from './features/dashboard/HomeDashboard';
import { UserProvider, useUser } from './contexts/UserContext';
import LoginModal from './components/auth/LoginModal';
import AdminUsernameManager from './components/auth/AdminUsernameManager';

function MyTrips() {
  const navigate = useNavigate();

  const handleCreateTrip = () => {
    navigate('/trips/create');
  };

  return (
    <div style={{ padding: '2rem' }}>
        <button 
        onClick={handleCreateTrip}
        style={{ 
        backgroundColor: '#f97316', 
        color: 'white', 
        padding: '0.5rem 1rem', 
        border: 'none', 
        borderRadius: '0.375rem',
        cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = '#ea580c';
        e.target.style.transform = 'translateY(-1px)';
        e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = '#f97316';
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
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

function WelcomeSection() {
  const navigate = useNavigate();

  const handleCreateFirstTrip = () => {
    navigate('/trips/create');
  };

  return (
    <div className="bg-gradient-to-br from-cyan-400 via-teal-400 to-orange-400 py-12 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm text-center">
        <img 
          src={ttLogo} 
          alt="TravelTogether Logo" 
          className="logo travel mx-auto mb-4" 
          style={{ height: '3em' }}
        />
        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          TravelTogether
        </h1>
        <p className="text-gray-600 mb-4 text-sm">
          Ready to build amazing travel experiences together. Start planning your next adventure!
        </p>
        <button 
          onClick={handleCreateFirstTrip}
          className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg"
        >
          Create Your First Trip
        </button>
      </div>
    </div>
  );
}

// Main app component with user authentication
function AppContent() {
  const { isLoggedIn, isLoading } = useUser();
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Show/hide login modal based on login state
  useEffect(() => {
    if (!isLoading) {
      if (!isLoggedIn) {
        setShowLoginModal(true);
      } else {
        setShowLoginModal(false);
      }
    }
  }, [isLoggedIn, isLoading]);

  const handleLoginModalClose = () => {
    // Only allow closing if user is logged in
    if (isLoggedIn) {
      setShowLoginModal(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading TravelTogether...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomeDashboard />} />
          <Route path="/trips" element={<MyTrips />} />
          <Route path="/trips/create" element={<TripCreation />} />
          <Route path="/trips/:tripId" element={<TripDetail />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/admin/users" element={<AdminUsernameManager />} />
          {/* Add more routes as you build components */}
        </Routes>
        
        <WelcomeSection />
      </main>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={handleLoginModalClose}
      />
    </>
  );
}

function App() {
  return (
    <UserProvider>
      <BrowserRouter basename="/traveltogether">
        <AppContent />
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
