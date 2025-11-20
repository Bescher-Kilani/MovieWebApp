package Bescher.Dev.MovieAppBackend.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object (DTO) for movie search requests.
 * Used to transfer data from frontend to backend when tracking movie searches.
 */
@Data  // Lombok: generates getters, setters, toString, equals, hashCode
@NoArgsConstructor  // Lombok: generates no-args constructor
@AllArgsConstructor  // Lombok: generates all-args constructor
public class MovieSearchRequest {

    @NotBlank(message = "Search term is required")
    private String searchTerm;  // The search query entered by the user

    @NotBlank(message = "Movie ID is required")
    private String movieId;  // TMDB movie ID

    private String posterUrl;  // URL to movie poster image (optional)
}