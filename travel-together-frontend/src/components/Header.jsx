import { Link } from 'react-router-dom';
import { useState } from 'react';
import './Header.css';
import ttLogo from '../assets/TT_logo_nobg.png';
import { useUser } from '../contexts/UserContext';
import UserDisplay from './auth/UserDisplay';

function Header() {
  // State for mobile menu toggle (for future implementation)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Get authentication state from context
  const { isLoggedIn } = useUser();

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
              <img 
                src={ttLogo} 
                alt="TravelTogether Logo" 
                className="brand-logo"
              />
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
              <UserDisplay />
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
                <div className="p-4">
                  <UserDisplay />
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;