import { useState } from 'react';
import { useStore } from '@/stores/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, MapPin, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Checkout = () => {
  const { cart, clearCart, addOrder } = useStore();
  const [placed, setPlaced] = useState(false);
  const [fulfillment, setFulfillment] = useState<'delivery' | 'pickup'>('delivery');
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addOrder({
        customerName: form.name,
        email: form.email,
        phone: `+260${form.phone}`,
        address: fulfillment === 'pickup' ? 'PICKUP' : form.address,
        items: cart,
        total,
        status: 'Pending',
      });
      setPlaced(true);
    } catch {
      alert('Failed to place order. Please try again.');
    }
  };

  if (placed) {
    return (
      <div className="container mx-auto px-4 py-20 text-center animate-fade-up">
        <CheckCircle className="h-16 w-16 text-primary mx-auto" />
        <h1 className="font-display text-4xl font-bold mt-6">Order Placed!</h1>
        <p className="text-muted-foreground mt-3 max-w-md mx-auto">
          Thank you for your order. We'll get your farm-fresh goods ready and reach out with {fulfillment === 'pickup' ? 'pickup' : 'delivery'} details.
        </p>
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

          {/* Fulfillment toggle */}
          <div>
            <Label className="mb-2 block">How would you like to receive your order?</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFulfillment('delivery')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${fulfillment === 'delivery' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'}`}
              >
                <ShoppingBag className={`h-6 w-6 ${fulfillment === 'delivery' ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className={`text-sm font-medium ${fulfillment === 'delivery' ? 'text-primary' : 'text-muted-foreground'}`}>Delivery</span>
              </button>
              <button
                type="button"
                onClick={() => setFulfillment('pickup')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${fulfillment === 'pickup' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'}`}
              >
                <MapPin className={`h-6 w-6 ${fulfillment === 'pickup' ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className={`text-sm font-medium ${fulfillment === 'pickup' ? 'text-primary' : 'text-muted-foreground'}`}>Pick Up</span>
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value.replace(/\b\w/g, (c) => c.toUpperCase()) })}
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                +260
              </span>
              <Input
                id="phone"
                required
                className="rounded-l-none"
                placeholder="97 123 4567"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '') })}
              />
            </div>
          </div>

          {fulfillment === 'delivery' && (
            <div>
              <Label htmlFor="address">Delivery Address</Label>
              <Input
                id="address"
                required={fulfillment === 'delivery'}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
          )}

          {fulfillment === 'pickup' && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm text-primary">
              📍 You'll receive a message with our farm location and pickup time after placing your order.
            </div>
          )}

          <Button type="submit" size="lg" className="w-full mt-4">
            Place Order — ZMW {total.toFixed(2)}
          </Button>
        </form>

        {/* Order summary */}
        <div className="md:col-span-2 bg-card rounded-xl border p-6 h-fit">
          <h2 className="font-display text-lg font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3">
            {cart.map((item) => (
              <div key={item.product.id} className="flex justify-between text-sm">
                <span>{item.product.name} × {item.quantity}</span>
                <span className="font-medium">ZMW {(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-4 flex justify-between items-center">
            <span className="font-display font-semibold text-lg">Total</span>
            <span className="font-display font-bold text-3xl text-primary">ZMW {total.toFixed(2)}</span>
          </div>
          <div className="mt-3 text-xs text-muted-foreground text-right">
            {fulfillment === 'pickup' ? '📍 Farm pick up' : '🚚 Home delivery'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
