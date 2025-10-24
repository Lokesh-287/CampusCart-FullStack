import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById, addItemToCart } from '../services/api';
import FeedbackForm from '../components/FeedbackForm';
import { AuthContext } from '../context/AuthContext'; // To check if user is student
import './ProductDetailPage.css'; // Create this file

const ProductDetailPage = () => {
    const { productId } = useParams(); // Get product ID from URL
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useContext(AuthContext); // Get user info

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await getProductById(productId);
                setProduct(response.data);
            } catch (err) {
                setError('Failed to fetch product details.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]); // Re-fetch if productId changes

     const handleAddToCart = async () => {
        if (!product) return;
        try {
            await addItemToCart(product.id, 1);
            alert(`${product.name} has been added to your cart!`);
        } catch (error) {
            console.error("Failed to add item to cart", error);
            alert("There was an error adding the item to your cart.");
        }
    };

    if (loading) return <p>Loading product details...</p>;
    if (error) return <p className="error-message">{error}</p>;
    if (!product) return <p>Product not found.</p>;

    // Check if the logged-in user is a student
    const isStudent = user && user.roles.includes('ROLE_STUDENT');

    return (
        <div className="product-detail-container">
            <h1>{product.name}</h1>
            <p className="product-detail-description">{product.description}</p>
            <p className="product-detail-price">Price: ₹{product.price.toFixed(2)}</p>
            <p className="product-detail-stock">Stock: {product.stockQuantity}</p>

            {/* Only show Add to Cart button if user is a student */}
            {isStudent && (
                 <button className="add-to-cart-detail-btn" onClick={handleAddToCart}>
                    Add to Cart
                </button>
            )}

             {/* Only show FeedbackForm if user is a student */}
            {isStudent && (
                <div className="feedback-section">
                    <FeedbackForm productId={product.id} />
                </div>
            )}
        </div>
    );
};

export default ProductDetailPage;