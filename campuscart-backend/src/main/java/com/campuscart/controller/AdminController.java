package com.campuscart.controller;

import com.campuscart.dto.StudentRegistrationRequest;
import com.campuscart.dto.StudentUpdateRequest;
import com.campuscart.model.*;
import com.campuscart.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional; // Import Optional
import java.util.Set;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private QueryRepository queryRepository;

    @Autowired
    private CartRepository cartRepository;

    // --- Product Management ---
    @PostMapping("/products")
    public ResponseEntity<Product> addProduct(@RequestBody Product product) {
        Product savedProduct = productRepository.save(product);
        return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        return productRepository.findById(id)
                .map(product -> {
                    product.setName(productDetails.getName());
                    product.setDescription(productDetails.getDescription());
                    product.setPrice(productDetails.getPrice());
                    product.setStockQuantity(productDetails.getStockQuantity());
                    return ResponseEntity.ok(productRepository.save(product));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // --- Student Management ---
    @PostMapping("/students")
    public ResponseEntity<?> registerStudent(@RequestBody StudentRegistrationRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body("Error: Username (Student ID) is already taken!");
        }

        // 1. Create the user object
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setDepartment(request.getDepartment());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setWalletBalance(2000.00);

        Role studentRole = roleRepository.findByName("ROLE_STUDENT")
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        user.setRoles(Set.of(studentRole));

        // 2. Save the user to generate their ID
        User savedUser = userRepository.save(user);

        // 3. Create a new cart, link it to the saved user, and save the cart
        Cart newCart = new Cart();
        newCart.setUser(savedUser);
        cartRepository.save(newCart);

        return ResponseEntity.ok("Student registered successfully!");
    }

    @PutMapping("/students/{id}")
    public ResponseEntity<User> updateStudent(@PathVariable Long id, @RequestBody StudentUpdateRequest request) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setFullName(request.getFullName());
                    user.setEmail(request.getEmail());
                    user.setDepartment(request.getDepartment());
                    user.setPhoneNumber(request.getPhoneNumber());
                    user.setWalletBalance(request.getWalletBalance());
                    return ResponseEntity.ok(userRepository.save(user));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/students")
    public ResponseEntity<List<User>> getAllStudents() {
        List<User> students = userRepository.findAll();
        return ResponseEntity.ok(students);
    }

    // --- Sales and History Management ---
    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderRepository.findAll());
    }

    // --- Feedback Management ---
    @GetMapping("/feedback")
    public ResponseEntity<List<Feedback>> getAllFeedback() {
        return ResponseEntity.ok(feedbackRepository.findAll());
    }

    // --- Query Management ---
    @GetMapping("/queries")
    public ResponseEntity<List<Query>> getAllQueries() {
        return ResponseEntity.ok(queryRepository.findAll());
    }

    // --- CORRECTED METHOD ---
    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long orderId, @RequestParam String status) {
        // 1. Find the order first
        Optional<Order> orderOptional = orderRepository.findById(orderId);

        // 2. Handle Order Not Found
        if (orderOptional.isEmpty()) {
            return ResponseEntity.notFound().build(); // Return 404 Not Found
        }

        Order order = orderOptional.get();

        // 3. Validate the status input
        String upperCaseStatus = status.toUpperCase();
        if (!List.of("PENDING", "COMPLETED", "DELIVERED", "CANCELLED").contains(upperCaseStatus)) {
            // Return 400 Bad Request if status is invalid
            return ResponseEntity.badRequest().body("Invalid status value."); // Added a body for clarity
        }

        // 4. Update and Save if valid
        order.setStatus(upperCaseStatus);
        Order savedOrder = orderRepository.save(order);
        return ResponseEntity.ok(savedOrder); // Return 200 OK with the updated order
    }
}