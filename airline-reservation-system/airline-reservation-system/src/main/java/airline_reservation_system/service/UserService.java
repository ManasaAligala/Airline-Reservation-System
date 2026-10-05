package airline_reservation_system.service;

import java.util.List;

import airline_reservation_system.dto.AuthResponse;
import airline_reservation_system.dto.ChangePasswordRequest;
import airline_reservation_system.dto.LoginRequest;
import airline_reservation_system.entity.User;

public interface UserService {

    // Register a new user
    User registerUser(User user);

    // Login user
    AuthResponse login(LoginRequest loginRequest);

    // Get user profile using email
    User getUserByEmail(String email);

    // Get all users for Admin User Management
    List<User> getAllUsers();

    // Update the logged-in user's profile
    User updateProfile(String email, User updatedUser);

    // Change the logged-in user's password
    void changePassword(
            String email,
            ChangePasswordRequest request
    );
}

