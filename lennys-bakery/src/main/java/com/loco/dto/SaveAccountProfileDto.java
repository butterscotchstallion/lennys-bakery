package com.loco.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SaveAccountProfileDto {
    @Size(max = 255)
    private String about;

    @Size(max = 255)
    private String avatarFilename;
}
