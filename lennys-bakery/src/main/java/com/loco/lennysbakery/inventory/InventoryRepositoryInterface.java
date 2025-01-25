package com.loco.lennysbakery.inventory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InventoryRepositoryInterface
        extends PagingAndSortingRepository<Inventory, Long>,
                QuerydslPredicateExecutor<Inventory>,
                JpaRepository<Inventory, Long> {
    Inventory findByName(String name);
}
