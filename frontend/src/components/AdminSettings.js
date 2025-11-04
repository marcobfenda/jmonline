import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { useTheme } from '../contexts/ThemeContext';
import './AdminSettings.css';

function AdminSettings() {
  const [settings, setSettings] = useState({
    site_name: '',
    primary_color: '#007bff',
    secondary_color: '#6c757d',
    logo_url: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    og_title: '',
    og_description: '',
    og_image: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const { showToast } = useToast();
  const { theme, applyTheme, loadTheme } = useTheme();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings');
      setSettings(response.data);
      // Apply theme immediately
      if (response.data.primary_color || response.data.secondary_color) {
        applyTheme(response.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      console.log('Saving settings:', settings);
      const response = await api.put('/settings', settings);
      console.log('Settings save response:', response.data);
      
      if (response.data) {
        const updatedSettings = response.data.settings || response.data;
        console.log('Updated settings:', updatedSettings);
        
        setSettings(updatedSettings);
        
        // Apply theme immediately to CSS variables
        applyTheme(updatedSettings);
        
        // Reload theme in context to update all components
        if (loadTheme) {
          await loadTheme();
        }
        
        showToast('Settings saved successfully', 'success');
      } else {
        showToast('Settings saved but no data returned', 'warning');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      console.error('Error response:', error.response?.data);
      showToast(error.response?.data?.error || 'Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e) => {
    e.preventDefault();
    if (!logoFile) {
      showToast('Please select a logo file', 'error');
      return;
    }

    setUploadingLogo(true);

    const formData = new FormData();
    formData.append('logo', logoFile);

    try {
      const response = await api.post('/settings/upload-logo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data.success) {
        const logoUrl = response.data.logo_url || response.data.full_url?.replace(/^https?:\/\/[^\/]+/, '') || '';
        setSettings({ ...settings, logo_url: logoUrl });
        showToast('Logo uploaded successfully', 'success');
        setLogoFile(null);
        // Reload theme to apply logo
        if (window.loadTheme) {
          window.loadTheme();
        }
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to upload logo', 'error');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleRemoveLogo = async () => {
    try {
      const response = await api.put('/settings', { logo_url: null });
      if (response.data.success) {
        setSettings({ ...settings, logo_url: null });
        showToast('Logo removed successfully', 'success');
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to remove logo', 'error');
    }
  };

  if (loading) {
    return <div className="loading">Loading settings...</div>;
  }

  return (
    <div className="container">
      <h1>Site Settings</h1>

      <div className="card settings-section">
        <h2>General Settings</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Site Name</label>
            <input
              type="text"
              value={settings.site_name || ''}
              onChange={(e) =>
                setSettings({ ...settings, site_name: e.target.value })
              }
              placeholder="Enter site name"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Primary Color</label>
              <div className="color-input-group">
                <input
                  type="color"
                  value={settings.primary_color || '#007bff'}
                  onChange={(e) =>
                    setSettings({ ...settings, primary_color: e.target.value })
                  }
                  className="color-picker"
                />
                <input
                  type="text"
                  value={settings.primary_color || '#007bff'}
                  onChange={(e) =>
                    setSettings({ ...settings, primary_color: e.target.value })
                  }
                  placeholder="#007bff"
                  className="color-text"
                />
              </div>
              <p className="form-help">Main brand color used for buttons and navigation</p>
            </div>

            <div className="form-group">
              <label>Secondary Color</label>
              <div className="color-input-group">
                <input
                  type="color"
                  value={settings.secondary_color || '#6c757d'}
                  onChange={(e) =>
                    setSettings({ ...settings, secondary_color: e.target.value })
                  }
                  className="color-picker"
                />
                <input
                  type="text"
                  value={settings.secondary_color || '#6c757d'}
                  onChange={(e) =>
                    setSettings({ ...settings, secondary_color: e.target.value })
                  }
                  placeholder="#6c757d"
                  className="color-text"
                />
              </div>
              <p className="form-help">Secondary color for accents</p>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={saving}
              onClick={(e) => {
                console.log('Save button clicked');
                // Let form handle submission
              }}
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>

      <div className="card settings-section">
        <h2>SEO Settings</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Meta Title</label>
            <input
              type="text"
              value={settings.meta_title || ''}
              onChange={(e) =>
                setSettings({ ...settings, meta_title: e.target.value })
              }
              placeholder="Enter meta title (appears in browser tab and search results)"
              maxLength={60}
            />
            <p className="form-help">Recommended: 50-60 characters. Shown in browser tabs and search results.</p>
          </div>

          <div className="form-group">
            <label>Meta Description</label>
            <textarea
              value={settings.meta_description || ''}
              onChange={(e) =>
                setSettings({ ...settings, meta_description: e.target.value })
              }
              placeholder="Enter meta description (appears in search results)"
              rows={3}
              maxLength={160}
            />
            <p className="form-help">Recommended: 150-160 characters. Shown in search engine results.</p>
          </div>

          <div className="form-group">
            <label>Meta Keywords</label>
            <input
              type="text"
              value={settings.meta_keywords || ''}
              onChange={(e) =>
                setSettings({ ...settings, meta_keywords: e.target.value })
              }
              placeholder="keyword1, keyword2, keyword3"
            />
            <p className="form-help">Comma-separated keywords relevant to your site.</p>
          </div>

          <div className="form-group">
            <label>Open Graph Title</label>
            <input
              type="text"
              value={settings.og_title || ''}
              onChange={(e) =>
                setSettings({ ...settings, og_title: e.target.value })
              }
              placeholder="Enter Open Graph title (for social media sharing)"
              maxLength={60}
            />
            <p className="form-help">Title shown when your site is shared on social media. Defaults to Meta Title if empty.</p>
          </div>

          <div className="form-group">
            <label>Open Graph Description</label>
            <textarea
              value={settings.og_description || ''}
              onChange={(e) =>
                setSettings({ ...settings, og_description: e.target.value })
              }
              placeholder="Enter Open Graph description (for social media sharing)"
              rows={3}
              maxLength={200}
            />
            <p className="form-help">Description shown when your site is shared on social media. Defaults to Meta Description if empty.</p>
          </div>

          <div className="form-group">
            <label>Open Graph Image URL</label>
            <input
              type="url"
              value={settings.og_image || ''}
              onChange={(e) =>
                setSettings({ ...settings, og_image: e.target.value })
              }
              placeholder="https://example.com/image.jpg"
            />
            <p className="form-help">Image shown when your site is shared on social media. Recommended: 1200x630px. Defaults to logo if empty.</p>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save SEO Settings'}
            </button>
          </div>
        </form>
      </div>

      <div className="card settings-section">
        <h2>Logo</h2>
        <div className="logo-section">
          {settings.logo_url && (
            <div className="logo-preview">
              <img
                src={`http://localhost:8082${settings.logo_url}`}
                alt="Site logo"
                className="logo-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="btn btn-danger btn-small"
              >
                Remove Logo
              </button>
            </div>
          )}

          <form onSubmit={handleLogoUpload} className="logo-upload-form">
            <div className="form-group">
              <label>Upload Logo</label>
              <p className="form-help">
                Accepted formats: JPEG, PNG, GIF, SVG (Max 5MB)
              </p>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/svg+xml"
                onChange={(e) => setLogoFile(e.target.files[0])}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={uploadingLogo || !logoFile}
            >
              {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
            </button>
          </form>
        </div>
      </div>

      <div className="card settings-preview">
        <h2>Preview</h2>
        <div className="preview-box" style={{ backgroundColor: settings.primary_color || '#007bff' }}>
          <div className="preview-content">
            {settings.logo_url ? (
              <img
                src={`http://localhost:8082${settings.logo_url}`}
                alt="Logo preview"
                className="preview-logo"
                onError={(e) => {
                  console.error('Preview logo load error:', e.target.src);
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <h3 style={{ color: 'white' }}>{settings.site_name || 'Site Name'}</h3>
            )}
            <button
              className="btn"
              style={{
                backgroundColor: settings.primary_color || '#007bff',
                color: 'white',
                border: 'none',
              }}
            >
              Sample Button
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSettings;

