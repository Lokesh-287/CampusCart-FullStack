import React, { useState, useEffect } from 'react';
import { getAllOrdersAdmin, updateOrderStatusAdmin } from '../../services/api';
import './AdminPages.css';

const AdminManageOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updateError, setUpdateError] = useState('');

    const fetchOrders = async () => {
        setLoading(true);
        setError('');
        setUpdateError('');
        try {
            const response = await getAllOrdersAdmin();
            const fetchedOrders = Array.isArray(response.data) ? response.data : [];
            const sortedOrders = fetchedOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
            setOrders(sortedOrders);
        } catch (err) {
            setError('Failed to fetch orders.');
            console.error('Fetch orders error:', err.response || err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusUpdate = async (orderId, newStatus) => {
        setUpdateError('');
        try {
            await updateOrderStatusAdmin(orderId, newStatus);
            fetchOrders();
        } catch (err) {
             const errorMessage = err.response?.data?.message || `Failed to update status for order #${orderId}.`;
             setUpdateError(errorMessage);
            console.error('Update status error:', err.response || err);
        }
    };

    if (loading) return <p>Loading orders...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="admin-page-container">
            <h1>Manage Orders</h1>
            {updateError && <p className="error-message">{updateError}</p>}
            {orders.length > 0 ? (
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Student</th>
                            <th>Date</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td>#{order.id}</td>
                                <td>{order.user?.username || 'N/A'}</td>
                                <td>{order.orderDate ? new Date(order.orderDate).toLocaleString() : 'N/A'}</td>
                                <td>₹{order.totalAmount != null ? order.totalAmount.toFixed(2) : '0.00'}</td>
                                <td>
                                    <span className={`status-badge status-${order.status?.toLowerCase() || 'unknown'}`}>
                                        {order.status || 'N/A'}
                                    </span>
                                </td>
                                <td>
                                    {order.status === 'PENDING' && (
                                        <button className="action-btn complete-btn" onClick={() => handleStatusUpdate(order.id, 'COMPLETED')}>
                                            Mark Completed
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No orders found.</p>
            )}
        </div>
    );
};

export default AdminManageOrdersPage;