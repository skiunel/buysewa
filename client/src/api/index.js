import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_ENDPOINT || 'http://localhost:5000/api';

// Axios instance
const api = axios.create({ baseURL: BASE_URL });

// Request interceptor - attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access-token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth
export const fetcRegister = async (input) => {
  const { data } = await api.post('/auth/register', input);
  return data;
};

export const fetchLogin = async (input) => {
  const { data } = await api.post('/auth/login', input);
  return data;
};

export const fetchMe = async () => {
  try {
    const token = localStorage.getItem('access-token');
    if (!token) return {};
    const { data } = await api.get('/auth/me');
    return data;
  } catch (error) {
    if (error.response && [401, 403].includes(error.response.status)) {
      localStorage.removeItem('access-token');
      localStorage.removeItem('refresh-token');
    }
    return {};
  }
};

export const fetchLogout = async () => {
  const refreshToken = localStorage.getItem('refresh-token');
  if (!refreshToken) return;
  try {
    const { data } = await api.post('/auth/logout', { refresh_token: refreshToken });
    return data;
  } catch (e) {
    console.warn('Logout error:', e.message);
  }
};

// Products
export const fetchProductList = async () => {
  const { data } = await api.get('/product');
  return data;
};

export const fetchProduct = async (id) => {
  const { data } = await api.get(`/product/${id}`);
  return data;
};

export const postProduct = async (input) => {
  const { data } = await api.post('/product', input);
  return data;
};

export const updateProduct = async ({ input, product_id }) => {
  const { data } = await api.put(`/product/${product_id}`, input);
  return data;
};

export const deleteProduct = async (product_id) => {
  const { data } = await api.delete(`/product/${product_id}`);
  return data;
};

export const fetchProductRating = async (product_id) => {
  const { data } = await api.get(`/product/${product_id}/rating`);
  return data;
};

// Orders
export const postOrder = async (input) => {
  const { data } = await api.post('/order', input);
  return data;
};

export const fetchOrders = async () => {
  const { data } = await api.get('/order');
  return data;
};

export const fetchUserOrders = async () => {
  const { data } = await api.get('/order/my-orders');
  return data;
};

export const deleteOrder = async (order_id) => {
  const { data } = await api.delete(`/order/${order_id}`);
  return data;
};

// Deliveries
export const markOrderAsDelivered = async (order_id) => {
  const { data } = await api.post(`/delivery/admin/deliver/${order_id}`);
  return data;
};

export const fetchUserDeliveries = async () => {
  const { data } = await api.get('/delivery/my-deliveries');
  return data;
};

// Reviews
export const fetchReviews = async (product_id) => {
  try {
    const { data } = await api.get(`/public/reviews/product/${product_id}`);
    return data;
  } catch (error) {
    return [];
  }
};

export const submitReview = async (product_id, reviewData) => {
  const { data } = await api.post('/review', { product_id, ...reviewData });
  return data;
};

export const submitWeb3Review = async (product_id, reviewData) => {
  const { data } = await api.post('/web3-review', { product_id, ...reviewData });
  return data;
};

// Analytics
export const fetchAnalyticsSummary = async () => {
  const { data } = await api.get('/analytics/summary');
  return data;
};

export const fetchSalesOverTime = async (days = 30) => {
  const { data } = await api.get(`/analytics/sales-over-time?days=${days}`);
  return data;
};

export const fetchRevenueByCategory = async () => {
  const { data } = await api.get('/analytics/revenue-by-category');
  return data;
};

export const fetchOrderStatus = async () => {
  const { data } = await api.get('/analytics/order-status');
  return data;
};

export const fetchTopProducts = async (limit = 10) => {
  const { data } = await api.get(`/analytics/top-products?limit=${limit}`);
  return data;
};

// Stores
export const fetchStores = async () => {
  const { data } = await api.get('/store');
  return data;
};

export const fetchMyStore = async () => {
  const { data } = await api.get('/store/my-store');
  return data;
};

export const createStore = async (input) => {
  const { data } = await api.post('/store', input);
  return data;
};

export const updateStore = async ({ store_id, input }) => {
  const { data } = await api.put(`/store/${store_id}`, input);
  return data;
};

export const deleteStore = async (store_id) => {
  const { data } = await api.delete(`/store/${store_id}`);
  return data;
};

export const assignStoreAdmin = async ({ store_id, email }) => {
  const { data } = await api.post(`/store/${store_id}/assign-admin`, { email });
  return data;
};

export default api;
