import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../contexts/ToastContext';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await api.post('/contact', formData);
      if (response.data.success) {
        showToast(response.data.message || 'Thank you for your message! We will get back to you soon.', 'success');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to send message. Please try again.';
      showToast(errorMsg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="contact-page">
        <h1>Contact Us</h1>
        <p className="contact-intro">
          Have a question or need assistance? We'd love to hear from you. 
          Fill out the form below and we'll get back to you as soon as possible.
        </p>

        <div className="contact-form-wrapper">
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your.email@example.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject *</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="What is this regarding?"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                placeholder="Tell us more about your inquiry..."
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>

          <div className="contact-info">
            <h2>Get in Touch</h2>
            <div className="info-item">
              <strong>Email:</strong>
              <p>support@jmonline.com</p>
            </div>
            <div className="info-item">
              <strong>Business Hours:</strong>
              <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
            </div>
            <div className="info-item">
              <strong>Response Time:</strong>
              <p>We typically respond within 24-48 hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;

