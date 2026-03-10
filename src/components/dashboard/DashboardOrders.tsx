import { useStore } from '@/stores/useStore';
import { Button } from '@/components/ui/button';

const DashboardOrders = () => {
  const { orders, updateOrderStatus } = useStore();

  return (
    <div className="space-y-6">
      <h2 className="font-display text-lg font-semibold">{orders.length} Orders</h2>
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b text-left text-muted-foreground bg-muted/30">
              <th className="p-4 font-medium">Customer</th><th className="p-4 font-medium">Items</th><th className="p-4 font-medium">Total</th><th className="p-4 font-medium">Date</th><th className="p-4 font-medium">Status</th><th className="p-4 font-medium">Action</th>
            </tr></thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b last:border-0">
                  <td className="p-4">
                    <p className="font-medium">{o.customerName}</p>
                    <p className="text-xs text-muted-foreground">{o.email}</p>
                  </td>
                  <td className="p-4 text-muted-foreground">{o.items.map((i) => `${i.product.name} ×${i.quantity}`).join(', ')}</td>
                  <td className="p-4 font-medium">ZMW {o.total.toFixed(2)}</td>
                  <td className="p-4 text-muted-foreground">{o.date}</td>
                  <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${o.status === 'Fulfilled' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>{o.status}</span></td>
                  <td className="p-4">
                    {o.status === 'Pending' ? (
                      <Button size="sm" variant="outline" onClick={() => updateOrderStatus(o.id, 'Fulfilled')}>Mark Fulfilled</Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">Done</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardOrders;
