package com.campuscart.service;

import com.campuscart.model.*;
import com.campuscart.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Transactional
    public Cart getCartByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> createCartForUser(user));
    }

    @Transactional
    public Cart addItemToCart(String username, Long productId, int quantity) {
        System.out.println("--- [DEBUG] CartService:addItemToCart START ---");
        System.out.println("[DEBUG] Attempting to process for user: " + username);

        Cart cart = getCartByUsername(username);
        if (cart == null) {
            System.out.println("[DEBUG] !!! FATAL ERROR: Cart is NULL after getCartByUsername.");
            throw new IllegalStateException("Cart could not be found or created for user.");
        }
        System.out.println("[DEBUG] Cart found/created with ID: " + cart.getId());

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + productId));
        System.out.println("[DEBUG] Product found: " + product.getName());

        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct() != null && item.getProduct().getId().equals(productId))
                .findFirst();

        if (existingItem.isPresent()) {
            System.out.println("[DEBUG] Item exists in cart. Updating quantity.");
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
        } else {
            System.out.println("[DEBUG] Item does not exist. Creating new CartItem.");
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            cart.getItems().add(newItem);
            System.out.println("[DEBUG] New item added to cart's item set.");
        }

        System.out.println("[DEBUG] Attempting to save cart...");
        Cart savedCart = cartRepository.save(cart);
        System.out.println("[DEBUG] Cart saved successfully.");
        System.out.println("--- [DEBUG] CartService:addItemToCart END ---");
        return savedCart;
    }

    @Transactional
    public Cart removeItemFromCart(String username, Long productId) {
        Cart cart = getCartByUsername(username);
        cart.getItems().removeIf(item -> item.getProduct().getId().equals(productId));
        return cartRepository.save(cart);
    }

    @Transactional
    public void clearCart(String username) {
        Cart cart = getCartByUsername(username);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    private Cart createCartForUser(User user) {
        Cart newCart = new Cart();
        newCart.setUser(user);
        return cartRepository.save(newCart);
    }
}