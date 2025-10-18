package Bescher.Dev.MovieAppBackend.Controller;

import Bescher.Dev.MovieAppBackend.DTO.MovieSearchRequest;
import Bescher.Dev.MovieAppBackend.Entity.MovieSearch;
import Bescher.Dev.MovieAppBackend.Service.MovieSearchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin(origins = "http://localhost:5173") // Für React Vite
@RequiredArgsConstructor
public class MovieSearchController {

    private final MovieSearchService service;

    @PostMapping("/search")
    public ResponseEntity<MovieSearch> updateSearchCount(
            @Valid @RequestBody MovieSearchRequest request) {
        MovieSearch result = service.updateSearchCount(request);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/trending")
    public ResponseEntity<List<MovieSearch>> getTrendingMovies() {
        List<MovieSearch> trending = service.getTrendingMovies();
        return ResponseEntity.ok(trending);
    }
}