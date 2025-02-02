package com.loco.service;

import com.loco.model.InventoryItems;
import com.loco.repository.InventoryItemRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class InventoryItemService {
    InventoryItemRepository inventoryItemRepository;

    public InventoryItemService(InventoryItemRepository inventoryItemRepository) {
        this.inventoryItemRepository = inventoryItemRepository;
    }

    public InventoryItems getInventoryItemBySlug(String slug) {
        return inventoryItemRepository.findBySlug(slug);
    }

    public List<InventoryItems> getAllInventoryItems() {
        return inventoryItemRepository.findAll();
    }

    public InventoryItems saveInventoryItem(InventoryItems inventoryItem) {
        return inventoryItemRepository.save(inventoryItem);
    }

    public void deleteInventoryItem(Long id) {
        inventoryItemRepository.deleteById(id);
    }
}
