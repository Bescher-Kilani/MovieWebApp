import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

import Home from "./components/Home.jsx";
import MovieDetail from "./components/MovieDetail.jsx";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/movie/:id" element={<MovieDetail />} />
            </Routes>
        </Router>
    );
};

export default App;
