-- TravelTogether Database Schema
-- SQLite database for storing trips, activities, restaurants, and ratings

-- Trips table - Main trip information
CREATE TABLE IF NOT EXISTS trips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_by TEXT, -- Username of the trip creator
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Trip destinations table - Support multiple destinations per trip
CREATE TABLE IF NOT EXISTS trip_destinations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trip_id INTEGER NOT NULL,
    destination TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    FOREIGN KEY (trip_id) REFERENCES trips (id) ON DELETE CASCADE
);

-- Participants table - Store trip participants
CREATE TABLE IF NOT EXISTS participants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trip_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'participant', -- 'creator' or 'participant'
    is_current_user BOOLEAN DEFAULT 0,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips (id) ON DELETE CASCADE
);

-- Activities table - Store trip activities
CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trip_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    location TEXT NOT NULL,
    cost DECIMAL(10,2),
    duration TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips (id) ON DELETE CASCADE
);

-- Restaurants table - Store trip restaurants
CREATE TABLE IF NOT EXISTS restaurants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trip_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    cuisine TEXT NOT NULL,
    location TEXT NOT NULL,
    cost DECIMAL(10,2),
    price_range TEXT, -- $, $$, $$$, $$$$
    group_capacity INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips (id) ON DELETE CASCADE
);

-- Dietary options for restaurants (many-to-many relationship)
CREATE TABLE IF NOT EXISTS restaurant_dietary_options (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    restaurant_id INTEGER NOT NULL,
    dietary_option TEXT NOT NULL, -- vegetarian, vegan, gluten-free, kids-friendly, etc.
    FOREIGN KEY (restaurant_id) REFERENCES restaurants (id) ON DELETE CASCADE
);

-- Activity votes/ratings table
CREATE TABLE IF NOT EXISTS activity_ratings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    activity_id INTEGER NOT NULL,
    participant_id INTEGER NOT NULL,
    rating INTEGER CHECK (rating >= 0 AND rating <= 5),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (activity_id) REFERENCES activities (id) ON DELETE CASCADE,
    FOREIGN KEY (participant_id) REFERENCES participants (id) ON DELETE CASCADE,
    UNIQUE(activity_id, participant_id) -- One rating per participant per activity
);

-- Restaurant votes/ratings table
CREATE TABLE IF NOT EXISTS restaurant_ratings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    restaurant_id INTEGER NOT NULL,
    participant_id INTEGER NOT NULL,
    rating INTEGER CHECK (rating >= 0 AND rating <= 5),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants (id) ON DELETE CASCADE,
    FOREIGN KEY (participant_id) REFERENCES participants (id) ON DELETE CASCADE,
    UNIQUE(restaurant_id, participant_id) -- One rating per participant per restaurant
);

-- Travel information table - Transportation details
CREATE TABLE IF NOT EXISTS trip_travel (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trip_id INTEGER NOT NULL,
    type TEXT NOT NULL, -- flight, train, bus, car, etc.
    details TEXT NOT NULL, -- flight number, departure time, etc.
    from_location TEXT,
    to_location TEXT,
    date_time DATETIME,
    cost DECIMAL(10,2),
    confirmation_number TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips (id) ON DELETE CASCADE
);

-- Lodging information table - Accommodation details
CREATE TABLE IF NOT EXISTS trip_lodging (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trip_id INTEGER NOT NULL,
    name TEXT NOT NULL, -- hotel name, airbnb address, etc.
    type TEXT NOT NULL, -- hotel, airbnb, hostel, camping, etc.
    location TEXT NOT NULL,
    check_in DATE,
    check_out DATE,
    cost DECIMAL(10,2),
    confirmation_number TEXT,
    contact_info TEXT, -- phone, email, etc.
    wifi_info TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips (id) ON DELETE CASCADE
);

-- Trip logistics table - WiFi, contacts, documents, etc.
CREATE TABLE IF NOT EXISTS trip_logistics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trip_id INTEGER NOT NULL,
    category TEXT NOT NULL, -- wifi, emergency_contact, document, important_number
    name TEXT NOT NULL, -- network name, contact name, document name, etc.
    details TEXT, -- password, phone, document number, etc.
    additional_info TEXT, -- extra details, notes, etc.
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips (id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_trip_destinations_trip_id ON trip_destinations (trip_id);
CREATE INDEX IF NOT EXISTS idx_participants_trip_id ON participants (trip_id);
CREATE INDEX IF NOT EXISTS idx_activities_trip_id ON activities (trip_id);
CREATE INDEX IF NOT EXISTS idx_restaurants_trip_id ON restaurants (trip_id);
CREATE INDEX IF NOT EXISTS idx_activity_ratings_activity_id ON activity_ratings (activity_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_ratings_restaurant_id ON restaurant_ratings (restaurant_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_dietary_options_restaurant_id ON restaurant_dietary_options (restaurant_id);
CREATE INDEX IF NOT EXISTS idx_trip_travel_trip_id ON trip_travel (trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_lodging_trip_id ON trip_lodging (trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_logistics_trip_id ON trip_logistics (trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_logistics_category ON trip_logistics (category);

-- Views for easier querying

-- View to get activities with vote counts
DROP VIEW IF EXISTS activities_with_votes;
CREATE VIEW activities_with_votes AS
SELECT 
    a.*,
    COUNT(ar.rating) as vote_count,
    AVG(CAST(ar.rating as FLOAT)) as avg_rating
FROM activities a
LEFT JOIN activity_ratings ar ON a.id = ar.activity_id
GROUP BY a.id;

-- View to get restaurants with vote counts
DROP VIEW IF EXISTS restaurants_with_votes;
CREATE VIEW restaurants_with_votes AS
SELECT 
    r.*,
    COUNT(rr.rating) as vote_count,
    AVG(CAST(rr.rating as FLOAT)) as avg_rating
FROM restaurants r
LEFT JOIN restaurant_ratings rr ON r.id = rr.restaurant_id
GROUP BY r.id;

-- View to get complete trip information
DROP VIEW IF EXISTS trips_complete;
CREATE VIEW trips_complete AS
SELECT 
    t.*,
    GROUP_CONCAT(DISTINCT td.destination ORDER BY td.order_index) as destinations,
    GROUP_CONCAT(DISTINCT p.name) as participants,
    COUNT(DISTINCT a.id) as activity_count,
    COUNT(DISTINCT r.id) as restaurant_count
FROM trips t
LEFT JOIN trip_destinations td ON t.id = td.trip_id
LEFT JOIN participants p ON t.id = p.trip_id
LEFT JOIN activities a ON t.id = a.trip_id
LEFT JOIN restaurants r ON t.id = r.trip_id
GROUP BY t.id;