package com.loco.controller;

import com.loco.model.InventoryItems;
import com.loco.service.InventoryItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/v1/inventory")
public class InventoryItemController {
    InventoryItemService inventoryItemService;

    public InventoryItemController(InventoryItemService inventoryItemService) {
        this.inventoryItemService = inventoryItemService;
    }

    @GetMapping("")
    public ResponseEntity<List<InventoryItems>> inventoryList() {
        List<InventoryItems> inventoryItemList = this.inventoryItemService.getAllInventoryItems();
        return ResponseEntity.ok(inventoryItemList);
    }

    @GetMapping("/{slug}")
    public ResponseEntity<InventoryItems> inventoryItemBySlug(@PathVariable String slug) {
        InventoryItems inventoryItem = this.inventoryItemService.getInventoryItemBySlug(slug);
        return ResponseEntity.ok(inventoryItem);
    }

    @GetMapping("/search?q={searchTerm}")
    public ResponseEntity<List<InventoryItems>> inventoryItemSearch(@PathVariable String searchTerm) {
        List<InventoryItems> inventoryItemList = this.inventoryItemService.getInventoryItemsBySearchText(searchTerm);
        return ResponseEntity.ok(inventoryItemList);
    }
}
