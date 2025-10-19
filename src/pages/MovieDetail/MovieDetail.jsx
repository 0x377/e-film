import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { movieAPI } from '../../utils/api';
import { useMovie } from '../../context/MovieContext';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import MovieCard from '../../components/MovieCard/MovieCard';
import { FaPlay, FaPlus, FaThumbsUp, FaShare, FaArrowLeft, FaStar } from 'react-icons/fa';
import './MovieDetail.css';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { popular } = useMovie();
  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        const [movieDetails, similar] = await Promise.all([
          movieAPI.getMovieDetails(id),
          movieAPI.getSimilarMovies(id)
        ]);
        setMovie(movieDetails);
        setSimilarMovies(similar.slice(0, 12));
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!movie) return <div className="error-container">Movie not found</div>;

  const backgroundImage = movieAPI.getImageUrl(movie.backdrop_path, 'original');
  const posterImage = movieAPI.getImageUrl(movie.poster_path, 'w500');

  return (
    <div className="movie-detail-page">
      {/* Backdrop */}
      <div 
        className="movie-backdrop"
        style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, #141414 100%), url(${backgroundImage})` }}
      >
        <div className="backdrop-overlay">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Back
          </button>
        </div>
      </div>

      {/* Movie Content */}
      <div className="container">
        <motion.div 
          className="movie-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="row">
            <div className="col-lg-4 col-md-5">
              <motion.div 
                className="poster-container"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img src={posterImage} alt={movie.title} className="movie-poster" />
              </motion.div>
            </div>
            
            <div className="col-lg-8 col-md-7">
              <div className="movie-info">
                <h1 className="movie-title">{movie.title}</h1>
                
                <div className="movie-meta">
                  <span className="rating">
                    <FaStar className="star-icon" />
                    {movie.vote_average?.toFixed(1)}
                  </span>
                  <span className="year">
                    {new Date(movie.release_date).getFullYear()}
                  </span>
                  <span className="runtime">
                    {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                  </span>
                  <span className="certification">PG-13</span>
                </div>

                <div className="genres">
                  {movie.genres?.map(genre => (
                    <span key={genre.id} className="genre-tag">{genre.name}</span>
                  ))}
                </div>

                <div className="action-buttons">
                  <button className="btn btn-primary btn-play">
                    <FaPlay /> Play
                  </button>
                  <button className="btn btn-outline-light btn-action">
                    <FaPlus />
                  </button>
                  <button className="btn btn-outline-light btn-action">
                    <FaThumbsUp />
                  </button>
                  <button className="btn btn-outline-light btn-action">
                    <FaShare />
                  </button>
                </div>

                <div className="movie-overview">
                  <p className={isExpanded ? 'expanded' : ''}>
                    {movie.overview}
                  </p>
                  {movie.overview?.length > 300 && (
                    <button 
                      className="toggle-expand"
                      onClick={() => setIsExpanded(!isExpanded)}
                    >
                      {isExpanded ? 'Show Less' : 'Read More'}
                    </button>
                  )}
                </div>

                <div className="movie-details-grid">
                  <div className="detail-item">
                    <strong>Cast:</strong>
                    <span>Various actors...</span>
                  </div>
                  <div className="detail-item">
                    <strong>Genre:</strong>
                    <span>{movie.genres?.map(g => g.name).join(', ')}</span>
                  </div>
                  <div className="detail-item">
                    <strong>This movie is:</strong>
                    <span>Exciting, Dramatic, Suspenseful</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Similar Movies */}
        {similarMovies.length > 0 && (
          <section className="similar-movies">
            <h2 className="section-title">More Like This</h2>
            <div className="row">
              {similarMovies.map(similarMovie => (
                <div key={similarMovie.id} className="col-xl-2 col-lg-3 col-md-4 col-sm-6 mb-4">
                  <MovieCard movie={similarMovie} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default MovieDetail;
