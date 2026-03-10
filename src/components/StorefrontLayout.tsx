import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';

const StorefrontLayout = () => (
  <>
    <Navbar />
    <CartDrawer />
    <Outlet />
  </>
);

export default StorefrontLayout;
