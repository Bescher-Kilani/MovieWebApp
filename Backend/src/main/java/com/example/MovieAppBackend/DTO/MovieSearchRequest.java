package com.example.MovieAppBackend.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MovieSearchRequest {

    @NotBlank(message = "Search term is required")
    private String searchTerm;

    @NotBlank(message = "Movie ID is required")
    private String movieId;

    private String posterUrl;
}