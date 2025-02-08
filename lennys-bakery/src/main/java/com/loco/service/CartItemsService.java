package com.loco.service;

import com.loco.model.CartItems;
import com.loco.model.InventoryItems;
import com.loco.model.Users;
import com.loco.repository.CartItemRepository;
import com.loco.repository.UsersRepository;
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
    private final UsersRepository usersRepository;
    private final InventoryItemService inventoryItemService;

    public CartItemsService(CartItemRepository cartItemRepository, UsersRepository usersRepository, InventoryItemService inventoryItemService) {
        this.cartItemRepository = cartItemRepository;
        this.usersRepository = usersRepository;
        this.inventoryItemService = inventoryItemService;
    }

    private Users getUserOrThrowException(long userId) throws ResponseStatusException {
        Users cartOwnerUser = usersRepository.getUsersById(userId);
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
    public void addItemToCart(long inventoryItemId, long userId, int quantity) {
        Users cartOwnerUser = this.getUserOrThrowException(userId);
        InventoryItems inventoryItem = this.inventoryItemService.getInventoryItemById(inventoryItemId);
        if (inventoryItem == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Inventory item not found");
        }

        // Find out if this item exists in the cart already
        CartItems cartItems = this.getCartItemsByUserIdAndInventoryItemId(cartOwnerUser, inventoryItem);
        int updatedQuantity = quantity;
        if (cartItems != null) {
            updatedQuantity += cartItems.getQuantity();
        } else {
            cartItems = new CartItems();
        }
        cartItems.setInventoryItem(inventoryItem);
        cartItems.setQuantity(updatedQuantity);
        cartItems.setUser(cartOwnerUser);

        log.debug("CartItemsService: Adding new cart item {} (quantity: {}) to user {}", inventoryItemId, updatedQuantity, userId);

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
