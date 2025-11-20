// =============================================================================
// MOVIE DETAIL COMPONENT - Individual Movie Page
// =============================================================================
// This component displays detailed information about a single movie:
// - Backdrop image (large hero image)
// - Movie poster
// - Title, tagline, rating, year, runtime, language
// - Genres
// - Overview (plot summary)
// - Budget, revenue, status, production countries
// - Production companies (with logos)
// - Top 12 cast members with photos
// - Link to official website
//
// Movie ID comes from URL parameter (e.g., /movie/550)
// Data fetched from TMDB API using the movie ID
// =============================================================================

// === IMPORTS ===
import React, {useEffect, useState} from "react";
// useEffect: For side effects (API call on component mount)
// useState: For state management (movie, loading, error)
import {Link, useParams} from "react-router-dom";
// useParams: Extracts :id from URL (e.g., /movie/550 → id = 550)
// Link: Component for navigation back to home page
import Spinner from "./Spinner.jsx";
// Loading animation shown during API call


// === API CONFIGURATION ===
const API_BASE_URL = 'https://api.themoviedb.org/3';
// Base URL for all TMDB API calls

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
// API key from .env file (VITE_TMDB_API_KEY=...)

const API_OPTIONS = {
    method: 'GET',                    // HTTP GET request
    headers: {
        accept: 'application/json',    // We want JSON response
        Authorization: `Bearer ${API_KEY}`  // Auth with Bearer token
    }
};


// === COMPONENT START ===
const MovieDetails = () => {
    const { id } = useParams();
    // Extract movie ID from URL
    // Example: /movie/550 → id = "550"

    // === STATE MANAGEMENT ===
    const [movie, setMovie] = useState(null);
    // Stores movie details (null = not loaded yet)

    const [isLoading, setIsLoading] = useState(true);
    // true = show spinner, false = show content

    const [errorMessage, setErrorMessage] = useState('');
    // Stores error messages if API call fails


    // === API CALL ON COMPONENT MOUNT ===
    useEffect(() => {
        // useEffect runs AFTER first render

        const fetchMovieDetails = async () => {
            setIsLoading(true);        // Show spinner
            setErrorMessage('');       // Reset old errors

            try {
                // API call to TMDB
                const response = await fetch(
                    `${API_BASE_URL}/movie/${id}?append_to_response=credits,videos`,
                    //                    ↑ ID from URL   ↑ Extra data in one call
                    API_OPTIONS
                );

                if (!response.ok) {
                    // HTTP error (404, 500, etc.)
                    throw new Error('Failed to fetch movie details');
                }

                const data = await response.json();
                // Parse JSON response

                setMovie(data);
                // Store movie details in state

                console.log('Movie Details:', data);
                // Debug: Show all available data in console

            } catch (error) {
                console.error(`Error fetching movie details: ${error}`);
                setErrorMessage('Failed to load movie details');
            } finally {
                setIsLoading(false);
                // Whether success or error: loading is done
            }
        };

        fetchMovieDetails();  // Execute the function

    }, [id]);
    // [id] = Dependency array
    // useEffect runs again when ID changes
    // (e.g., from /movie/550 to /movie/551)


    // === CONDITIONAL RENDERING ===

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-primary">
            <Spinner />
        </div>
    );
    // If still loading → show only spinner

    if (errorMessage) return (
        <p className="text-red-500 text-center mt-10">{errorMessage}</p>
    );
    // If error → show error message

    if (!movie) return null;
    // If no movie loaded → show nothing
    // (Should not happen, but safety check)


    // === MAIN RENDER ===
    return (
        <main className="min-h-screen bg-primary text-white">
            {/* Full screen height, primary background, white text */}

            <div className="pattern"></div>
            {/* Background pattern (defined in index.css) */}

            <div className="wrapper relative z-10">
                {/* Container with padding (from index.css), z-10 above pattern */}

                {/* === BACK BUTTON === */}
                <Link to="/" className="text-light-200 hover:text-white mb-6 inline-block">
                    ← Back to Home
                </Link>
                {/* Link navigates to home ("/"), hover effect on text */}


                {/* === BACKDROP IMAGE === */}
                <div className="relative rounded-2xl overflow-hidden mb-8">
                    {/* Container: rounded corners, hidden overflow, margin-bottom */}

                    {movie.backdrop_path && (
                        /* Only render if backdrop_path exists (optional chaining) */

                        <div className="relative h-[400px]">
                            {/* Container with fixed height of 400px */}

                            <img
                                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                                // TMDB image URL: original = highest quality
                                // Example: /t/p/original/fCayJrkfRaCRCTh8GqN30f8oyQF.jpg

                                alt={movie.title}
                                className="w-full h-full object-cover"
                                // w-full: 100% width
                                // h-full: 100% height
                                // object-cover: Image fills container without distortion
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent"></div>
                            {/* Gradient overlay OVER the image:
                                - absolute: positioned over image
                                - inset-0: top/right/bottom/left = 0 (fills parent)
                                - gradient from bottom (primary) to top (transparent)
                                - via-primary/30: middle is 30% opacity
                            */}
                        </div>
                    )}
                </div>


                {/* === MAIN CONTENT: POSTER + DETAILS === */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/*
                        Flexbox layout:
                        - Mobile: Column (poster on top, details below)
                        - Desktop (lg): Row (poster left, details right)
                        - gap-8: 32px space between items
                    */}

                    {/* === POSTER === */}
                    <div className="flex-shrink-0">
                        {/* flex-shrink-0: Poster maintains its size (doesn't shrink) */}

                        <img
                            src={movie.poster_path
                                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                // If poster_path exists: TMDB URL with w500 (width 500px)
                                : '/no-movie.png'
                                // Fallback: Placeholder image
                            }
                            alt={movie.title}
                            className="w-full lg:w-80 rounded-2xl shadow-2xl"
                            // Mobile: full width
                            // Desktop (lg): fixed width 320px (w-80)
                            // rounded-2xl: strong rounding
                            // shadow-2xl: large shadow
                        />
                    </div>


                    {/* === DETAILS SECTION === */}
                    <div className="flex-1 min-w-0">
                        {/* flex-1: Takes remaining space */}

                        {/* === TITLE === */}
                        <h2 className="text-4xl font-bold mb-2">{movie.title}</h2>
                        {/* text-4xl: ~36px, font-bold: 700 weight, mb-2: margin-bottom */}

                        {/* === TAGLINE (Optional) === */}
                        {movie.tagline && (
                            /* Only show if tagline exists */
                            <p className="text-light-200 italic mb-4">"{movie.tagline}"</p>
                            // Italic text, light-200 color (lighter gray)
                        )}


                        {/* === META INFO (Rating, Year, Runtime, Language) === */}
                        <div className="flex flex-wrap gap-4 mb-6 text-light-200">
                            {/*
                                flex: Items side by side
                                flex-wrap: If not enough space → new line
                                gap-4: 16px spacing
                            */}

                            {/* Rating */}
                            <div className="flex items-center gap-2">
                                <img src="/star.svg" alt="Rating" className="w-5 h-5" />
                                <span>{movie.vote_average?.toFixed(1)} / 10</span>
                                {/*
                                    vote_average?: Optional chaining (safe access)
                                    toFixed(1): Round to 1 decimal place
                                    Example: 8.365 → 8.4
                                */}
                            </div>

                            <span>•</span>  {/* Bullet point separator */}

                            {/* Release year */}
                            <span>{movie.release_date?.split('-')[0]}</span>
                            {/*
                                release_date: "2024-03-15"
                                split('-'): ["2024", "03", "15"]
                                [0]: "2024" ← first element
                            */}

                            <span>•</span>

                            {/* Runtime */}
                            <span>{movie.runtime} min</span>
                            {/* Example: "142 min" */}

                            <span>•</span>

                            {/* Original language */}
                            <span className="uppercase">{movie.original_language}</span>
                            {/* uppercase: en → EN */}
                        </div>


                        {/* === GENRES === */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {movie.genres?.map(genre => (
                                /*
                                    genres is an array: [{id: 28, name: "Action"}, ...]
                                    map: Loop through all genres
                                */
                                <span
                                    key={genre.id}
                                    // React key: unique identifier (important!)

                                    className="px-4 py-2 bg-light-100/10 rounded-full text-sm"
                                    // px-4: Padding horizontal 16px
                                    // py-2: Padding vertical 8px
                                    // bg-light-100/10: light-100 with 10% opacity
                                    // rounded-full: Pill shape
                                    // text-sm: smaller font
                                >
                                    {genre.name}
                                </span>
                            ))}
                        </div>


                        {/* === OVERVIEW === */}
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold mb-3">Overview</h2>
                            <p className="text-light-200 leading-relaxed">
                                {movie.overview}
                                {/* leading-relaxed: more line spacing for readability */}
                            </p>
                        </div>


                        {/* === ADDITIONAL INFO GRID === */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {/*
                                CSS Grid:
                                - Mobile: 1 column
                                - Tablet+ (md): 2 columns
                                - gap-4: 16px between grid items
                            */}

                            {/* Status */}
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Status</h3>
                                <p className="text-light-200">{movie.status}</p>
                                {/* E.g., "Released", "In Production" */}
                            </div>

                            {/* Budget */}
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Budget</h3>
                                <p className="text-light-200">
                                    {movie.budget
                                        ? `$${movie.budget.toLocaleString()}`
                                        // toLocaleString(): Adds thousand separators
                                        // 160000000 → "160,000,000"
                                        : 'N/A'
                                    }
                                </p>
                            </div>

                            {/* Revenue */}
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Revenue</h3>
                                <p className="text-light-200">
                                    {movie.revenue
                                        ? `$${movie.revenue.toLocaleString()}`
                                        : 'N/A'
                                    }
                                </p>
                            </div>

                            {/* Production countries */}
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Production Countries</h3>
                                <p className="text-light-200">
                                    {movie.production_countries?.map(c => c.name).join(', ') || 'N/A'}
                                    {/*
                                        Array of countries: [{iso_3166_1: "US", name: "United States"}, ...]
                                        map(c => c.name): Extract only the names
                                        join(', '): Combine with comma
                                        Result: "United States, United Kingdom"
                                    */}
                                </p>
                            </div>
                        </div>


                        {/* === PRODUCTION COMPANIES === */}
                        {movie.production_companies && movie.production_companies.length > 0 && (
                            /* Only show if:
                               1. production_companies exists AND
                               2. Array is not empty
                            */
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-3">Production Companies</h3>
                                <div className="flex flex-wrap gap-4">
                                    {movie.production_companies.map(company => (
                                        <div key={company.id} className="flex items-center gap-2">
                                            {company.logo_path ? (
                                                /* If logo available: show logo */
                                                <img
                                                    src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                                                    alt={company.name}
                                                    className="h-15 object-contain bg-white/100 p-2 rounded"
                                                    // h-15: Height ~60px
                                                    // object-contain: Maintains aspect ratio
                                                    // bg-white/100: White background (100% opacity)
                                                />
                                            ) : (
                                                /* No logo: show text */
                                                <span className="text-light-200">{company.name}</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}


                        {/* === CAST (Top 12) === */}
                        {movie.credits?.cast && movie.credits.cast.length > 0 && (
                            /*
                                Only show if credits exists (from append_to_response)
                                AND cast array is not empty
                            */
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-3">Top Cast</h3>
                                <div className="flex flex-wrap overflow-x-auto gap-4 pb-4 hide-scrollbar">
                                    {/*
                                        overflow-x-auto: Horizontal scrollbar if too many items
                                        hide-scrollbar: Custom CSS (from index.css)
                                        pb-4: Padding-bottom for scrollbar space
                                    */}

                                    {movie.credits.cast.slice(0, 12).map(person => (
                                        /*
                                            slice(0, 12): Only first 12 cast members
                                            Array of: {id, name, character, profile_path, ...}
                                        */
                                        <div key={person.id} className="flex-shrink-0 w-32">
                                            {/*
                                                flex-shrink-0: Maintains width (no squishing)
                                                w-32: Fixed width 128px
                                            */}

                                            {/* Actor photo */}
                                            <img
                                                src={person.profile_path
                                                    ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
                                                    : '/no-movie.png'
                                                }
                                                alt={person.name}
                                                className="w-32 h-48 object-cover rounded-lg mb-2"
                                                // w-32: 128px width
                                                // h-48: 192px height (portrait ratio)
                                                // object-cover: Fills container
                                            />

                                            {/* Actor name */}
                                            <p className="text-sm font-semibold">{person.name}</p>

                                            {/* Character name */}
                                            <p className="text-xs text-light-200">{person.character}</p>
                                            {/* text-xs: very small (12px) */}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}


                        {/* === OFFICIAL WEBSITE LINK === */}
                        {movie.homepage && (
                            /* Only show if homepage URL exists */
                            <a
                            href={movie.homepage}
                            target="_blank"
                            // Opens in new tab

                            rel="noopener noreferrer"
                            // Security: Prevents window.opener access

                            className="inline-block px-6 py-3 bg-light-100/20 hover:bg-light-100/30 rounded-lg transition"
                            // inline-block: Makes <a> a button-style element
                            // hover:bg-light-100/30: Lighter on mouse hover
                            // transition: Smooth animation
                            >
                            Visit Official Website →
                            </a>
                            )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default MovieDetails;