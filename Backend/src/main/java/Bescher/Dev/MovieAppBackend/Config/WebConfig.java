package Bescher.Dev.MovieAppBackend.Config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web configuration class for setting up CORS (Cross-Origin Resource Sharing).
 * Allows the frontend application to communicate with the backend API from different origins.
 */
@Configuration
public class WebConfig {

    // Inject frontend URL from application.properties with default fallback
    @Value("${frontend.url:http://localhost}")
    private String frontendUrl;

    /**
     * Configures CORS settings for the application.
     *
     * @return WebMvcConfigurer with CORS configuration
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")  // Apply CORS to all /api/* endpoints
                        .allowedOrigins(
                                frontendUrl,                    // From properties (http://localhost)
                                "http://localhost",             // Without port
                                "http://localhost:80",          // With port 80
                                "http://localhost:8080",        // Backend port (for testing)
                                "http://localhost:5173",        // Local Vite dev server
                                "https://*.railway.app"         // Railway deployment wildcard
                        )
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")  // Allowed HTTP methods
                        .allowedHeaders("*")        // Allow all headers
                        .allowCredentials(true);    // Allow cookies/credentials
            }
        };
    }
}