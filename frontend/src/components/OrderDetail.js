import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './OrderDetail.css';

function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/orders/${id}`);
      if (response.data) {
        // Ensure all required fields have defaults
        const orderData = {
          ...response.data,
          status: response.data.status || 'Placed',
          payment_status: response.data.payment_status || 'pending',
          items: response.data.items || [],
          total_amount: response.data.total_amount || 0,
        };
        setOrder(orderData);
      } else {
        setOrder(null);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!paymentMethod) {
      setError('Please select a payment method');
      return;
    }

    setProcessingPayment(true);
    setError('');

    try {
      const response = await api.put(`/orders/${id}/payment`, {
        payment_method: paymentMethod,
        payment_status: 'paid',
      });

      if (response.data.success) {
        setOrder(response.data.order);
        alert('Payment processed successfully!');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process payment');
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading order...</div>;
  }

  if (!order) {
    return (
      <div className="container">
        <div className="error">Order not found</div>
      </div>
    );
  }

  const canPay = (order.status === 'Placed' || !order.status) && (order.payment_status === 'pending' || !order.payment_status);

  return (
    <div className="container">
      <button onClick={() => navigate('/orders')} className="btn btn-secondary">
        ← Back to Orders
      </button>
      <div className="order-detail">
        <div className="order-header">
          <h1>Order #${order.id}</h1>
          <div className={`order-status status-${order.status?.toLowerCase().replace(' ', '-') || 'placed'}`}>
            {order.status || 'Placed'}
          </div>
        </div>

        <div className="card">
          <h2>Order Items</h2>
          <div className="order-items">
            {order.items && order.items.length > 0 ? (
              order.items.map((item) => (
                <div key={item.id} className="order-item">
                  <div className="order-item-image">
                    <img
                      src={item.image_url || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect width="80" height="80" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-family="sans-serif" font-size="9"%3ENo Image%3C/text%3E%3C/svg%3E'}
                      alt={item.product_name || 'Product'}
                      onError={(e) => {
                        if (!e.target.src.includes('data:image/svg+xml')) {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect width="80" height="80" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-family="sans-serif" font-size="9"%3ENo Image%3C/text%3E%3C/svg%3E';
                        } else {
                          e.target.style.display = 'none';
                        }
                      }}
                    />
                  </div>
                  <div className="order-item-info">
                    <h3>{item.product_name || 'Product'}</h3>
                    <p>Quantity: {item.quantity || 0}</p>
                    <p>Price: ${parseFloat(item.price || 0).toFixed(2)}</p>
                  </div>
                  <div className="order-item-total">
                    ${(parseFloat(item.price || 0) * (item.quantity || 0)).toFixed(2)}
                  </div>
                </div>
              ))
            ) : (
              <p>No items found in this order.</p>
            )}
          </div>
          <div className="order-total">
            <strong>Total Amount: ${parseFloat(order.total_amount || 0).toFixed(2)}</strong>
          </div>
        </div>

        {canPay && (
          <div className="card payment-section">
            <h2>Payment</h2>
            <div className="form-group">
              <label>Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="">Select payment method</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cash_on_delivery">Cash on Delivery</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>
            {error && <div className="error">{error}</div>}
            <button
              onClick={handlePayment}
              className="btn btn-primary"
              disabled={processingPayment || !paymentMethod}
            >
              {processingPayment ? 'Processing...' : 'Pay Now'}
            </button>
          </div>
        )}

        {order.payment_method && (
          <div className="card">
            <h2>Payment Information</h2>
            <p><strong>Payment Method:</strong> {order.payment_method ? order.payment_method.replace('_', ' ').toUpperCase() : 'N/A'}</p>
            <p><strong>Payment Status:</strong> {order.payment_status || 'pending'}</p>
          </div>
        )}

        <div className="card">
          <h2>Order Information</h2>
          <p><strong>Order Date:</strong> {order.created_at ? new Date(order.created_at).toLocaleString() : 'N/A'}</p>
          <p><strong>Status:</strong> {order.status || 'Placed'}</p>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;

