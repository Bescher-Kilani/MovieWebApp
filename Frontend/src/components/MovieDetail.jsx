import React from "react";
import {useParams} from "react-router-dom";

const MovieDetail = () => {
    const { id } = useParams();


    return (
        <div className="movie-detail">
            <h2>Movie Detail Page</h2>
            <h2>Movie ID: {id}</h2>
        </div>
    );
};

export default MovieDetail;
