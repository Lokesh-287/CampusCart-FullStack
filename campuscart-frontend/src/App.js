import React, { useContext } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Import Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CartPage from './pages/CartPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import ProfilePage from './pages/ProfilePage';
import ContactUsPage from './pages/ContactUsPage';
import ProductDetailPage from './pages/ProductDetailPage';

// Import ALL Admin Pages (Make sure these files exist!)
import AdminAddStudentPage from './pages/admin/AdminAddStudentPage';
import AdminViewStudentsPage from './pages/admin/AdminViewStudentsPage';
import AdminManageProductsPage from './pages/admin/AdminManageProductsPage';
import AdminManageOrdersPage from './pages/admin/AdminManageOrdersPage';
import AdminViewFeedbackPage from './pages/admin/AdminViewFeedbackPage';
import AdminViewQueriesPage from './pages/admin/AdminViewQueriesPage';

import './App.css';

function App() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div>
            <nav className="navbar">
                <Link to="/" className="navbar-brand">CampusCart</Link>
                <div className="nav-links">
                    {/* Public Links */}
                    <Link to="/contact">Contact Us</Link>

                    {/* Conditional Links based on Login Status */}
                    {user ? (
                        <>
                            <span className="welcome-message">Welcome, {user.username}!</span>
                            {/* Admin specific links */}
                            {user.roles.includes('ROLE_ADMIN') && (
                                <Link to="/admin">Admin Dashboard</Link>
                            )}
                            {/* Student specific links */}
                            {user.roles.includes('ROLE_STUDENT') && (
                                <>
                                    <Link to="/student">Products</Link>
                                    <Link to="/cart">Cart</Link>
                                    <Link to="/orders">Order History</Link>
                                    <Link to="/profile">Profile</Link>
                                </>
                            )}
                            <button onClick={handleLogout} className="logout-button">Logout</button>
                        </>
                    ) : (
                        <Link to="/login">Login</Link>
                    )}
                </div>
            </nav>

            <main className="container">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/contact" element={<ContactUsPage />} />
                    <Route path="/products/:productId" element={<ProductDetailPage />} />


                    {/* Protected Student Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['ROLE_STUDENT']} />}>
                        <Route path="/student" element={<StudentDashboard />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/orders" element={<OrderHistoryPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                    </Route>

                    {/* --- THIS IS THE MISSING SECTION --- */}
                    {/* Protected Admin Routes - Nested Structure */}
                    <Route path="/admin" element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
                         {/* Parent AdminDashboard renders sidebar + Outlet */}
                        <Route element={<AdminDashboard />}>
                            {/* Child routes rendered within Outlet */}
                            {/* Index route for /admin itself */}
                             <Route index element={<div className="admin-page-container"><h1>Admin Dashboard</h1><p>Welcome, admin! Select an option from the menu.</p></div>} />
                            <Route path="add-student" element={<AdminAddStudentPage />} />
                            <Route path="manage-students" element={<AdminViewStudentsPage />} />
                            <Route path="manage-products" element={<AdminManageProductsPage />} />
                            <Route path="manage-orders" element={<AdminManageOrdersPage />} />
                            <Route path="view-feedback" element={<AdminViewFeedbackPage />} />
                            <Route path="view-queries" element={<AdminViewQueriesPage />} />
                        </Route>
                    </Route>
                    {/* ------------------------------------ */}

                    {/* Catch-all route for unmatched paths */}
                    <Route path="*" element={<div className="container"><p>Page Not Found</p></div>} />
                </Routes>
            </main>
        </div>
    );
}

export default App;