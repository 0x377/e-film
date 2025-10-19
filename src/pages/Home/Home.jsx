import React from 'react';
import { useMovie } from '../../context/MovieContext';
import HeroBanner from '../../components/HeroBanner/HeroBanner';
import MovieRow from '../../components/MovieRow/MovieRow';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import './Home.css';

const Home = () => {
  const { trending, popular, topRated, upcoming, loading } = useMovie();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="home-page">
      <HeroBanner />
      
      <div className="content-container">
        <MovieRow 
          title="Trending Now" 
          movies={trending} 
          type="trending"
        />
        
        <MovieRow 
          title="Popular on E-FILM" 
          movies={popular} 
          type="popular"
        />
        
        <MovieRow 
          title="Top Rated" 
          movies={topRated} 
          type="top-rated"
        />
        
        <MovieRow 
          title="Coming Soon" 
          movies={upcoming} 
          type="upcoming"
        />
      </div>
    </div>
  );
};

export default Home;
