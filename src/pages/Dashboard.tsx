import { useState } from 'react';
import { useStore } from '@/stores/useStore';
import { LayoutDashboard, Package, ClipboardList, LogOut, Menu } from 'lucide-react';
import DashboardLogin from '@/components/DashboardLogin';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import DashboardProducts from '@/components/dashboard/DashboardProducts';
import DashboardOrders from '@/components/dashboard/DashboardOrders';

const tabs = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'orders', label: 'Orders', icon: ClipboardList },
] as const;

type TabId = typeof tabs[number]['id'];

const Dashboard = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!loggedIn) return <DashboardLogin onLogin={() => setLoggedIn(true)} />;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-60' : 'w-0 md:w-16'} transition-all duration-300 border-r bg-sidebar flex flex-col overflow-hidden`}>
        <div className="h-16 flex items-center px-4 border-b gap-2">
          {sidebarOpen && <span className="font-display font-bold text-sm text-sidebar-foreground truncate">🌿 Farm Admin</span>}
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50'}`}
            >
              <tab.icon className="h-4 w-4 shrink-0" />
              {sidebarOpen && <span>{tab.label}</span>}
            </button>
          ))}
        </nav>
        <div className="p-2 border-t">
          <button onClick={() => setLoggedIn(false)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 transition-colors">
            <LogOut className="h-4 w-4 shrink-0" />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center px-4 border-b gap-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-muted rounded-lg"><Menu className="h-5 w-5" /></button>
          <h1 className="font-display text-lg font-semibold capitalize">{activeTab}</h1>
        </header>
        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'overview' && <DashboardOverview />}
          {activeTab === 'products' && <DashboardProducts />}
          {activeTab === 'orders' && <DashboardOrders />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
