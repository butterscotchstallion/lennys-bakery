package com.loco.controller;

import com.loco.dto.AddCartItemRequestDto;
import com.loco.model.CartItems;
import com.loco.service.CartItemsService;
import com.loco.service.UserService;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("api/v1/cart")
public class CartItemsController {
    private final ModelMapper modelMapper;
    private final CartItemsService cartItemsService;
    private final UserService userService;

    public CartItemsController(ModelMapper modelMapper, CartItemsService cartItemsService, UserService userService) {
        this.modelMapper = modelMapper;
        this.cartItemsService = cartItemsService;
        this.userService = userService;
    }

    @GetMapping("")
    public List<CartItems> getCartItemsByUserId() {
        // TODO: tie this to the current session and get user from that
        return cartItemsService.getCartItemsByUserId(this.userService.getUserIdFromSession());
    }

    @PostMapping(value = "", consumes = "application/json", produces = "application/json")
    @Valid
    public ResponseEntity<Object> addItemToCart(@RequestBody AddCartItemRequestDto cartItemRequestDto) {
        CartItems cartItem = this.modelMapper.map(cartItemRequestDto, CartItems.class);
        this.cartItemsService.addItemToCart(
                cartItem.getInventoryItem().getId(),
                this.userService.getUserIdFromSession(),
                cartItemRequestDto.getQuantity()
        );
        HashMap<String, String> response = new HashMap<>();
        response.put("status", "OK");
        response.put("message", "Item added to cart");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
