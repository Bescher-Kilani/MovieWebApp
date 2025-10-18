package Bescher.Dev.MovieAppBackend.Repository;

import Bescher.Dev.MovieAppBackend.Entity.MovieSearch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MovieSearchRepository extends JpaRepository<MovieSearch, Long> {

    Optional<MovieSearch> findBySearchTerm(String searchTerm);

    List<MovieSearch> findTop5ByOrderByCountDesc();
}