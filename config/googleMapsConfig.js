const { Client } = require('@googlemaps/google-maps-services-js');

const client = new Client({});

async function findNearbyPharmacies(latitude, longitude, radius = 5000) {
  try {
    const response = await client.nearbySearch({
      params: {
        location: [latitude, longitude],
        radius: radius,
        type: 'pharmacy',
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });

    return response.data.results.map(place => ({
      name: place.name,
      address: place.vicinity,
      location: place.geometry.location,
      rating: place.rating,
      openNow: place.opening_hours?.open_now
    }));
  } catch (error) {
    console.error('Google Maps API error:', error);
    return [];
  }
}

module.exports = { findNearbyPharmacies };