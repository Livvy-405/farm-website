import { create } from 'zustand';
import { productsAPI, ordersAPI, ApiProduct, ApiOrder } from '@/lib/api';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Fulfilled';
  date: string;
}

const toProduct = (p: ApiProduct): Product => ({ ...p, id: p._id });
const toOrder = (o: ApiOrder): Order => ({ ...o, id: o._id, date: o.createdAt.split('T')[0] });

interface StoreState {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  fetchProducts: () => Promise<void>;
  fetchOrders: () => Promise<void>;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addOrder: (order: Omit<Order, 'id' | 'date'>) => Promise<void>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
}

export const useStore = create<StoreState>((set) => ({
  products: [],
  cart: [],
  orders: [],
  isCartOpen: false,

  setCartOpen: (open) => set({ isCartOpen: open }),

  fetchProducts: async () => {
    try {
      const data = await productsAPI.getAll();
      set({ products: data.map(toProduct) });
    } catch (err) {
      console.error('fetchProducts failed:', err);
    }
  },

  fetchOrders: async () => {
    try {
      const data = await ordersAPI.getAll();
      set({ orders: data.orders.map(toOrder) });
    } catch (err) {
      console.error('fetchOrders failed:', err);
    }
  },

  addToCart: (product, quantity = 1) => set((state) => {
    const existing = state.cart.find((item) => item.product.id === product.id);
    if (existing) {
      return { cart: state.cart.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item) };
    }
    return { cart: [...state.cart, { product, quantity }] };
  }),

  removeFromCart: (productId) => set((state) => ({
    cart: state.cart.filter((item) => item.product.id !== productId)
  })),

  updateCartQuantity: (productId, quantity) => set((state) => {
    if (quantity <= 0) return { cart: state.cart.filter((item) => item.product.id !== productId) };
    return { cart: state.cart.map((item) => item.product.id === productId ? { ...item, quantity } : item) };
  }),

  clearCart: () => set({ cart: [] }),

  addProduct: async (product) => {
    try {
      await productsAPI.create(product as any);
      const data = await productsAPI.getAll();
      set({ products: data.map(toProduct) });
    } catch (err) {
      console.error('addProduct failed:', err);
    }
  },

  updateProduct: async (id, updates) => {
    try {
      await productsAPI.update(id, updates as any);
      const data = await productsAPI.getAll();
      set({ products: data.map(toProduct) });
    } catch (err) {
      console.error('updateProduct failed:', err);
    }
  },

  deleteProduct: async (id) => {
    try {
      await productsAPI.delete(id);
      const data = await productsAPI.getAll();
      set({ products: data.map(toProduct) });
    } catch (err) {
      console.error('deleteProduct failed:', err);
    }
  },

  addOrder: async (order) => {
    try {
      const items = order.items.map((i) => ({
        product: {
          id: i.product.id,
          name: i.product.name,
          price: i.product.price,
          image: i.product.image,
          category: i.product.category,
        },
        quantity: i.quantity,
      }));
      await ordersAPI.create({ ...order, items });
      set({ cart: [] });
    } catch (err) {
      console.error('addOrder failed:', err);
      throw err;
    }
  },

  updateOrderStatus: async (id, status) => {
    try {
      await ordersAPI.updateStatus(id, status);
      const data = await ordersAPI.getAll();
      set({ orders: data.orders.map(toOrder) });
    } catch (err) {
      console.error('updateOrderStatus failed:', err);
    }
  },
}));
