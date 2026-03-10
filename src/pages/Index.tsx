import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-farm.jpg';

const Index = () => {
  return (
    <div className="grain-overlay">
      {/* Hero */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <img src={heroImage} alt="Green Hollow Farm at golden hour" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/30 to-transparent" />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <p className="text-primary-foreground/80 text-sm uppercase tracking-[0.3em] mb-4 animate-fade-up font-body">
            Farm Fresh · Locally Grown · Naturally Good
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-primary-foreground leading-tight animate-fade-up delay-100">
            From Our Fields<br />to Your Table
          </h1>
          <p className="mt-6 text-primary-foreground/80 text-lg md:text-xl max-w-xl mx-auto animate-fade-up delay-200 font-body">
            Small-batch organic produce, farm-fresh eggs, and handcrafted goods — grown with care in Green Hollow.
          </p>
          <div className="mt-8 animate-fade-up delay-300">
            <Button asChild variant="hero" size="lg">
              <Link to="/shop">Shop Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {[
            { emoji: '🌱', title: 'Organically Grown', desc: 'No pesticides, no shortcuts. Just honest farming and healthy soil.' },
            { emoji: '🚜', title: 'Farm to Door', desc: 'Harvested fresh and delivered directly to you within 24 hours.' },
            { emoji: '🍯', title: 'Handcrafted Goods', desc: 'Small-batch jams, honey, and preserves made with love.' },
          ].map((f, i) => (
            <div key={i} className="animate-fade-up" style={{ animationDelay: `${i * 0.15}s` }}>
              <span className="text-4xl">{f.emoji}</span>
              <h3 className="font-display text-xl font-semibold mt-4">{f.title}</h3>
              <p className="text-muted-foreground mt-2 font-body">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto max-w-5xl flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-display text-lg font-semibold text-primary">🌿 Green Hollow Farm</p>
          <p className="text-sm text-muted-foreground">© 2026 Green Hollow Farm. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
