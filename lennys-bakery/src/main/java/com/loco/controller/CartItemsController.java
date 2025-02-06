package com.loco.controller;

import com.loco.model.CartItems;
import com.loco.service.CartService;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/v1/cart")
public class CartItemsController {
    CartService cartService;

    public CartItemsController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("/{userId}")
    public List<CartItems> getCartItemsByUserId(@PathVariable @Min(1) @Positive Long userId) {
        return cartService.getCartItemsByUserId(userId);
    }
}
