// =============================================================================
// HOME COMPONENT - Main Landing Page
// =============================================================================
// This component displays:
// 1. Hero banner with search bar
// 2. Trending movies section (from our backend)
// 3. All movies grid (from TMDB API)
//
// Features:
// - Debounced search (waits 0,5 second after user stops typing)
// - Fetches movies from TMDB API
// - Tracks search counts in our backend
// - Loading states and error handling
// =============================================================================

import React, {useEffect, useState} from "react";
import {useDebounce} from "react-use"; // Custom hook for debouncing
import {getTrendingMovies, updateSearchCount} from "../api.js";
import Search from "./Search.jsx";
import Spinner from "./Spinner.jsx";
import MovieCard from "./MovieCard.jsx";
import {Link} from "react-router-dom";

// TMDB API configuration
const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;  // Vite environment variable

const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`  // TMDB requires Bearer token authentication
    }
}

const Home = () => {
    // ==========================================================================
    // STATE MANAGEMENT
    // ==========================================================================
    const [searchTerm, setSearchTerm] = useState('');              // User's search input (live typing)
    const [errorMessage, setErrorMessage] = useState('');           // Error messages from API calls
    const [movieList, setMovieList] = useState([]);                // Movies fetched from TMDB
    const [isLoading, setIsLoading] = useState(false);             // Loading state for spinner
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');  // Debounced search (after 1s delay)
    const [trendingMovies, setTrendingMovies] = useState([]);      // Top 5 trending from our backend

    // ==========================================================================
    // DEBOUNCE SEARCH INPUT
    // ==========================================================================
    // Waits 0,5 second after user stops typing before triggering search
    // Prevents excessive API calls while user is still typing
    // Example: User types "batman" → Only searches after "batman" is complete
    useDebounce(() => setDebouncedSearchTerm(searchTerm), 1000, [searchTerm])

    // ==========================================================================
    // FETCH MOVIES FROM TMDB
    // ==========================================================================
    // If query is empty: Shows popular movies (discover endpoint)
    // If query exists: Searches for movies (search endpoint)
    // Also updates our backend's search count for trending calculation
    const fetchMovies = async (query = '') => {
        setIsLoading(true);
        setErrorMessage('');

        try{
            // Choose endpoint based on whether we have a search query
            const endpoint = query
                ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`  // Search endpoint
                : `${API_BASE_URL}/trending/movie/week`;          // Popular movies

            const response = await fetch(endpoint, API_OPTIONS);

            if(!response.ok){
                throw new Error('Failed to fetch movies');
            }

            const data = await response.json();

            // Check if TMDB returned an error (unlikely, but handle gracefully)
            if(data.Response === 'False'){
                setErrorMessage(data.Error || 'Failed to fetch movies');
                setMovieList([]);
                return;
            }

            setMovieList(data.results);  // TMDB returns movies in "results" array
            console.log(data.results);   // Debug: Log movies to console

            // Track search in our backend (only if user actually searched)
            if(query && data.results.length > 0){
                await updateSearchCount(query, data.results[0]);  // Send first result to backend
            }

        } catch (error){
            console.error(`Error fetching movies: ${error}`);
            // Keep existing movies on screen even if request fails
        } finally {
            setIsLoading(false);  // Hide spinner regardless of success/failure
        }
    }

    // ==========================================================================
    // FETCH TRENDING MOVIES FROM BACKEND
    // ==========================================================================
    // Gets top 5 most searched movies from our Spring Boot backend
    // These are displayed in the horizontal "Trending Movies" section
    const loadTrendingMovies = async () => {
        try {
            const movies = await getTrendingMovies();
            console.log('Trending Movies:', movies);
            setTrendingMovies(movies);

        } catch (error) {
            console.error(`Error fetching trending movies: ${error}`);
            // Silently fail - trending section just won't show
        }
    }

    // ==========================================================================
    // EFFECTS
    // ==========================================================================

    // Effect 1: Search movies when debounced search term changes
    useEffect(() => {
        fetchMovies(debouncedSearchTerm);
    }, [debouncedSearchTerm]);

    // Effect 2: Load trending movies on initial page load
    useEffect(() => {
        loadTrendingMovies();
    }, []);  // Empty dependency array = runs only once on mount

    // ==========================================================================
    // RENDER
    // ==========================================================================
    return (
        <main>
            {/* Background pattern (defined in index.css) */}
            <div className="pattern"></div>

            <div className="wrapper">
                {/* === HEADER SECTION === */}
                <header>
                    <img src="./hero.png" alt="Hero Banner"/>
                    <h1>
                        Find <span className="text-gradient"> Movies </span>
                        You'll Enjoy without the Hassle
                    </h1>
                    {/* Search component with controlled input */}
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
                </header>

                {/* === TRENDING MOVIES SECTION === */}
                {/* Only show if we have trending movies from backend */}
                {trendingMovies.length > 0 && (
                    <section className="trending">
                        <h2>Trending Movies</h2>

                        <ul className="flex flex-wrap">
                            {trendingMovies.map((movie, index) => (
                                <Link to={`/movie/${movie.movieId}`} key={movie.id}>
                                    <li>
                                        {/* Large number showing rank (1-5) */}
                                        <p>{index + 1}</p>
                                        {/* Movie poster from our backend */}
                                        <img src={movie.posterUrl} alt={movie.searchTerm}/>
                                    </li>
                                </Link>
                            ))}
                        </ul>
                    </section>
                )}

                {/* === ALL MOVIES SECTION === */}
                <section className="all-movies">
                    <h2>All Movies</h2>

                    {/* Conditional rendering based on loading state */}
                    {isLoading ? (
                        <Spinner/>  // Show spinner while loading
                    ) : errorMessage ? (
                        <p className="text-red-500">{errorMessage}</p>  // Show error if API failed
                    ) : (
                        <ul>
                            {/* Map through movies and render MovieCard for each */}
                            {movieList.map(movie => (
                                <MovieCard
                                    key={movie.id}  // Unique key for React reconciliation
                                    movie={movie}
                                    setMovieList={setMovieList}
                                />
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </main>
    );
};

export default Home;