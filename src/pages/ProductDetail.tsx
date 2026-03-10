import { useParams, Link } from 'react-router-dom';
import { useStore } from '@/stores/useStore';
import { Button } from '@/components/ui/button';
import { Minus, Plus, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

const ProductDetail = () => {
  const { id } = useParams();
  const { products, addToCart, setCartOpen } = useStore();
  const product = products.find((p) => p.id === id);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-3xl">Product not found</h1>
        <Button asChild variant="link" className="mt-4"><Link to="/shop">Back to Shop</Link></Button>
      </div>
    );
  }

  const handleAdd = () => {
    addToCart(product, quantity);
    setCartOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Shop
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-fade-up">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          {!product.inStock && (
            <span className="absolute top-4 left-4 bg-foreground/80 text-background text-sm font-semibold px-4 py-1.5 rounded-full">Out of Stock</span>
          )}
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-sm text-muted-foreground uppercase tracking-wider">{product.category}</p>
          <h1 className="font-display text-4xl font-bold mt-2">{product.name}</h1>
          <p className="text-3xl font-semibold text-secondary mt-4">ZMW {product.price.toFixed(2)}</p>
          <p className="text-muted-foreground mt-6 leading-relaxed">{product.description}</p>

          {product.inStock && (
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Quantity</span>
                <div className="flex items-center border rounded-lg">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-muted transition-colors"><Minus className="h-4 w-4" /></button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:bg-muted transition-colors"><Plus className="h-4 w-4" /></button>
                </div>
              </div>
              <Button size="lg" className="w-full md:w-auto" onClick={handleAdd}>Add to Cart — ZMW {(product.price * quantity).toFixed(2)}</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
