import axios from 'axios';

const API_KEY = 'YOUR_TMDB_API_KEY'; // Get free API key from themoviedb.org
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

export const movieAPI = {
  getTrending: () => 
    api.get('/trending/movie/week').then(res => res.data.results),
  
  getPopular: () => 
    api.get('/movie/popular').then(res => res.data.results),
  
  getTopRated: () => 
    api.get('/movie/top_rated').then(res => res.data.results),
  
  getUpcoming: () => 
    api.get('/movie/upcoming').then(res => res.data.results),
  
  getGenres: () => 
    api.get('/genre/movie/list').then(res => res.data.genres),
  
  getMovieDetails: (id) => 
    api.get(`/movie/${id}`).then(res => res.data),
  
  searchMovies: (query) => 
    api.get('/search/movie', { params: { query } }).then(res => res.data.results),
  
  getImageUrl: (path, size = 'w500') => 
    path ? `${IMAGE_BASE_URL}/${size}${path}` : null,

  getSimilarMovies: (id) =>
    api.get(`/movie/${id}/similar`).then(res => res.data.results),

  getMovieCredits: (id) =>
    api.get(`/movie/${id}/credits`).then(res => res.data),

  getMovieVideos: (id) =>
    api.get(`/movie/${id}/videos`).then(res => res.data.results),
};

// Fallback movie data in case API fails
export const fallbackMovies = [
  {
    id: 1,
    title: "The Matrix",
    poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    backdrop_path: "/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg",
    overview: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    vote_average: 8.7
  },
  // Add more fallback movies...
];
