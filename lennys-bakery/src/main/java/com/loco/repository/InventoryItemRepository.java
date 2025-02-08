package com.loco.repository;

import com.loco.model.InventoryItems;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InventoryItemRepository extends PagingAndSortingRepository<InventoryItems, Long> {
    InventoryItems findBySlug(String slug);

    void save(InventoryItems inventoryItem);

    InventoryItems getInventoryItemById(Long id);
}
