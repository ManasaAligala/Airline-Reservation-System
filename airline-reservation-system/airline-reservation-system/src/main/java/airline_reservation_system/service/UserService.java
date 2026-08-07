package airline_reservation_system.service;

import airline_reservation_system.dto.AuthResponse;
import airline_reservation_system.dto.LoginRequest;
import airline_reservation_system.entity.User;

public interface UserService {

    User registerUser(User user);
    AuthResponse login(LoginRequest loginRequest);

}