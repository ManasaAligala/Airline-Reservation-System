
package airline_reservation_system.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
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
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(
            UserRepository userRepository,
            JwtUtil passwordEncoder,
            PasswordEncoder passwordEncoderBean) {

        this.userRepository = userRepository;
        this.jwtUtil = passwordEncoder;
        this.passwordEncoder = passwordEncoderBean;
    }

    // Register a new user
    @Override
    public User registerUser(User user) {

        user.setRole("CUSTOMER");

        user.setPassword(
                passwordEncoder.encode(user.getPassword())
        );

        return userRepository.save(user);
    }

    // Login user - supports old and new passwords
    @Override
    public AuthResponse login(LoginRequest loginRequest) {

        Optional<User> optionalUser =
                userRepository.findByEmail(loginRequest.getEmail());

        if (optionalUser.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = optionalUser.get();

        String enteredPassword = loginRequest.getPassword();
        String storedPassword = user.getPassword();

        if (enteredPassword == null || storedPassword == null) {
            throw new RuntimeException("Invalid password");
        }

        boolean passwordMatches;

        // Check whether password is already BCrypt encrypted
        if (storedPassword.startsWith("$2a$")
                || storedPassword.startsWith("$2b$")
                || storedPassword.startsWith("$2y$")) {

            passwordMatches = passwordEncoder.matches(
                    enteredPassword,
                    storedPassword
            );

        } else {

            // Support old plain-text passwords
            passwordMatches = storedPassword.equals(enteredPassword);

            // Encrypt old password after successful login
            if (passwordMatches) {
                user.setPassword(
                        passwordEncoder.encode(enteredPassword)
                );

                userRepository.save(user);
            }
        }

        if (!passwordMatches) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole()
        );

        return new AuthResponse("Login Successful", token);
    }

    // Retrieve user profile
    @Override
    public User getUserByEmail(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with email: " + email
                        )
                );
    }

    // Get all users
    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Update profile
    @Override
    public User updateProfile(String email, User updatedUser) {

        User existingUser = getUserByEmail(email);

        if (updatedUser.getFirstName() != null) {
            existingUser.setFirstName(updatedUser.getFirstName());
        }

        if (updatedUser.getLastName() != null) {
            existingUser.setLastName(updatedUser.getLastName());
        }

        if (updatedUser.getPhoneNumber() != null) {
            existingUser.setPhoneNumber(updatedUser.getPhoneNumber());
        }

        return userRepository.save(existingUser);
    }

    // Change password
    @Override
    public void changePassword(
            String email,
            ChangePasswordRequest request) {

        User user = getUserByEmail(email);

        String currentPassword = request.getCurrentPassword();

        if (currentPassword == null
                || !passwordEncoder.matches(
                        currentPassword,
                        user.getPassword())) {

            throw new RuntimeException(
                    "Current password is incorrect"
            );
        }

        String newPassword = request.getNewPassword();

        if (newPassword == null || newPassword.trim().isEmpty()) {
            throw new RuntimeException(
                    "New password cannot be empty"
            );
        }

        if (newPassword.length() < 8) {
            throw new RuntimeException(
                    "New password must contain at least 8 characters"
            );
        }

        if (passwordEncoder.matches(
                newPassword,
                user.getPassword())) {

            throw new RuntimeException(
                    "New password must be different from the current password"
            );
        }

        user.setPassword(
                passwordEncoder.encode(newPassword)
        );

        userRepository.save(user);
    }
}
