package com.loco.repository;

import com.loco.model.CartItems;
import com.loco.model.InventoryItems;
import com.loco.model.Users;
import lombok.NonNull;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface CartItemRepository extends CrudRepository<CartItems, Long> {
    List<CartItems> getCartItemsByUser(@NonNull Users users);

    CartItems getCartItemsByUserAndInventoryItem(Users user, InventoryItems inventoryItem);

    @Transactional
    void deleteCartItemsByUserAndInventoryItem(Users user, InventoryItems inventoryItem);

    CartItems getCartItemsById(Long id);

    List<CartItems> getCartItemsByInventoryItem(InventoryItems inventoryItem);
}
