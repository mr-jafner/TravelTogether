import React from 'react';

const GroupAnalysisTab = ({ trip, activityRatings, restaurantRatings }) => {
  // Calculate consensus data for activities
  const calculateActivityConsensus = () => {
    if (!trip.activities || trip.activities.length === 0) return [];
    
    return trip.activities.map(activity => {
      const ratings = activityRatings[activity.id] || {};
      const ratingValues = Object.values(ratings);
      const total = ratingValues.length;
      const sum = ratingValues.reduce((acc, rating) => acc + rating, 0);
      const avg = total > 0 ? sum / total : 0;
      const interested = ratingValues.filter(rating => rating >= 3).length;
      
      return {
        id: activity.id,
        name: activity.name,
        category: activity.category,
        avg: avg,
        total: total,
        interested: interested,
        ratings: ratings
      };
    });
  };

  // Calculate consensus data for restaurants
  const calculateRestaurantConsensus = () => {
    if (!trip.restaurants || trip.restaurants.length === 0) return [];
    
    return trip.restaurants.map(restaurant => {
      const ratings = restaurantRatings[restaurant.id] || {};
      const ratingValues = Object.values(ratings);
      const total = ratingValues.length;
      const sum = ratingValues.reduce((acc, rating) => acc + rating, 0);
      const avg = total > 0 ? sum / total : 0;
      const interested = ratingValues.filter(rating => rating >= 3).length;
      
      return {
        id: restaurant.id,
        name: restaurant.name,
        cuisine: restaurant.cuisine,
        avg: avg,
        total: total,
        interested: interested,
        ratings: ratings
      };
    });
  };

  const activityConsensusData = calculateActivityConsensus();
  const restaurantConsensusData = calculateRestaurantConsensus();

  const strongActivityConsensus = activityConsensusData.filter(a => a.avg >= 4);
  const strongRestaurantConsensus = restaurantConsensusData.filter(r => r.avg >= 4);
  const divisiveActivities = activityConsensusData.filter(a => a.interested > 0 && a.interested < a.total * 0.6);
  const divisiveRestaurants = restaurantConsensusData.filter(r => r.interested > 0 && r.interested < r.total * 0.6);

  const hasData = activityConsensusData.length > 0 || restaurantConsensusData.length > 0;
  const hasStrongConsensus = strongActivityConsensus.length > 0 || strongRestaurantConsensus.length > 0;
  const hasDivisiveItems = divisiveActivities.length > 0 || divisiveRestaurants.length > 0;

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
        <svg className="w-7 h-7 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Group Consensus Analysis
      </h3>

      {!hasData && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h4 className="text-lg font-semibold text-gray-700 mb-2">No Ratings Yet</h4>
          <p className="text-gray-500 mb-4">
            Start rating activities and restaurants to see group analysis and consensus!
          </p>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Add activities and restaurants from their respective tabs</p>
            <p>• Have group members rate items 0-5 based on their preferences</p>
            <p>• Come back here to see group consensus and plan accordingly</p>
          </div>
        </div>
      )}

      {hasData && (
        <div className="space-y-6">
          {/* Strong Consensus Section */}
          {hasStrongConsensus && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h4 className="font-bold text-green-800 mb-4 flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                Strong Group Consensus (4.0+ Average Rating)
              </h4>
              <div className="space-y-4">
                {strongActivityConsensus.length > 0 && (
                  <div>
                    <h5 className="text-lg font-semibold text-green-700 mb-3">🎯 Activities:</h5>
                    <div className="grid gap-3">
                      {strongActivityConsensus.map(activity => (
                        <div key={`activity-${activity.id}`} className="bg-green-100 border border-green-300 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-semibold text-green-800">{activity.name}</span>
                              <span className="ml-2 text-sm text-green-600 bg-green-200 px-2 py-1 rounded">
                                {activity.category}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-lg font-bold text-green-600">
                                {activity.avg.toFixed(1)}/5
                              </span>
                              <div className="text-sm text-green-600">
                                {activity.interested}/{activity.total} interested
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {strongRestaurantConsensus.length > 0 && (
                  <div>
                    <h5 className="text-lg font-semibold text-green-700 mb-3">🍽️ Restaurants:</h5>
                    <div className="grid gap-3">
                      {strongRestaurantConsensus.map(restaurant => (
                        <div key={`restaurant-${restaurant.id}`} className="bg-green-100 border border-green-300 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-semibold text-green-800">{restaurant.name}</span>
                              <span className="ml-2 text-sm text-green-600 bg-green-200 px-2 py-1 rounded">
                                {restaurant.cuisine}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-lg font-bold text-green-600">
                                {restaurant.avg.toFixed(1)}/5
                              </span>
                              <div className="text-sm text-green-600">
                                {restaurant.interested}/{restaurant.total} interested
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Divisive Items Section */}
          {hasDivisiveItems && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h4 className="font-bold text-yellow-800 mb-4 flex items-center">
                <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                Mixed Opinions - Consider Subgroups
              </h4>
              <div className="space-y-4">
                {divisiveActivities.length > 0 && (
                  <div>
                    <h5 className="text-lg font-semibold text-yellow-700 mb-3">🎯 Activities:</h5>
                    <div className="grid gap-3">
                      {divisiveActivities.map(activity => (
                        <div key={`div-activity-${activity.id}`} className="bg-yellow-100 border border-yellow-300 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-semibold text-yellow-800">{activity.name}</span>
                              <span className="ml-2 text-sm text-yellow-600 bg-yellow-200 px-2 py-1 rounded">
                                {activity.category}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-lg font-bold text-yellow-600">
                                {activity.avg.toFixed(1)}/5
                              </span>
                              <div className="text-sm text-yellow-600">
                                {activity.interested}/{activity.total} interested
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 text-sm text-yellow-700">
                            💡 Some group members love this, others don't. Consider splitting up or finding alternatives.
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {divisiveRestaurants.length > 0 && (
                  <div>
                    <h5 className="text-lg font-semibold text-yellow-700 mb-3">🍽️ Restaurants:</h5>
                    <div className="grid gap-3">
                      {divisiveRestaurants.map(restaurant => (
                        <div key={`div-restaurant-${restaurant.id}`} className="bg-yellow-100 border border-yellow-300 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-semibold text-yellow-800">{restaurant.name}</span>
                              <span className="ml-2 text-sm text-yellow-600 bg-yellow-200 px-2 py-1 rounded">
                                {restaurant.cuisine}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-lg font-bold text-yellow-600">
                                {restaurant.avg.toFixed(1)}/5
                              </span>
                              <div className="text-sm text-yellow-600">
                                {restaurant.interested}/{restaurant.total} interested
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 text-sm text-yellow-700">
                            💡 Mixed preferences on this restaurant. Consider having multiple meal options or different dining times.
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* All Items Summary */}
          {(activityConsensusData.length > 0 || restaurantConsensusData.length > 0) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-bold text-blue-800 mb-4 flex items-center">
                <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                Complete Ratings Summary
              </h4>
              
              {activityConsensusData.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-lg font-semibold text-blue-700 mb-3">🎯 All Activities:</h5>
                  <div className="grid gap-2">
                    {activityConsensusData
                      .sort((a, b) => b.avg - a.avg)
                      .map(activity => (
                        <div key={`all-activity-${activity.id}`} className="flex justify-between items-center p-3 bg-blue-100 border border-blue-300 rounded">
                          <div>
                            <span className="font-medium text-blue-800">{activity.name}</span>
                            <span className="ml-2 text-xs text-blue-600 bg-blue-200 px-2 py-1 rounded">
                              {activity.category}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-sm text-blue-600">
                              {activity.interested}/{activity.total} interested
                            </span>
                            <span className="font-bold text-blue-600">
                              {activity.avg.toFixed(1)}/5
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {restaurantConsensusData.length > 0 && (
                <div>
                  <h5 className="text-lg font-semibold text-blue-700 mb-3">🍽️ All Restaurants:</h5>
                  <div className="grid gap-2">
                    {restaurantConsensusData
                      .sort((a, b) => b.avg - a.avg)
                      .map(restaurant => (
                        <div key={`all-restaurant-${restaurant.id}`} className="flex justify-between items-center p-3 bg-blue-100 border border-blue-300 rounded">
                          <div>
                            <span className="font-medium text-blue-800">{restaurant.name}</span>
                            <span className="ml-2 text-xs text-blue-600 bg-blue-200 px-2 py-1 rounded">
                              {restaurant.cuisine}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-sm text-blue-600">
                              {restaurant.interested}/{restaurant.total} interested
                            </span>
                            <span className="font-bold text-blue-600">
                              {restaurant.avg.toFixed(1)}/5
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* No Strong Consensus Message */}
          {hasData && !hasStrongConsensus && !hasDivisiveItems && (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">Ratings in Progress</h4>
              <p className="text-gray-600">
                Keep rating activities and restaurants to build group consensus!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GroupAnalysisTab;