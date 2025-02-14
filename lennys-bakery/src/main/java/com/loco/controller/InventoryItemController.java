package com.loco.controller;

import com.loco.model.InventoryItems;
import com.loco.service.InventoryItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/search")
    public ResponseEntity<List<InventoryItems>> inventoryItemSearch(@RequestParam String q) {
        List<InventoryItems> inventoryItemList = this.inventoryItemService.getInventoryItemsBySearchText(q);
        return ResponseEntity.ok(inventoryItemList);
    }

    @GetMapping("/item/{slug}")
    public ResponseEntity<InventoryItems> inventoryItemBySlug(@PathVariable String slug) {
        InventoryItems inventoryItem = this.inventoryItemService.getInventoryItemBySlug(slug);
        if (inventoryItem == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(inventoryItem);
    }
}
