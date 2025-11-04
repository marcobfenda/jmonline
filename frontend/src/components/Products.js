import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import { useTheme } from '../contexts/ThemeContext';
import './Products.css';

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMobileDropdown, setShowMobileDropdown] = useState(false);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  const primaryColor = theme.primary_color || '#007bff';

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      // Ensure we always have an array
      const categoriesData = Array.isArray(response.data) ? response.data : [];
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]); // Set empty array on error
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const url = selectedCategory 
        ? `/products?category_id=${selectedCategory}` 
        : '/products';
      const response = await api.get(url);
      // Ensure we always have an array
      if (!Array.isArray(response.data)) {
        console.warn('Products API returned non-array response:', response.data);
        setProducts([]);
        return;
      }
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      console.error('Error response:', error.response?.data);
      setProducts([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    if (!user) {
      showToast('Please login to add items to cart', 'warning');
      return;
    }
    
    if (product.stock > 0) {
      addToCart(product);
      showToast(`${product.name} added to cart`, 'success');
    }
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="container">
      <h1>Products</h1>
      
      <div className="products-layout">
        {/* Desktop Sidebar - Categories */}
        {categories.length > 0 && (
          <aside className="categories-sidebar">
            <h2 className="categories-sidebar-title">Categories</h2>
            <div className="categories-list">
              <button
                className={`category-sidebar-item ${selectedCategory === null ? 'active' : ''}`}
                onClick={() => setSelectedCategory(null)}
                style={{
                  color: selectedCategory === null ? 'white' : '#333',
                  backgroundColor: selectedCategory === null ? primaryColor : 'transparent',
                  borderLeft: selectedCategory === null ? `4px solid ${primaryColor}` : '4px solid transparent'
                }}
              >
                All Products
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`category-sidebar-item ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                  style={{
                    color: selectedCategory === category.id ? 'white' : '#333',
                    backgroundColor: selectedCategory === category.id ? primaryColor : 'transparent',
                    borderLeft: selectedCategory === category.id ? `4px solid ${primaryColor}` : '4px solid transparent'
                  }}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </aside>
        )}

        {/* Mobile Dropdown */}
        {categories.length > 0 && (
          <div className="categories-mobile-dropdown">
            <button
              className="categories-mobile-trigger"
              onClick={() => setShowMobileDropdown(!showMobileDropdown)}
              style={{
                borderColor: primaryColor,
                color: primaryColor
              }}
            >
              {selectedCategory === null 
                ? 'All Products' 
                : categories.find(c => c.id === selectedCategory)?.name || 'Select Category'}
              <span className={`dropdown-arrow ${showMobileDropdown ? 'open' : ''}`}>▼</span>
            </button>
            {showMobileDropdown && (
              <div className="categories-mobile-menu">
                <button
                  className={`category-mobile-item ${selectedCategory === null ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedCategory(null);
                    setShowMobileDropdown(false);
                  }}
                  style={{
                    color: selectedCategory === null ? 'white' : '#333',
                    backgroundColor: selectedCategory === null ? primaryColor : 'white',
                    borderLeft: selectedCategory === null ? `4px solid ${primaryColor}` : '4px solid transparent'
                  }}
                >
                  All Products
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className={`category-mobile-item ${selectedCategory === category.id ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setShowMobileDropdown(false);
                    }}
                    style={{
                      color: selectedCategory === category.id ? 'white' : '#333',
                      backgroundColor: selectedCategory === category.id ? primaryColor : 'white',
                      borderLeft: selectedCategory === category.id ? `4px solid ${primaryColor}` : '4px solid transparent'
                    }}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Products Grid */}
        <div className="products-content">
          <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img
                src={product.image_url || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect width="300" height="300" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-family="sans-serif" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E'}
                alt={product.name}
                onError={(e) => {
                  if (e.target.src !== 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect width="300" height="300" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-family="sans-serif" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E') {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect width="300" height="300" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-family="sans-serif" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E';
                  } else {
                    e.target.style.display = 'none';
                  }
                }}
              />
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <div className="product-price">${parseFloat(product.price).toFixed(2)}</div>
              <div className="product-stock">
                Stock: {product.stock > 0 ? product.stock : 'Out of Stock'}
              </div>
              <button
                onClick={() => handleAddToCart(product)}
                className="btn btn-primary"
                disabled={product.stock === 0}
                style={{ backgroundColor: primaryColor }}
              >
                {product.stock > 0 
                  ? (user ? 'Add to Cart' : 'Login to Add to Cart') 
                  : 'Out of Stock'}
              </button>
            </div>
          </div>
        ))}
          </div>
          {products.length === 0 && (
            <p className="no-products">No products available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;

