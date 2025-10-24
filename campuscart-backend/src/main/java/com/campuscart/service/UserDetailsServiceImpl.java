package com.campuscart.service;

import com.campuscart.model.User;
import com.campuscart.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Ensure this is imported

import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional(readOnly = true) // Add/Keep this annotation to help with lazy loading
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("--- [DEBUG] UserDetailsServiceImpl: Loading user: " + username + " ---"); // <-- ADD LINE

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        System.out.println("[DEBUG] User found in DB: " + user.getUsername()); // <-- ADD LINE

        // Print the roles loaded directly from the User object
        System.out.println("[DEBUG] Roles loaded from User object: " +
                user.getRoles().stream().map(role -> role.getName()).collect(Collectors.joining(", "))); // <-- ADD LINE

        Set<GrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName()))
                .collect(Collectors.toSet());

        // Print the authorities created for Spring Security
        System.out.println("[DEBUG] GrantedAuthorities created: " +
                authorities.stream().map(GrantedAuthority::getAuthority).collect(Collectors.joining(", "))); // <-- ADD LINE

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                authorities
        );
    }
}