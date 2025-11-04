import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../contexts/ToastContext';
import './AdminCategories.css';

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const { showToast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/admin/categories');
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      showToast('Failed to load categories', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingCategory) {
        // Update existing category
        const response = await api.put(`/admin/categories/${editingCategory.id}`, formData);
        if (response.data.success) {
          showToast('Category updated successfully', 'success');
          setFormData({ name: '', description: '' });
          setEditingCategory(null);
          setShowForm(false);
          fetchCategories();
        }
      } else {
        // Create new category
        const response = await api.post('/admin/categories', formData);
        if (response.data.success) {
          showToast('Category created successfully', 'success');
          setFormData({ name: '', description: '' });
          setShowForm(false);
          fetchCategories();
        }
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to save category';
      showToast(errorMsg, 'error');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category? Products with this category will have their category removed.')) {
      return;
    }

    try {
      const response = await api.delete(`/admin/categories/${id}`);
      if (response.data.success) {
        showToast('Category deleted successfully', 'success');
        fetchCategories();
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to delete category';
      showToast(errorMsg, 'error');
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', description: '' });
    setEditingCategory(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="loading">Loading categories...</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Manage Categories</h1>
        <button
          onClick={() => {
            setEditingCategory(null);
            setFormData({ name: '', description: '' });
            setShowForm(!showForm);
          }}
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : 'Create New Category'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h2>{editingCategory ? 'Edit Category' : 'Create New Category'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                placeholder="e.g., Furniture, Electronics"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows="3"
                placeholder="Optional description for this category"
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingCategory ? 'Update Category' : 'Create Category'}
              </button>
              <button type="button" onClick={handleCancel} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="categories-list">
        {categories.length === 0 ? (
          <div className="empty-state">
            <p>No categories found. Create your first category to get started.</p>
          </div>
        ) : (
          categories.map((category) => (
            <div key={category.id} className="category-card">
              <div className="category-info">
                <h3>{category.name}</h3>
                {category.description && (
                  <p className="category-description">{category.description}</p>
                )}
                <span className="category-meta">
                  Created: {new Date(category.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="category-actions">
                <button
                  onClick={() => handleEdit(category)}
                  className="btn btn-secondary btn-small"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="btn btn-danger btn-small"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminCategories;

