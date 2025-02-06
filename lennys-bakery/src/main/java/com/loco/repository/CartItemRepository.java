package com.loco.repository;

import com.loco.model.CartItems;
import com.loco.model.Users;
import lombok.NonNull;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface CartItemRepository extends CrudRepository<CartItems, Long> {
    List<CartItems> getCartItemsByUserId(@NonNull Users users);
}
