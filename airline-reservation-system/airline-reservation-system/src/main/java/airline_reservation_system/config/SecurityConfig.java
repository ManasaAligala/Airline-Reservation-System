package airline_reservation_system.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import airline_reservation_system.security.JwtAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .sessionManagement(session ->
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            .authorizeHttpRequests(auth -> auth

                    // Public APIs
                    .requestMatchers(
                            "/api/users/register",
                            "/api/users/login"
                    )
                    .permitAll()


                    // User Role APIs
                    .requestMatchers("/api/users/admin/**")
                    .hasRole("ADMIN")

                    .requestMatchers("/api/users/customer/**")
                    .hasRole("CUSTOMER")


                    // Airport APIs

                    // Only ADMIN can add airport
                    .requestMatchers(HttpMethod.POST, "/api/airports/**")
                    .hasRole("ADMIN")


                    // Only ADMIN can update airport
                    .requestMatchers(HttpMethod.PUT, "/api/airports/**")
                    .hasRole("ADMIN")


                    // Only ADMIN can delete airport
                    .requestMatchers(HttpMethod.DELETE, "/api/airports/**")
                    .hasRole("ADMIN")


                    // ADMIN and CUSTOMER can view airports
                    .requestMatchers(HttpMethod.GET, "/api/airports/**")
                    .hasAnyRole("ADMIN", "CUSTOMER")


                    // Other APIs
                    .anyRequest()
                    .permitAll()
            )

            .addFilterBefore(
                    jwtAuthenticationFilter,
                    UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}