package com.loco.dto;

import com.loco.model.CartItems;
import lombok.Data;

@Data
public class AddCartItemRequestDto {
    private CartItems cartItems;
    private int quantity;
}
