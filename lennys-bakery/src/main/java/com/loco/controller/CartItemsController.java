package com.loco.controller;

import com.loco.model.CartItems;
import com.loco.service.CartService;
import org.springframework.web.bind.annotation.GetMapping;
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

    @GetMapping("")
    public List<CartItems> getCartItemsByUserId() {
        // TODO: tie this to the current session and get user from that
        return cartService.getCartItemsByUserId(2);
    }
}
