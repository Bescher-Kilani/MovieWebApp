package Bescher.Dev.MovieAppBackend.Controller;

import Bescher.Dev.MovieAppBackend.DTO.MovieSearchRequest;
import Bescher.Dev.MovieAppBackend.Entity.MovieSearch;
import Bescher.Dev.MovieAppBackend.Service.MovieSearchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for movie search operations.
 * Handles API endpoints for tracking movie searches and retrieving trending movies.
 */
@RestController
@RequestMapping("/api/movies")
@CrossOrigin(origins = "http://localhost:5173")  // CORS for React Vite dev server
@RequiredArgsConstructor  // Lombok: generates constructor for final fields
public class MovieSearchController {

    private final MovieSearchService service;  // Injected via constructor

    /**
     * Updates the search count for a movie when a user searches for it.
     * Creates a new entry if the movie doesn't exist, or increments count if it does.
     *
     * @param request DTO containing search term, movie ID, and poster URL
     * @return ResponseEntity with the updated/created MovieSearch entity
     */
    @PostMapping("/search")
    public ResponseEntity<MovieSearch> updateSearchCount(
            @Valid @RequestBody MovieSearchRequest request) {
        MovieSearch result = service.updateSearchCount(request);
        return ResponseEntity.ok(result);
    }

    /**
     * Retrieves the top 5 trending movies based on search count.
     *
     * @return ResponseEntity with list of trending movies
     */
    @GetMapping("/trending")
    public ResponseEntity<List<MovieSearch>> getTrendingMovies() {
        List<MovieSearch> trending = service.getTrendingMovies();
        return ResponseEntity.ok(trending);
    }
}