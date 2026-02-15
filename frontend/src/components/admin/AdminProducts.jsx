import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Save, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../api/axios';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    // Edit/Create State
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '', price: '', discountPrice: '', category: '', brand: '', description: '',
        images: '', sizes: []
    });

    const categories = ["shirts", "coloured tshirts", "oversized tshirts", "jeans pants", "baggy pants", "formal shirts", "formal pants"];
    const sizeOptions = ['S', 'M', 'L', 'XL', 'XXL']; // Removed 30, 32, 34, 36

    useEffect(() => {
        fetchProducts();
    }, [page]);

    const fetchProducts = async () => {
        try {
            const { data } = await api.get(`/products?pageNumber=${page}`);
            setProducts(data.products);
            setPages(data.pages);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching products", error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/products/${id}`);
                fetchProducts();
            } catch (error) {
                alert('Failed to delete product');
            }
        }
    };

    const handleEditClick = (product) => {
        setCurrentProduct(product);
        setFormData({
            name: product.name,
            price: product.price,
            discountPrice: product.discountPrice || 0,
            category: product.category,
            brand: product.brand,
            description: product.description,
            images: product.images ? product.images.join(', ') : '',
            sizes: product.sizes.map(s => ({ size: s.size, stock: s.stock })) // Store as objects {size, stock}
        });
        setIsEditing(true);
    };

    const handleCreateClick = () => {
        setCurrentProduct(null);
        setFormData({
            name: '', price: '', discountPrice: 0, category: categories[0], brand: '', description: '',
            images: '', sizes: []
        });
        setIsEditing(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare Payload
        const imageArray = formData.images.split(',').map(url => url.trim()).filter(url => url !== '');
        // Validate stock
        const validSizes = formData.sizes.filter(s => s.stock > 0);

        if (validSizes.length === 0) {
            alert("Please select at least one size with valid stock.");
            return;
        }

        const payload = {
            ...formData,
            images: imageArray,
            sizes: formData.sizes // Already in {size, stock} format
        };

        try {
            if (currentProduct) {
                await api.put(`/products/${currentProduct._id}`, payload);
            } else {
                await api.post('/products', payload);
            }
            setIsEditing(false);
            fetchProducts();
        } catch (error) {
            console.error(error);
            alert("Failed to save product");
        }
    };

    const toggleSize = (size) => {
        setFormData(prev => {
            const exists = prev.sizes.some(s => s.size === size);
            if (exists) {
                return { ...prev, sizes: prev.sizes.filter(s => s.size !== size) };
            } else {
                return { ...prev, sizes: [...prev.sizes, { size, stock: 0 }] };
            }
        });
    };

    const handleStockChange = (size, qty) => {
        const stock = parseInt(qty) || 0;
        setFormData(prev => ({
            ...prev,
            sizes: prev.sizes.map(s => s.size === size ? { ...s, stock } : s)
        }));
    };

    if (loading) return <div className="p-4">Loading products...</div>;

    return (
        <div className="admin-products">
            <div className="page-header">
                <h2>Products</h2>
                <button className="btn-primary-admin" onClick={handleCreateClick}>
                    <Plus size={18} /> Add Product
                </button>
            </div>

            {/* List View */}
            {!isEditing ? (
                <>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <tr key={product._id}>
                                        <td>
                                            <img
                                                src={product.images[0] || 'https://via.placeholder.com/50'}
                                                alt={product.name}
                                                className="table-img"
                                            />
                                        </td>
                                        <td>{product.name}</td>
                                        <td>{product.category}</td>
                                        <td>₹{product.price}</td>
                                        <td>{product.sizes.reduce((acc, s) => acc + s.stock, 0)}</td>
                                        <td>
                                            <div className="actions-cell">
                                                <button className="action-btn edit" onClick={() => handleEditClick(product)}>
                                                    <Edit size={16} />
                                                </button>
                                                <button className="action-btn delete" onClick={() => handleDelete(product._id)}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pages > 1 && (
                        <div className="pagination">
                            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft size={20} /></button>
                            <span>Page {page} of {pages}</span>
                            <button disabled={page === pages} onClick={() => setPage(p => p + 1)}><ChevronRight size={20} /></button>
                        </div>
                    )}
                </>
            ) : (
                /* Edit/Create Form */
                <div className="form-container">
                    <div className="form-header">
                        <h3>{currentProduct ? 'Edit Product' : 'Create Product'}</h3>
                        <button className="close-btn" onClick={() => setIsEditing(false)}><X size={24} /></button>
                    </div>

                    <form onSubmit={handleSubmit} className="admin-form">
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Product Name</label>
                                <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Brand</label>
                                <input type="text" required value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Price</label>
                                <input type="number" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Discount Price (Optional)</label>
                                <input type="number" value={formData.discountPrice} onChange={e => setFormData({ ...formData, discountPrice: e.target.value })} />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea rows="4" required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                        </div>

                        <div className="form-group">
                            <label>Image URLs (Comma separated)</label>
                            <input
                                type="text"
                                required
                                value={formData.images}
                                onChange={e => setFormData({ ...formData, images: e.target.value })}
                                placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                            />
                            <small>Paste direct image links here.</small>
                        </div>

                        <div className="form-group">
                            <label>Available Sizes & Stock</label>
                            <div className="size-inputs-container">
                                {sizeOptions.map(size => {
                                    const isSelected = formData.sizes.some(s => s.size === size);
                                    const currentStock = formData.sizes.find(s => s.size === size)?.stock || 0;

                                    return (
                                        <div key={size} className={`size-row ${isSelected ? 'active' : ''}`}>
                                            <label className="size-label">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => toggleSize(size)}
                                                />
                                                <span className="size-name">{size}</span>
                                            </label>
                                            {isSelected && (
                                                <input
                                                    type="number"
                                                    className="stock-input"
                                                    placeholder="Qty"
                                                    value={currentStock}
                                                    onChange={(e) => handleStockChange(size, e.target.value)}
                                                    min="0"
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <button type="submit" className="save-btn">
                            <Save size={18} /> Save Product
                        </button>
                    </form>
                </div>
            )}

            <style>{`
                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }

                .btn-primary-admin {
                    background: var(--color-primary);
                    color: white;
                    padding: 0.6rem 1.2rem;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-weight: 500;
                }

                .table-container {
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
                    overflow-x: auto;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                }

                th, td {
                    padding: 1rem;
                    text-align: left;
                    border-bottom: 1px solid #f3f4f6;
                }

                th {
                    background: #f9fafb;
                    font-weight: 600;
                    color: #374151;
                    font-size: 0.9rem;
                }

                .table-img {
                    width: 40px;
                    height: 40px;
                    border-radius: 4px;
                    object-fit: cover;
                }

                .actions-cell {
                    display: flex;
                    gap: 0.5rem;
                }

                .action-btn {
                    padding: 0.4rem;
                    border-radius: 4px;
                    transition: all 0.2s;
                }

                .action-btn.edit {
                    color: #3b82f6;
                    background: #eff6ff;
                }

                .action-btn.delete {
                    color: #ef4444;
                    background: #fef2f2;
                }

                .form-container {
                    background: white;
                    padding: 2rem;
                    border-radius: 8px;
                    max-width: 800px;
                    margin: 0 auto;
                }

                .form-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 2rem;
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }

                .form-group {
                    margin-bottom: 1.5rem;
                }

                .form-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-weight: 500;
                    font-size: 0.9rem;
                }

                .form-group input, .form-group select, .form-group textarea {
                    width: 100%;
                    padding: 0.6rem;
                    border: 1px solid #d1d5db;
                    border-radius: 4px;
                }

                .size-inputs-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
                    gap: 1rem;
                }

                .size-row {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    transition: all 0.2s;
                    background: #f9fafb;
                }

                .size-row.active {
                    border-color: var(--color-primary);
                    background: #eff6ff;
                }

                .size-label {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    cursor: pointer;
                    font-weight: 600;
                    margin-bottom: 0 !important;
                }

                .stock-input {
                    width: 60px !important;
                    padding: 4px !important;
                    font-size: 0.85rem;
                    text-align: center;
                    border-color: #d1d5db;
                }

                .save-btn {
                    background: var(--color-accent);
                    color: black;
                    padding: 0.8rem 2rem;
                    border-radius: 6px;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    width: 100%;
                    justify-content: center;
                }

                .pagination {
                    display: flex;
                    justify-content: center;
                    align-items: center; 
                    gap: 1rem; 
                    margin-top: 2rem;
                }
            `}</style>
        </div>
    );
};

export default AdminProducts;
