package Bescher.Dev.MovieAppBackend.Service;

import Bescher.Dev.MovieAppBackend.DTO.MovieSearchRequest;
import Bescher.Dev.MovieAppBackend.Entity.MovieSearch;
import Bescher.Dev.MovieAppBackend.Repository.MovieSearchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service layer for movie search operations.
 * Contains business logic for tracking searches and retrieving trending movies.
 */
@Service
@RequiredArgsConstructor  // Lombok: generates constructor for final fields
public class MovieSearchService {

    private final MovieSearchRepository repository;  // Injected via constructor

    /**
     * Updates or creates a movie search record.
     * If the search term exists, increments the count. Otherwise, creates a new record.
     *
     * @param request DTO containing search term, movie ID, and poster URL
     * @return The updated or newly created MovieSearch entity
     */
    @Transactional  // Ensures all operations are atomic (all succeed or all fail)
    public MovieSearch updateSearchCount(MovieSearchRequest request) {
        // Try to find existing record by search term
        MovieSearch movieSearch = repository.findBySearchTerm(request.getSearchTerm())
                .map(existing -> {
                    // If found: increment count
                    existing.setCount(existing.getCount() + 1);
                    return existing;
                })
                .orElseGet(() -> {
                    // If not found: create new record with count = 1
                    MovieSearch newSearch = new MovieSearch();
                    newSearch.setSearchTerm(request.getSearchTerm());
                    newSearch.setMovieId(request.getMovieId());
                    newSearch.setCount(1);
                    newSearch.setPosterUrl(request.getPosterUrl());
                    return newSearch;
                });

        // Save to database and return
        return repository.save(movieSearch);
    }

    /**
     * Retrieves the top 5 trending movies based on search count.
     *
     * @return List of top 5 most searched movies
     */
    public List<MovieSearch> getTrendingMovies() {
        return repository.findTop5ByOrderByCountDesc();
    }
}