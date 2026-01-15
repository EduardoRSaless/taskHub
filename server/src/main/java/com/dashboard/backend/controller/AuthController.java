package com.dashboard.backend.controller;

import com.dashboard.backend.model.User;
import com.dashboard.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        user.setRole("Member"); // Default role
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signin(@RequestBody User loginRequest) {
        Optional<User> user = userRepository.findByEmail(loginRequest.getEmail());
        
        if (user.isPresent() && user.get().getPassword().equals(loginRequest.getPassword())) {
            return ResponseEntity.ok(user.get());
        }
        
        return ResponseEntity.badRequest().body("Invalid credentials");
    }

    @PostMapping("/social-login")
    public ResponseEntity<?> socialLogin(@RequestBody User socialUser) {
        Optional<User> existingUser = userRepository.findByEmail(socialUser.getEmail());

        if (existingUser.isPresent()) {
            return ResponseEntity.ok(existingUser.get());
        }

        // Criar novo usuário vindo do Google
        socialUser.setRole("Member");
        socialUser.setPassword(UUID.randomUUID().toString()); // Senha dummy
        User savedUser = userRepository.save(socialUser);
        return ResponseEntity.ok(savedUser);
    }
}
