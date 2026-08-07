package airline_reservation_system.service.impl;
import airline_reservation_system.security.JwtUtil;

import java.util.Optional;

import org.springframework.stereotype.Service;

import airline_reservation_system.dto.AuthResponse;
import airline_reservation_system.dto.LoginRequest;
import airline_reservation_system.entity.User;
import airline_reservation_system.repository.UserRepository;
import airline_reservation_system.service.UserService;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public UserServiceImpl(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
         this.jwtUtil = jwtUtil;
    }

    @Override
    public User registerUser(User user) {
         user.setRole("CUSTOMER");
        return userRepository.save(user);
    }

    @Override
    public AuthResponse login(LoginRequest loginRequest) {

        Optional<User> optionalUser = userRepository.findByEmail(loginRequest.getEmail());

        if (optionalUser.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = optionalUser.get();

        if (!user.getPassword().equals(loginRequest.getPassword())) {
            throw new RuntimeException("Invalid password");
        }
        String token = jwtUtil.generateToken(user.getEmail(),user.getRole());
         return new AuthResponse("Login Successful",token);
    }
}
