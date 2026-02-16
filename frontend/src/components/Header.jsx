import React, { useState } from 'react';
import { ShoppingBag, Heart, User, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ProfileModal from './ProfileModal';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState(null);
  const { cartCount = 0, wishlistItems = [] } = useCart();

  // Safe wishlist check
  const hasWishlistItems = Array.isArray(wishlistItems) && wishlistItems.length > 0;
  const safeWishlistCount = Array.isArray(wishlistItems) ? wishlistItems.length : 0;

  // Check for logged in user on mount and storage events
  React.useEffect(() => {
    const checkUser = () => {
      const userInfoString = localStorage.getItem('userInfo');
      if (userInfoString) {
        try {
          const user = JSON.parse(userInfoString);
          console.log("Header User Check:", user); // DEBUG LOG
          setUsername(user.name);
          if (user.role === 'admin') {
            console.log("User is ADMIN. Setting isAdmin = true"); // DEBUG LOG
            setIsAdmin(true);
          } else {
            console.log("User is CUSTOMER. Setting isAdmin = false"); // DEBUG LOG
            setIsAdmin(false);
          }
        } catch (e) {
          console.error("Error parsing user info", e);
        }
      } else {
        setUsername(null);
        setIsAdmin(false);
      }
    };

    checkUser();
    window.addEventListener('storage', checkUser);
    window.addEventListener('auth-change', checkUser); // Listen for custom event
    return () => {
      window.removeEventListener('storage', checkUser);
      window.removeEventListener('auth-change', checkUser);
    };
  }, []);

  const handleLogin = (name) => {
    setUsername(name);
    setShowLogin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    setUsername(null);
    setIsAdmin(false);
    window.location.reload();
  };

  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <>
      <header className="header">
        <div className="container header-container">
          {/* Logo */}
          <Link to="/" className="logo">
            Xpression<span className="logo-accent">.</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="desktop-nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/shop" className="nav-link">Shop</Link>
            <Link to="/about" className="nav-link">About Us</Link>
            <Link to="/contact" className="nav-link">Contact Us</Link>
          </nav>

          {/* Actions */}
          <div className="header-actions">

            <button className="icon-btn" aria-label="Sign In" onClick={() => !username && setShowLogin(true)}>
              <User size={22} />
              {username ? (
                <div className="user-dropdown">
                  <span className="user-greeting">Hi, {username}</span>
                  <div className="dropdown-content">
                    {isAdmin && (
                      <Link to="/admin/dashboard" className="dropdown-item admin-link">
                        Admin Panel
                      </Link>
                    )}
                    <button onClick={handleLogout} className="dropdown-item">Logout</button>
                  </div>
                </div>
              ) : (
                <span className="tooltip">Login</span>
              )}
            </button>

            <Link to="/wishlist" className="icon-btn" aria-label="Wishlist">
              <Heart size={22} fill={hasWishlistItems ? "#e74c3c" : "none"} color={hasWishlistItems ? "#e74c3c" : "currentColor"} />
            </Link>

            <Link to="/cart" className="icon-btn" aria-label="Cart">
              <ShoppingBag size={22} />
              {cartCount > 0 && <span className="badge">{cartCount}</span>}
            </Link>

            <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="mobile-nav">
            <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/shop" onClick={() => setIsMenuOpen(false)}>Shop</Link>
            <Link to="/about" onClick={() => setIsMenuOpen(false)}>About Us</Link>
            <Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact Us</Link>
            <Link to="/cart" onClick={() => setIsMenuOpen(false)}>Cart ({cartCount})</Link>
            <Link to="/wishlist" onClick={() => setIsMenuOpen(false)}>Wishlist ({safeWishlistCount})</Link>
          </div>
        )}

        <style>{`
          .header {
            position: sticky;
            top: 0;
            z-index: 1000;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(0,0,0,0.05);
            padding: 1rem 0;
          }

          .header-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .logo {
            font-family: var(--font-heading);
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--color-primary);
            letter-spacing: -0.5px;
          }

          .logo-accent {
            color: var(--color-accent);
          }

          .desktop-nav {
            display: none;
          }

          @media (min-width: 768px) {
            .desktop-nav {
              display: flex;
              gap: 2rem;
            }
          }

          .nav-link {
            font-weight: 500;
            font-size: 0.95rem;
            color: var(--color-text-main);
            position: relative;
          }

          .nav-link:hover {
            color: var(--color-accent);
          }

          .nav-link::after {
            content: '';
            position: absolute;
            bottom: -4px;
            left: 0;
            width: 0;
            height: 2px;
            background: var(--color-accent);
            transition: width 0.3s ease;
          }

          .nav-link:hover::after {
            width: 100%;
          }

          .header-actions {
            display: flex;
            align-items: center;
            gap: 1.5rem;
          }

          .icon-btn {
            position: relative;
            color: var(--color-text-main);
          }

          .icon-btn:hover {
            color: var(--color-accent);
            transform: translateY(-2px);
          }

          .badge {
            position: absolute;
            top: -5px;
            right: -8px;
            background-color: var(--color-accent);
            color: white;
            font-size: 0.7rem;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
          }

          .user-greeting {
             font-size: 0.8rem;
             margin-left: 0.5rem;
             font-weight: 600;
             white-space: nowrap;
          }

          .tooltip {
              position: absolute;
              top: 100%;
              left: 50%;
              transform: translateX(-50%);
              background: #333;
              color: #fff;
              font-size: 0.7rem;
              padding: 4px 8px;
              border-radius: 4px;
              margin-top: 8px;
              white-space: nowrap;
              opacity: 0;
              transition: opacity 0.2s;
              pointer-events: none;
          }

          .icon-btn:hover .tooltip {
              opacity: 1;
          }

          .mobile-menu-btn {
            display: block;
          }

          @media (min-width: 768px) {
            .mobile-menu-btn {
              display: none;
            }
          }

          .mobile-nav {
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background: white;
            padding: 1rem;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            border-bottom: 1px solid #eee;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
            z-index: 999;
          }

        .mobile-nav a {
            font-size: 1.1rem;
            font-weight: 500;
            padding: 0.5rem;
          }

        .user-dropdown {
            position: relative;
            display: inline-block;
        }

        .dropdown-content {
            display: none;
            position: absolute;
            right: 0;
            top: 100%;
            background-color: white;
            min-width: 160px;
            box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
            z-index: 1001;
            border-radius: 4px;
            overflow: hidden;
            padding: 5px 0;
        }

        .user-dropdown:hover .dropdown-content {
            display: block;
        }

        .dropdown-item {
            color: black;
            padding: 12px 16px;
            text-decoration: none;
            display: block;
            width: 100%;
            text-align: left;
            border: none;
            background: none;
            cursor: pointer;
            font-size: 0.9rem;
        }

        .dropdown-item:hover {
            background-color: #f9f9f9;
            color: var(--color-primary);
        }
        
        .admin-link {
            color: var(--color-primary);
            font-weight: bold;
            border-bottom: 1px solid #eee;
        }
        `}</style>
      </header>

      {showLogin && (
        <ProfileModal onClose={() => setShowLogin(false)} onLogin={handleLogin} />
      )}
    </>
  );
};

export default Header;
