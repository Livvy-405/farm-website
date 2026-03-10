import { create } from 'zustand';

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

interface StoreState {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addOrder: (order: Omit<Order, 'id' | 'date'>) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
}

const initialProducts: Product[] = [
  { id: '1', name: 'Organic Tomatoes', description: 'Vine-ripened heirloom tomatoes grown without pesticides. Bursting with flavor, perfect for salads and sauces.', price: 4.99, image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600', category: 'Produce', inStock: true },
  { id: '2', name: 'Free Range Eggs', description: 'Farm-fresh eggs from happy, pasture-raised hens. Rich golden yolks with incredible taste.', price: 6.50, image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600', category: 'Dairy & Eggs', inStock: true },
  { id: '3', name: 'Wildflower Honey', description: 'Raw, unfiltered honey harvested from our own beehives. Complex floral notes with a smooth finish.', price: 12.99, image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600', category: 'Pantry', inStock: true },
  { id: '4', name: 'Sweet Corn', description: 'Freshly picked sweet corn, harvested at peak sweetness. Nothing beats farm-fresh corn on the cob.', price: 3.49, image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600', category: 'Produce', inStock: true },
  { id: '5', name: 'Heirloom Lettuce Mix', description: 'A vibrant mix of butterhead, oak leaf, and romaine lettuces. Tender leaves perfect for any salad.', price: 3.99, image: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=600', category: 'Produce', inStock: true },
  { id: '6', name: 'Sunflower Seeds', description: 'Organic sunflower seeds ready for planting or snacking. Grown and dried naturally on our farm.', price: 5.99, image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600', category: 'Seeds', inStock: false },
  { id: '7', name: 'Fresh Basil Bundle', description: 'Aromatic Genovese basil, hand-picked and bundled. The essential herb for Italian cooking.', price: 2.99, image: 'https://images.unsplash.com/photo-1618164435735-413d3b066c9a?w=600', category: 'Herbs', inStock: true },
  { id: '8', name: 'Strawberry Jam', description: 'Small-batch strawberry preserves made with our own berries. Just fruit, sugar, and a touch of lemon.', price: 8.99, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600', category: 'Pantry', inStock: true },
];

const initialOrders: Order[] = [
  { id: 'ord-1', customerName: 'Sarah Mitchell', email: 'sarah@email.com', phone: '555-0101', address: '123 Oak Lane', items: [{ product: initialProducts[0], quantity: 2 }, { product: initialProducts[2], quantity: 1 }], total: 22.97, status: 'Fulfilled', date: '2026-03-01' },
  { id: 'ord-2', customerName: 'James Cooper', email: 'james@email.com', phone: '555-0102', address: '456 Elm Street', items: [{ product: initialProducts[1], quantity: 3 }], total: 19.50, status: 'Pending', date: '2026-03-03' },
  { id: 'ord-3', customerName: 'Emily Watson', email: 'emily@email.com', phone: '555-0103', address: '789 Maple Ave', items: [{ product: initialProducts[3], quantity: 4 }, { product: initialProducts[4], quantity: 1 }], total: 17.95, status: 'Pending', date: '2026-03-04' },
];

export const useStore = create<StoreState>((set) => ({
  products: initialProducts,
  cart: [],
  orders: initialOrders,
  isCartOpen: false,
  setCartOpen: (open) => set({ isCartOpen: open }),
  addToCart: (product, quantity = 1) => set((state) => {
    const existing = state.cart.find((item) => item.product.id === product.id);
    if (existing) {
      return { cart: state.cart.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item) };
    }
    return { cart: [...state.cart, { product, quantity }] };
  }),
  removeFromCart: (productId) => set((state) => ({ cart: state.cart.filter((item) => item.product.id !== productId) })),
  updateCartQuantity: (productId, quantity) => set((state) => {
    if (quantity <= 0) return { cart: state.cart.filter((item) => item.product.id !== productId) };
    return { cart: state.cart.map((item) => item.product.id === productId ? { ...item, quantity } : item) };
  }),
  clearCart: () => set({ cart: [] }),
  addProduct: (product) => set((state) => ({ products: [...state.products, { ...product, id: Date.now().toString() }] })),
  updateProduct: (id, updates) => set((state) => ({ products: state.products.map((p) => p.id === id ? { ...p, ...updates } : p) })),
  deleteProduct: (id) => set((state) => ({ products: state.products.filter((p) => p.id !== id) })),
  addOrder: (order) => set((state) => ({ orders: [...state.orders, { ...order, id: `ord-${Date.now()}`, date: new Date().toISOString().split('T')[0] }] })),
  updateOrderStatus: (id, status) => set((state) => ({ orders: state.orders.map((o) => o.id === id ? { ...o, status } : o) })),
}));
