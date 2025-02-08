package com.loco.dto;

import lombok.Data;

@Data
public class AddCartItemRequestDto {
    private long inventoryItemId;
    private int quantity;
}
