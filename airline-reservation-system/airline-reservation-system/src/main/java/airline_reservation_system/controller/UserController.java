package airline_reservation_system.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import airline_reservation_system.dto.AuthResponse;
import airline_reservation_system.dto.ChangePasswordRequest;
import airline_reservation_system.dto.LoginRequest;
import airline_reservation_system.entity.User;
import airline_reservation_system.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Register a new user
    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        return userService.registerUser(user);
    }

    // Login user
    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest loginRequest) {
        return userService.login(loginRequest);
    }

    // Get the logged-in user's profile
    @GetMapping("/profile")
    public User getProfile(Authentication authentication) {
        String email = authentication.getName();
        return userService.getUserByEmail(email);
    }

    // Update the logged-in user's profile
    @PutMapping("/profile")
    public User updateProfile(
            Authentication authentication,
            @RequestBody User updatedUser) {

        String email = authentication.getName();

        return userService.updateProfile(email, updatedUser);
    }

    // Change the logged-in user's password
    @PutMapping("/change-password")
    public String changePassword(
            Authentication authentication,
            @RequestBody ChangePasswordRequest request) {

        String email = authentication.getName();

        userService.changePassword(email, request);

        return "Password changed successfully";
    }

    // Admin dashboard
    @GetMapping("/admin/dashboard")
    public String adminDashboard() {
        return "Welcome Admin! You have ADMIN access.";
    }

    // Customer dashboard
    @GetMapping("/customer/dashboard")
    public String customerDashboard() {
        return "Welcome Customer! You have CUSTOMER access.";
    }
}