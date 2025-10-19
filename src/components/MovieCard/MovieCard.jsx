import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlay, FaPlus, FaThumbsUp, FaStar, FaInfoCircle } from 'react-icons/fa';
import { useMovie } from '../../context/MovieContext';
import LazyImage from '../LazyImage/LazyImage';
import './MovieCard.css';

const MovieCard = ({ movie, size = 'medium', showOverlay = true }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { getImageUrl } = useMovie();

  const posterUrl = getImageUrl(movie.poster_path, size === 'large' ? 'w500' : 'w342');
  const backdropUrl = getImageUrl(movie.backdrop_path, 'w780');

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const getYear = () => {
    return movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  };

  const truncateTitle = (title, maxLength = 20) => {
    if (title.length > maxLength) {
      return title.substring(0, maxLength) + '...';
    }
    return title;
  };

  const getRatingColor = (rating) => {
    if (rating >= 8) return '#46d369';
    if (rating >= 6) return '#ffd700';
    if (rating >= 4) return '#ffa500';
    return '#ff4444';
  };

  // Fallback image in case of error
  const fallbackImage = 'https://via.placeholder.com/342x513/2a2a2a/ffffff?text=No+Image';

  return (
    <motion.div
      className={`movie-card ${size} ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: size === 'large' ? 1.05 : 1.1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <div className="card-inner">
        {/* Main Card Content */}
        <div className="card-front">
          <Link to={`/movie/${movie.id}`} className="card-link">
            <div className="image-container">
              {!imageError ? (
                <LazyImage
                  src={posterUrl}
                  alt={movie.title}
                  className={`card-image ${imageLoaded ? 'loaded' : 'loading'}`}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              ) : (
                <div className="card-image fallback">
                  <div className="fallback-content">
                    <FaInfoCircle className="fallback-icon" />
                    <span>No Image</span>
                  </div>
                </div>
              )}
              
              {/* Rating Badge */}
              {movie.vote_average > 0 && (
                <div 
                  className="rating-badge"
                  style={{ backgroundColor: getRatingColor(movie.vote_average) }}
                >
                  <FaStar className="star-icon" />
                  <span>{movie.vote_average.toFixed(1)}</span>
                </div>
              )}

              {/* Quick Actions Overlay */}
              {showOverlay && (
                <div className="quick-actions">
                  <button className="action-btn play-btn">
                    <FaPlay />
                  </button>
                  <button className="action-btn add-btn">
                    <FaPlus />
                  </button>
                  <button className="action-btn like-btn">
                    <FaThumbsUp />
                  </button>
                </div>
              )}
            </div>

            {/* Card Info */}
            <div className="card-info">
              <h3 className="movie-title" title={movie.title}>
                {truncateTitle(movie.title, size === 'large' ? 25 : 20)}
              </h3>
              <div className="movie-meta">
                <span className="year">{getYear()}</span>
                {movie.vote_count > 0 && (
                  <span className="votes">({movie.vote_count.toLocaleString()})</span>
                )}
              </div>
            </div>
          </Link>
        </div>

        {/* Expanded Card on Hover */}
        {showOverlay && isHovered && (
          <motion.div
            className="card-expanded"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <div 
              className="expanded-backdrop"
              style={{ backgroundImage: `url(${backdropUrl || posterUrl})` }}
            >
              <div className="backdrop-overlay"></div>
            </div>
            
            <div className="expanded-content">
              <div className="expanded-actions">
                <button className="expanded-btn primary">
                  <FaPlay /> Play
                </button>
                <button className="expanded-btn">
                  <FaPlus />
                </button>
                <button className="expanded-btn">
                  <FaThumbsUp />
                </button>
              </div>

              <div className="expanded-info">
                <Link to={`/movie/${movie.id}`} className="expanded-title">
                  {movie.title}
                </Link>
                
                <div className="expanded-meta">
                  <span className="rating" style={{ color: getRatingColor(movie.vote_average) }}>
                    ⭐ {movie.vote_average?.toFixed(1)}
                  </span>
                  <span className="year">{getYear()}</span>
                  {movie.genre_ids && (
                    <span className="genres">
                      {movie.genre_ids.slice(0, 2).join(', ')}
                    </span>
                  )}
                </div>

                {movie.overview && (
                  <p className="expanded-overview">
                    {movie.overview.length > 150 
                      ? `${movie.overview.substring(0, 150)}...` 
                      : movie.overview
                    }
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default MovieCard;
