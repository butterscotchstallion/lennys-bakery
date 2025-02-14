package com.loco.repository;

import com.loco.model.InventoryItems;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryItemRepository extends PagingAndSortingRepository<InventoryItems, Long> {
    InventoryItems findBySlug(String slug);

    void save(InventoryItems inventoryItem);

    InventoryItems getInventoryItemById(Long id);

    @Query("SELECT i FROM InventoryItems i WHERE " +
            "LOWER(i.name) LIKE LOWER(CONCAT('%', :searchText, '%')) OR " +
            "LOWER(i.description) LIKE LOWER(CONCAT('%', :searchText, '%')) OR " +
            "LOWER(i.shortDescription) LIKE LOWER(CONCAT('%', :searchText, '%'))")
    List<InventoryItems> findInventoryItemsBySearchText(@Param("searchText") String searchText);
}
