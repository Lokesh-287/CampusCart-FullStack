import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- Import useNavigate
import { getCart, removeItemFromCart, checkout } from '../services/api'; // <-- Import checkout
import { AuthContext } from '../context/AuthContext';
import './CartPage.css';

const CartPage = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useContext(AuthContext);
    const navigate = useNavigate(); // <-- Hook for navigation

    // ... (keep fetchCart, useEffect, handleRemoveItem, calculateTotal functions as they are)
    const fetchCart = async () => {
        if (!user) return;
        setLoading(true); // Reset loading state
        setError(''); // Reset error state
        try {
            const response = await getCart();
            setCart(response.data);
        } catch (err) {
            setError('Failed to fetch cart.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [user]);

    const handleRemoveItem = async (productId) => {
        try {
            await removeItemFromCart(productId);
            fetchCart(); // Refresh cart
        } catch (err) {
            setError('Failed to remove item from cart.');
            console.error(err);
        }
    };

    const calculateTotal = () => {
        if (!cart || !cart.items) return 0;
        return cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
    };


    // --- THIS IS THE NEW FUNCTION ---
    const handleCheckout = async () => {
        setError(''); // Clear previous errors
        try {
            await checkout();
            alert('Checkout successful! Your order has been placed.');
            // Navigate to the student dashboard or an order confirmation page
            navigate('/student'); // Redirect to product list for now
            fetchCart(); // Optionally refresh cart (it should be empty now)
        } catch (err) {
            // Handle specific errors from backend if available
            if (err.response && err.response.data && err.response.data.message) {
                 setError(`Checkout failed: ${err.response.data.message}`);
            } else {
                 setError('Checkout failed. Please try again.');
            }
            console.error('Checkout error:', err);
        }
    };

    // ... (keep loading and error checks)
    if (loading) return <p>Loading cart...</p>;


    return (
        <div className="cart-container">
            <h1>Your Shopping Cart</h1>
             {error && <p className="error-message">{error}</p>} {/* Display checkout errors */}
            {cart && cart.items.length > 0 ? (
                <>
                    {/* ... (keep the cart items display code as is) */}
                    <div className="cart-items">
                        {cart.items.map((item) => (
                             <div key={item.id || item.product.id} className="cart-item"> {/* Ensure unique key */}
                                <div className="item-details">
                                    <h3 className="item-name">{item.product.name}</h3>
                                    <p className="item-price">
                                        {item.quantity} x ₹{item.product.price.toFixed(2)}
                                    </p>
                                </div>
                                <div className="item-actions">
                                    <p className="item-subtotal">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                                    <button
                                        className="remove-btn"
                                        onClick={() => handleRemoveItem(item.product.id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="cart-summary">
                        <h2 className="cart-total">Total: ₹{calculateTotal().toFixed(2)}</h2>
                        {/* --- UPDATE THIS BUTTON --- */}
                        <button className="checkout-btn" onClick={handleCheckout}>
                            Proceed to Checkout
                        </button>
                    </div>
                </>
            ) : (
                <p>Your cart is empty.</p>
            )}
        </div>
    );
};

export default CartPage;