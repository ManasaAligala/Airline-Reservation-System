package airline_reservation_system.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import airline_reservation_system.security.JwtAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter) {

        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
            // Disable CSRF for the stateless REST API
            .csrf(csrf -> csrf.disable())

            // Enable CORS
            .cors(cors ->
                cors.configurationSource(corsConfigurationSource())
            )

            // Do not create HTTP sessions
            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )

            // Configure API permissions
            .authorizeHttpRequests(auth -> auth

                // Public APIs
                .requestMatchers(
                    "/api/users/register",
                    "/api/users/login"
                )
                .permitAll()

                // ADMIN-only APIs
                .requestMatchers("/api/users/admin/**")
                .hasRole("ADMIN")

                // CUSTOMER-only APIs
                .requestMatchers("/api/users/customer/**")
                .hasRole("CUSTOMER")

                // Logged-in users can access their profile
                .requestMatchers("/api/users/profile")
                .authenticated()

                // Only ADMIN can add airports
                .requestMatchers(
                    HttpMethod.POST,
                    "/api/airports/**"
                )
                .hasRole("ADMIN")

                // Only ADMIN can update airports
                .requestMatchers(
                    HttpMethod.PUT,
                    "/api/airports/**"
                )
                .hasRole("ADMIN")

                // Only ADMIN can delete airports
                .requestMatchers(
                    HttpMethod.DELETE,
                    "/api/airports/**"
                )
                .hasRole("ADMIN")

                // ADMIN and CUSTOMER can view airports
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/airports/**"
                )
                .hasAnyRole("ADMIN", "CUSTOMER")

                // Preserve existing permissions for other APIs
                .anyRequest()
                .permitAll()
            )

            // Register JWT authentication filter
            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }

    // CORS configuration
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of("http://localhost:5173")
        );

        configuration.setAllowedMethods(
                List.of(
                    "GET",
                    "POST",
                    "PUT",
                    "DELETE",
                    "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }
}