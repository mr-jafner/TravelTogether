import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Calendar, Map, Heart, Share2, Vote, 
  AlertTriangle, CheckCircle, Clock, Camera
} from 'lucide-react';
import { tripApi, transformTripForFrontend } from '../../services/api';
import { useUserTripFiltering } from '../../hooks/useUserTripFiltering';
import TripFilterToggle from '../../components/common/TripFilterToggle';
import { getTripContextMessage } from '../../components/common/TripContextMessage';

// Demo data matching the MVP prototype
const demoData = {
  trips: [
    { 
      id: "paris", 
      name: "Paris", 
      destination: "Paris, France",
      starts: "2025-05-15", 
      daysAway: 14, 
      next: "Louvre visit · Fri 15:00", 
      status: { polls: 2, conflicts: 1 }, 
      myRole: "organizer",
      draft: false 
    },
    { 
      id: "tahoe", 
      name: "Lake Tahoe", 
      destination: "Lake Tahoe, CA",
      starts: "2025-07-06", 
      daysAway: 62, 
      next: "Cabin check-in Fri 4pm", 
      status: { polls: 0, conflicts: 0 }, 
      myRole: "member",
      draft: false 
    },
    { 
      id: "bcn", 
      name: "Barcelona", 
      destination: "Barcelona, Spain",
      starts: null, 
      daysAway: null, 
      next: "Build your itinerary", 
      status: { polls: 0, conflicts: 0 }, 
      myRole: "organizer",
      draft: true 
    }
  ],
  todos: [
    { 
      id: "poll_paris_dinner", 
      kind: "poll", 
      title: "Vote: Dinner in Paris?", 
      detail: "3 options", 
      status: "pending", 
      trip: "paris" 
    },
    { 
      id: "poll_tahoe_hike", 
      kind: "poll", 
      title: "Poll: Lake Tahoe hike route", 
      detail: "2 options", 
      status: "voted", 
      trip: "tahoe" 
    },
    { 
      id: "conflict_satnight", 
      kind: "conflict", 
      title: "Conflict: Moulin Rouge vs Cruise", 
      detail: "Sat night overlap", 
      status: "needs", 
      trip: "paris" 
    }
  ],
  photos: [
    { id: 1, alt: "Eiffel at sunset", trip: "paris" },
    { id: 2, alt: "Seine cruise", trip: "paris" },
    { id: 3, alt: "Louvre glass", trip: "paris" },
    { id: 4, alt: "Tahoe trail", trip: "tahoe" },
    { id: 5, alt: "Cabin deck", trip: "tahoe" },
    { id: 6, alt: "Sagrada sketch", trip: "bcn" }
  ],
  feed: [
    { id: 1, user: "Alice", text: "Posted a new photo in Paris", when: "2h", likes: 12 },
    { id: 2, user: "Ben", text: "Liked your Lake Tahoe post", when: "4h", likes: 1 },
    { id: 3, user: "Emma", text: "\"Excited for Eiffel Tower!\"", when: "1d", likes: 6 }
  ]
};

function HomeDashboard() {
  const navigate = useNavigate();
  const [allTrips, setAllTrips] = useState([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('map');
  
  // Use the reusable filtering hook
  const {
    filteredTrips: filteredTripData,
    tripStats,
    viewMode,
    setViewMode,
    isLoggedIn
  } = useUserTripFiltering(allTrips);

  // Transform backend trip data to dashboard format
  const transformTripData = (trips) => {
    const transformedTrips = trips.map(trip => {
      const startDate = trip.startDate ? new Date(trip.startDate) : null;
      const today = new Date();
      const daysAway = startDate ? Math.ceil((startDate - today) / (1000 * 60 * 60 * 24)) : null;
      
      return {
        id: trip.id,
        name: trip.name,
        destination: Array.isArray(trip.destinations) ? trip.destinations.join(', ') : trip.destinations || 'No destination set',
        starts: trip.startDate,
        daysAway: daysAway > 0 ? daysAway : null,
        next: trip.startDate ? `Trip starts ${startDate?.toLocaleDateString()}` : 'Set trip dates',
        status: { 
          polls: 0, // Could derive from trip activities/restaurants that need votes
          conflicts: 0 // Could derive from overlapping activities or missing info
        },
        myRole: 'organizer', // Could be derived from user relationship to trip
        draft: !trip.startDate || !trip.endDate || !trip.destinations
      };
    });

    return {
      trips: transformedTrips,
      todos: demoData.todos, // Keep demo todos for now - these would be derived from trip issues
      photos: demoData.photos, // Keep demo photos - these would come from social features later
      feed: demoData.feed // Keep demo feed - this would come from user activity
    };
  };

  // Load data (demo mode or API)
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (import.meta.env.VITE_DEMO_MODE === 'true') {
          // Use demo data
          setTimeout(() => {
            setData(demoData);
            setLoading(false);
          }, 500);
        } else {
          // Fetch real trip data from backend
          const trips = await tripApi.getAllTrips();
          const transformedTrips = trips.map(transformTripForFrontend);
          setAllTrips(transformedTrips);
          
          const dashboardData = transformTripData(transformedTrips);
          setData(dashboardData);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Fallback to demo data
        setData(demoData);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleVote = (todoId) => {
    setData(prev => ({
      ...prev,
      todos: prev.todos.map(todo => 
        todo.id === todoId 
          ? { ...todo, status: todo.status === 'voted' ? 'pending' : 'voted' }
          : todo
      )
    }));
  };

  const handleResolve = (todoId) => {
    setData(prev => ({
      ...prev,
      todos: prev.todos.map(todo => 
        todo.id === todoId 
          ? { ...todo, status: 'done' }
          : todo
      )
    }));
  };

  const handleLike = (feedId) => {
    setData(prev => ({
      ...prev,
      feed: prev.feed.map(post => 
        post.id === feedId 
          ? { ...post, likes: post.likes + 1 }
          : post
      )
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">TravelTogether</h1>
              <span className="px-2 sm:px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs sm:text-sm">
                Dashboard
              </span>
              
              {/* Trip Filter Toggle */}
              <TripFilterToggle
                viewMode={viewMode}
                setViewMode={setViewMode}
                tripStats={tripStats}
                isLoggedIn={isLoggedIn}
                size="small"
                className="ml-2"
              />
            </div>
            <div className="flex gap-1 sm:gap-2 flex-wrap">
              <button 
                onClick={() => navigate('/trips/create')}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Create New Trip</span>
                <span className="sm:hidden">Create</span>
              </button>
              <button className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                <Vote className="h-4 w-4" />
                <span className="hidden sm:inline">Poll</span>
              </button>
              <button className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                <Camera className="h-4 w-4" />
                <span className="hidden sm:inline">Photo</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Upcoming Trips */}
        <motion.section 
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            {viewMode === 'myTrips' ? 'My Upcoming Trips' : 'All Upcoming Trips'}
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            {import.meta.env.VITE_DEMO_MODE === 'true' 
              ? 'Your next adventures at a glance.'
              : getTripContextMessage(isLoggedIn, viewMode, tripStats)
            }
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 overflow-x-auto">
            {(import.meta.env.VITE_DEMO_MODE === 'true' ? data.trips : transformTripData(filteredTripData).trips).map((trip, index) => (
              <motion.div
                key={trip.id}
                className="bg-gradient-to-b from-blue-50 to-white border border-blue-100 rounded-2xl p-4 min-w-0"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3 className="font-semibold text-gray-900 mb-2">{trip.name}</h3>
                <div className="space-y-1 text-sm text-gray-600 mb-3">
                  <p>{trip.daysAway ? `${trip.daysAway} days away` : 'No date yet'}</p>
                  <p>Next: {trip.next}</p>
                </div>
                
                {/* Status Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {trip.status.conflicts > 0 && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs">
                      <AlertTriangle className="h-3 w-3" />
                      {trip.status.conflicts} conflicts
                    </span>
                  )}
                  {trip.status.polls > 0 && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full text-xs">
                      <Clock className="h-3 w-3" />
                      {trip.status.polls} polls open
                    </span>
                  )}
                  {trip.status.polls === 0 && trip.status.conflicts === 0 && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs">
                      <CheckCircle className="h-3 w-3" />
                      All set
                    </span>
                  )}
                  {trip.draft && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 border border-gray-200 rounded-full text-xs">
                      Draft
                    </span>
                  )}
                </div>
                
                <button 
                  onClick={() => navigate(`/trips/${trip.id}`)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Open Trip
                </button>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Split Layout: Todos & Social */}
        <div className="space-y-6 lg:grid lg:grid-cols-3 lg:gap-6 lg:space-y-0">
          {/* To-Dos & Polls */}
          <motion.section 
            className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Your To-Dos & Polls</h2>
            <p className="text-gray-600 text-sm mb-6">Vote on plans, resolve conflicts, finish tasks.</p>
            
            <div className="space-y-3">
              {data.todos.map((todo) => (
                <div
                  key={todo.id}
                  className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{todo.title}</h4>
                      <p className="text-gray-600 text-sm">{todo.detail}</p>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      {todo.kind === 'poll' && (
                        <button
                          onClick={() => handleVote(todo.id)}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0"
                        >
                          {todo.status === 'voted' ? 'Change Vote' : 'Vote'}
                        </button>
                      )}
                      {todo.kind === 'conflict' && (
                        <button
                          onClick={() => handleResolve(todo.id)}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors flex-shrink-0"
                        >
                          Resolve
                        </button>
                      )}
                      <span className={`text-sm flex items-center gap-1 flex-shrink-0 ${
                        todo.status === 'voted' || todo.status === 'done' 
                          ? 'text-green-600' 
                          : todo.status === 'needs' 
                            ? 'text-red-600' 
                            : 'text-yellow-600'
                      }`}>
                        {todo.status === 'voted' && <><CheckCircle className="h-4 w-4" /> <span className="hidden sm:inline">Voted</span></>}
                        {todo.status === 'pending' && <><Clock className="h-4 w-4" /> <span className="hidden sm:inline">Pending</span></>}
                        {todo.status === 'needs' && <><AlertTriangle className="h-4 w-4" /> <span className="hidden sm:inline">Needs resolution</span></>}
                        {todo.status === 'done' && <><CheckCircle className="h-4 w-4" /> <span className="hidden sm:inline">Resolved</span></>}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Social Highlights & Map/Calendar */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* Social Highlights */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Social Highlights</h2>
              <p className="text-gray-600 text-sm mb-6">Recent photos & posts from your trips.</p>
              
              {/* Photo Gallery */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {data.photos.slice(0, 4).map((photo) => (
                  <div
                    key={photo.id}
                    className="aspect-square bg-pink-50 border-2 border-dashed border-pink-200 rounded-xl flex items-center justify-center text-pink-700 text-sm text-center p-2"
                  >
                    {photo.alt}
                  </div>
                ))}
              </div>
              
              {/* Feed */}
              <div className="space-y-3">
                {data.feed.map((post) => (
                  <div key={post.id} className="p-4 bg-pink-50 border border-pink-200 rounded-xl">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-gray-600 text-sm">{post.user} • {post.when}</span>
                      <span className="text-gray-500 text-xs">Trip activity</span>
                    </div>
                    <p className="text-gray-900 mb-3">{post.text}</p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleLike(post.id)}
                        className="flex items-center gap-1 text-pink-600 text-sm hover:text-pink-700"
                      >
                        <Heart className="h-4 w-4" />
                        Like ({post.likes})
                      </button>
                      <button className="flex items-center gap-1 text-gray-600 text-sm hover:text-gray-700">
                        <Share2 className="h-4 w-4" />
                        Share
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Map/Calendar Tabs - PLACEHOLDER */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  onClick={() => setActiveTab('map')}
                  className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                    activeTab === 'map'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Map className="h-4 w-4" />
                  Map
                </button>
                <button
                  onClick={() => setActiveTab('calendar')}
                  className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                    activeTab === 'calendar'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Calendar className="h-4 w-4" />
                  Calendar
                </button>
              </div>
              
              <div className="h-64 bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                {activeTab === 'map' ? (
                  <div className="h-full relative">
                    {/* Fake Map View */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-green-50 to-blue-50">
                      {/* Fake map markers */}
                      <div className="absolute top-12 left-8 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-sm"></div>
                      <div className="absolute top-20 right-12 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-sm"></div>
                      <div className="absolute bottom-16 left-16 w-3 h-3 bg-orange-500 rounded-full border-2 border-white shadow-sm"></div>
                      
                      {/* Fake roads */}
                      <div className="absolute top-16 left-0 w-full h-0.5 bg-gray-400 opacity-30 rotate-12"></div>
                      <div className="absolute top-32 left-0 w-full h-0.5 bg-gray-400 opacity-30 -rotate-6"></div>
                      
                      {/* Map controls */}
                      <div className="absolute top-4 right-4 bg-white rounded shadow-sm p-1">
                        <div className="w-6 h-6 flex items-center justify-center text-xs text-gray-600">+</div>
                        <div className="w-6 h-6 flex items-center justify-center text-xs text-gray-600 border-t">−</div>
                      </div>
                    </div>
                    <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded text-xs text-gray-600">
                      📍 Paris, Tahoe, Barcelona
                    </div>
                  </div>
                ) : (
                  <div className="h-full p-4">
                    {/* Fake Calendar View */}
                    <div className="grid grid-cols-7 gap-1 text-xs text-center mb-2">
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                        <div key={day} className="font-medium text-gray-600 p-1">{day}</div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-xs">
                      {Array.from({ length: 35 }, (_, i) => {
                        const day = i - 6;
                        const isCurrentMonth = day > 0 && day <= 31;
                        const hasEvent = [15, 18, 25].includes(day);
                        return (
                          <div key={i} className={`aspect-square flex items-center justify-center ${
                            isCurrentMonth 
                              ? hasEvent 
                                ? 'bg-blue-100 text-blue-700 rounded font-medium' 
                                : 'text-gray-700 hover:bg-gray-100 rounded'
                              : 'text-gray-400'
                          }`}>
                            {isCurrentMonth ? day : ''}
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-3 text-xs space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded"></div>
                        <span className="text-gray-600">May 15 - Paris Trip</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded"></div>
                        <span className="text-gray-600">Jul 6 - Lake Tahoe</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default HomeDashboard;