import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './AdminDashboard.css';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [ordersRes, usersRes, productsRes] = await Promise.all([
        api.get('/admin/orders'),
        api.get('/admin/users'),
        api.get('/products'),
      ]);

      const orders = ordersRes.data;
      const users = usersRes.data;
      const products = productsRes.data;

      setStats({
        totalOrders: orders.length,
        totalUsers: users.length,
        totalProducts: products.length,
        pendingOrders: orders.filter((o) => o.status === 'Placed').length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Orders</h3>
          <div className="stat-value">{stats.totalOrders}</div>
        </div>
        <div className="stat-card">
          <h3>Total Users</h3>
          <div className="stat-value">{stats.totalUsers}</div>
        </div>
        <div className="stat-card">
          <h3>Total Products</h3>
          <div className="stat-value">{stats.totalProducts}</div>
        </div>
        <div className="stat-card">
          <h3>Pending Orders</h3>
          <div className="stat-value">{stats.pendingOrders}</div>
        </div>
      </div>
      <div className="admin-links">
        <Link to="/admin/users" className="admin-link-card">
          <h2>Manage Users</h2>
          <p>Create and manage user accounts</p>
        </Link>
        <Link to="/admin/orders" className="admin-link-card">
          <h2>Manage Orders</h2>
          <p>View and update order statuses</p>
        </Link>
        <Link to="/admin/products" className="admin-link-card">
          <h2>Manage Products</h2>
          <p>Update stock levels and upload inventory</p>
        </Link>
        <Link to="/admin/categories" className="admin-link-card">
          <h2>Manage Categories</h2>
          <p>Create and manage product categories</p>
        </Link>
        <Link to="/admin/settings" className="admin-link-card">
          <h2>Site Settings</h2>
          <p>Customize site name, colors, and logo</p>
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;

