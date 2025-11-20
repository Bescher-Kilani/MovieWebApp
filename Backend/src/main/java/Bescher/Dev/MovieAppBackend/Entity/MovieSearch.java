package Bescher.Dev.MovieAppBackend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * JPA Entity representing a movie search record in the database.
 * Tracks search terms, movie IDs, search counts, and poster URLs.
 */
@Entity
@Table(name = "movie_searches")  // Database table name
@Data  // Lombok: generates getters, setters, toString, equals, hashCode
@NoArgsConstructor  // Lombok: generates no-args constructor
@AllArgsConstructor  // Lombok: generates all-args constructor
public class MovieSearch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // Auto-generated primary key

    @Column(nullable = false, unique = true)
    private String searchTerm;  // Maps to 'search_term' column (camelCase to snake_case)

    @Column(nullable = false)
    private String movieId;  // Maps to 'movie_id' column

    @Column(nullable = false)
    private Integer count = 0;  // Number of times this movie was searched

    @Column(length = 500)
    private String posterUrl;  // Maps to 'poster_url' column

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;  // Maps to 'created_at' column, set once

    @Column
    private LocalDateTime updatedAt;  // Maps to 'updated_at' column, updated on changes

    /**
     * JPA lifecycle callback executed before entity is persisted to database.
     * Sets the creation and update timestamps.
     */
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    /**
     * JPA lifecycle callback executed before entity is updated in database.
     * Updates the modification timestamp.
     */
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}