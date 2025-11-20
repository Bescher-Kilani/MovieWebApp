// =============================================================================
// API FUNCTIONS - Backend Communication
// =============================================================================
// This file contains all API calls to our Spring Boot backend.
// The backend tracks movie searches and returns trending movies.
// =============================================================================

import {API_BASE_URL} from "./config.js";

// =============================================================================
// UPDATE SEARCH COUNT
// =============================================================================
// Sends a POST request to backend when user searches for a movie
// This helps track which movies are trending based on search frequency
//
// @param {string} searchTerm - The search query entered by user
// @param {object} movie - The first movie result from TMDB API
// @returns {Promise<object>} - Updated search count data from backend
// =============================================================================
export const updateSearchCount = async (searchTerm, movie) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/movies/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                searchTerm: searchTerm,                           // User's search query
                movieId: movie.id.toString(),                     // TMDB movie ID as string
                posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`  // Movie poster URL
            })
        });
        return await response.json();
    } catch (error) {
        console.error('Error updating search count:', error);
        // Silently fail - don't break user experience if backend is down
    }
};

// =============================================================================
// GET TRENDING MOVIES
// =============================================================================
// Fetches top 5 most searched movies from our backend
// These are displayed in the "Trending Movies" section on home page
//
// @returns {Promise<Array>} - Array of trending movie objects
// =============================================================================
export const getTrendingMovies = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/movies/trending`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching trending movies:', error);
        return [];  // Return empty array on error to prevent app crash
    }
};