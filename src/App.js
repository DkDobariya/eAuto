import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import AdminSidebar from './components/AdminSidebar';

// User Pages
import Home from './pages/user/Home';
import Hero from './pages/user/Hero';
import Honda from './pages/user/Honda';
import Bajaj from './pages/user/Bajaj';
import Cart from './pages/user/Cart';
import Checkout from './pages/user/Checkout';
import OrderSuccess from './pages/user/OrderSuccess';
import Orders from './pages/user/Orders';
import OrderDetails from './pages/user/OrderDetails';
import MyProfile from './pages/user/MyProfile';
import Login from './pages/user/Login';
import Register from './pages/user/Register';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import Customers from './pages/admin/Customers';
import AdminOrders from './pages/admin/Orders';
import ManageProducts from './pages/admin/ManageProducts';
import EditProduct from './pages/admin/EditProduct';
import DeleteProduct from './pages/admin/DeleteProduct';
import ExportProducts from './pages/admin/ExportProducts';
import PrintLabel from './pages/admin/PrintLabel';
import AdminLogin from './pages/admin/Login';
import RegisterAdmin from './pages/admin/RegisterAdmin';
import Logout from './pages/admin/Logout';

// 404 Not Found component
const NotFound = () => (
  <div style={{ padding: 40, textAlign: 'center' }}>
    <h1>404 - Page Not Found</h1>
    <p>The page you requested does not exist.</p>
  </div>
);

const AppContent = () => {
  const location = useLocation();

  const headerHideRoutes = [
    '/checkout',
    '/order-success',
    '/order-details',
    '/admin/login',
    '/admin/register',
    '/admin/logout',
    '/admin/print-label',
  ];

  const footerHideRoutes = [
    '/checkout',
    '/order-details',
    '/my-profile',
    '/orders',
    '/order-success',
    '/admin/login',
    '/admin/register',
    '/admin/logout',
    '/admin/print-label',
  ];

  const adminNoSidebarRoutes = [
    '/admin/login',
    '/admin/register',
    '/admin/logout',
    '/admin/print-label',
  ];

  const hideHeader =
    headerHideRoutes.some(route => location.pathname.startsWith(route)) ||
    (location.pathname.startsWith('/admin') &&
      !adminNoSidebarRoutes.some(route => location.pathname.startsWith(route)));

  const hideFooter =
    location.pathname.startsWith('/admin') ||
    footerHideRoutes.some(route => location.pathname.startsWith(route));

  const showAdminSidebar =
    location.pathname.startsWith('/admin') &&
    !adminNoSidebarRoutes.some(route => location.pathname.startsWith(route));

  return (
    <>
      {!hideHeader && <Header />}

      <div style={{ display: 'flex' }}>
        {showAdminSidebar && <AdminSidebar />}

        <main
          className="container mt-4 mb-5"
          style={
            showAdminSidebar
              ? { marginLeft: '220px', width: 'calc(100% - 220px)' }
              : {}
          }
        >
          <Routes>
            {/* Public User Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/hero" element={<Hero />} />
            <Route path="/honda" element={<Honda />} />
            <Route path="/bajaj" element={<Bajaj />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/order-success/:id" element={<OrderSuccess />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:orderId" element={<OrderDetails />} />
            <Route path="/order-details/:orderId" element={<OrderDetails />} />
            <Route path="/my-profile" element={<MyProfile />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/register" element={<RegisterAdmin />} />
            <Route path="/admin/logout" element={<Logout />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/customers" element={<Customers />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/manage-products" element={<ManageProducts />} />
            <Route path="/admin/edit-product/:id" element={<EditProduct />} />
            <Route path="/admin/delete-product/:id" element={<DeleteProduct />} />
            <Route path="/admin/export-products" element={<ExportProducts />} />
            <Route path="/admin/print-label/:orderId" element={<PrintLabel />} />

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>

      {!hideFooter && <Footer />}
    </>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
