import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

// --- Products ---
export const fetchProducts = async (search = '') => {
  const res = await API.get(`/products${search ? `?search=${encodeURIComponent(search)}` : ''}`);
  return res.data;
};

export const fetchProductById = async (id) => {
  const res = await API.get(`/products/${id}`);
  return res.data;
};

// --- Cart ---
export const fetchCart = async (id) => {
  const res = await API.get(`/cart/${id}`);
  return res.data;
};

export const addToCart = async (identifier, productId, quantity = 1) => {
  const res = await API.post('/cart', { ...identifier, productId, quantity });
  return res.data;
};

export const updateCartItem = async (identifier, productId, updates) => {
  const res = await API.put('/cart', { ...identifier, productId, ...updates });
  return res.data;
};

export const removeFromCart = async (id, productId) => {
  const res = await API.delete(`/cart/${id}/${productId}`);
  return res.data;
};

// --- Orders ---
export const placeOrder = async (identifier, orderData = {}) => {
  const res = await API.post('/orders', { ...identifier, ...orderData });
  return res.data;
};

export const fetchOrders = async (id) => {
  const res = await API.get(`/orders/${id}`);
  return res.data;
};

export const fetchOrderById = async (orderId) => {
  const res = await API.get(`/orders/detail/${orderId}`);
  return res.data;
};
