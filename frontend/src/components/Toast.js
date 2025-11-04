import React from 'react';
import './Toast.css';

function Toast({ message, type = 'success', onClose }) {
  return (
    <div className={`toast toast-${type}`}>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={onClose}>&times;</button>
    </div>
  );
}

export default Toast;

