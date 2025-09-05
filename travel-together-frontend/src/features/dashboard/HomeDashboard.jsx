import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Calendar, Map, Heart, Share2, Vote, 
  AlertTriangle, CheckCircle, Clock, Camera,
  MapPin, MessageCircle, Users, Bookmark
} from 'lucide-react';
import { tripApi, transformTripForFrontend } from '../../services/api';
import { useUserTripFiltering } from '../../hooks/useUserTripFiltering';
import TripFilterToggle from '../../components/common/TripFilterToggle';
import { getTripContextMessage } from '../../components/common/TripContextMessage';

// Demo data with enhanced trip statuses
const demoData = {
  trips: [
    { 
      id: "current-trip", 
      name: "Tokyo Adventure", 
      destination: "Tokyo, Japan",
      starts: "2025-09-02", 
      ends: "2025-09-08",
      daysAway: -3, 
      next: "3 days remaining", 
      tripStatus: "inProgress",
      status: { polls: 1, conflicts: 1 }, 
      myRole: "organizer",
      draft: false 
    },
    { 
      id: "paris", 
      name: "Paris", 
      destination: "Paris, France",
      starts: "2025-05-15", 
      ends: "2025-05-22",
      daysAway: 14, 
      next: "Trip starts May 15, 2025", 
      tripStatus: "upcoming",
      status: { polls: 2, conflicts: 1 }, 
      myRole: "organizer",
      draft: false 
    },
    { 
      id: "tahoe", 
      name: "Lake Tahoe", 
      destination: "Lake Tahoe, CA",
      starts: "2025-07-06", 
      ends: "2025-07-10",
      daysAway: 62, 
      next: "Trip starts July 6, 2025", 
      tripStatus: "upcoming",
      status: { polls: 0, conflicts: 0 }, 
      myRole: "member",
      draft: false 
    },
    { 
      id: "bcn", 
      name: "Barcelona", 
      destination: "Barcelona, Spain",
      starts: null, 
      ends: null,
      daysAway: null, 
      next: "Set trip dates", 
      tripStatus: "draft",
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
    { id: 1, user: "Alice", text: "Posted a new photo in Paris", when: "2h", likes: 12, liked: false, type: "photo", trip: "paris" },
    { id: 2, user: "Ben", text: "Liked your Lake Tahoe post", when: "4h", likes: 1, liked: true, type: "like", trip: "tahoe" },
    { id: 3, user: "Emma", text: "\"Excited for Eiffel Tower!\"", when: "1d", likes: 6, liked: false, type: "comment", trip: "paris" },
    { id: 4, user: "Chris", text: "Added 3 activities to Barcelona trip", when: "3h", likes: 8, liked: false, type: "activity", trip: "bcn" },
    { id: 5, user: "Sarah", text: "Updated Lake Tahoe itinerary", when: "5h", likes: 4, liked: true, type: "itinerary", trip: "tahoe" }
  ]
};

function HomeDashboard() {
  const navigate = useNavigate();
  const [allTrips, setAllTrips] = useState([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('map');
  
  // Enhanced archetype toggles
  const [activeArchetypes, setActiveArchetypes] = useState(() => {
    // Load from localStorage or default to all active
    const saved = localStorage.getItem('dashboard-archetypes');
    return saved ? JSON.parse(saved) : {
      organizer: true,
      casualTraveler: true, 
      socialSharer: true
    };
  });
  
  // Use the reusable filtering hook
  const {
    filteredTrips: filteredTripData,
    tripStats,
    viewMode,
    setViewMode,
    isLoggedIn
  } = useUserTripFiltering(allTrips);

  // Transform backend trip data to dashboard format with enhanced status detection
  const transformTripData = (trips) => {
    console.log('TransformTripData called with:', trips);
    const today = new Date();
    
    const transformedTrips = trips.map(trip => {
      const startDate = trip.startDate ? new Date(trip.startDate) : null;
      const endDate = trip.endDate ? new Date(trip.endDate) : null;
      const daysAway = startDate ? Math.ceil((startDate - today) / (1000 * 60 * 60 * 24)) : null;
      
      // Determine trip status
      let tripStatus = 'draft';
      let nextAction = 'Set trip dates';
      
      if (startDate && endDate) {
        if (today >= startDate && today <= endDate) {
          tripStatus = 'inProgress';
          const daysRemaining = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
          nextAction = `${daysRemaining} day${daysRemaining === 1 ? '' : 's'} remaining`;
        } else if (today > endDate) {
          tripStatus = 'completed';
          nextAction = 'Trip completed';
        } else {
          tripStatus = 'upcoming';
          nextAction = `Trip starts ${startDate.toLocaleDateString()}`;
        }
      }
      
      return {
        id: trip.id,
        name: trip.name,
        destination: Array.isArray(trip.destinations) ? trip.destinations.join(', ') : trip.destinations || 'No destination set',
        starts: trip.startDate,
        ends: trip.endDate,
        daysAway: daysAway,
        next: nextAction,
        tripStatus: tripStatus,
        status: { 
          polls: Math.floor(Math.random() * 3), // Mock data - could derive from trip activities/restaurants
          conflicts: tripStatus === 'inProgress' ? Math.floor(Math.random() * 2) : Math.floor(Math.random() * 3)
        },
        myRole: 'organizer', // Could be derived from user relationship to trip
        draft: tripStatus === 'draft'
      };
    });

    // Sort trips: in-progress first, then by upcoming dates, then by name
    return transformedTrips.sort((a, b) => {
      // In-progress trips first
      if (a.tripStatus === 'inProgress' && b.tripStatus !== 'inProgress') return -1;
      if (b.tripStatus === 'inProgress' && a.tripStatus !== 'inProgress') return 1;
      
      // Then upcoming trips by date
      if (a.tripStatus === 'upcoming' && b.tripStatus === 'upcoming') {
        if (a.daysAway && b.daysAway) return a.daysAway - b.daysAway;
        if (a.daysAway && !b.daysAway) return -1;
        if (!a.daysAway && b.daysAway) return 1;
      }
      
      // Then by name
      return a.name.localeCompare(b.name);
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
          ? { 
              ...post, 
              likes: post.liked ? post.likes - 1 : post.likes + 1,
              liked: !post.liked
            }
          : post
      )
    }));
  };

  const handleShare = (postId) => {
    // Share functionality placeholder
    console.log('Sharing post:', postId);
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'photo': return <Camera className="h-4 w-4" />;
      case 'like': return <Heart className="h-4 w-4" />;
      case 'comment': return <MessageCircle className="h-4 w-4" />;
      case 'activity': return <MapPin className="h-4 w-4" />;
      case 'itinerary': return <Clock className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  // Handle archetype toggle changes
  const toggleArchetype = (archetype) => {
    const updated = {
      ...activeArchetypes,
      [archetype]: !activeArchetypes[archetype]
    };
    setActiveArchetypes(updated);
    localStorage.setItem('dashboard-archetypes', JSON.stringify(updated));
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
            
            {/* Enhanced Archetype Toggles */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500 hidden sm:inline">View:</span>
              <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => toggleArchetype('organizer')}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    activeArchetypes.organizer
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                  title="Show/hide planning and organization features"
                >
                  📋 Organizer
                </button>
                <button
                  onClick={() => toggleArchetype('casualTraveler')}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    activeArchetypes.casualTraveler
                      ? 'bg-green-600 text-white'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                  title="Show/hide casual travel features"
                >
                  🏖️ Casual
                </button>
                <button
                  onClick={() => toggleArchetype('socialSharer')}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    activeArchetypes.socialSharer
                      ? 'bg-pink-600 text-white'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                  title="Show/hide social sharing features"
                >
                  📸 Social
                </button>
              </div>
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
        {/* Current Trip Alert - Show if there's an in-progress trip */}
        {(import.meta.env.VITE_DEMO_MODE === 'true' ? data?.trips : transformTripData(filteredTripData).trips)?.some(trip => trip.tripStatus === 'inProgress') && (
          <motion.section 
            className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg border-2 border-green-400 p-6 text-white"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.0 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🔥</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-1">You're Currently Traveling!</h2>
                  <p className="text-green-100">
                    {(import.meta.env.VITE_DEMO_MODE === 'true' ? data?.trips : transformTripData(filteredTripData).trips)
                      ?.find(trip => trip.tripStatus === 'inProgress')?.name} - {
                      (import.meta.env.VITE_DEMO_MODE === 'true' ? data?.trips : transformTripData(filteredTripData).trips)
                      ?.find(trip => trip.tripStatus === 'inProgress')?.next}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => navigate(`/trips/${(import.meta.env.VITE_DEMO_MODE === 'true' ? data?.trips : transformTripData(filteredTripData).trips)?.find(trip => trip.tripStatus === 'inProgress')?.id}`)}
                className="px-4 py-2 bg-white text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-colors"
              >
                View Trip
              </button>
            </div>
          </motion.section>
        )}

        {/* Upcoming Trips - Always show, but badge styling based on organizer mode */}
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
            {(import.meta.env.VITE_DEMO_MODE === 'true' ? data?.trips || [] : (() => {
              console.log('Filtered trip data:', filteredTripData);
              const transformed = transformTripData(filteredTripData);
              console.log('Transformed trip data:', transformed);
              return transformed.trips || [];
            })()).map((trip, index) => (
              <motion.div
                key={trip.id}
                className={`${
                  trip.tripStatus === 'inProgress' 
                    ? 'bg-gradient-to-b from-green-100 via-emerald-50 to-white border-2 border-green-300 shadow-lg ring-2 ring-green-200' 
                    : trip.tripStatus === 'upcoming' 
                      ? 'bg-gradient-to-b from-blue-50 to-white border border-blue-100'
                      : trip.tripStatus === 'draft'
                        ? 'bg-gradient-to-b from-gray-50 to-white border border-gray-200'
                        : 'bg-gradient-to-b from-purple-50 to-white border border-purple-100'
                } rounded-2xl p-4 min-w-0 relative overflow-hidden`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* In-progress trip indicator */}
                {trip.tripStatus === 'inProgress' && (
                  <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    🔥 IN PROGRESS
                  </div>
                )}
                <h3 className={`font-semibold mb-2 ${
                  trip.tripStatus === 'inProgress' ? 'text-green-800 text-lg' : 'text-gray-900'
                }`}>
                  {trip.name}
                </h3>
                <div className="space-y-1 text-sm text-gray-600 mb-3">
                  {trip.tripStatus === 'inProgress' ? (
                    <>
                      <p className="text-green-700 font-medium">🔥 Currently traveling!</p>
                      <p className="text-green-600">Next: {trip.next}</p>
                    </>
                  ) : trip.tripStatus === 'upcoming' ? (
                    <>
                      <p className="text-blue-700">{trip.daysAway > 0 ? `${trip.daysAway} days away` : 'Starting soon'}</p>
                      <p>Next: {trip.next}</p>
                    </>
                  ) : trip.tripStatus === 'completed' ? (
                    <>
                      <p className="text-purple-700">Trip completed</p>
                      <p>Status: {trip.next}</p>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-500">Draft trip</p>
                      <p>Next: {trip.next}</p>
                    </>
                  )}
                </div>
                
                {/* Status Badges - Enhanced based on archetype preferences */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {/* Organizer badges - conflicts and polls */}
                  {activeArchetypes.organizer && trip.status.conflicts > 0 && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs">
                      <AlertTriangle className="h-3 w-3" />
                      {trip.status.conflicts} conflicts
                    </span>
                  )}
                  {activeArchetypes.organizer && trip.status.polls > 0 && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full text-xs">
                      <Clock className="h-3 w-3" />
                      {trip.status.polls} polls open
                    </span>
                  )}
                  {activeArchetypes.organizer && trip.status.polls === 0 && trip.status.conflicts === 0 && !trip.draft && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs">
                      <CheckCircle className="h-3 w-3" />
                      All set
                    </span>
                  )}
                  {/* Casual traveler badges - simplified status */}
                  {activeArchetypes.casualTraveler && !activeArchetypes.organizer && trip.daysAway && trip.daysAway <= 30 && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs">
                      🏖️ Coming soon
                    </span>
                  )}
                  {/* Draft badge - always show if trip is draft */}
                  {trip.draft && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 border border-gray-200 rounded-full text-xs">
                      Draft
                    </span>
                  )}
                </div>
                
                {/* Enhanced trip action buttons */}
                <div className="space-y-2">
                  <button 
                    onClick={() => navigate(`/trips/${trip.id}`)}
                    className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                      trip.tripStatus === 'inProgress'
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : trip.tripStatus === 'upcoming'
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-600 text-white hover:bg-gray-700'
                    }`}
                  >
                    {trip.tripStatus === 'inProgress' ? '📱 Open Current Trip' : 
                     trip.tripStatus === 'upcoming' ? '✈️ View Trip' : 
                     '📝 Edit Draft'}
                  </button>
                  
                  {/* Quick actions for different trip statuses */}
                  {trip.tripStatus === 'inProgress' && (
                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors">
                        📍 Check-in
                      </button>
                      <button className="flex-1 px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors">
                        📸 Add Photo
                      </button>
                    </div>
                  )}
                  
                  {trip.tripStatus === 'upcoming' && trip.daysAway <= 7 && (
                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                        ✅ Final Review
                      </button>
                      <button className="flex-1 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                        🎒 Packing List
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Todos Section - Show if organizer is active */}
        {activeArchetypes.organizer && (
          <motion.section 
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Your To-Dos & Polls</h2>
            <p className="text-gray-600 text-sm mb-6">Vote on plans, resolve conflicts, finish tasks.</p>
            
            <div className="space-y-3">
              {data?.todos?.map((todo) => (
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
        )}

        {/* Social & Map/Calendar Layout - Full width when both are active */}
        <div className={`space-y-6 ${
          activeArchetypes.socialSharer && (activeArchetypes.casualTraveler || activeArchetypes.organizer)
            ? 'lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0' 
            : ''
        }`}>

          {/* Social Highlights - Only show for social sharer archetype */}
          {activeArchetypes.socialSharer && (
            <motion.section 
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Social Highlights</h2>
              <p className="text-gray-600 text-sm mb-6">Recent photos & posts from your trips.</p>
              
              {/* Photo Gallery */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {data?.photos?.slice(0, 4).map((photo) => (
                  <div
                    key={photo.id}
                    className="aspect-square bg-pink-50 border-2 border-dashed border-pink-200 rounded-xl flex items-center justify-center text-pink-700 text-sm text-center p-2"
                  >
                    {photo.alt}
                  </div>
                ))}
              </div>
              
              {/* Enhanced Feed */}
              <div className="space-y-3">
                {data?.feed?.slice(0, activeArchetypes.socialSharer ? 5 : 3).map((post) => (
                  <div key={post.id} className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-xl hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-gray-600 text-sm">
                          {getActivityIcon(post.type)}
                          <span className="font-medium">{post.user}</span>
                          <span>•</span>
                          <span>{post.when}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500 px-2 py-1 bg-white/60 rounded-full">
                          {post.trip === 'paris' && '🇫🇷 Paris'}
                          {post.trip === 'tahoe' && '🏔️ Tahoe'}
                          {post.trip === 'bcn' && '🇪🇸 Barcelona'}
                        </span>
                        <button className="p-1 hover:bg-white/60 rounded">
                          <Bookmark className="h-3 w-3 text-gray-400" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-900 mb-3 leading-relaxed">{post.text}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-4">
                        <button
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center gap-1 text-sm hover:scale-105 transition-transform ${
                            post.liked ? 'text-pink-600' : 'text-gray-600 hover:text-pink-600'
                          }`}
                        >
                          <Heart className={`h-4 w-4 ${post.liked ? 'fill-current' : ''}`} />
                          {post.likes}
                        </button>
                        <button 
                          onClick={() => handleShare(post.id)}
                          className="flex items-center gap-1 text-gray-600 text-sm hover:text-blue-600 hover:scale-105 transition-all"
                        >
                          <Share2 className="h-4 w-4" />
                          Share
                        </button>
                        <button className="flex items-center gap-1 text-gray-600 text-sm hover:text-gray-700">
                          <MessageCircle className="h-4 w-4" />
                          Reply
                        </button>
                      </div>
                      {post.type === 'photo' && (
                        <span className="text-xs text-blue-600 font-medium">View photo</span>
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Load more social activity */}
                <button className="w-full py-3 text-pink-600 text-sm font-medium hover:bg-pink-50 rounded-lg border border-dashed border-pink-300 transition-colors">
                  Load more activity
                </button>
              </div>
            </motion.section>
            )}

            {/* Enhanced Map/Calendar Tabs - Show for casual traveler or organizer - Now gets wider space */}
            {(activeArchetypes.casualTraveler || activeArchetypes.organizer) && (
            <motion.section 
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {activeTab === 'map' ? 'Trip Locations' : 'Trip Timeline'}
                </h2>
                <div className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
                  {activeTab === 'map' ? '3 destinations' : '2 upcoming trips'}
                </div>
              </div>
              
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  onClick={() => setActiveTab('map')}
                  className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                    activeTab === 'map'
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Map className="h-4 w-4" />
                  <span>Map View</span>
                  {activeArchetypes.organizer && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">PRO</span>}
                </button>
                <button
                  onClick={() => setActiveTab('calendar')}
                  className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                    activeTab === 'calendar'
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Calendar className="h-4 w-4" />
                  <span>Timeline</span>
                  {activeArchetypes.casualTraveler && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">EASY</span>}
                </button>
              </div>
              
              <div className="h-[32rem] bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                {activeTab === 'map' ? (
                  <div className="h-full relative">
                    {/* Enhanced Map View */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-green-50 to-blue-50">
                      {/* Interactive map markers with trip info */}
                      <div className="absolute top-12 left-8 group cursor-pointer">
                        <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          🇫🇷 Paris - 14 days away
                        </div>
                      </div>
                      <div className="absolute top-20 right-12 group cursor-pointer">
                        <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          🏔️ Lake Tahoe - 62 days away
                        </div>
                      </div>
                      <div className="absolute bottom-16 left-16 group cursor-pointer">
                        <div className="w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow-lg opacity-60"></div>
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          🇪🇸 Barcelona - Draft
                        </div>
                      </div>
                      
                      {/* Enhanced map elements */}
                      <div className="absolute top-16 left-0 w-full h-0.5 bg-blue-400 opacity-20 rotate-12"></div>
                      <div className="absolute top-32 left-0 w-full h-0.5 bg-green-400 opacity-20 -rotate-6"></div>
                      
                      {/* Enhanced map controls */}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-1">
                        <button className="w-8 h-8 flex items-center justify-center text-sm text-gray-700 hover:bg-gray-100 rounded">+</button>
                        <button className="w-8 h-8 flex items-center justify-center text-sm text-gray-700 hover:bg-gray-100 rounded border-t">−</button>
                      </div>
                      
                      {/* Trip route indicator */}
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
                        <div className="flex items-center gap-2 text-xs">
                          <MapPin className="h-3 w-3 text-gray-600" />
                          <span className="font-medium text-gray-700">Multi-destination trips</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Enhanced map legend */}
                    <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
                      <div className="flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-gray-700">Upcoming</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-orange-500 rounded-full opacity-60"></div>
                          <span className="text-gray-700">Draft</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full p-4 bg-gradient-to-br from-green-50 to-blue-50">
                    {/* Enhanced Calendar View */}
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-700">May 2025</h3>
                      <div className="flex gap-1">
                        <button className="w-6 h-6 flex items-center justify-center text-xs text-gray-600 hover:bg-white/60 rounded">‹</button>
                        <button className="w-6 h-6 flex items-center justify-center text-xs text-gray-600 hover:bg-white/60 rounded">›</button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1 text-xs text-center mb-2">
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                        <div key={day} className="font-semibold text-gray-700 p-1">{day}</div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-xs mb-3">
                      {Array.from({ length: 35 }, (_, i) => {
                        const day = i - 6;
                        const isCurrentMonth = day > 0 && day <= 31;
                        const hasEvent = [15, 18, 25].includes(day);
                        const isToday = day === 5; // Mock today
                        return (
                          <div key={i} className={`aspect-square flex items-center justify-center relative ${
                            isCurrentMonth 
                              ? isToday
                                ? 'bg-blue-600 text-white rounded-full font-bold'
                                : hasEvent 
                                  ? 'bg-gradient-to-br from-red-100 to-pink-100 text-red-700 rounded-full font-semibold border border-red-200 hover:shadow-sm cursor-pointer' 
                                  : 'text-gray-700 hover:bg-white/60 rounded cursor-pointer'
                              : 'text-gray-400'
                          }`}>
                            {isCurrentMonth ? day : ''}
                            {hasEvent && (
                              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full"></div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Enhanced event list */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-2 bg-white/70 rounded-lg hover:bg-white/90 cursor-pointer transition-colors">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-800 text-xs">May 15 - Paris Trip</div>
                          <div className="text-gray-600 text-xs">🇫🇷 14 days away</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-2 bg-white/70 rounded-lg hover:bg-white/90 cursor-pointer transition-colors">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-800 text-xs">Jul 6 - Lake Tahoe</div>
                          <div className="text-gray-600 text-xs">🏔️ 62 days away</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.section>
            )}
        </div>
      </main>
    </div>
  );
}

export default HomeDashboard;