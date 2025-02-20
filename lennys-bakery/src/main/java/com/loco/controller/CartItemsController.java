package com.loco.controller;

import com.loco.dto.AddCartItemRequestDto;
import com.loco.model.CartItems;
import com.loco.model.InventoryItems;
import com.loco.model.Users;
import com.loco.service.CartItemsService;
import com.loco.service.InventoryItemService;
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
    private final InventoryItemService inventoryItemService;

    public CartItemsController(ModelMapper modelMapper, CartItemsService cartItemsService, UserService userService, InventoryItemService inventoryItemService) {
        this.modelMapper = modelMapper;
        this.cartItemsService = cartItemsService;
        this.userService = userService;
        this.inventoryItemService = inventoryItemService;
    }

    @GetMapping("")
    public List<CartItems> getCartItemsByUserId() {
        // TODO: tie this to the current session and get user from that
        return cartItemsService.getCartItemsByUserId(this.userService.getUserIdFromSession());
    }

    @DeleteMapping("/{inventoryItemId}")
    public ResponseEntity<HashMap<String, String>> deleteCartItem(@PathVariable long inventoryItemId) {
        InventoryItems inventoryItem = inventoryItemService.getInventoryItemById(inventoryItemId);
        if (inventoryItem == null) {
            log.error("Inventory item not found: {}", inventoryItem);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Inventory item not found");
        }

        long userId = this.userService.getUserIdFromSession();
        Users cartOwnerUser = this.userService.getUserById(userId);
        if (cartOwnerUser == null) {
            log.error("User not found: {}", userId);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        CartItems cartItem = this.cartItemsService.getCartItemsByUserAndInventoryItem(cartOwnerUser, inventoryItem);
        if (cartItem == null) {
            log.error("Cart item not found: {}", userId);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart item not found");
        }

        this.cartItemsService.deleteCartItem(cartOwnerUser, cartItem);
        HashMap<String, String> response = new HashMap<>();
        response.put("status", "OK");
        response.put("message", "Item deleted from cart");

        log.debug("CartItemsController: Deleted cart item {} from user {}", cartItem.getId(), userId);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    private boolean isPositiveInteger(Number number) {
        if (number == null) return false;
        return number.doubleValue() > 0 && number.doubleValue() == Math.floor(number.doubleValue());
    }

    @PostMapping(value = "", consumes = "application/json", produces = "application/json")
    @Valid
    public ResponseEntity<HashMap<String, String>> addItemToCart(@RequestBody AddCartItemRequestDto cartItemRequestDto) {
        HashMap<String, String> response = new HashMap<>();
        try {
            if (!this.isPositiveInteger(cartItemRequestDto.getQuantity())) {
                response.put("status", "ERROR");
                response.put("message", "Invalid quantity");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            if (!this.isPositiveInteger(cartItemRequestDto.getInventoryItemId())) {
                response.put("status", "ERROR");
                response.put("message", "Invalid inventory item id");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            this.cartItemsService.addItemToCart(
                    cartItemRequestDto.getInventoryItemId(),
                    this.userService.getUserIdFromSession(),
                    cartItemRequestDto.getQuantity(),
                    cartItemRequestDto.getOverwriteQuantity()
            );
            response.put("status", "OK");
            response.put("message", "Item added to cart");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error adding new cart item: {}", e.getMessage(), e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
