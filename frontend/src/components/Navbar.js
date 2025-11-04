import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useTheme } from '../contexts/ThemeContext';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const navbarBgColor = theme.primary_color || '#007bff';
  
  return (
    <nav className="navbar" style={{ backgroundColor: navbarBgColor }}>
      <div className="navbar-container">
        <div className="navbar-brand-wrapper">
          <Link to="/" className="navbar-brand" onClick={handleLinkClick}>
            {theme.logo_url ? (
              <img
                src={`http://localhost:8082${theme.logo_url}`}
                alt={theme.site_name || 'JM Online'}
                className="navbar-logo"
                onError={(e) => {
                  e.target.style.display = 'none';
                  if (e.target.nextSibling) {
                    e.target.nextSibling.style.display = 'inline';
                  }
                }}
              />
            ) : null}
            <span style={{ display: theme.logo_url ? 'none' : 'inline' }}>
              {theme.site_name || 'JM Online'}
            </span>
          </Link>
          <button
            className={`burger-menu ${isMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        <div 
          className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}
          style={{ backgroundColor: navbarBgColor }}
        >
          {user?.role === 'admin' ? (
            <>
              <Link to="/admin" className="navbar-link" onClick={handleLinkClick}>Admin Dashboard</Link>
              <Link to="/admin/users" className="navbar-link" onClick={handleLinkClick}>Users</Link>
              <Link to="/admin/orders" className="navbar-link" onClick={handleLinkClick}>Orders</Link>
              <Link to="/admin/products" className="navbar-link" onClick={handleLinkClick}>Products</Link>
              <Link to="/admin/categories" className="navbar-link" onClick={handleLinkClick}>Categories</Link>
              <Link to="/admin/settings" className="navbar-link" onClick={handleLinkClick}>Settings</Link>
            </>
          ) : (
            <>
              <Link to="/" className="navbar-link" onClick={handleLinkClick}>Home</Link>
              <Link to="/products" className="navbar-link" onClick={handleLinkClick}>Products</Link>
              <Link to="/contact" className="navbar-link" onClick={handleLinkClick}>Contact</Link>
              {user && (
                <>
                  <Link to="/cart" className="navbar-link" onClick={handleLinkClick}>
                    Cart
                    {cartItemCount > 0 && <span className="cart-badge">({cartItemCount})</span>}
                  </Link>
                  <Link to="/orders" className="navbar-link" onClick={handleLinkClick}>My Orders</Link>
                </>
              )}
            </>
          )}
          {user ? (
            <>
              <span className="navbar-user">Hello, {user.username}</span>
              <button onClick={handleLogout} className="btn btn-secondary btn-small">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-secondary btn-small">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

