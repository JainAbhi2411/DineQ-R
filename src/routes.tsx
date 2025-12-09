import type { ComponentType } from 'react';
import type { UserRole } from './types/types';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import RestaurantList from './pages/owner/RestaurantList';
import RestaurantForm from './pages/owner/RestaurantForm';
import MenuManagement from './pages/owner/MenuManagement';
import TableManagement from './pages/owner/TableManagement';
import OrderManagement from './pages/owner/OrderManagement';
import StaffManagement from './pages/owner/StaffManagement';
import Analytics from './pages/owner/Analytics';
import Reviews from './pages/owner/Reviews';
import Promotions from './pages/owner/Promotions';
import Settings from './pages/owner/Settings';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import CustomerProfile from './pages/customer/CustomerProfile';
import BrowseRestaurants from './pages/customer/BrowseRestaurants';
import Rewards from './pages/customer/Rewards';
import CustomerSettings from './pages/customer/Settings';
import ScanQR from './pages/customer/ScanQR';
import MenuBrowsing from './pages/customer/MenuBrowsing';
import Checkout from './pages/customer/Checkout';
import OrderHistory from './pages/customer/OrderHistory';
import PaymentSuccess from './pages/customer/PaymentSuccess';
import OrderTracking from './pages/customer/OrderTracking';

interface RouteConfig {
  name: string;
  path: string;
  component: ComponentType;
  visible?: boolean;
  protected?: boolean;
  allowedRoles?: UserRole[];
}

const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    component: Home,
    visible: false,
  },
  {
    name: 'Login',
    path: '/login',
    component: Login,
    visible: false,
  },
  {
    name: 'Register',
    path: '/register',
    component: Register,
    visible: false,
  },
  {
    name: 'Payment Success',
    path: '/payment-success',
    component: PaymentSuccess,
    visible: false,
    protected: true,
  },
  {
    name: 'Owner Dashboard',
    path: '/owner/dashboard',
    component: OwnerDashboard,
    visible: false,
    protected: true,
    allowedRoles: ['owner'],
  },
  {
    name: 'Restaurants',
    path: '/owner/restaurants',
    component: RestaurantList,
    visible: false,
    protected: true,
    allowedRoles: ['owner'],
  },
  {
    name: 'New Restaurant',
    path: '/owner/restaurants/new',
    component: RestaurantForm,
    visible: false,
    protected: true,
    allowedRoles: ['owner'],
  },
  {
    name: 'Edit Restaurant',
    path: '/owner/restaurants/:id',
    component: RestaurantForm,
    visible: false,
    protected: true,
    allowedRoles: ['owner'],
  },
  {
    name: 'Menu Management',
    path: '/owner/menu/:restaurantId',
    component: MenuManagement,
    visible: false,
    protected: true,
    allowedRoles: ['owner'],
  },
  {
    name: 'Table Management',
    path: '/owner/tables/:restaurantId',
    component: TableManagement,
    visible: false,
    protected: true,
    allowedRoles: ['owner'],
  },
  {
    name: 'Order Management',
    path: '/owner/orders/:restaurantId',
    component: OrderManagement,
    visible: false,
    protected: true,
    allowedRoles: ['owner'],
  },
  {
    name: 'Staff Management',
    path: '/owner/staff/:restaurantId',
    component: StaffManagement,
    visible: false,
    protected: true,
    allowedRoles: ['owner'],
  },
  {
    name: 'Analytics',
    path: '/owner/analytics/:restaurantId',
    component: Analytics,
    visible: false,
    protected: true,
    allowedRoles: ['owner'],
  },
  {
    name: 'Reviews',
    path: '/owner/reviews/:restaurantId',
    component: Reviews,
    visible: false,
    protected: true,
    allowedRoles: ['owner'],
  },
  {
    name: 'Promotions',
    path: '/owner/promotions/:restaurantId',
    component: Promotions,
    visible: false,
    protected: true,
    allowedRoles: ['owner'],
  },
  {
    name: 'Settings',
    path: '/owner/settings/:restaurantId',
    component: Settings,
    visible: false,
    protected: true,
    allowedRoles: ['owner'],
  },
  {
    name: 'Customer Dashboard',
    path: '/customer/dashboard',
    component: CustomerDashboard,
    visible: false,
    protected: true,
    allowedRoles: ['customer'],
  },
  {
    name: 'Browse Restaurants',
    path: '/customer/restaurants',
    component: BrowseRestaurants,
    visible: false,
    protected: true,
    allowedRoles: ['customer'],
  },
  {
    name: 'Rewards',
    path: '/customer/rewards',
    component: Rewards,
    visible: false,
    protected: true,
    allowedRoles: ['customer'],
  },
  {
    name: 'Customer Settings',
    path: '/customer/settings',
    component: CustomerSettings,
    visible: false,
    protected: true,
    allowedRoles: ['customer'],
  },
  {
    name: 'Scan QR',
    path: '/customer/scan',
    component: ScanQR,
    visible: false,
    protected: true,
    allowedRoles: ['customer'],
  },
  {
    name: 'Menu Browsing',
    path: '/customer/menu/:restaurantId',
    component: MenuBrowsing,
    visible: false,
    protected: true,
    allowedRoles: ['customer'],
  },
  {
    name: 'Checkout',
    path: '/customer/checkout/:restaurantId',
    component: Checkout,
    visible: false,
    protected: true,
    allowedRoles: ['customer'],
  },
  {
    name: 'Order History',
    path: '/customer/orders',
    component: OrderHistory,
    visible: false,
    protected: true,
    allowedRoles: ['customer'],
  },
  {
    name: 'Order Tracking',
    path: '/order-tracking/:orderId',
    component: OrderTracking,
    visible: false,
  },
  {
    name: 'Customer Profile',
    path: '/customer/profile',
    component: CustomerProfile,
    visible: false,
    protected: true,
    allowedRoles: ['customer'],
  },
];

export default routes;
