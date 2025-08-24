const database = require('./init.js');
const Trip = require('../models/Trip.js');

// Sample trips data with multiple destinations support
const sampleTrips = [
  {
    id: 1,
    name: "Summer Family Vacation",
    destinations: ["Orlando, Florida"],
    startDate: "2025-07-15",
    endDate: "2025-07-22",
    participants: ["Sarah Johnson", "Mike Johnson", "Emma Johnson", "Lucas Johnson"],
    restaurants: [
      {
        id: 151,
        name: "Chef Mickey's",
        cuisine: "American",
        location: "Disney's Contemporary Resort",
        cost: 62,
        priceRange: "$$$",
        dietaryOptions: ["vegetarian", "kids-friendly"],
        groupCapacity: 8,
        votes: 4
      },
      {
        id: 152,
        name: "Ohana",
        cuisine: "Polynesian",
        location: "Disney's Polynesian Village Resort",
        cost: 65,
        priceRange: "$$$",
        dietaryOptions: ["gluten-free", "kids-friendly"],
        groupCapacity: 10,
        votes: 3
      },
      {
        id: 153,
        name: "Homecoming Kitchen",
        cuisine: "Southern",
        location: "Disney Springs",
        cost: 45,
        priceRange: "$$",
        dietaryOptions: ["vegetarian", "gluten-free"],
        groupCapacity: 6,
        votes: 2
      },
      {
        id: 154,
        name: "Cosmic Ray's Starlight Cafe",
        cuisine: "Fast Food",
        location: "Magic Kingdom",
        cost: 18,
        priceRange: "$",
        dietaryOptions: ["vegetarian", "kids-friendly"],
        groupCapacity: 12,
        votes: 4
      }
    ],
    activities: [
      {
        id: 101,
        name: "Magic Kingdom",
        category: "Entertainment",
        location: "Bay Lake, FL",
        cost: 109,
        duration: "Full Day",
        votes: 4
      },
      {
        id: 102,
        name: "Universal Studios",
        category: "Entertainment", 
        location: "Orlando, FL",
        cost: 115,
        duration: "Full Day",
        votes: 3
      },
      {
        id: 103,
        name: "Disney's Blizzard Beach",
        category: "Recreation",
        location: "Orlando, FL", 
        cost: 75,
        duration: "Half Day",
        votes: 4
      },
      {
        id: 104,
        name: "Character Breakfast at Chef Mickey's",
        category: "Dining",
        location: "Orlando, FL",
        cost: 62,
        duration: "2 hours",
        votes: 2
      }
    ]
  },
  {
    id: 2,
    name: "Bachelor Party Weekend",
    destinations: ["Las Vegas, Nevada"],
    startDate: "2025-09-12",
    endDate: "2025-09-14",
    participants: ["Alex Chen", "David Martinez", "Ryan Thompson", "Kevin Park", "Jordan Williams"],
    restaurants: [
      {
        id: 251,
        name: "Gordon Ramsay Hell's Kitchen",
        cuisine: "Fine Dining",
        location: "Caesars Palace",
        cost: 120,
        priceRange: "$$$$",
        dietaryOptions: ["gluten-free"],
        groupCapacity: 8,
        votes: 5
      },
      {
        id: 252,
        name: "The Buffet at Wynn",
        cuisine: "International",
        location: "Wynn Las Vegas",
        cost: 89,
        priceRange: "$$$",
        dietaryOptions: ["vegetarian", "gluten-free", "vegan"],
        groupCapacity: 15,
        votes: 4
      },
      {
        id: 253,
        name: "Hash House A Go Go",
        cuisine: "American",
        location: "The LINQ",
        cost: 35,
        priceRange: "$$",
        dietaryOptions: ["vegetarian"],
        groupCapacity: 10,
        votes: 3
      },
      {
        id: 254,
        name: "Yard House",
        cuisine: "Sports Bar",
        location: "The LINQ Promenade",
        cost: 28,
        priceRange: "$$",
        dietaryOptions: ["vegetarian", "gluten-free"],
        groupCapacity: 12,
        votes: 4
      }
    ],
    activities: [
      {
        id: 201,
        name: "Cirque du Soleil Show",
        category: "Entertainment",
        location: "The Strip, Las Vegas",
        cost: 89,
        duration: "3 hours",
        votes: 5
      },
      {
        id: 202,
        name: "High Roller Observation Wheel",
        category: "Sightseeing",
        location: "The LINQ, Las Vegas",
        cost: 35,
        duration: "1 hour",
        votes: 4
      },
      {
        id: 203,
        name: "Pool Party at Marquee Dayclub",
        category: "Entertainment",
        location: "The Cosmopolitan, Las Vegas",
        cost: 75,
        duration: "4 hours", 
        votes: 3
      },
      {
        id: 204,
        name: "Steakhouse Dinner",
        category: "Dining",
        location: "Gordon Ramsay Hell's Kitchen",
        cost: 150,
        duration: "2 hours",
        votes: 5
      }
    ]
  },
  {
    id: 3,
    name: "European Adventure",
    destinations: ["Paris, France", "Rome, Italy", "Barcelona, Spain"],
    startDate: "2025-10-05",
    endDate: "2025-10-18",
    participants: ["Jessica Brown", "Amanda Davis"],
    restaurants: [
      {
        id: 351,
        name: "Le Comptoir du Relais",
        cuisine: "French Bistro",
        location: "6th Arrondissement, Paris",
        cost: 45,
        priceRange: "$$",
        dietaryOptions: ["vegetarian"],
        groupCapacity: 4,
        votes: 2
      },
      {
        id: 352,
        name: "L'Ambroisie",
        cuisine: "Fine Dining",
        location: "Place des Vosges, Paris",
        cost: 180,
        priceRange: "$$$$",
        dietaryOptions: ["vegetarian", "gluten-free"],
        groupCapacity: 6,
        votes: 1
      },
      {
        id: 353,
        name: "Café de Flore",
        cuisine: "Café",
        location: "Saint-Germain-des-Prés, Paris",
        cost: 25,
        priceRange: "$",
        dietaryOptions: ["vegetarian", "vegan"],
        groupCapacity: 8,
        votes: 2
      },
      {
        id: 354,
        name: "Le Train Bleu",
        cuisine: "Brasserie",
        location: "Gare de Lyon, Paris",
        cost: 65,
        priceRange: "$$$",
        dietaryOptions: ["vegetarian", "gluten-free"],
        groupCapacity: 6,
        votes: 2
      }
    ],
    activities: [
      {
        id: 301,
        name: "Eiffel Tower Visit",
        category: "Sightseeing",
        location: "Champ de Mars, Paris",
        cost: 29,
        duration: "3 hours",
        votes: 2
      },
      {
        id: 302,
        name: "Louvre Museum",
        category: "Culture",
        location: "1st Arrondissement, Paris",
        cost: 22,
        duration: "4 hours",
        votes: 2
      },
      {
        id: 303,
        name: "Seine River Cruise",
        category: "Sightseeing",
        location: "Seine River, Paris",
        cost: 15,
        duration: "1.5 hours",
        votes: 2
      },
      {
        id: 304,
        name: "Wine Tasting in Montmartre",
        category: "Dining",
        location: "Montmartre, Paris",
        cost: 65,
        duration: "2 hours",
        votes: 1
      },
      {
        id: 305,
        name: "Day Trip to Versailles",
        category: "Culture",
        location: "Versailles, France",
        cost: 35,
        duration: "Full Day",
        votes: 1
      }
    ]
  },
  {
    id: 4,
    name: "Company Retreat",
    destinations: ["Aspen, Colorado"],
    startDate: "2025-11-08",
    endDate: "2025-11-10",
    participants: ["Jennifer Lee", "Mark Wilson", "Lisa Garcia", "Tom Anderson", "Rachel Kim", "Steve Miller", "Monica Rodriguez", "Chris Taylor"],
    activities: [
      {
        id: 401,
        name: "Team Building Ropes Course",
        category: "Team Building",
        location: "Aspen Recreation Center",
        cost: 45,
        duration: "3 hours",
        votes: 6
      },
      {
        id: 402,
        name: "Scenic Gondola Ride",
        category: "Sightseeing",
        location: "Aspen Mountain",
        cost: 32,
        duration: "2 hours",
        votes: 8
      },
      {
        id: 403,
        name: "Group Dinner at The Little Nell",
        category: "Dining",
        location: "Aspen, CO",
        cost: 95,
        duration: "2.5 hours",
        votes: 7
      },
      {
        id: 404,
        name: "Morning Yoga Session",
        category: "Wellness",
        location: "Hotel Conference Room",
        cost: 0,
        duration: "1 hour",
        votes: 4
      },
      {
        id: 405,
        name: "Strategic Planning Workshop",
        category: "Business",
        location: "Hotel Meeting Room",
        cost: 0,
        duration: "4 hours",
        votes: 8
      }
    ],
    restaurants: []
  }
];

async function migrateSampleData() {
  try {
    console.log('Initializing database...');
    await database.initialize();
    
    const tripModel = new Trip(database);
    
    console.log('Migrating sample trips data...');
    
    // Clear existing data
    await database.run('DELETE FROM trip_destinations');
    await database.run('DELETE FROM participants');
    await database.run('DELETE FROM activities');
    await database.run('DELETE FROM restaurants');
    await database.run('DELETE FROM restaurant_dietary_options');
    await database.run('DELETE FROM activity_ratings');
    await database.run('DELETE FROM restaurant_ratings');
    await database.run('DELETE FROM trips');
    
    // Reset auto increment counters
    await database.run('DELETE FROM sqlite_sequence WHERE name IN ("trips", "trip_destinations", "participants", "activities", "restaurants", "restaurant_dietary_options", "activity_ratings", "restaurant_ratings")');
    
    for (const tripData of sampleTrips) {
      console.log(`Migrating trip: ${tripData.name}`);
      
      // Create trip with destinations and participants
      const trip = await tripModel.create({
        name: tripData.name,
        destinations: tripData.destinations,
        startDate: tripData.startDate,
        endDate: tripData.endDate,
        participants: tripData.participants
      });
      
      // Add activities
      for (const activity of tripData.activities) {
        const activityId = await tripModel.addActivity(trip.id, {
          name: activity.name,
          category: activity.category,
          location: activity.location,
          cost: activity.cost,
          duration: activity.duration
        });
        
        // Add fake ratings to match the original votes
        const participants = await database.all('SELECT id, name FROM participants WHERE trip_id = ?', [trip.id]);
        for (let i = 0; i < activity.votes && i < participants.length; i++) {
          await tripModel.rateActivity(trip.id, activityId, participants[i].name, 5);
        }
      }
      
      // Add restaurants
      for (const restaurant of tripData.restaurants) {
        const restaurantId = await tripModel.addRestaurant(trip.id, {
          name: restaurant.name,
          cuisine: restaurant.cuisine,
          location: restaurant.location,
          cost: restaurant.cost,
          priceRange: restaurant.priceRange,
          groupCapacity: restaurant.groupCapacity,
          dietaryOptions: restaurant.dietaryOptions
        });
        
        // Add fake ratings to match the original votes
        const participants = await database.all('SELECT id, name FROM participants WHERE trip_id = ?', [trip.id]);
        for (let i = 0; i < restaurant.votes && i < participants.length; i++) {
          await tripModel.rateRestaurant(trip.id, restaurantId, participants[i].name, 5);
        }
      }
    }
    
    console.log('Sample data migration completed successfully!');
    
    // Display summary
    const trips = await tripModel.getAll();
    console.log(`\nMigrated ${trips.length} trips:`);
    trips.forEach(trip => {
      console.log(`- ${trip.name}: ${trip.destinations.join(' → ')} (${trip.activityCount} activities, ${trip.restaurantCount} restaurants)`);
    });
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await database.close();
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateSampleData();
}

module.exports = { migrateSampleData, sampleTrips };