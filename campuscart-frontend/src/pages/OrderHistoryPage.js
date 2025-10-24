import React, { useState, useEffect, useContext } from 'react';
import { getOrderHistory } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import './OrderHistoryPage.css';

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]); // Initialize as empty array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchOrderHistory = async () => {
            if (!user) {
                setLoading(false); // Stop loading if no user
                return;
            };
            setLoading(true); // Start loading
            setError(''); // Clear previous errors
            try {
                const response = await getOrderHistory();
                // Ensure response.data is an array before sorting/setting
                const fetchedOrders = Array.isArray(response.data) ? response.data : [];
                const sortedOrders = fetchedOrders.sort((a, b) =>
                    new Date(b.orderDate) - new Date(a.orderDate)
                );
                setOrders(sortedOrders);
            } catch (err) {
                setError('Failed to fetch order history.');
                console.error(err);
            } finally {
                setLoading(false); // Stop loading
            }
        };
        fetchOrderHistory();
    }, [user]); // Re-run effect if user changes

    if (loading) return <p>Loading order history...</p>;
    if (error) return <p className="error-message">{error}</p>;

    // --- RENDER LOGIC WITH CHECKS ---
    return (
        <div className="order-history-container">
            <h1>Your Order History</h1>
            {/* Check if orders is an array and has length */}
            {Array.isArray(orders) && orders.length > 0 ? (
                orders.map((order) => (
                    <div key={order.id} className="order-card">
                        <div className="order-header">
                            <h2>Order ID: #{order.id}</h2>
                            <p className="order-date">
                                {/* Add check for orderDate */}
                                Date: {order.orderDate ? new Date(order.orderDate).toLocaleString() : 'N/A'}
                            </p>
                            <p className="order-total">
                                {/* Add check for totalAmount */}
                                Total: ₹{order.totalAmount != null ? order.totalAmount.toFixed(2) : '0.00'}
                            </p>
                        </div>
                        {/* Check if order.items is an array before mapping */}
                        {Array.isArray(order.items) && order.items.length > 0 ? (
                            <ul className="order-items-list">
                                {order.items.map((item) => (
                                    // Add checks for item properties just in case
                                    <li key={item.id} className="order-item">
                                        <span>
                                            {item.product ? item.product.name : 'Unknown Product'}
                                            ({item.quantity != null ? item.quantity : 0} x ₹{item.pricePerItem != null ? item.pricePerItem.toFixed(2) : '0.00'})
                                        </span>
                                        <span>
                                            ₹{item.quantity != null && item.pricePerItem != null ? (item.quantity * item.pricePerItem).toFixed(2) : '0.00'}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="no-items-message">No items found for this order.</p> // Handle empty items
                        )}
                    </div>
                ))
            ) : (
                <p>You haven't placed any orders yet.</p> // Handle no orders case
            )}
        </div>
    );
};

export default OrderHistoryPage;