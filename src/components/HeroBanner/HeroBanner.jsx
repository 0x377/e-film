import React, { useState, useEffect } from 'react';
import { useMovie } from '../../context/MovieContext';
import { movieAPI } from '../../utils/api';
import './HeroBanner.css';

const HeroBanner = () => {
  const { trending } = useMovie();
  const [currentMovie, setCurrentMovie] = useState(0);
  const [movieDetails, setMovieDetails] = useState(null);

  useEffect(() => {
    if (trending.length > 0) {
      const fetchMovieDetails = async () => {
        try {
          const details = await movieAPI.getMovieDetails(trending[currentMovie].id);
          setMovieDetails(details);
        } catch (error) {
          console.error('Error fetching movie details:', error);
        }
      };
      fetchMovieDetails();
    }
  }, [trending, currentMovie]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMovie((prev) => (prev + 1) % Math.min(trending.length, 5));
    }, 8000);
    return () => clearInterval(interval);
  }, [trending.length]);

  if (!movieDetails) return null;

  const backgroundImage = movieAPI.getImageUrl(movieDetails.backdrop_path, 'original');

  return (
    <div 
      className="hero-banner"
      style={{ backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.7) 30%, transparent 70%), url(${backgroundImage})` }}
    >
      <div className="hero-content">
        <h1 className="hero-title">{movieDetails.title}</h1>
        <div className="hero-meta">
          <span className="rating">
            ⭐ {movieDetails.vote_average?.toFixed(1)}
          </span>
          <span className="year">
            {new Date(movieDetails.release_date).getFullYear()}
          </span>
          <span className="runtime">
            {Math.floor(movieDetails.runtime / 60)}h {movieDetails.runtime % 60}m
          </span>
        </div>
        <p className="hero-description">
          {movieDetails.overview?.length > 200 
            ? `${movieDetails.overview.substring(0, 200)}...` 
            : movieDetails.overview
          }
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary btn-hero">
            <i className="fas fa-play"></i> Play
          </button>
          <button className="btn btn-outline-light btn-hero">
            <i className="fas fa-info-circle"></i> More Info
          </button>
        </div>
      </div>
      <div className="hero-indicators">
        {trending.slice(0, 5).map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentMovie ? 'active' : ''}`}
            onClick={() => setCurrentMovie(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
