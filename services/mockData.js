// Mock Data Service - Fallback with phone number only users
export const mockData = {
  users: [
    { id: "650e8400-e29b-41d4-a716-446655440001", phone_number: "22212345678" },
    { id: "650e8400-e29b-41d4-a716-446655440002", phone_number: "22287654321" },
    { id: "650e8400-e29b-41d4-a716-446655440003", phone_number: "22298765432" },
    { id: "650e8400-e29b-41d4-a716-446655440004", phone_number: "22256789012" },
    { id: "650e8400-e29b-41d4-a716-446655440005", phone_number: "22289876543" },
  ],

  posts: [
    {
      id: "850e8400-e29b-41d4-a716-446655440001",
      user_id: "650e8400-e29b-41d4-a716-446655440001",
      title: "Modern Apartment for Rent",
      description: "2 bedroom luxury apartment in downtown with AC and parking",
      category: "property",
      listing_type: "rent",
      price: 150000,
      location: "Nouakchott",
      image_url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=400&fit=crop",
      images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=400&fit=crop"],
      rating: 4.5,
      total_reviews: 2,
    },
    {
      id: "850e8400-e29b-41d4-a716-446655440002",
      user_id: "650e8400-e29b-41d4-a716-446655440002",
      title: "Beautiful Villa for Sale",
      description: "Spacious 4 bedroom villa with garden and pool",
      category: "property",
      listing_type: "buy",
      price: 2500000,
      location: "Nouakchott",
      image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=400&fit=crop",
      images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=400&fit=crop"],
      rating: 5,
      total_reviews: 1,
    },
    {
      id: "850e8400-e29b-41d4-a716-446655440004",
      user_id: "650e8400-e29b-41d4-a716-446655440001",
      title: "iPhone 14 Pro - Like New",
      description: "Excellent condition, all accessories included",
      category: "electronics",
      price: 150000,
      location: "Nouakchott",
      image_url: "https://images.unsplash.com/photo-1592286927505-1def25115558?w=400&h=400&fit=crop",
      images: ["https://images.unsplash.com/photo-1592286927505-1def25115558?w=400&h=400&fit=crop"],
      rating: 5,
      total_reviews: 1,
    },
    {
      id: "850e8400-e29b-41d4-a716-446655440007",
      user_id: "650e8400-e29b-41d4-a716-446655440001",
      title: "Toyota Camry 2020",
      description: "Well-maintained family car, low mileage",
      category: "vehicles",
      price: 850000,
      location: "Nouakchott",
      image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
      images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop"],
      rating: 4,
      total_reviews: 1,
    },
    {
      id: "850e8400-e29b-41d4-a716-446655440009",
      user_id: "650e8400-e29b-41d4-a716-446655440002",
      title: "Designer Sofa",
      description: "Modern grey sofa, perfect for living room",
      category: "furniture",
      price: 200000,
      location: "Nouakchott",
      image_url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
      images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop"],
      rating: 4.3,
      total_reviews: 0,
    },
  ],

  getAll: function (filters = {}) {
    let filtered = this.posts;

    if (filters.category && filters.category !== "all") {
      filtered = filtered.filter((p) => p.category === filters.category);
    }

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search)
      );
    }

    if (filters.minPrice !== undefined) {
      filtered = filtered.filter((p) => p.price >= filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.price <= filters.maxPrice);
    }

    return filtered;
  },

  getOne: function (id) {
    return this.posts.find((p) => p.id === id) || null;
  },

  reviews: [
    {
      id: "r1",
      post_id: "850e8400-e29b-41d4-a716-446655440001",
      user_id: "650e8400-e29b-41d4-a716-446655440002",
      rating: 5,
      comment: "Great apartment!",
    },
    {
      id: "r2",
      post_id: "850e8400-e29b-41d4-a716-446655440004",
      user_id: "650e8400-e29b-41d4-a716-446655440003",
      rating: 4,
      comment: "Good condition",
    },
  ],

  getReviews: function (postId) {
    return this.reviews.filter((r) => r.post_id === postId);
  },
};

export default mockData;
