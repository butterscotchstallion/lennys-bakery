package com.loco.repository;

import com.loco.model.InventoryItems;
import com.loco.model.Tags;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

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

    List<InventoryItems> findDistinctByTagsIn(Set<Tags> tags);
}
