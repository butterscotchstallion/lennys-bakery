package com.loco.dto;

import lombok.Data;

@Data
public class GenericResponseDto {
    private Status status;
    private String message;
}
