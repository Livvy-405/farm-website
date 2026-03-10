import { useStore } from '@/stores/useStore';
import { Package, AlertTriangle, ClipboardList, DollarSign } from 'lucide-react';

const DashboardOverview = () => {
  const { products, orders } = useStore();
  const inStock = products.filter((p) => p.inStock).length;
  const outOfStock = products.filter((p) => !p.inStock).length;
  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  const stats = [
    { label: 'Total Products', value: products.length, icon: Package, color: 'text-primary' },
    { label: 'In Stock', value: inStock, icon: Package, color: 'text-primary' },
    { label: 'Out of Stock', value: outOfStock, icon: AlertTriangle, color: 'text-destructive' },
    { label: 'Pending Orders', value: pendingOrders, icon: ClipboardList, color: 'text-secondary' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-card border rounded-xl p-5 animate-fade-up">
            <div className="flex items-center gap-3 mb-2">
              <s.icon className={`h-5 w-5 ${s.color}`} />
              <span className="text-sm text-muted-foreground">{s.label}</span>
            </div>
            <p className="text-3xl font-display font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border rounded-xl p-6">
        <h2 className="font-display text-lg font-semibold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b text-left text-muted-foreground">
              <th className="pb-3 font-medium">Customer</th><th className="pb-3 font-medium">Items</th><th className="pb-3 font-medium">Total</th><th className="pb-3 font-medium">Status</th><th className="pb-3 font-medium">Date</th>
            </tr></thead>
            <tbody>
              {orders.slice(-5).reverse().map((o) => (
                <tr key={o.id} className="border-b last:border-0">
                  <td className="py-3 font-medium">{o.customerName}</td>
                  <td className="py-3 text-muted-foreground">{o.items.length} item(s)</td>
                  <td className="py-3">${o.total.toFixed(2)}</td>
                  <td className="py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${o.status === 'Fulfilled' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>{o.status}</span></td>
                  <td className="py-3 text-muted-foreground">{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
