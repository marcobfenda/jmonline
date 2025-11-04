import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import api from '../services/api';
import './Cart.css';

function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, getTotal } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const items = cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      const response = await api.post('/orders', {
        items,
        total_amount: getTotal(),
      });

      if (response.data.success) {
        clearCart();
        navigate(`/orders/${response.data.order.id}`);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container">
        <h1>Shopping Cart</h1>
        <div className="empty-cart">
          <p>Your cart is empty.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Shopping Cart</h1>
      <div className="cart-items">
        {cart.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-image">
              <img
                src={item.image_url || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-family="sans-serif" font-size="10"%3ENo Image%3C/text%3E%3C/svg%3E'}
                alt={item.name}
                onError={(e) => {
                  if (!e.target.src.includes('data:image/svg+xml')) {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-family="sans-serif" font-size="10"%3ENo Image%3C/text%3E%3C/svg%3E';
                  } else {
                    e.target.style.display = 'none';
                  }
                }}
              />
            </div>
            <div className="cart-item-info">
              <h3>{item.name}</h3>
              <p className="cart-item-price">${parseFloat(item.price).toFixed(2)}</p>
              <div className="cart-item-controls">
                <label>
                  Quantity:
                  <input
                    type="number"
                    min="1"
                    max={item.stock}
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                  />
                </label>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="btn btn-danger btn-small"
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="cart-item-total">
              ${(parseFloat(item.price) * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <div className="cart-total">
          <strong>Total: ${getTotal().toFixed(2)}</strong>
        </div>
        {error && <div className="error">{error}</div>}
        <button
          onClick={handlePlaceOrder}
          className="btn btn-primary btn-large"
          disabled={loading}
        >
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
}

export default Cart;

