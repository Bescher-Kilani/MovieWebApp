// =============================================================================
// MOVIE CARD COMPONENT - Individual Movie Display
// =============================================================================
// Displays a single movie as a clickable card with:
// - Poster image
// - Title
// - Rating (with star icon)
// - Original language
// - Release year
//
// Clicking the card navigates to the movie detail page
// =============================================================================

import React from 'react'
import {Link} from "react-router-dom";

// Destructure movie object props directly in function parameters
const MovieCard = ({movie: {id, title, vote_average, poster_path, release_date, original_language}}) => {
    return (
        // Entire card is a Link to movie detail page
        <Link to={`/movie/${id}`} className="movie-card">

            {/* === POSTER IMAGE === */}
            <img
                src={poster_path
                    ? `http://image.tmdb.org/t/p/w500${poster_path}`  // TMDB image URL (500px width)
                    : '/no-movie.png'  // Fallback placeholder if no poster exists
                }
                alt={title}
            />

            {/* === MOVIE INFO === */}
            <div className="mt-4">
                {/* Title */}
                <h3>{title}</h3>

                {/* Meta information (rating, language, year) */}
                <div className="content">

                    {/* Rating with star icon */}
                    <div className="rating">
                        <img src="star.svg" alt="Star Icon"/>
                        <p>
                            {vote_average
                                ? vote_average.toFixed(1)  // Round to 1 decimal: 8.365 → 8.4
                                : 'N/A'  // Show N/A if no rating available
                            }
                        </p>
                    </div>

                    <span>•</span>  {/* Bullet separator */}

                    {/* Original language (e.g., "en", "de", "ja") */}
                    <p className="lang">{original_language}</p>

                    <span>•</span>  {/* Bullet separator */}

                    {/* Release year only (extract from full date) */}
                    <p className="year">
                        {release_date
                            ? release_date.split('-')[0]  // "2024-03-15" → "2024"
                            : 'N/A'
                        }
                    </p>
                </div>
            </div>
        </Link>
    );
};

export default MovieCard;