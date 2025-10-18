package Bescher.Dev.MovieAppBackend.Service;

import Bescher.Dev.MovieAppBackend.DTO.MovieSearchRequest;
import Bescher.Dev.MovieAppBackend.Entity.MovieSearch;
import Bescher.Dev.MovieAppBackend.Repository.MovieSearchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MovieSearchService {

    private final MovieSearchRepository repository;

    @Transactional
    public MovieSearch updateSearchCount(MovieSearchRequest request) {
        MovieSearch movieSearch = repository.findBySearchTerm(request.getSearchTerm())
                .map(existing -> {
                    existing.setCount(existing.getCount() + 1);
                    return existing;
                })
                .orElseGet(() -> {
                    MovieSearch newSearch = new MovieSearch();
                    newSearch.setSearchTerm(request.getSearchTerm());
                    newSearch.setMovieId(request.getMovieId());
                    newSearch.setCount(1);
                    newSearch.setPosterUrl(request.getPosterUrl());
                    return newSearch;
                });

        return repository.save(movieSearch);
    }

    public List<MovieSearch> getTrendingMovies() {
        return repository.findTop5ByOrderByCountDesc();
    }
}