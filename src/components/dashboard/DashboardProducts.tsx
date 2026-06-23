import { useState, useRef } from 'react';
import { useStore, Product } from '@/stores/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Pencil, Trash2, X, Upload, Link as LinkIcon } from 'lucide-react';

const emptyForm = { name: '', description: '', price: '', image: '', category: '', inStock: true };

const titleCase = (str: string) => str.replace(/\b\w/g, (c) => c.toUpperCase());

const DashboardProducts = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [imageMode, setImageMode] = useState<'url' | 'file'>('url');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openAdd = () => { setForm(emptyForm); setEditId(null); setShowForm(true); };
  const openEdit = (p: Product) => {
    setForm({ name: p.name, description: p.description, price: p.price.toString(), image: p.image, category: p.category, inStock: p.inStock });
    setEditId(p.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { name: form.name, description: form.description, price: parseFloat(form.price), image: form.image, category: form.category, inStock: form.inStock };
    if (editId) { await updateProduct(editId, data); } else { await addProduct(data); }
    setShowForm(false);
  };

  const confirmDelete = async (id: string) => { await deleteProduct(id); setDeleteConfirm(null); };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-lg font-semibold">{products.length} Products</h2>
        <Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />Add Product</Button>
      </div>

      {showForm && (
        <>
          <div className="fixed inset-0 bg-foreground/30 z-50" onClick={() => setShowForm(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-background border rounded-xl p-6 w-full max-w-md shadow-xl animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display text-lg font-semibold">{editId ? 'Edit Product' : 'Add Product'}</h3>
              <button onClick={() => setShowForm(false)}><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input required value={form.name}
                  onChange={(e) => setForm({ ...form, name: titleCase(e.target.value) })} />
              </div>
              <div>
                <Label>Description</Label>
                <Input required value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1) })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Price (ZMW)</Label>
                  <Input type="number" step="0.01" required value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </div>
                <div>
                  <Label>Category</Label>
                  <select required value={form.category}
                    onChange={(e) => setForm({ ...form, category: titleCase(e.target.value) })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <option value="">Select category</option>
                    {Array.from(new Set(products.map(p => p.category))).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="__new">+ New Category</option>
                  </select>
                  {form.category === '__new' && (
                    <Input className="mt-2" placeholder="Enter new category"
                      onChange={(e) => setForm({ ...form, category: titleCase(e.target.value) })} />
                  )}
                </div>
              </div>
              <div>
                <Label>Product Image</Label>
                <div className="flex gap-2 mt-1 mb-2">
                  <button type="button" onClick={() => setImageMode('url')}
                    className={`text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${imageMode === 'url' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
                    <LinkIcon className="h-3 w-3" /> URL
                  </button>
                  <button type="button" onClick={() => setImageMode('file')}
                    className={`text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${imageMode === 'file' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
                    <Upload className="h-3 w-3" /> From Device
                  </button>
                </div>
                {imageMode === 'url' ? (
                  <Input required={!form.image} value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
                ) : (
                  <>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setForm({ ...form, image: reader.result as string });
                          reader.readAsDataURL(file);
                        }
                      }} />
                    <Button type="button" variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
                      <Upload className="h-4 w-4 mr-2" /> Choose from device
                    </Button>
                    {form.image && form.image.startsWith('data:') && (
                      <img src={form.image} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded-lg border" />
                    )}
                  </>
                )}
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.inStock}
                  onChange={(e) => setForm({ ...form, inStock: e.target.checked })} className="rounded" />
                In Stock
              </label>
              <Button type="submit" className="w-full">{editId ? 'Save Changes' : 'Add Product'}</Button>
            </form>
          </div>
        </>
      )}

      {deleteConfirm && (
        <>
          <div className="fixed inset-0 bg-foreground/30 z-50" onClick={() => setDeleteConfirm(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-background border rounded-xl p-6 w-full max-w-sm shadow-xl animate-fade-in text-center">
            <p className="font-display text-lg font-semibold">Delete this product?</p>
            <p className="text-sm text-muted-foreground mt-2">This action cannot be undone.</p>
            <div className="flex gap-3 mt-6 justify-center">
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
              <Button variant="destructive" onClick={() => confirmDelete(deleteConfirm)}>Delete</Button>
            </div>
          </div>
        </>
      )}

      {Array.from(new Set(products.map(p => p.category))).sort().map(category => (
        <div key={category} className="space-y-3">
          <h3 className="font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
            {category} ({products.filter(p => p.category === category).length})
          </h3>
          <div className="grid gap-3">
            {products.filter(p => p.category === category).map((p) => (
              <div key={p.id} className="flex items-center gap-4 bg-card border rounded-xl p-4 animate-fade-in">
                <img src={p.image} alt={p.name} className="w-14 h-14 object-cover rounded-lg" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">{p.name}</h3>
                  <p className="text-sm text-muted-foreground">ZMW {p.price.toFixed(2)} · {p.category}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium shrink-0 ${p.inStock ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
                  {p.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
                <button onClick={() => updateProduct(p.id, { inStock: !p.inStock })} className="text-xs text-muted-foreground hover:text-foreground shrink-0">
                  {p.inStock ? 'Mark OOS' : 'Restock'}
                </button>
                <button onClick={() => openEdit(p)} className="p-2 hover:bg-muted rounded-lg"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => setDeleteConfirm(p.id)} className="p-2 hover:bg-destructive/10 rounded-lg text-destructive"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardProducts;
