import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X, Youtube } from 'lucide-react';
import { useStore } from '@/stores/useStore';
import { useState } from 'react';

const Navbar = () => {
  const { cart, setCartOpen } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="font-display text-xl font-bold text-primary tracking-tight">
          🌿 Green Hollow Farm
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">Home</Link>
          <Link to="/shop" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">Shop</Link>
          <Link to="/about" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">About</Link>
        </div>

        <div className="flex items-center gap-2">
          <a href="https://www.youtube.com/watch?v=q54PdLgXIR0&list=RDq54PdLgXIR0&start_radio=1" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-[hsl(0,100%,50%)] hover:bg-[hsl(0,100%,42%)] text-white rounded-full text-xs font-semibold transition-all hover:scale-105 shadow-sm" aria-label="YouTube Channel">
            <Youtube className="h-4 w-4" />
            <span className="hidden sm:inline">Watch on YouTube</span>
          </a>
          <button onClick={() => setCartOpen(true)} className="relative p-2 hover:bg-muted rounded-lg transition-colors">
            <ShoppingCart className="h-5 w-5 text-foreground" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t bg-background animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
            <Link to="/" onClick={() => setMobileOpen(false)} className="text-sm font-medium py-2">Home</Link>
            <Link to="/shop" onClick={() => setMobileOpen(false)} className="text-sm font-medium py-2">Shop</Link>
            <Link to="/about" onClick={() => setMobileOpen(false)} className="text-sm font-medium py-2">About</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
