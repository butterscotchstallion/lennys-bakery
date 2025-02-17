package com.loco.dto;

import com.loco.model.Tags;
import lombok.Data;

import java.util.Set;

@Data
public class GetInventoryItemsByTagsDto {
    private Set<Tags> tags;
}
