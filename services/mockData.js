// Mock Data Service - Fallback for app display with VALID image URLs
// Matches DATABASE_SEEDS.sql dummy data for consistency
export const mockData = {
  posts: [
    // Properties
    {
      id: "850e8400-e29b-41d4-a716-446655440001",
      user_id: "650e8400-e29b-41d4-a716-446655440001",
      title: "Modern Apartment for Rent",
      description: "2 bedroom luxury apartment in downtown with AC and parking",
      category: "property",
      listing_type: "rent",
      property_type: "apartment",
      price: 150000,
      location: "Nouakchott",
      image_url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=400&fit=crop",
      images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=400&fit=crop"],
      rating: 4.5,
      total_reviews: 2,
      created_at: new Date().toISOString(),
      users: { full_name: "Ahmed Mohamed", photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" }
    },
    {
      id: "850e8400-e29b-41d4-a716-446655440002",
      user_id: "650e8400-e29b-41d4-a716-446655440002",
      title: "Beautiful Villa for Sale",
      description: "Spacious 4 bedroom villa with garden and pool",
      category: "property",
      listing_type: "buy",
      property_type: "villa",
      price: 2500000,
      location: "Nouakchott",
      image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=400&fit=crop",
      images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=400&fit=crop"],
      rating: 5,
      total_reviews: 1,
      created_at: new Date().toISOString(),
      users: { full_name: "Fatima Ali", photo_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" }
    },
    // Electronics
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
      created_at: new Date().toISOString(),
      users: { full_name: "Ahmed Mohamed", photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" }
    },
    {
      id: "850e8400-e29b-41d4-a716-446655440005",
      user_id: "650e8400-e29b-41d4-a716-446655440002",
      title: "MacBook Pro 16 inch",
      description: "2022 model, barely used, perfect for work",
      category: "electronics",
      price: 550000,
      location: "Nouakchott",
      image_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
      images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop"],
      rating: 4.5,
      total_reviews: 0,
      created_at: new Date().toISOString(),
      users: { full_name: "Fatima Ali", photo_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" }
    },
    // Vehicles
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
      created_at: new Date().toISOString(),
      users: { full_name: "Ahmed Mohamed", photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" }
    },
    // Furniture
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
      created_at: new Date().toISOString(),
      users: { full_name: "Fatima Ali", photo_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" }
    }
  ],

  getAll: function(filters = {}) {
    let filtered = this.posts;
    
    if (filters.category && filters.category !== "all") {
      filtered = filtered.filter(p => p.category === filters.category);
    }
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(search) || 
        p.description.toLowerCase().includes(search)
      );
    }
    
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(p => p.price >= filters.minPrice);
    }
    
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(p => p.price <= filters.maxPrice);
    }
    
    return filtered;
  },

  getOne: function(id) {
    return this.posts.find(p => p.id === id) || null;
  },

  reviews: [
    { id: "r1", post_id: "1", user_id: "user10", rating: 5, comment: "Great apartment!", users: { full_name: "Ali", photo_url: "https://via.placeholder.com/40/06b6d4/ffffff?text=A" } },
    { id: "r2", post_id: "2", user_id: "user11", rating: 4, comment: "Good condition", users: { full_name: "Mona", photo_url: "https://via.placeholder.com/40/84cc16/ffffff?text=M" } },
  ],

  getReviews: function(postId) {
    return this.reviews.filter(r => r.post_id === postId);
  }
};

export default mockData;
