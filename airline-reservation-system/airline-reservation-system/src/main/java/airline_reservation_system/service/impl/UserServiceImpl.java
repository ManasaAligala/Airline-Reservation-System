package airline_reservation_system.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import airline_reservation_system.dto.AuthResponse;
import airline_reservation_system.dto.ChangePasswordRequest;
import airline_reservation_system.dto.LoginRequest;
import airline_reservation_system.entity.User;
import airline_reservation_system.repository.UserRepository;
import airline_reservation_system.security.JwtUtil;
import airline_reservation_system.service.UserService;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public UserServiceImpl(
            UserRepository userRepository,
            JwtUtil jwtUtil) {

        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    // Register a new user
    @Override
    public User registerUser(User user) {
        user.setRole("CUSTOMER");
        return userRepository.save(user);
    }

    // Login user
    @Override
    public AuthResponse login(LoginRequest loginRequest) {

        Optional<User> optionalUser =
                userRepository.findByEmail(loginRequest.getEmail());

        if (optionalUser.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = optionalUser.get();

        if (!user.getPassword().equals(loginRequest.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole()
        );

        return new AuthResponse("Login Successful", token);
    }

    // Retrieve a user's profile using email
    @Override
    public User getUserByEmail(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with email: " + email
                        )
                );
    }

    // Get all users for Admin User Management
    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Update the logged-in user's profile
    @Override
    public User updateProfile(String email, User updatedUser) {

        User existingUser = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with email: " + email
                        )
                );

        // Update first name when provided
        if (updatedUser.getFirstName() != null) {
            existingUser.setFirstName(updatedUser.getFirstName());
        }

        // Update last name when provided
        if (updatedUser.getLastName() != null) {
            existingUser.setLastName(updatedUser.getLastName());
        }

        // Update phone number when provided
        if (updatedUser.getPhoneNumber() != null) {
            existingUser.setPhoneNumber(updatedUser.getPhoneNumber());
        }

        // Email, password, and role cannot be changed here
        return userRepository.save(existingUser);
    }

    // Change the logged-in user's password
    @Override
    public void changePassword(
            String email,
            ChangePasswordRequest request) {

        // Find the logged-in user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        // Check whether the current password is correct
        if (request.getCurrentPassword() == null
                || !user.getPassword().equals(
                        request.getCurrentPassword())) {

            throw new RuntimeException(
                    "Current password is incorrect"
            );
        }

        // Validate the new password
        if (request.getNewPassword() == null
                || request.getNewPassword().trim().isEmpty()) {

            throw new RuntimeException(
                    "New password cannot be empty"
            );
        }

        if (request.getNewPassword().length() < 8) {
            throw new RuntimeException(
                    "New password must contain at least 8 characters"
            );
        }

        // Prevent setting the same password again
        if (user.getPassword().equals(request.getNewPassword())) {
            throw new RuntimeException(
                    "New password must be different from the current password"
            );
        }

        // Save the new password
        user.setPassword(request.getNewPassword());
        userRepository.save(user);
    }
}
