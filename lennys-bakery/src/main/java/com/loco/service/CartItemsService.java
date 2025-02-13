package com.loco.service;

import com.loco.model.CartItems;
import com.loco.model.InventoryItems;
import com.loco.model.Users;
import com.loco.repository.CartItemRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CartItemsService {
    private static final Logger log = LoggerFactory.getLogger(CartItemsService.class);
    private final CartItemRepository cartItemRepository;
    private final UserService userService;
    private final InventoryItemService inventoryItemService;

    public CartItemsService(CartItemRepository cartItemRepository, UserService userService, InventoryItemService inventoryItemService) {
        this.cartItemRepository = cartItemRepository;
        this.userService = userService;
        this.inventoryItemService = inventoryItemService;
    }

    public CartItems getCartItemById(long cartItemId) {
        return cartItemRepository.getCartItemsById(cartItemId);
    }

    public void deleteCartItem(Users cartOwnerUser, CartItems cartItems) {
        this.cartItemRepository.deleteCartItemsByUserAndId(cartOwnerUser, cartItems.getId());
    }

    private Users getUserOrThrowException(long userId) throws ResponseStatusException {
        Users cartOwnerUser = userService.getUserById(userId);
        if (cartOwnerUser == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        return cartOwnerUser;
    }

    /**
     * Add new item to cart
     * 1. Validate user and inventory item id
     * 2. Check if this item exists in the cart already
     * 3. If cart item exists, update quantity
     * 4. If cart item does not exist, add it
     *
     * @param inventoryItemId Inventory item
     * @param userId          User id
     * @param quantity        Number of items
     */
    public void addItemToCart(long inventoryItemId, long userId, int quantity, boolean overwriteQuantity) {
        Users cartOwnerUser = this.getUserOrThrowException(userId);
        InventoryItems inventoryItem = this.inventoryItemService.getInventoryItemById(inventoryItemId);
        if (inventoryItem == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Inventory item not found");
        }

        // Find out if this item exists in the cart already
        CartItems cartItems = this.getCartItemsByUserIdAndInventoryItemId(cartOwnerUser, inventoryItem);
        int updatedQuantity = quantity;
        if (cartItems != null) {
            if (!overwriteQuantity) {
                updatedQuantity += cartItems.getQuantity();
            }
        } else {
            cartItems = new CartItems();
        }
        cartItems.setInventoryItem(inventoryItem);
        cartItems.setQuantity(updatedQuantity);
        cartItems.setUser(cartOwnerUser);

        log.debug("CartItemsService: Adding new cart item {} (quantity: {} - overwrite: {}) to user {}",
                inventoryItemId, updatedQuantity, overwriteQuantity, userId);

        this.cartItemRepository.save(cartItems);
    }

    private CartItems getCartItemsByUserIdAndInventoryItemId(Users cartUser, InventoryItems inventoryItem) {
        return this.cartItemRepository.getCartItemsByUserAndInventoryItem(
                cartUser,
                inventoryItem
        );
    }

    public List<CartItems> getCartItemsByUserId(long userId) {
        Users cartOwnerUser = this.getUserOrThrowException(userId);
        return this.cartItemRepository.getCartItemsByUser(cartOwnerUser);
    }
}
