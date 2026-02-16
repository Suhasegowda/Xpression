import React, { useState } from 'react';
import { X } from 'lucide-react';
import api from '../api/axios';

const ProfileModal = ({ onClose, onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const endpoint = isRegistering ? '/auth/register' : '/auth/login';
      const payload = isRegistering
        ? { name: formData.name, email: formData.email, password: formData.password, phone: '1234567890' }
        : { email: formData.email, password: formData.password };

      const { data } = await api.post(endpoint, payload);

      console.log('Login success:', data);
      localStorage.setItem('token', data.token);
      localStorage.setItem('userInfo', JSON.stringify(data));

      onLogin(data.name);

      // Dispatch custom event to notify Header
      window.dispatchEvent(new Event('auth-change'));

      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}><X size={24} /></button>

        <div className="form-header">
          <h2>{isRegistering ? 'Join Xpression' : 'Login to Xpression'}</h2>
          <p>Enter your details to access your account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {isRegistering && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter full name"
              />
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter password"
            />
          </div>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="submit-btn">{isRegistering ? 'Register' : 'Login'}</button>

          <button type="button" className="toggle-btn" onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? 'Already have an account? Login' : 'New here? Register'}
          </button>
        </form>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }

        .modal-content {
          background: white;
          width: 100%;
          max-width: 450px;
          padding: 2.5rem;
          border-radius: 8px;
          border-top: 8px solid var(--color-primary); 
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          position: relative;
        }

        .close-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          color: #666;
          border: none;
          background: none;
          cursor: pointer;
        }

        .form-header {
          margin-bottom: 2rem;
        }

        .form-header h2 {
          font-size: 1.8rem;
          margin-bottom: 0.5rem;
        }

        .form-header p {
          color: #666;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .form-group input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
          transition: border-color 0.3s;
        }

        .form-group input:focus {
          outline: none;
          border-color: var(--color-primary);
        }

        .submit-btn {
          background-color: var(--color-primary);
          color: white;
          padding: 0.8rem;
          border: none;
          border-radius: 4px;
          font-weight: 600;
          margin-top: 0.5rem;
          cursor: pointer;
          font-size: 1rem;
        }

        .submit-btn:hover {
          background-color: var(--color-accent);
        }

        .toggle-btn {
            background: none;
            border: none;
            color: var(--color-accent);
            cursor: pointer;
            margin-top: 0.5rem;
            text-decoration: underline;
            font-size: 0.9rem;
        }

        .error-text {
            color: #e74c3c;
            font-size: 0.9rem;
            margin: 0;
        }
      `}</style>
    </div>
  );
};

export default ProfileModal;
