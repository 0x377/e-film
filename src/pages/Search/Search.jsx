import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMovie } from '../../context/MovieContext';
import { motion, AnimatePresence } from 'framer-motion';
import MovieCard from '../../components/MovieCard/MovieCard';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import { FaSearch, FaTimes, FaFilter, FaSort } from 'react-icons/fa';
import './Search.css';

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchMovies, searchResults, loading } = useMovie();
  const [query, setQuery] = useState('');
  const [localResults, setLocalResults] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    genre: '',
    year: '',
    sortBy: 'popularity'
  });

  // Extract query from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchQuery = urlParams.get('q') || '';
    setQuery(searchQuery);
    
    if (searchQuery) {
      handleSearch(searchQuery);
    }
  }, [location.search]);

  const handleSearch = useCallback(async (searchQuery) => {
    if (searchQuery.trim()) {
      await searchMovies(searchQuery);
    }
  }, [searchMovies]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const clearSearch = () => {
    setQuery('');
    navigate('/search');
  };

  const applyFilters = (newFilters) => {
    setFilters(newFilters);
    // Filter logic would be implemented here
  };

  const displayedResults = searchResults.length > 0 ? searchResults : localResults;

  return (
    <div className="search-page">
      <div className="container">
        {/* Search Header */}
        <motion.div 
          className="search-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <form onSubmit={handleSubmit} className="search-form-large">
            <div className="search-input-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search for movies, TV shows, and more..."
                value={query}
                onChange={handleInputChange}
                className="search-input-large"
              />
              {query && (
                <button 
                  type="button" 
                  className="clear-search"
                  onClick={clearSearch}
                >
                  <FaTimes />
                </button>
              )}
            </div>
            <button type="submit" className="search-submit-btn">
              Search
            </button>
          </form>

          <div className="search-actions">
            <button 
              className="filter-btn"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter /> Filters
            </button>
            <button className="sort-btn">
              <FaSort /> Sort
            </button>
          </div>
        </motion.div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              className="filters-panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="filter-group">
                <label>Genre</label>
                <select 
                  value={filters.genre}
                  onChange={(e) => applyFilters({ ...filters, genre: e.target.value })}
                >
                  <option value="">All Genres</option>
                  <option value="28">Action</option>
                  <option value="12">Adventure</option>
                  <option value="35">Comedy</option>
                  {/* Add more genres */}
                </select>
              </div>
              
              <div className="filter-group">
                <label>Year</label>
                <select 
                  value={filters.year}
                  onChange={(e) => applyFilters({ ...filters, year: e.target.value })}
                >
                  <option value="">All Years</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  {/* Add more years */}
                </select>
              </div>
              
              <div className="filter-group">
                <label>Sort By</label>
                <select 
                  value={filters.sortBy}
                  onChange={(e) => applyFilters({ ...filters, sortBy: e.target.value })}
                >
                  <option value="popularity">Popularity</option>
                  <option value="release_date">Release Date</option>
                  <option value="vote_average">Rating</option>
                  <option value="title">Title</option>
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Results */}
        <div className="search-results">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {query && (
                <motion.div
                  className="results-header"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2>
                    Search Results for "{query}"
                    {displayedResults.length > 0 && (
                      <span className="results-count"> ({displayedResults.length} results)</span>
                    )}
                  </h2>
                </motion.div>
              )}

              <AnimatePresence mode="wait">
                {displayedResults.length > 0 ? (
                  <motion.div
                    key="results"
                    className="results-grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="row">
                      {displayedResults.map((movie, index) => (
                        <motion.div
                          key={movie.id}
                          className="col-xl-2 col-lg-3 col-md-4 col-sm-6 mb-4"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <MovieCard movie={movie} />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ) : query ? (
                  <motion.div
                    key="no-results"
                    className="no-results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="no-results-content">
                      <h3>No results found for "{query}"</h3>
                      <p>Try adjusting your search or filters to find what you're looking for.</p>
                      <button 
                        className="btn btn-primary"
                        onClick={clearSearch}
                      >
                        Clear Search
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty-state"
                    className="empty-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="empty-state-content">
                      <FaSearch className="empty-icon" />
                      <h3>Start Exploring</h3>
                      <p>Search for your favorite movies, TV shows, and more.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
