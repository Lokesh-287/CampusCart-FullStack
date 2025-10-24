import React from 'react';
import { Outlet, useLocation, NavLink } from 'react-router-dom';
import './admin/AdminPages.css'; // Use shared admin CSS

const AdminDashboard = () => {
    const location = useLocation();

    // Helper for NavLink active state
    const getNavLinkClass = ({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link';

    return (
        <div className="admin-dashboard-layout">
            <aside className="admin-sidebar">
                <h2>Admin Menu</h2>
                <nav>
                    <ul>
                        <li><NavLink to="add-student" className={getNavLinkClass}>Add Student</NavLink></li>
                        <li><NavLink to="manage-students" className={getNavLinkClass}>View Students</NavLink></li>
                        <li><NavLink to="manage-products" className={getNavLinkClass}>Manage Products</NavLink></li>
                        <li><NavLink to="manage-orders" className={getNavLinkClass}>Manage Orders</NavLink></li>
                        <li><NavLink to="view-feedback" className={getNavLinkClass}>View Feedback</NavLink></li>
                        <li><NavLink to="view-queries" className={getNavLinkClass}>View Queries</NavLink></li>
                    </ul>
                </nav>
            </aside>
            <main className="admin-content">
                {/* Outlet renders the matched child route component */}
                <Outlet />
            </main>
        </div>
    );
};

export default AdminDashboard;