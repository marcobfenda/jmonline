import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../contexts/ToastContext';
import './AdminProducts.css';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingStock, setEditingStock] = useState({});
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image_url: '',
    category_id: '',
    featured: false,
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStockUpdate = async (productId, newStock) => {
    try {
      const response = await api.put(`/admin/products/${productId}/stock`, {
        stock: parseInt(newStock),
      });
      if (response.data.success) {
        setEditingStock({ ...editingStock, [productId]: false });
        fetchProducts();
      }
    } catch (error) {
      alert('Failed to update stock');
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setUploadMessage('Please select a file');
      return;
    }

    setUploading(true);
    setUploadMessage('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/admin/products/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data.success) {
        setUploadMessage(`Successfully uploaded ${response.data.count} products`);
        setFile(null);
        fetchProducts();
      }
    } catch (error) {
      setUploadMessage(error.response?.data?.error || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!formData.name || !formData.price || parseFloat(formData.price) <= 0) {
      setFormError('Name and valid price are required');
      return;
    }

    try {
      const productData = {
        name: formData.name,
        description: formData.description || '',
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock) || 0,
        image_url: formData.image_url || '',
        category_id: formData.category_id || null,
        featured: formData.featured || false,
      };

      let response;
      if (editingProduct) {
        response = await api.put(`/admin/products/${editingProduct.id}`, productData);
      } else {
        response = await api.post('/admin/products', productData);
      }

      if (response.data.success) {
        setFormSuccess(editingProduct ? 'Product updated successfully' : 'Product created successfully');
        setFormData({
          name: '',
          description: '',
          price: '',
          stock: '',
          image_url: '',
          category_id: '',
          featured: false,
        });
        setEditingProduct(null);
        setShowForm(false);
        fetchProducts();
        setTimeout(() => setFormSuccess(''), 3000);
      }
    } catch (error) {
      setFormError(error.response?.data?.error || 'Failed to save product');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      stock: product.stock || '',
      image_url: product.image_url || '',
      category_id: product.category_id || '',
      featured: product.featured || false,
    });
    setShowForm(true);
    setFormError('');
    setFormSuccess('');
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      image_url: '',
      category_id: '',
      featured: false,
    });
    setFormError('');
    setFormSuccess('');
  };

  const handleDeleteProduct = async (product) => {
    if (!window.confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await api.delete(`/admin/products/${product.id}`);
      if (response.data.success) {
        fetchProducts();
        showToast(`Product "${product.name}" deleted successfully`, 'success');
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to delete product', 'error');
    }
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Manage Products</h1>
        <button
          onClick={() => {
            if (showForm) {
              handleCancelForm();
            } else {
              setShowForm(true);
            }
          }}
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : 'Add New Product'}
        </button>
      </div>

      {showForm && (
        <div className="card product-form-section">
          <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
          <form onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label>Product Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                placeholder="Enter product name"
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
                placeholder="Enter product description"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Price *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                  placeholder="0.00"
                />
              </div>
              <div className="form-group">
                <label>Stock</label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                  placeholder="0"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Image URL</label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) =>
                  setFormData({ ...formData, image_url: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                />
                Featured Product (show on homepage)
              </label>
            </div>
            {formError && <div className="error">{formError}</div>}
            {formSuccess && <div className="success">{formSuccess}</div>}
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingProduct ? 'Update Product' : 'Create Product'}
              </button>
              <button
                type="button"
                onClick={handleCancelForm}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card upload-section">
        <h2>Upload Inventory (CSV)</h2>
        <p className="upload-info">
          Upload a CSV file with columns: name, description, price, stock, image_url
        </p>
        <form onSubmit={handleFileUpload}>
          <div className="form-group">
            <input
              type="file"
              accept=".csv,.xls,.xlsx"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          {uploadMessage && (
            <div
              className={uploadMessage.includes('Success') ? 'success' : 'error'}
            >
              {uploadMessage}
            </div>
          )}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={uploading || !file}
          >
            {uploading ? 'Uploading...' : 'Upload Inventory'}
          </button>
        </form>
      </div>

      <div className="products-table">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="product-cell">
                    <img
                      src={
                        product.image_url ||
                        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="50" height="50"%3E%3Crect width="50" height="50" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-family="sans-serif" font-size="8"%3EN/A%3C/text%3E%3C/svg%3E'
                      }
                      alt={product.name}
                      className="product-thumb"
                      onError={(e) => {
                        if (!e.target.src.includes('data:image/svg+xml')) {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="50" height="50"%3E%3Crect width="50" height="50" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-family="sans-serif" font-size="8"%3EN/A%3C/text%3E%3C/svg%3E';
                        } else {
                          e.target.style.display = 'none';
                        }
                      }}
                    />
                    <div>
                      <strong>{product.name}</strong>
                      <p className="product-desc">{product.description}</p>
                    </div>
                  </div>
                </td>
                <td>${parseFloat(product.price).toFixed(2)}</td>
                <td>
                  {editingStock[product.id] ? (
                    <div className="stock-edit">
                      <input
                        type="number"
                        min="0"
                        defaultValue={product.stock}
                        onBlur={(e) =>
                          handleStockUpdate(product.id, e.target.value)
                        }
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleStockUpdate(product.id, e.target.value);
                          }
                        }}
                        autoFocus
                      />
                    </div>
                  ) : (
                    <span
                      className="stock-value"
                      onClick={() =>
                        setEditingStock({ ...editingStock, [product.id]: true })
                      }
                    >
                      {product.stock}
                    </span>
                  )}
                </td>
                <td>
                  <span className={`featured-badge ${product.featured ? 'featured' : ''}`}>
                    {product.featured ? '⭐ Featured' : '—'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="btn btn-small btn-primary"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        setEditingStock({
                          ...editingStock,
                          [product.id]: !editingStock[product.id],
                        })
                      }
                      className="btn btn-small btn-secondary"
                    >
                      {editingStock[product.id] ? 'Cancel' : 'Edit Stock'}
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product)}
                      className="btn btn-small btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminProducts;

