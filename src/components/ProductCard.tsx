import { Link } from 'react-router-dom';
import { useStore, Product } from '@/stores/useStore';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart, setCartOpen } = useStore();

  const handleAdd = () => {
    if (!product.inStock) return;
    addToCart(product);
    setCartOpen(true);
  };

  return (
    <div className="group bg-card rounded-xl overflow-hidden border hover:shadow-lg transition-all duration-300 animate-fade-up">
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {!product.inStock && (
          <span className="absolute top-3 left-3 bg-foreground/80 text-background text-xs font-semibold px-3 py-1 rounded-full">
            Out of Stock
          </span>
        )}
      </Link>
      <div className="p-4 space-y-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">{product.category}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-display text-lg font-semibold hover:text-secondary transition-colors">{product.name}</h3>
        </Link>
        <div className="flex items-center justify-between pt-1">
          <span className="text-lg font-semibold">ZMW {product.price.toFixed(2)}</span>
          <Button size="sm" variant={product.inStock ? 'default' : 'outline'} disabled={!product.inStock} onClick={handleAdd}>
            <ShoppingCart className="h-4 w-4 mr-1" />
            {product.inStock ? 'Add' : 'Sold Out'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
