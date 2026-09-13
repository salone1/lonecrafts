export const API_BASE_URL = process.env.VITE_API_URL || '/api';

export const API_ENDPOINTS = {
  // Public
  products: {
    list: `${API_BASE_URL}/products`,
  },
  settings: {
    get: `${API_BASE_URL}/settings`,
  },
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    verify: `${API_BASE_URL}/auth/verify`,
  },

  // Admin
  admin: {
    products: {
      list: `${API_BASE_URL}/admin/products`,
      create: `${API_BASE_URL}/admin/products`,
      update: (id: string) => `${API_BASE_URL}/admin/products/${id}`,
      toggle: (id: string) => `${API_BASE_URL}/admin/products/${id}`,
      delete: (id: string) => `${API_BASE_URL}/admin/products/${id}`,
    },
    customers: {
      list: `${API_BASE_URL}/admin/customers`,
      create: `${API_BASE_URL}/admin/customers`,
      get: (id: string) => `${API_BASE_URL}/admin/customers/${id}`,
      bills: (customerId: string) => `${API_BASE_URL}/admin/customers/${customerId}/bills`,
    },
    bills: {
      list: `${API_BASE_URL}/admin/bills`,
      create: `${API_BASE_URL}/admin/bills`,
      get: (id: string) => `${API_BASE_URL}/admin/bills/${id}`,
      addPayment: (id: string) => `${API_BASE_URL}/admin/bills/${id}/payments`,
    },
  },
};
