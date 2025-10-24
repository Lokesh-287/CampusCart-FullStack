import React, { useState, useEffect } from 'react';
import { getAllProducts, addProductAdmin, updateProductAdmin } from '../../services/api';
import './AdminPages.css';

const AdminManageProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState({ id: null, name: '', description: '', price: 0, stockQuantity: 0 });
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');

    const fetchProducts = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await getAllProducts(); // Use existing public endpoint
            setProducts(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            setError('Failed to fetch products.');
            console.error('Fetch products error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleAddNewClick = () => {
        setIsEditing(true);
        setCurrentProduct({ id: null, name: '', description: '', price: 0, stockQuantity: 0 });
        setFormError('');
        setFormSuccess('');
    };

    const handleEditClick = (product) => {
        setIsEditing(true);
        setCurrentProduct({ ...product });
        setFormError('');
        setFormSuccess('');
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setCurrentProduct({ id: null, name: '', description: '', price: 0, stockQuantity: 0 });
        setFormError('');
        setFormSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        setFormSuccess('');
        const isNew = currentProduct.id === null;
        const productData = {
            name: currentProduct.name,
            description: currentProduct.description,
            price: parseFloat(currentProduct.price),
            stockQuantity: parseInt(currentProduct.stockQuantity, 10),
        };

        if (!productData.name || productData.price <= 0 || productData.stockQuantity < 0) {
            setFormError('Please provide a valid name, positive price, and non-negative stock quantity.');
            return;
        }

        try {
            if (isNew) {
                await addProductAdmin(productData);
                setFormSuccess('Product added successfully!');
            } else {
                await updateProductAdmin(currentProduct.id, productData);
                setFormSuccess('Product updated successfully!');
            }
            fetchProducts();
            handleCancelEdit();
        } catch (err) {
            const errMsg = err.response?.data?.message || `Failed to ${isNew ? 'add' : 'update'} product.`;
            setFormError(errMsg);
            console.error('Product save error:', err);
        }
    };

    if (loading) return <p>Loading products...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="admin-page-container">
            <h1>Manage Products</h1>

            {formSuccess && <p className="success-message">{formSuccess}</p>}

            {isEditing ? (
                <form onSubmit={handleSubmit} className="admin-form product-form">
                    <h2>{currentProduct.id ? 'Edit Product' : 'Add New Product'}</h2>
                    {formError && <p className="error-message">{formError}</p>}
                    <input type="hidden" name="id" value={currentProduct.id || ''} />
                    <div className="form-group">
                        <label htmlFor="name">Product Name</label>
                        <input type="text" id="name" name="name" value={currentProduct.name} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea id="description" name="description" value={currentProduct.description} onChange={handleInputChange} rows="3" />
                    </div>
                    <div className="form-group form-row">
                        <div>
                            <label htmlFor="price">Price (₹)</label>
                            <input type="number" id="price" name="price" value={currentProduct.price} onChange={handleInputChange} required min="0.01" step="0.01" />
                        </div>
                        <div>
                            <label htmlFor="stockQuantity">Stock Quantity</label>
                            <input type="number" id="stockQuantity" name="stockQuantity" value={currentProduct.stockQuantity} onChange={handleInputChange} required min="0" step="1" />
                        </div>
                    </div>
                    <div className="form-actions">
                        <button type="submit">{currentProduct.id ? 'Update Product' : 'Add Product'}</button>
                        <button type="button" onClick={handleCancelEdit} className="cancel-btn">Cancel</button>
                    </div>
                </form>
            ) : (
                <button onClick={handleAddNewClick} className="add-new-btn">Add New Product</button>
            )}

            <h2>Existing Products</h2>
            {products.length > 0 ? (
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td>{product.id}</td>
                                <td>{product.name}</td>
                                <td>₹{product.price.toFixed(2)}</td>
                                <td>{product.stockQuantity}</td>
                                <td>
                                    <button className="action-btn edit-btn" onClick={() => handleEditClick(product)}>Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No products found. Add one using the button above.</p>
            )}
        </div>
    );
};

export default AdminManageProductsPage;