package com.loco.service;

import com.loco.model.InventoryItemImages;
import com.loco.repository.InventoryImagesRepository;
import org.springframework.stereotype.Service;

@Service
public class InventoryItemImagesService {
    private final InventoryImagesRepository inventoryItemImagesRepository;

    public InventoryItemImagesService(InventoryImagesRepository inventoryItemImagesRepository) {
        this.inventoryItemImagesRepository = inventoryItemImagesRepository;
    }

    public InventoryItemImages saveInventoryItemImage(InventoryItemImages image) {
        return inventoryItemImagesRepository.save(image);
    }
}
