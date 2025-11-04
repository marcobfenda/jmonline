import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Orders.css';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div className="container">
      <h1>My Orders</h1>
      {orders.length === 0 ? (
        <div className="no-orders">
          <p>You have no orders yet.</p>
          <Link to="/" className="btn btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="order-card"
            >
              <div className="order-card-header">
                <div>
                  <h3>Order #{order.id}</h3>
                  <p className="order-date">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
                <div className={`order-status-badge status-${(order.status || 'Placed').toLowerCase().replace(/\s+/g, '-')}`}>
                  {order.status || 'Placed'}
                </div>
              </div>
              <div className="order-card-body">
                <p><strong>Total:</strong> ${parseFloat(order.total_amount).toFixed(2)}</p>
                <p><strong>Items:</strong> {order.items?.length || 0}</p>
                {order.payment_method && (
                  <p><strong>Payment:</strong> {order.payment_method.replace('_', ' ')}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;

