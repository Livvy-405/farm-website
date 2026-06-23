import { useEffect, useState } from 'react';
import { useStore } from '@/stores/useStore';
import ProductCard from '@/components/ProductCard';

const Shop = () => {
  const { products, fetchProducts } = useStore();
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchProducts();
    const interval = setInterval(fetchProducts, 30000);
    return () => clearInterval(interval);
  }, []);

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];
  const filtered = filter === 'All' ? products : products.filter((p) => p.category === filter);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold">Our Products</h1>
        <p className="text-muted-foreground mt-3 max-w-lg mx-auto">Fresh from the farm to your kitchen. Everything is grown and made right here in Green Hollow.</p>
      </div>
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === cat ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Shop;
