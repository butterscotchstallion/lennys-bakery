package com.loco.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class AddCartItemRequestDto {
    @Positive
    @NotBlank
    private long inventoryItemId;

    @Positive
    @NotBlank
    private int quantity;
}
