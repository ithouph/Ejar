export const filterOptions = {
  priceRange: {
    min: 0,
    max: 5000,
    step: 50,
  },
  propertyTypes: [
    { id: 'all', label: 'All', count: 123 },
    { id: 'hotels', label: 'Hotels', count: 24 },
    { id: 'apartments', label: 'Apartments', count: 45 },
    { id: 'villas', label: 'Villas', count: 32 },
    { id: 'resorts', label: 'Resorts', count: 22 },
  ],
  amenities: [
    { id: 'wifi', label: 'Wi-Fi', icon: 'wifi' },
    { id: 'ac', label: 'Air conditioning', icon: 'wind' },
    { id: 'pool', label: 'Pool', icon: 'droplet' },
    { id: 'parking', label: 'Parking', icon: 'truck' },
    { id: 'gym', label: 'Gym', icon: 'activity' },
    { id: 'pet', label: 'Pet friendly', icon: 'heart' },
  ],
  ratings: [
    { id: '5', label: '5 Stars', value: 5 },
    { id: '4', label: '4+ Stars', value: 4 },
    { id: '3', label: '3+ Stars', value: 3 },
  ],
};
