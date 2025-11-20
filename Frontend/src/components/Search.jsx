// =============================================================================
// SEARCH COMPONENT - Movie Search Input
// =============================================================================
// Controlled input component with search icon
// Parent component (Home.jsx) manages the actual search state
// This component just renders the UI and calls setSearchTerm on input change
// =============================================================================

import React from 'react';

const Search = ({searchTerm, setSearchTerm}) => {
    return (
        <div className="search">
            <div>
                {/* Search icon (positioned absolutely in CSS) */}
                <img src="search.svg" alt="search"/>

                {/* Controlled input - value comes from parent, changes go to parent */}
                <input
                    type="text"
                    value={searchTerm}  // Controlled component - value from props
                    placeholder="Search through thousands of movies"
                    onChange={(e) => setSearchTerm(e.target.value)}  // Update parent state on change
                />
            </div>
        </div>
    );
};

export default Search;