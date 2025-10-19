import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import MovieCard from '../MovieCard/MovieCard';
import './MovieRow.css';

const MovieRow = ({ title, movies, type = 'default' }) => {
  const rowRef = useRef(null);

  const scroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth 
        : scrollLeft + clientWidth;
      
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className={`movie-row ${type}`}>
      <h2 className="row-title">{title}</h2>
      <div className="row-container">
        <button 
          className="scroll-btn scroll-left"
          onClick={() => scroll('left')}
        >
          ‹
        </button>
        
        <motion.div 
          ref={rowRef}
          className="row-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </motion.div>
        
        <button 
          className="scroll-btn scroll-right"
          onClick={() => scroll('right')}
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default MovieRow;
