package com.loco.lennysbakery.InventoryItem;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InventoryItemRepositoryInterface
        extends PagingAndSortingRepository<InventoryItem, Long>,
        QuerydslPredicateExecutor<InventoryItem>,
        JpaRepository<InventoryItem, Long> {
    InventoryItem findByName(String name);
}
