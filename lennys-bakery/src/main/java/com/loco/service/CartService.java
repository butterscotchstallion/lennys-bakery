package com.loco.service;

import com.loco.model.CartItems;
import com.loco.model.Users;
import com.loco.repository.CartItemRepository;
import com.loco.repository.UsersRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CartService {
    CartItemRepository cartItemRepository;
    UsersRepository usersRepository;

    public CartService(CartItemRepository cartItemRepository, UsersRepository usersRepository) {
        this.cartItemRepository = cartItemRepository;
        this.usersRepository = usersRepository;
    }

    public List<CartItems> getCartItemsByUserId(Long userId) {
        Users cartOwnerUser = usersRepository.getUsersById(userId);
        if (cartOwnerUser == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        return this.cartItemRepository.getCartItemsByUserId(cartOwnerUser);
    }
}
