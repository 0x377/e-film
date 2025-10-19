import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { movieAPI } from '../utils/api';

const MovieContext = createContext();

const initialState = {
  trending: [],
  popular: [],
  topRated: [],
  upcoming: [],
  genres: [],
  searchResults: [],
  loading: false,
  error: null
};

function movieReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_TRENDING':
      return { ...state, trending: action.payload };
    case 'SET_POPULAR':
      return { ...state, popular: action.payload };
    case 'SET_TOP_RATED':
      return { ...state, topRated: action.payload };
    case 'SET_UPCOMING':
      return { ...state, upcoming: action.payload };
    case 'SET_GENRES':
      return { ...state, genres: action.payload };
    case 'SET_SEARCH_RESULTS':
      return { ...state, searchResults: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

export function MovieProvider({ children }) {
  const [state, dispatch] = useReducer(movieReducer, initialState);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const [trending, popular, topRated, upcoming, genres] = await Promise.all([
        movieAPI.getTrending(),
        movieAPI.getPopular(),
        movieAPI.getTopRated(),
        movieAPI.getUpcoming(),
        movieAPI.getGenres()
      ]);

      dispatch({ type: 'SET_TRENDING', payload: trending });
      dispatch({ type: 'SET_POPULAR', payload: popular });
      dispatch({ type: 'SET_TOP_RATED', payload: topRated });
      dispatch({ type: 'SET_UPCOMING', payload: upcoming });
      dispatch({ type: 'SET_GENRES', payload: genres });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const searchMovies = async (query) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const results = await movieAPI.searchMovies(query);
      dispatch({ type: 'SET_SEARCH_RESULTS', payload: results });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <MovieContext.Provider value={{ ...state, searchMovies }}>
      {children}
    </MovieContext.Provider>
  );
}

export const useMovie = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovie must be used within MovieProvider');
  }
  return context;
};
