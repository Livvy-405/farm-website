import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useStore } from '@/stores/useStore';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const CartDrawer = () => {
  const { cart, isCartOpen, setCartOpen, removeFromCart, updateCartQuantity } = useStore();
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (!isCartOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-foreground/30 z-50" onClick={() => setCartOpen(false)} />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background z-50 shadow-2xl animate-slide-in-right flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="font-display text-xl font-semibold">Your Cart</h2>
          <button onClick={() => setCartOpen(false)} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-muted-foreground">
            <ShoppingBag className="h-12 w-12" />
            <p className="font-display text-lg">Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.map((item) => (
                <div key={item.product.id} className="flex gap-4 animate-fade-in">
                  <img src={item.product.image} alt={item.product.name} className="w-20 h-20 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{item.product.name}</h3>
                    <p className="text-sm text-muted-foreground">ZMW {item.product.price.toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)} className="p-1 hover:bg-muted rounded">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)} className="p-1 hover:bg-muted rounded">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">ZMW {(item.product.price * item.quantity).toFixed(2)}</p>
                    <button onClick={() => removeFromCart(item.product.id)} className="text-xs text-muted-foreground hover:text-destructive mt-1">Remove</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 border-t space-y-4">
              <div className="flex justify-between text-lg font-display font-semibold">
                <span>Total</span>
                <span>ZMW {total.toFixed(2)}</span>
              </div>
              <Button className="w-full" size="lg" onClick={() => { setCartOpen(false); navigate('/checkout'); }}>
                Proceed to Checkout
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
