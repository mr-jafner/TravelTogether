import { tripApi } from '../services/api';

// Utility to create and download a blob file
const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Get current date string for filename
const getDateString = () => {
  const date = new Date();
  return date.toISOString().split('T')[0]; // YYYY-MM-DD format
};

// Clean trip name for filename
const cleanTripName = (tripName) => {
  return tripName
    .replace(/[^a-zA-Z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
};

// Export trip data as JSON
export const downloadJSON = (data, filename) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json'
  });
  downloadBlob(blob, filename);
};

// Generate multi-section CSV content
const generateCSVContent = (tripData) => {
  let csvContent = '';
  
  // Trip Overview Section
  csvContent += '## TRIP OVERVIEW\n';
  csvContent += 'Trip Name,Destinations,Start Date,End Date,Participants\n';
  csvContent += `"${tripData.tripInfo.name}","${tripData.tripInfo.destinations.join('; ')}","${tripData.tripInfo.startDate}","${tripData.tripInfo.endDate}","${tripData.tripInfo.participants.join(', ')}"\n\n`;
  
  // Activities Section
  csvContent += '## ACTIVITIES\n';
  if (tripData.activities && tripData.activities.length > 0) {
    csvContent += 'Name,Category,Location,Cost,Duration';
    
    // Add rating columns for each participant
    tripData.tripInfo.participants.forEach(participant => {
      csvContent += `,"${participant} Rating"`;
    });
    csvContent += ',Average Rating\n';
    
    tripData.activities.forEach(activity => {
      csvContent += `"${activity.name}","${activity.category}","${activity.location}","${activity.cost || ''}","${activity.duration || ''}"`;
      
      // Add individual ratings
      tripData.tripInfo.participants.forEach(participant => {
        const userRating = activity.ratings.find(r => r.user === participant);
        csvContent += `,"${userRating ? userRating.rating : ''}"`;
      });
      
      csvContent += `,"${activity.averageRating}"\n`;
    });
  } else {
    csvContent += 'No activities added\n';
  }
  csvContent += '\n';
  
  // Restaurants Section
  csvContent += '## RESTAURANTS\n';
  if (tripData.restaurants && tripData.restaurants.length > 0) {
    csvContent += 'Name,Cuisine,Location,Cost,Price Range,Group Capacity,Dietary Options';
    
    // Add rating columns for each participant
    tripData.tripInfo.participants.forEach(participant => {
      csvContent += `,"${participant} Rating"`;
    });
    csvContent += ',Average Rating\n';
    
    tripData.restaurants.forEach(restaurant => {
      csvContent += `"${restaurant.name}","${restaurant.cuisine}","${restaurant.location}","${restaurant.cost || ''}","${restaurant.priceRange || ''}","${restaurant.groupCapacity || ''}","${restaurant.dietaryOptions ? restaurant.dietaryOptions.join('; ') : ''}"`;
      
      // Add individual ratings
      tripData.tripInfo.participants.forEach(participant => {
        const userRating = restaurant.ratings.find(r => r.user === participant);
        csvContent += `,"${userRating ? userRating.rating : ''}"`;
      });
      
      csvContent += `,"${restaurant.averageRating}"\n`;
    });
  } else {
    csvContent += 'No restaurants added\n';
  }
  csvContent += '\n';
  
  // Travel Section
  csvContent += '## TRAVEL\n';
  if (tripData.travel && tripData.travel.length > 0) {
    csvContent += 'Type,Details,From Location,To Location,Date/Time,Cost,Confirmation Number,Notes\n';
    tripData.travel.forEach(travel => {
      csvContent += `"${travel.type || ''}","${travel.details || ''}","${travel.fromLocation || ''}","${travel.toLocation || ''}","${travel.dateTime || ''}","${travel.cost || ''}","${travel.confirmationNumber || ''}","${travel.notes || ''}"\n`;
    });
  } else {
    csvContent += 'No travel information added\n';
  }
  csvContent += '\n';
  
  // Lodging Section
  csvContent += '## LODGING\n';
  if (tripData.lodging && tripData.lodging.length > 0) {
    csvContent += 'Name,Type,Location,Check In,Check Out,Cost,Confirmation Number,Contact Info,WiFi Info,Notes\n';
    tripData.lodging.forEach(lodging => {
      csvContent += `"${lodging.name || ''}","${lodging.type || ''}","${lodging.location || ''}","${lodging.checkIn || ''}","${lodging.checkOut || ''}","${lodging.cost || ''}","${lodging.confirmationNumber || ''}","${lodging.contactInfo || ''}","${lodging.wifiInfo || ''}","${lodging.notes || ''}"\n`;
    });
  } else {
    csvContent += 'No lodging information added\n';
  }
  csvContent += '\n';
  
  // Logistics Section
  csvContent += '## LOGISTICS\n';
  if (tripData.logistics && tripData.logistics.length > 0) {
    csvContent += 'Category,Name,Details,Additional Info\n';
    tripData.logistics.forEach(logistics => {
      csvContent += `"${logistics.category || ''}","${logistics.name || ''}","${logistics.details || ''}","${logistics.additionalInfo || ''}"\n`;
    });
  } else {
    csvContent += 'No logistics information added\n';
  }
  csvContent += '\n';
  
  // Itinerary Section
  csvContent += '## ITINERARY\n';
  if (tripData.itinerary && tripData.itinerary.length > 0) {
    csvContent += 'Date,Time,Activity,Location,Notes\n';
    tripData.itinerary.forEach(item => {
      csvContent += `"${item.date || ''}","${item.time || ''}","${item.activity || ''}","${item.location || ''}","${item.notes || ''}"\n`;
    });
  } else {
    csvContent += 'No itinerary items added\n';
  }
  
  return csvContent;
};

// Export trip data as CSV
export const downloadCSV = (tripData, filename) => {
  const csvContent = generateCSVContent(tripData);
  const blob = new Blob([csvContent], { type: 'text/csv' });
  downloadBlob(blob, filename);
};

// Generate PDF content (simplified - would need a library like jsPDF for full PDF)
export const downloadPDF = (tripData, filename) => {
  // For now, create a formatted text document that can be saved as PDF
  let pdfContent = `TRIP EXPORT: ${tripData.tripInfo.name}\n`;
  pdfContent += `Generated: ${new Date().toLocaleString()}\n\n`;
  
  pdfContent += `TRIP OVERVIEW\n`;
  pdfContent += `Name: ${tripData.tripInfo.name}\n`;
  pdfContent += `Destinations: ${tripData.tripInfo.destinations.join(', ')}\n`;
  pdfContent += `Dates: ${tripData.tripInfo.startDate} to ${tripData.tripInfo.endDate}\n`;
  pdfContent += `Participants: ${tripData.tripInfo.participants.join(', ')}\n\n`;
  
  if (tripData.activities && tripData.activities.length > 0) {
    pdfContent += `ACTIVITIES (${tripData.activities.length})\n`;
    tripData.activities.forEach((activity, index) => {
      pdfContent += `${index + 1}. ${activity.name}\n`;
      pdfContent += `   Category: ${activity.category}\n`;
      pdfContent += `   Location: ${activity.location}\n`;
      if (activity.cost) pdfContent += `   Cost: $${activity.cost}\n`;
      if (activity.duration) pdfContent += `   Duration: ${activity.duration}\n`;
      pdfContent += `   Average Rating: ${activity.averageRating}/5\n`;
      if (activity.ratings.length > 0) {
        pdfContent += `   Individual Ratings: ${activity.ratings.map(r => `${r.user}: ${r.rating}`).join(', ')}\n`;
      }
      pdfContent += `\n`;
    });
  }
  
  if (tripData.restaurants && tripData.restaurants.length > 0) {
    pdfContent += `RESTAURANTS (${tripData.restaurants.length})\n`;
    tripData.restaurants.forEach((restaurant, index) => {
      pdfContent += `${index + 1}. ${restaurant.name}\n`;
      pdfContent += `   Cuisine: ${restaurant.cuisine}\n`;
      pdfContent += `   Location: ${restaurant.location}\n`;
      if (restaurant.cost) pdfContent += `   Cost: $${restaurant.cost}\n`;
      if (restaurant.priceRange) pdfContent += `   Price Range: ${restaurant.priceRange}\n`;
      pdfContent += `   Average Rating: ${restaurant.averageRating}/5\n`;
      if (restaurant.ratings.length > 0) {
        pdfContent += `   Individual Ratings: ${restaurant.ratings.map(r => `${r.user}: ${r.rating}`).join(', ')}\n`;
      }
      pdfContent += `\n`;
    });
  }
  
  // Add other sections as needed...
  
  // Create as text file for now (user can save as PDF)
  const blob = new Blob([pdfContent], { type: 'text/plain' });
  downloadBlob(blob, filename.replace('.pdf', '.txt'));
};

// Main export function that handles all formats
export const exportTripData = async (tripId, tripName) => {
  try {
    // Fetch export data from API
    const response = await fetch(`/api/trips/${tripId}/export`);
    if (!response.ok) {
      throw new Error(`Export failed: ${response.status} ${response.statusText}`);
    }
    
    const tripData = await response.json();
    const cleanName = cleanTripName(tripName);
    const dateString = getDateString();
    
    // Generate all three formats
    const jsonFilename = `${cleanName}-Export-${dateString}.json`;
    const csvFilename = `${cleanName}-Export-${dateString}.csv`;
    const pdfFilename = `${cleanName}-Export-${dateString}.pdf`;
    
    // Download all formats
    downloadJSON(tripData, jsonFilename);
    
    // Small delay between downloads to avoid browser blocking
    setTimeout(() => {
      downloadCSV(tripData, csvFilename);
    }, 500);
    
    setTimeout(() => {
      downloadPDF(tripData, pdfFilename);
    }, 1000);
    
    console.log('Trip export completed successfully');
    return true;
    
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
};