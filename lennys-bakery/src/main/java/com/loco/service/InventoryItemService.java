package com.loco.service;

import com.loco.model.InventoryItems;
import com.loco.repository.InventoryItemRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventoryItemService {
    InventoryItemRepository inventoryItemRepository;

    public InventoryItemService(InventoryItemRepository inventoryItemRepository) {
        this.inventoryItemRepository = inventoryItemRepository;
    }

    public InventoryItems getInventoryItemById(long id) {
        return this.inventoryItemRepository.getInventoryItemById(id);
    }

    public InventoryItems getInventoryItemBySlug(String slug) {
        return inventoryItemRepository.findBySlug(slug);
    }

    public List<InventoryItems> getAllInventoryItems() {
        return (List<InventoryItems>)
                inventoryItemRepository.findAll(Sort.by(Sort.Direction.ASC, "name"));
    }

    public void saveInventoryItem(InventoryItems inventoryItem) {
        inventoryItemRepository.save(inventoryItem);
    }
}
