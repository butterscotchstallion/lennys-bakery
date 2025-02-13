package com.loco.controller;

import com.loco.dto.AddCartItemRequestDto;
import com.loco.model.CartItems;
import com.loco.model.Users;
import com.loco.service.CartItemsService;
import com.loco.service.UserService;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("api/v1/cart")
public class CartItemsController {
    private final static org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(CartItemsController.class);
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

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<HashMap<String, String>> deleteCartItem(@PathVariable long cartItemId) {
        CartItems cartItem = cartItemsService.getCartItemById(cartItemId);
        if (cartItem == null) {
            log.error("Cart item not found: {}", cartItemId);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart item not found");
        }
        long userId = this.userService.getUserIdFromSession();
        Users cartOwnerUser = this.userService.getUserById(userId);
        if (cartOwnerUser == null) {
            log.error("User not found: {}", userId);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        this.cartItemsService.deleteCartItem(cartOwnerUser, cartItem);
        HashMap<String, String> response = new HashMap<>();
        response.put("status", "OK");
        response.put("message", "Item deleted from cart");

        log.debug("CartItemsController: Deleted cart item {} from user {}", cartItemId, userId);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping(value = "", consumes = "application/json", produces = "application/json")
    @Valid
    public ResponseEntity<Object> addItemToCart(@RequestBody AddCartItemRequestDto cartItemRequestDto) {
        try {
            this.cartItemsService.addItemToCart(
                    cartItemRequestDto.getInventoryItemId(),
                    this.userService.getUserIdFromSession(),
                    cartItemRequestDto.getQuantity(),
                    cartItemRequestDto.getOverwriteQuantity()
            );
            HashMap<String, String> response = new HashMap<>();
            response.put("status", "OK");
            response.put("message", "Item added to cart");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error adding new cart item: {}", e.getMessage(), e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
