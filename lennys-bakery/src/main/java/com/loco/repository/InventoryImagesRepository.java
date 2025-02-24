package com.loco.repository;

import com.loco.model.InventoryItemImages;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InventoryImagesRepository extends CrudRepository<InventoryItemImages, Long> {
}
