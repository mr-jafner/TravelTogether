import { Link } from 'react-router-dom';
import { useState } from 'react';
import './Header.css';

function Header() {
  // State for mobile menu toggle (for future implementation)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Placeholder for authentication state (Phase 2)
  const isLoggedIn = false; // This will come from your auth context later

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          
          {/* Brand/Logo Section */}
          <div className="brand-section">
            <Link to="/" className="brand-link">
              <div className="brand-icon">
                <span className="brand-icon-text">TT</span>
              </div>
              <span className="brand-text brand-text-full">TravelTogether</span>
              <span className="brand-text brand-text-short">TT</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="desktop-nav" aria-label="Main navigation">
            <Link 
              to="/" 
              className="nav-link"
              aria-label="View dashboard"
            >
              Dashboard
            </Link>
            <Link 
              to="/trips" 
              className="nav-link"
              aria-label="View my trips"
            >
              My Trips
            </Link>
            <Link 
              to="/feed" 
              className="nav-link"
              aria-label="View feed"
            >
              Feed
            </Link>
          </nav>

          {/* User Actions Area */}
          <div className="user-actions">
            
            {/* Desktop User Menu */}
            <div className="desktop-user-menu">
              {isLoggedIn ? (
                <>
                  {/* Notification bell placeholder */}
                  <button 
                    className="notification-btn"
                    aria-label="View notifications"
                  >
                    <svg className="notification-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-3.5-3.5a50.9 50.9 0 01-5.5 3.5zm0 0l-.5 5h-9l-.5-5m10 0a50.9 50.9 0 01-5.5 3.5m5.5-3.5L13.5 10a50.9 50.9 0 015.5 7.5z" />
                    </svg>
                  </button>
                  
                  {/* User Profile Link */}
                  <Link 
                    to="/profile" 
                    className="nav-link"
                    aria-label="View profile"
                  >
                    Profile
                  </Link>
                  
                  {/* Logout button placeholder */}
                  <button className="logout-btn">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="nav-link"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="signup-btn"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="mobile-menu-btn"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle mobile menu"
            >
              <svg 
                className="mobile-menu-icon" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="mobile-menu">
            <nav className="mobile-nav" aria-label="Mobile navigation">
              <Link 
                to="/" 
                className="mobile-nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                to="/trips" 
                className="mobile-nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Trips
              </Link>
              <Link 
                to="/feed" 
                className="mobile-nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Feed
              </Link>
              
              {/* Mobile User Actions */}
              <div className="mobile-user-actions">
                {isLoggedIn ? (
                  <>
                    <Link 
                      to="/profile" 
                      className="mobile-nav-link"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button className="mobile-logout-btn">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      className="mobile-nav-link"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link 
                      to="/signup" 
                      className="mobile-signup-btn"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;