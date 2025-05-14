package com.mentovia.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.mentovia.dto.AuthRequest;
import com.mentovia.dto.RegisterRequest;
import com.mentovia.model.User;
import com.mentovia.repository.UserRepository;
import com.mentovia.security.JwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public Map<String, Object> register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        var user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        userRepository.save(user);

        String token = jwtService.generateToken(new org.springframework.security.core.userdetails.User(
            user.getEmail(),
            user.getPassword(),
            java.util.Collections.emptyList()
        ));

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", user);
        return response;
    }

    public Map<String, Object> authenticate(AuthRequest request) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found with email: " + request.getEmail()));

            String token = jwtService.generateToken(new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                java.util.Collections.emptyList()
            ));

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", user);
            return response;
        } catch (org.springframework.security.authentication.BadCredentialsException e) {
            throw new RuntimeException("Invalid email or password");
        } catch (Exception e) {
            throw new RuntimeException("Authentication failed: " + e.getMessage());
        }
    }

    /**
     * Accepts a Firebase ID token, verifies it, and returns our own JWT plus user info.
     */
    public Map<String, Object> authenticateWithGoogle(String idToken) throws FirebaseAuthException {
        // 1. Verify Firebase token
        FirebaseToken decoded = FirebaseAuth.getInstance().verifyIdToken(idToken);
        String email = decoded.getEmail();

        // 2. Lookup or create local user
        User user = userRepository.findByEmail(email)
            .orElseGet(() -> {
                User u = new User();
                u.setEmail(email);
                u.setUsername(email.substring(0, email.indexOf("@")));
                u.setFirstName((String) decoded.getClaims().getOrDefault("given_name", ""));
                u.setLastName((String) decoded.getClaims().getOrDefault("family_name", ""));
                u.setProfilePicture((String) decoded.getClaims().getOrDefault("picture", ""));
                u.setRole("BEGINNER");
                // no password for Google‐only
                u.setEnabled(true);
                return userRepository.save(u);
            });

        // 3. Build Spring Security UserDetails
        UserDetails userDetails = org.springframework.security.core.userdetails.User
            .withUsername(user.getEmail())
            .password(user.getPassword() == null ? "" : user.getPassword())
            .authorities("ROLE_" + user.getRole())
            .build();

        // 4. Issue our JWT
        String jwt = jwtService.generateToken(Map.of("authProvider", "google"), userDetails);

        // 5. Return a simple map (or your own DTO)
        return Map.of(
            "token", jwt,
            "user", Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "username", user.getUsername(),
                "role", user.getRole()
            )
        );
    }
}



