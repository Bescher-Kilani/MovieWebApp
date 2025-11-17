import {API_BASE_URL} from "./config.js";


export const updateSearchCount = async (searchTerm, movie) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/movies/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                searchTerm: searchTerm,
                movieId: movie.id.toString(),
                posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            })
        });
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
    }
};

export const getTrendingMovies = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/movies/trending`);
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
};