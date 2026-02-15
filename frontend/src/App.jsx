import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Shop from './components/Shop';
import ProductDetails from './components/ProductDetails';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import { CartProvider } from './context/CartContext';
import Cart from './components/Cart';
import Wishlist from './components/Wishlist';
import Footer from './components/Footer';
import ExchangePolicy from './components/ExchangePolicy';
import FAQ from './components/FAQ';
import ProtectedRoute from './components/ProtectedRoute';
import Checkout from './components/Checkout';
import TrackOrder from './components/TrackOrder';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminProducts from './components/admin/AdminProducts';
import AdminOrders from './components/admin/AdminOrders';
import AdminUsers from './components/admin/AdminUsers';
import AdminMessages from './components/admin/AdminMessages';
import './index.css';

// Home Page Component
const Home = () => (
    <main>
        <Hero />
        <Shop />
    </main>
);

// Standalone Shop Page Wrapper
const ShopPage = () => (
    <main>
        <div style={{ marginTop: '2rem' }}></div>
        <Shop />
    </main>
);

function App() {
    return (
        <Router>
            <CartProvider>
                <div className="app">
                    {/* Header should be visible on non-admin pages usually, but we keep it global for now 
                        or we can conditionally render it. AdminLayout has its own sidebar/header. 
                        Let's conditionally render Header only if not in admin route? 
                        The Router structure makes this tricky without a layout wrapper for public pages.
                        For simplicity, we will just render Header everywhere EXCEPT inside AdminLayout which uses Outlet.
                        However, App has Header at top level. 
                        To hide Header on Admin pages, we can check location or structure routes differently.
                        Better yet: Move Header inside a PublicLayout.
                    */}

                    <Routes>
                        {/* Public Routes with Header */}
                        <Route element={<><Header /><Outlet /><Footer /></>}>
                            <Route path="/" element={<Home />} />
                            <Route path="/shop" element={<ShopPage />} />
                            <Route path="/product/:id" element={<ProductDetails />} />
                            <Route path="/about" element={<AboutUs />} />
                            <Route path="/contact" element={<ContactUs />} />
                            <Route path="/faq" element={<FAQ />} />
                            <Route path="/exchange-policy" element={<ExchangePolicy />} />
                            <Route path="/track-order" element={<TrackOrder />} />
                            <Route path="/wishlist" element={<Wishlist />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                        </Route>

                        {/* Admin Routes */}
                        <Route element={<ProtectedRoute adminOnly={true} />}>
                            <Route path="/admin" element={<AdminLayout />}>
                                <Route path="dashboard" element={<AdminDashboard />} />
                                <Route path="products" element={<AdminProducts />} />
                                <Route path="orders" element={<AdminOrders />} />
                                <Route path="users" element={<AdminUsers />} />
                                <Route path="messages" element={<AdminMessages />} />
                            </Route>
                        </Route>
                    </Routes>
                </div>
            </CartProvider>
        </Router>
    );
}

export default App;
