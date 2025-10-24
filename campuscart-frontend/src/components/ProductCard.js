import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import { addItemToCart } from '../services/api';
// Remove FeedbackForm import
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const handleAddToCart = async (e) => {
        e.stopPropagation(); // Prevent link navigation when clicking button
        e.preventDefault(); // Prevent default button behavior within link
        try {
            await addItemToCart(product.id, 1);
            alert(`${product.name} has been added to your cart!`);
        } catch (error) {
            console.error("Failed to add item to cart", error);
            alert("There was an error adding the item to your cart.");
        }
    };

    return (
        // Wrap the card content in a Link
        <Link to={`/products/${product.id}`} className="product-card-link">
            <div className="product-card">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-footer">
                    <span className="product-price">₹{product.price.toFixed(2)}</span>
                    <button className="add-to-cart-btn" onClick={handleAddToCart}>
                        Add to Cart
                    </button>
                </div>
                {/* Feedback form removed from here */}
            </div>
        </Link>
    );
};

export default ProductCard;