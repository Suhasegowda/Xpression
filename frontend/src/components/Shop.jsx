import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { ChevronDown, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import api from '../api/axios'; // Import our new axios instance

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Fetch Categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await api.get('/categories');
                setCategories(data);
            } catch (err) {
                console.error("Failed to fetch categories", err);
            }
        };
        fetchCategories();
    }, []);

    // Fetch Products with filters
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                let queryString = `?pageNumber=${currentPage}`;
                if (selectedCategory && selectedCategory !== 'All') {
                    queryString += `&category=${selectedCategory}`;
                }
                if (sortBy) {
                    queryString += `&sort=${sortBy}`;
                }

                const { data } = await api.get(`/products${queryString}`);

                if (data) {
                    // Check if data.products exists and is an array
                    if (data.products && Array.isArray(data.products)) {
                        setProducts(data.products);
                        setTotalPages(data.pages || 1);
                    } else if (Array.isArray(data)) {
                        // Fallback in case API returns just an array
                        setProducts(data);
                        setTotalPages(1);
                    } else {
                        console.warn("Unexpected products response:", data);
                        setProducts([]);
                        setTotalPages(1);
                    }
                } else {
                    setProducts([]);
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError(err.message || "Failed to load products");
                setProducts([]); // Ensure products is empty array on error
                setLoading(false);
            }
        };

        fetchProducts();
    }, [currentPage, selectedCategory, sortBy]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (loading && currentPage === 1) return (
        <div className="container" style={{ padding: '5rem', textAlign: 'center', minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="loader"></div> <span style={{ marginLeft: '1rem', fontSize: '1.2rem' }}>Loading Collection...</span>
            <style>{`.loader { border: 4px solid #f3f3f3; border-top: 4px solid var(--color-accent); border-radius: 50%; width: 30px; height: 30px; animation: spin 1s linear infinite; } @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
    );

    if (error) return (
        <div className="container" style={{ padding: '5rem', textAlign: 'center', minHeight: '50vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h2 style={{ color: '#e74c3c', marginBottom: '1rem' }}>Oops! Something went wrong.</h2>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>We couldn't load the products at this moment.</p>
            <p style={{ fontSize: '0.9rem', color: '#999', marginBottom: '2rem' }}>Error details: {error}</p>
            <button
                onClick={() => window.location.reload()}
                style={{ padding: '0.8rem 1.5rem', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
                Try Again
            </button>
        </div>
    );

    return (
        <section className="shop-section" id="shop">
            <div className="container">
                <h2 className="section-title">Our <span className="text-accent">Collection</span></h2>

                <div className="filters-bar">
                    <div className="filter-group">
                        <label>Category:</label>
                        <div className="select-wrapper">
                            <select
                                value={selectedCategory}
                                onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                            >
                                <option value="All">All</option>
                                {Array.isArray(categories) && categories.map(cat => (
                                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="select-icon" />
                        </div>
                    </div>

                    <div className="filter-group">
                        <label>Sort By:</label>
                        <div className="select-wrapper">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="newest">What's New</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                                <option value="rating">Customer Rating</option>
                            </select>
                            <ChevronDown size={16} className="select-icon" />
                        </div>
                    </div>
                </div>

                <div className="products-grid">
                    {products.length > 0 ? (
                        products.map(product => (
                            <ProductCard
                                key={product._id}
                                product={{
                                    ...product,
                                    id: product._id, // Map _id to id for child components
                                    image: product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/300'
                                }}
                            />
                        ))
                    ) : (
                        <div className="no-products">
                            <p>No products found in this category.</p>
                        </div>
                    )}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="pagination">
                        <button
                            className="page-btn"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft size={20} />
                        </button>

                        <span className="page-info">Page {currentPage} of {totalPages}</span>

                        <button
                            className="page-btn"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>

            <style>{`
        .shop-section {
          padding: 6rem 0;
          background-color: var(--color-bg-white);
        }

        .text-accent {
          color: var(--color-accent);
          font-style: italic;
        }

        .filters-bar {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3rem;
          padding: 1.5rem;
          background: #fdfdfd;
          border: 1px solid #eee;
          border-radius: var(--radius-md);
        }
        
        .filter-group {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 0.5rem 0;
        }

        .filter-group label {
          font-weight: 600;
          color: var(--color-text-main);
        }

        .select-wrapper {
          position: relative;
          width: 200px;
        }

        select {
          width: 100%;
          padding: 0.6rem 1rem;
          padding-right: 2.5rem;
          font-family: inherit;
          font-size: 0.95rem;
          border: 1px solid #ddd;
          border-radius: var(--radius-sm);
          background-color: white;
          appearance: none;
          cursor: pointer;
          transition: border-color 0.2s;
        }

        select:focus {
          outline: none;
          border-color: var(--color-accent);
        }

        .select-icon {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: #888;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
        }

        .no-products {
          grid-column: 1 / -1;
          text-align: center;
          padding: 4rem;
          color: var(--color-text-muted);
          font-size: 1.2rem;
        }

        .pagination {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 4rem;
        }

        .page-btn {
          width: 40px;
          height: 40px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-main);
          font-weight: 600;
          transition: all 0.2s;
        }

        .page-btn:hover:not(:disabled) {
          border-color: var(--color-accent);
          color: var(--color-accent);
        }

        .page-btn.active {
          background: var(--color-primary);
          color: white;
          border-color: var(--color-primary);
        }

        .page-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
        </section>
    );
};

export default Shop;
