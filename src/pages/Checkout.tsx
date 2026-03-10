import { useState } from 'react';
import { useStore } from '@/stores/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Checkout = () => {
  const { cart, clearCart, addOrder } = useStore();
  const [placed, setPlaced] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addOrder({ customerName: form.name, email: form.email, phone: form.phone, address: form.address, items: cart, total, status: 'Pending' });
    clearCart();
    setPlaced(true);
  };

  if (placed) {
    return (
      <div className="container mx-auto px-4 py-20 text-center animate-fade-up">
        <CheckCircle className="h-16 w-16 text-primary mx-auto" />
        <h1 className="font-display text-4xl font-bold mt-6">Order Placed!</h1>
        <p className="text-muted-foreground mt-3 max-w-md mx-auto">Thank you for your order. We'll get your farm-fresh goods ready and reach out with delivery details.</p>
        <Button asChild className="mt-8"><Link to="/shop">Continue Shopping</Link></Button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-bold">Your cart is empty</h1>
        <Button asChild variant="link" className="mt-4"><Link to="/shop">Go to Shop</Link></Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="font-display text-4xl font-bold mb-10">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
        <form onSubmit={handleSubmit} className="md:col-span-3 space-y-5">
          <div><Label htmlFor="name">Full Name</Label><Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><Label htmlFor="email">Email</Label><Input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div><Label htmlFor="phone">Phone</Label><Input id="phone" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div><Label htmlFor="address">Delivery Address</Label><Input id="address" required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
          <Button type="submit" size="lg" className="w-full mt-4">Place Order — ZMW {total.toFixed(2)}</Button>
        </form>

        <div className="md:col-span-2 bg-card rounded-xl border p-6 h-fit">
          <h2 className="font-display text-lg font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3">
            {cart.map((item) => (
              <div key={item.product.id} className="flex justify-between text-sm">
                <span>{item.product.name} × {item.quantity}</span>
                <span className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-4 flex justify-between font-display font-semibold text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
