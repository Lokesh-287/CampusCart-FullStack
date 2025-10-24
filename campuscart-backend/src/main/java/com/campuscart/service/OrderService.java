package com.campuscart.service;

import com.campuscart.exception.InsufficientBalanceException;
import com.campuscart.exception.OutOfStockException;
import com.campuscart.model.*;
import com.campuscart.repository.OrderRepository;
import com.campuscart.repository.ProductRepository;
import com.campuscart.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartService cartService; // Added for cart interaction

    @Transactional
    public Order createOrder(String username) { // Method signature is changed
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Get the cart from the database
        Cart cart = cartService.getCartByUsername(username);
        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cannot create an order from an empty cart.");
        }

        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());

        double totalAmount = 0;

        // Loop through items from the persistent cart, not a DTO list
        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();

            if (product.getStockQuantity() < cartItem.getQuantity()) {
                throw new OutOfStockException("Not enough stock for product: " + product.getName());
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPricePerItem(product.getPrice());
            order.getItems().add(orderItem);

            totalAmount += product.getPrice() * cartItem.getQuantity();

            // Decrease stock
            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
            productRepository.save(product);
        }

        if (user.getWalletBalance() < totalAmount) {
            throw new InsufficientBalanceException("Insufficient wallet balance.");
        }

        // Deduct from wallet
        user.setWalletBalance(user.getWalletBalance() - totalAmount);
        userRepository.save(user);

        order.setTotalAmount(totalAmount);
        Order savedOrder = orderRepository.save(order);

        // Clear the cart after a successful order
        cartService.clearCart(username);

        return savedOrder;
    }
}