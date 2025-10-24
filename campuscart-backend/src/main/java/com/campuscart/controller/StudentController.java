package com.campuscart.controller;

import com.campuscart.dto.FeedbackRequest;
import com.campuscart.model.Feedback;
import com.campuscart.model.Order;
import com.campuscart.model.Product;
import com.campuscart.model.User;
import com.campuscart.repository.FeedbackRepository;
import com.campuscart.repository.OrderRepository;
import com.campuscart.repository.ProductRepository;
import com.campuscart.repository.UserRepository;
import com.campuscart.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderService orderService;

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private ProductRepository productRepository;

    /**
     * Retrieves the profile of the currently logged-in student.
     */
    @GetMapping("/profile")
    public ResponseEntity<User> getStudentProfile(Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + principal.getName()));
        return ResponseEntity.ok(user);
    }

    /**
     * Retrieves the order history for the currently logged-in student.
     */
    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getOrderHistory(Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + principal.getName()));
        return ResponseEntity.ok(orderRepository.findByUserId(user.getId()));
    }

    /**
     * Processes the checkout for the student's current cart.
     * The cart's contents are retrieved from the database.
     */
    @PostMapping("/checkout")
    public ResponseEntity<Order> checkout(Principal principal) {
        Order createdOrder = orderService.createOrder(principal.getName());
        return ResponseEntity.ok(createdOrder);
    }

    /**
     * Submits feedback for a specific product.
     */
    @PostMapping("/products/{productId}/feedback")
    public ResponseEntity<Feedback> submitFeedback(@PathVariable Long productId, @RequestBody FeedbackRequest feedbackRequest, Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + principal.getName()));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        Feedback feedback = new Feedback();
        feedback.setProduct(product);
        feedback.setUser(user);
        feedback.setComment(feedbackRequest.getComment());
        feedback.setCreatedAt(LocalDateTime.now());

        Feedback savedFeedback = feedbackRepository.save(feedback);
        return ResponseEntity.ok(savedFeedback);
    }
}