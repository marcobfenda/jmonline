import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import { useTheme } from '../contexts/ThemeContext';
import './Home.css';

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  const primaryColor = theme.primary_color || '#007bff';

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    if (featuredProducts.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [featuredProducts]);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await api.get('/products?featured=true');
      const products = Array.isArray(response.data) ? response.data : [];
      setFeaturedProducts(products);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      showToast('Please login to add items to cart', 'warning');
      navigate('/login');
      return;
    }

    if (product.stock > 0) {
      addToCart(product);
      showToast(`${product.name} added to cart`, 'success');
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/products`);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home">
      {/* Hero Banner */}
      <section 
        className="hero-banner" 
        style={{ 
          backgroundColor: primaryColor,
          backgroundImage: 'url(https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">{theme.site_name || 'JM Online'}</h1>
          <p className="hero-subtitle">Your trusted partner for office supplies and business solutions</p>
          <Link to="/products" className="hero-cta" style={{ backgroundColor: 'white', color: primaryColor }}>
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Products Carousel */}
      {featuredProducts.length > 0 && (
        <section className="featured-section">
          <div className="container">
            <h2 className="section-title">Featured Products</h2>
            <div className="carousel-container">
              <div 
                className="carousel-track"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {featuredProducts.map((product) => (
                  <div key={product.id} className="carousel-slide">
                    <div className="featured-product-card">
                      <div className="featured-product-image">
                        <img
                          src={product.image_url || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect width="400" height="400" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-family="sans-serif" font-size="16"%3ENo Image%3C/text%3E%3C/svg%3E'}
                          alt={product.name}
                          onError={(e) => {
                            if (e.target.src !== 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect width="400" height="400" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-family="sans-serif" font-size="16"%3ENo Image%3C/text%3E%3C/svg%3E') {
                              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect width="400" height="400" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-family="sans-serif" font-size="16"%3ENo Image%3C/text%3E%3C/svg%3E';
                            }
                          }}
                        />
                      </div>
                      <div className="featured-product-info">
                        <h3>{product.name}</h3>
                        <p className="featured-product-description">{product.description}</p>
                        <div className="featured-product-price">${parseFloat(product.price).toFixed(2)}</div>
                        <div className="featured-product-actions">
                          <button
                            onClick={(e) => handleAddToCart(product, e)}
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
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Carousel Controls */}
              {featuredProducts.length > 1 && (
                <>
                  <button
                    className="carousel-btn carousel-prev"
                    onClick={() => setCurrentSlide((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length)}
                    aria-label="Previous"
                  >
                    ‹
                  </button>
                  <button
                    className="carousel-btn carousel-next"
                    onClick={() => setCurrentSlide((prev) => (prev + 1) % featuredProducts.length)}
                    aria-label="Next"
                  >
                    ›
                  </button>
                  
                  {/* Carousel Indicators */}
                  <div className="carousel-indicators">
                    {featuredProducts.map((_, index) => (
                      <button
                        key={index}
                        className={`carousel-indicator ${index === currentSlide ? 'active' : ''}`}
                        onClick={() => setCurrentSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                        style={{ backgroundColor: index === currentSlide ? primaryColor : '#ccc' }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to get started?</h2>
          <p>Browse our complete catalog of office supplies and business solutions</p>
          <Link to="/products" className="btn btn-primary" style={{ backgroundColor: primaryColor }}>
            View All Products
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;

