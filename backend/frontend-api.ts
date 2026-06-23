// src/lib/api.ts
// Drop this file into your React project at src/lib/api.ts
// Then update useStore.ts to call these functions instead of mutating local state.

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ── Token helpers ─────────────────────────────────────────────────────────────

export const getToken = () => localStorage.getItem('ghf_token');
export const setToken = (token: string) => localStorage.setItem('ghf_token', token);
export const clearToken = () => localStorage.removeItem('ghf_token');

const authHeader = (): Record<string, string> => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ── Generic fetch wrapper ─────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
      ...(options.headers as Record<string, string>),
    },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'API error');
  }

  return res.json();
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export const authAPI = {
  login: (password: string) =>
    request<{ token: string; expiresIn: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    }),

  verify: () =>
    request<{ valid: boolean }>('/auth/verify'),
};

// ── Products ──────────────────────────────────────────────────────────────────

export interface ApiProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export const productsAPI = {
  getAll: (params?: { category?: string; inStock?: boolean; search?: string }) => {
    const qs = new URLSearchParams();
    if (params?.category) qs.set('category', params.category);
    if (params?.inStock !== undefined) qs.set('inStock', String(params.inStock));
    if (params?.search) qs.set('search', params.search);
    return request<ApiProduct[]>(`/products${qs.toString() ? `?${qs}` : ''}`);
  },

  getCategories: () => request<string[]>('/products/categories'),

  getById: (id: string) => request<ApiProduct>(`/products/${id}`),

  create: (data: Omit<ApiProduct, '_id' | 'createdAt' | 'updatedAt'>) =>
    request<ApiProduct>('/products', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: Partial<ApiProduct>) =>
    request<ApiProduct>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  toggleStock: (id: string, inStock: boolean) =>
    request<ApiProduct>(`/products/${id}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ inStock }),
    }),

  delete: (id: string) =>
    request<{ message: string }>(`/products/${id}`, { method: 'DELETE' }),
};

// ── Orders ────────────────────────────────────────────────────────────────────

export interface ApiOrderItem {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
  };
  quantity: number;
}

export interface ApiOrder {
  _id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  items: ApiOrderItem[];
  total: number;
  status: 'Pending' | 'Fulfilled';
  createdAt: string;
  updatedAt: string;
}

export const ordersAPI = {
  create: (data: Omit<ApiOrder, '_id' | 'status' | 'createdAt' | 'updatedAt'>) =>
    request<ApiOrder>('/orders', { method: 'POST', body: JSON.stringify(data) }),

  getAll: (params?: { status?: string; page?: number; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set('status', params.status);
    if (params?.page) qs.set('page', String(params.page));
    if (params?.limit) qs.set('limit', String(params.limit));
    return request<{ orders: ApiOrder[]; total: number; page: number; pages: number }>(
      `/orders${qs.toString() ? `?${qs}` : ''}`
    );
  },

  getStats: () =>
    request<{
      totalOrders: number;
      pendingOrders: number;
      fulfilledOrders: number;
      totalRevenue: number;
    }>('/orders/stats'),

  updateStatus: (id: string, status: 'Pending' | 'Fulfilled') =>
    request<ApiOrder>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  delete: (id: string) =>
    request<{ message: string }>(`/orders/${id}`, { method: 'DELETE' }),
};
