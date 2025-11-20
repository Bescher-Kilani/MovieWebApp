package Bescher.Dev.MovieAppBackend.Repository;

import Bescher.Dev.MovieAppBackend.Entity.MovieSearch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for MovieSearch entity.
 * Provides CRUD operations and custom query methods.
 * Spring Data JPA automatically implements these methods.
 */
@Repository
public interface MovieSearchRepository extends JpaRepository<MovieSearch, Long> {

    /**
     * Finds a movie search record by its search term.
     *
     * @param searchTerm the search query to look up
     * @return Optional containing the MovieSearch if found, empty otherwise
     */
    Optional<MovieSearch> findBySearchTerm(String searchTerm);

    /**
     * Retrieves the top 5 most searched movies ordered by search count (descending).
     *
     * @return List of top 5 trending movies
     */
    List<MovieSearch> findTop5ByOrderByCountDesc();
}