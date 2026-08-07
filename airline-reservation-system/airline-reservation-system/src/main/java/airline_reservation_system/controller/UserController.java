package airline_reservation_system.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import airline_reservation_system.dto.AuthResponse;
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

    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        return userService.registerUser(user);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest loginRequest) {
        return userService.login(loginRequest);
    }
    @GetMapping("/profile")
    public String profile() {
        return "Welcome! JWT Authentication Successful.";
   }
      @GetMapping("/admin/dashboard")
    public String adminDashboard() {
        return "Welcome Admin! You have ADMIN access.";
    }

    // CUSTOMER Endpoint
    @GetMapping("/customer/dashboard")
    public String customerDashboard() {
        return "Welcome Customer! You have CUSTOMER access.";

    }
    
    

}
