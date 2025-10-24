import React, { useState, useEffect } from 'react';
import { getAllProducts } from '../services/api';
import ProductCard from './ProductCard';
import './ProductList.css';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getAllProducts();
                setProducts(response.data);
            } catch (err) {
                setError('Failed to fetch products. Is the backend running?');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) return <p>Loading products...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="product-list">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
};

export default ProductList;