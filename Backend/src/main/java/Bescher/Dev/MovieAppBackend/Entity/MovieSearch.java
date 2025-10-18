package Bescher.Dev.MovieAppBackend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "movie_searches")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MovieSearch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // → id

    @Column(nullable = false, unique = true)
    private String searchTerm;  // → search_term (automatisch!)

    @Column(nullable = false)
    private String movieId;  // → movie_id (automatisch!)

    @Column(nullable = false)
    private Integer count = 0;  // → count

    @Column(length = 500)
    private String posterUrl;  // → poster_url (automatisch!)

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;  // → created_at (automatisch!)

    @Column
    private LocalDateTime updatedAt;  // → updated_at (automatisch!)

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}