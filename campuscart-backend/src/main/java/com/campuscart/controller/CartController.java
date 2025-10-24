package com.campuscart.controller;

import com.campuscart.dto.CartItemRequest;
import com.campuscart.model.Cart;
import com.campuscart.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/student/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    public ResponseEntity<Cart> getCart(Principal principal) {
        Cart cart = cartService.getCartByUsername(principal.getName());
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/items")
    public ResponseEntity<Cart> addItemToCart(@RequestBody CartItemRequest request, Principal principal) {
        Cart updatedCart = cartService.addItemToCart(principal.getName(), request.getProductId(), request.getQuantity());
        return ResponseEntity.ok(updatedCart);
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<Cart> removeItemFromCart(@PathVariable Long productId, Principal principal) {
        Cart updatedCart = cartService.removeItemFromCart(principal.getName(), productId);
        return ResponseEntity.ok(updatedCart);
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(Principal principal) {
        cartService.clearCart(principal.getName());
        return ResponseEntity.noContent().build();
    }
}