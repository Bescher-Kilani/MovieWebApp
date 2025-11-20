// =============================================================================
// APP COMPONENT - Main Router Configuration
// =============================================================================
// This is the root component that sets up React Router for the application.
// It defines two routes:
// - "/" (home page with movie search and trending movies)
// - "/movie/:id" (individual movie detail page)
// =============================================================================

import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

import Home from "./components/Home.jsx";
import MovieDetails from "./components/MovieDetails.jsx";

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Home page route - shows search bar, trending movies, and all movies */}
                <Route path="/" element={<Home />} />

                {/* Movie detail route - :id is a dynamic parameter (e.g., /movie/550) */}
                <Route path="/movie/:id" element={<MovieDetails />} />
            </Routes>
        </Router>
    );
};

export default App;