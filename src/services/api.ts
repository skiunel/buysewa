// API Service - Connects to Express Backend
// Replace mock implementations with real API calls

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Helper function to make API calls
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('authToken');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    const err: any = new Error(error.message || `HTTP error! status: ${response.status}`);
    err.response = { data: error };
    throw err;
  }

  return await response.json();
};

// All data is now fetched from backend API
// No mock storage needed

// ============ AUTH API ============
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.success && response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userId', response.data.user.id);
    }
    
    return response;
  },

  register: async (userData: any) => {
    const response = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.success && response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userId', response.data.user.id);
    }
    
    return response;
  },

  verifyToken: async (token: string) => {
    try {
      const response = await apiCall('/auth/me', {
        method: 'GET',
      });
      return { success: true, valid: response.success };
    } catch {
      return { success: false, valid: false };
    }
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
  },

  forgotPassword: async (email: string) => {
    return await apiCall('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  resetPassword: async (token: string, newPassword: string) => {
    return await apiCall('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    return await apiCall('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }
};

// ============ PRODUCT API ============
export const productAPI = {
  getAll: async (filters?: any) => {
    const queryParams = new URLSearchParams();
    if (filters?.category) queryParams.append('category', filters.category);
    if (filters?.search) queryParams.append('search', filters.search);
    if (filters?.minPrice) queryParams.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) queryParams.append('maxPrice', filters.maxPrice.toString());
    
    const query = queryParams.toString();
    return await apiCall(`/products${query ? `?${query}` : ''}`);
  },

  getById: async (id: number | string) => {
    return await apiCall(`/products/${id}`);
  },

  create: async (productData: any) => {
    return await apiCall('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  update: async (id: number | string, productData: any) => {
    return await apiCall(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  delete: async (id: number | string) => {
    return await apiCall(`/products/${id}`, {
      method: 'DELETE',
    });
  }
};

// ============ CART API ============
export const cartAPI = {
  get: async (userId: string) => {
    await delay();
    return { success: true, data: mockStorage.carts[userId] || [] };
  },

  add: async (userId: string, item: any) => {
    await delay();
    if (!mockStorage.carts[userId]) {
      mockStorage.carts[userId] = [];
    }

    const existingIndex = mockStorage.carts[userId].findIndex((i: any) => i.productId === item.productId);
    if (existingIndex >= 0) {
      mockStorage.carts[userId][existingIndex].quantity += item.quantity;
    } else {
      mockStorage.carts[userId].push(item);
    }

    saveToStorage();
    return { success: true, data: mockStorage.carts[userId] };
  },

  update: async (userId: string, productId: number, quantity: number) => {
    await delay();
    if (!mockStorage.carts[userId]) return { success: true, data: [] };

    const index = mockStorage.carts[userId].findIndex((i: any) => i.productId === productId);
    if (index >= 0) {
      mockStorage.carts[userId][index].quantity = quantity;
    }

    saveToStorage();
    return { success: true, data: mockStorage.carts[userId] };
  },

  remove: async (userId: string, productId: number) => {
    await delay();
    if (!mockStorage.carts[userId]) return { success: true, data: [] };

    mockStorage.carts[userId] = mockStorage.carts[userId].filter((i: any) => i.productId !== productId);
    saveToStorage();
    return { success: true, data: mockStorage.carts[userId] };
  },

  clear: async (userId: string) => {
    await delay();
    mockStorage.carts[userId] = [];
    saveToStorage();
    return { success: true };
  }
};

// ============ ORDER API ============
export const orderAPI = {
  create: async (orderData: any) => {
    return await apiCall('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  getById: async (id: string) => {
    return await apiCall(`/orders/${id}`);
  },

  getUserOrders: async (userId: string) => {
    return await apiCall(`/orders/user/${userId}`);
  },

  updateStatus: async (orderId: string, status: string) => {
    return await apiCall(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
  verifyPayment: async (orderId: string, paymentStatus: string, transactionId?: string, notes?: string) => {
    return await apiCall(`/orders/${orderId}/payment/verify`, {
      method: 'PATCH',
      body: JSON.stringify({ paymentStatus, transactionId, notes }),
    });
  },
  getByPaymentStatus: async (status: string) => {
    return await apiCall(`/orders/payment/${status}`);
  },

  getAll: async () => {
    return await apiCall('/orders');
  }
};

// ============ REVIEW API ============
export const reviewAPI = {
  create: async (reviewData: any) => {
    return await apiCall('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  },

  getProductReviews: async (productId: number | string) => {
    return await apiCall(`/reviews/product/${productId}`);
  },

  getUserReviews: async (userId: string) => {
    return await apiCall(`/reviews/user/${userId}`);
  },

  getById: async (reviewId: string) => {
    return await apiCall(`/reviews/${reviewId}`);
  },

  verify: async (reviewId: string, blockchainHash: string, ipfsHash: string) => {
    // This is handled automatically by the backend when submitting a review
    return { success: true };
  }
};

// ============ SDC API ============
export const sdcAPI = {
  verify: async (sdcCode: string) => {
    return await apiCall('/sdc/verify', {
      method: 'POST',
      body: JSON.stringify({ sdcCode }),
    });
  },

  getUserSDCs: async (userId: string) => {
    return await apiCall(`/sdc/user/${userId}`);
  },

  registerBlockchain: async (sdcId: string) => {
    return await apiCall('/sdc/register-blockchain', {
      method: 'POST',
      body: JSON.stringify({ sdcId }),
    });
  }
};

// ============ PAYMENT API ============
export const paymentAPI = {
  initiatePayment: async (paymentData: any) => {
    await delay();
    // Simulate payment gateway (eSewa/Khalti)
    const paymentId = `PAY-${Date.now()}`;
    return {
      success: true,
      data: {
        paymentId,
        paymentUrl: `/payment/${paymentId}`,
        ...paymentData
      }
    };
  },

  verifyPayment: async (paymentId: string) => {
    await delay(1000);
    // Simulate payment verification
    return {
      success: true,
      data: {
        paymentId,
        status: 'completed',
        transactionId: `TXN-${Date.now()}`
      }
    };
  },

  // Mock eSewa integration
  eSewa: {
    initiate: async (amount: number, orderId: string) => {
      await delay();
      return {
        success: true,
        data: {
          paymentUrl: `https://esewa.com.np/epay/main?amt=${amount}&pid=${orderId}&scd=MERCHANT_CODE`,
          orderId
        }
      };
    }
  },

  // Mock Khalti integration
  khalti: {
    initiate: async (amount: number, orderId: string) => {
      await delay();
      return {
        success: true,
        data: {
          paymentUrl: `https://khalti.com/payment/verify/?pidx=KHALTI_${orderId}`,
          orderId
        }
      };
    }
  }
};

// ============ ADMIN API ============
export const adminAPI = {
  getStats: async () => {
    await delay();
    return {
      success: true,
      data: {
        totalUsers: mockStorage.users.length,
        totalProducts: mockStorage.products.length,
        totalOrders: mockStorage.orders.length,
        totalRevenue: mockStorage.orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0),
        pendingOrders: mockStorage.orders.filter((o: any) => o.status === 'processing').length
      }
    };
  },

  getUsers: async () => {
    await delay();
    return { success: true, data: mockStorage.users };
  },

  updateUser: async (userId: string, userData: any) => {
    await delay();
    const index = mockStorage.users.findIndex((u: any) => u.id === userId);
    if (index === -1) throw new Error('User not found');

    mockStorage.users[index] = { ...mockStorage.users[index], ...userData };
    saveToStorage();
    return { success: true, data: mockStorage.users[index] };
  },

  approveProduct: async (productId: number) => {
    await delay();
    const index = mockStorage.products.findIndex((p: any) => p.id === productId);
    if (index === -1) throw new Error('Product not found');

    mockStorage.products[index].status = 'active';
    saveToStorage();
    return { success: true, data: mockStorage.products[index] };
  }
};

// ============ ANALYTICS API ============
export const analyticsAPI = {
  logEvent: async (eventData: any) => {
    await delay(100);
    // Log analytics event (would send to backend in production)
    console.log('Analytics Event:', eventData);
    return { success: true };
  },

  getProductViews: async (productId: number) => {
    await delay();
    return { success: true, data: { views: Math.floor(Math.random() * 1000) } };
  }
};

// ============ UPLOAD API ============
export const uploadAPI = {
  uploadImage: async (file: File) => {
    await delay(1000);
    // Simulate Cloudinary upload
    // In production, this would upload to Cloudinary and return the URL
    return {
      success: true,
      data: {
        url: URL.createObjectURL(file),
        publicId: `buysewa-${Date.now()}`
      }
    };
  }
};

export default {
  auth: authAPI,
  products: productAPI,
  cart: cartAPI,
  orders: orderAPI,
  reviews: reviewAPI,
  sdc: sdcAPI,
  payment: paymentAPI,
  admin: adminAPI,
  analytics: analyticsAPI,
  upload: uploadAPI
};