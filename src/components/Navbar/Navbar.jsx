import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSearch, 
  FaBell, 
  FaUser, 
  FaBars, 
  FaTimes,
  FaCaretDown,
  FaHome,
  FaFilm,
  FaTv,
  FaStar,
  FaPlus,
  FaCog
} from 'react-icons/fa';
import { useMovie } from '../../context/MovieContext';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications] = useState([
    { id: 1, text: 'New episode of Stranger Things available', time: '2 hours ago', unread: true },
    { id: 2, text: 'Your watchlist has new recommendations', time: '1 day ago', unread: true },
    { id: 3, text: 'New season of The Crown is here', time: '2 days ago', unread: false }
  ]);

  const location = useLocation();
  const navigate = useNavigate();
  const { searchMovies } = useMovie();
  const searchRef = useRef(null);
  const userDropdownRef = useRef(null);
  const notificationsRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target) && searchQuery === '') {
        setShowSearch(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchQuery]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
    // Real-time search could be implemented here
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowSearch(false);
  };

  const handleQuickSearch = (query) => {
    setSearchQuery(query);
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setShowSearch(false);
  };

  const unreadNotifications = notifications.filter(n => n.unread).length;

  const navItems = [
    { path: '/', label: 'Home', icon: <FaHome /> },
    { path: '/movies', label: 'Movies', icon: <FaFilm /> },
    { path: '/tv-shows', label: 'TV Shows', icon: <FaTv /> },
    { path: '/new', label: 'New & Popular', icon: <FaPlus /> },
    { path: '/my-list', label: 'My List', icon: <FaStar /> }
  ];

  const quickSearches = [
    'Action', 'Comedy', 'Drama', 'Thriller', 'Romance', 'Horror'
  ];

  return (
    <>
      <motion.nav 
        className={`navbar ${isScrolled ? 'navbar-scrolled' : ''} ${showMobileMenu ? 'mobile-menu-open' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="nav-container">
          {/* Logo Section */}
          <div className="nav-brand">
            <Link to="/" className="brand-link">
              <span className="brand-logo">E-FILM</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="nav-menu">
            <ul className="nav-list">
              {navItems.map((item) => (
                <li key={item.path} className="nav-item">
                  <Link 
                    to={item.path} 
                    className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Side Actions */}
          <div className="nav-actions">
            {/* Search */}
            <div className="search-container" ref={searchRef}>
              <AnimatePresence>
                {showSearch && (
                  <motion.div
                    className="search-expanded"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 300 }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <form onSubmit={handleSearch} className="search-form">
                      <div className="search-input-wrapper">
                        <FaSearch className="search-icon" />
                        <input
                          ref={searchRef}
                          type="text"
                          placeholder="Search movies, TV shows..."
                          value={searchQuery}
                          onChange={handleSearchInputChange}
                          className="search-input"
                          autoFocus
                        />
                        {searchQuery && (
                          <button 
                            type="button" 
                            className="clear-search-btn"
                            onClick={clearSearch}
                          >
                            <FaTimes />
                          </button>
                        )}
                      </div>
                    </form>

                    {/* Quick Search Suggestions */}
                    {searchQuery === '' && (
                      <div className="quick-search">
                        <h4>Popular Searches</h4>
                        <div className="quick-search-tags">
                          {quickSearches.map(tag => (
                            <button
                              key={tag}
                              className="quick-search-tag"
                              onClick={() => handleQuickSearch(tag)}
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <button 
                className={`nav-action-btn search-btn ${showSearch ? 'active' : ''}`}
                onClick={() => setShowSearch(!showSearch)}
                aria-label="Search"
              >
                <FaSearch />
              </button>
            </div>

            {/* Notifications */}
            <div className="notifications-container" ref={notificationsRef}>
              <button 
                className="nav-action-btn notifications-btn"
                onClick={() => setShowNotifications(!showNotifications)}
                aria-label="Notifications"
              >
                <FaBell />
                {unreadNotifications > 0 && (
                  <span className="notification-badge">{unreadNotifications}</span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    className="notifications-dropdown"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="notifications-header">
                      <h3>Notifications</h3>
                      <span className="notifications-count">{unreadNotifications} new</span>
                    </div>
                    <div className="notifications-list">
                      {notifications.map(notification => (
                        <div 
                          key={notification.id} 
                          className={`notification-item ${notification.unread ? 'unread' : ''}`}
                        >
                          <p className="notification-text">{notification.text}</p>
                          <span className="notification-time">{notification.time}</span>
                        </div>
                      ))}
                    </div>
                    <div className="notifications-footer">
                      <button className="view-all-btn">View All Notifications</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Dropdown */}
            <div className="user-container" ref={userDropdownRef}>
              <button 
                className="user-btn"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                aria-label="User menu"
              >
                <div className="user-avatar">
                  <FaUser />
                </div>
                <FaCaretDown className={`caret ${showUserDropdown ? 'open' : ''}`} />
              </button>

              <AnimatePresence>
                {showUserDropdown && (
                  <motion.div
                    className="user-dropdown"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="dropdown-header">
                      <div className="user-info">
                        <div className="user-avatar large">
                          <FaUser />
                        </div>
                        <div className="user-details">
                          <span className="user-name">John Doe</span>
                          <span className="user-email">john.doe@example.com</span>
                        </div>
                      </div>
                    </div>
                    <div className="dropdown-content">
                      <Link to="/profile" className="dropdown-item">
                        <FaUser />
                        <span>Profile</span>
                      </Link>
                      <Link to="/settings" className="dropdown-item">
                        <FaCog />
                        <span>Account Settings</span>
                      </Link>
                      <div className="dropdown-divider"></div>
                      <button className="dropdown-item">
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="mobile-menu-toggle"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              aria-label="Toggle menu"
            >
              {showMobileMenu ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              className="mobile-menu"
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ duration: 0.3 }}
            >
              <div className="mobile-menu-header">
                <span className="user-welcome">Welcome, John</span>
              </div>
              <ul className="mobile-nav-list">
                {navItems.map((item) => (
                  <li key={item.path} className="mobile-nav-item">
                    <Link 
                      to={item.path} 
                      className={`mobile-nav-link ${location.pathname === item.path ? 'active' : ''}`}
                      onClick={() => setShowMobileMenu(false)}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mobile-menu-footer">
                <button className="mobile-sign-out">Sign Out</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            className="mobile-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMobileMenu(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
