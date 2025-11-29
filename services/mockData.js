// Mock Data Service - Fallback for app display with VALID image URLs
export const mockData = {
  posts: [
    {
      id: "1",
      user_id: "user1",
      title: "Modern Apartment for Rent",
      description: "Beautiful 2-bedroom apartment in downtown area",
      category: "property",
      price: 1500,
      location: "Downtown",
      image_url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=400&fit=crop",
      images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=400&fit=crop"],
      rating: 4.5,
      total_reviews: 12,
      created_at: new Date().toISOString(),
      users: { full_name: "Ahmed", photo_url: "https://via.placeholder.com/40/3b82f6/ffffff?text=A" }
    },
    {
      id: "2",
      user_id: "user2",
      title: "iPhone 14 Pro - Like New",
      description: "Excellent condition, all accessories included",
      category: "electronics",
      price: 800,
      location: "Mall Area",
      image_url: "https://images.unsplash.com/photo-1592286927505-1def25115558?w=400&h=400&fit=crop",
      images: ["https://images.unsplash.com/photo-1592286927505-1def25115558?w=400&h=400&fit=crop"],
      rating: 4.8,
      total_reviews: 5,
      created_at: new Date().toISOString(),
      users: { full_name: "Fatima", photo_url: "https://via.placeholder.com/40/ec4899/ffffff?text=F" }
    },
    {
      id: "3",
      user_id: "user3",
      title: "Toyota Camry 2020",
      description: "Well-maintained family car, low mileage",
      category: "vehicles",
      price: 25000,
      location: "Airport Road",
      image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
      images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop"],
      rating: 4.6,
      total_reviews: 8,
      created_at: new Date().toISOString(),
      users: { full_name: "Mohammed", photo_url: "https://via.placeholder.com/40/f59e0b/ffffff?text=M" }
    },
    {
      id: "4",
      user_id: "user4",
      title: "Designer Sofa",
      description: "Modern grey sofa, perfect for living room",
      category: "furniture",
      price: 600,
      location: "Furniture Mall",
      image_url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
      images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop"],
      rating: 4.3,
      total_reviews: 6,
      created_at: new Date().toISOString(),
      users: { full_name: "Noor", photo_url: "https://via.placeholder.com/40/10b981/ffffff?text=N" }
    },
    {
      id: "5",
      user_id: "user5",
      title: "MacBook Pro 16 inch",
      description: "2022 model, barely used, perfect for work",
      category: "electronics",
      price: 2200,
      location: "Tech District",
      image_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
      images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop"],
      rating: 4.9,
      total_reviews: 3,
      created_at: new Date().toISOString(),
      users: { full_name: "Sara", photo_url: "https://via.placeholder.com/40/8b5cf6/ffffff?text=S" }
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
