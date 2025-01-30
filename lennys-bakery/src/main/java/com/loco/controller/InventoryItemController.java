package com.loco.controller;

import com.loco.model.InventoryItem;
import com.loco.service.InventoryItemService;
import java.util.ArrayList;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/inventory")
public class InventoryItemController {
    InventoryItemService inventoryItemService;

    public InventoryItemController(InventoryItemService inventoryItemService) {
        this.inventoryItemService = inventoryItemService;
    }

    @GetMapping("")
    public ResponseEntity<ArrayList<InventoryItem>> inventoryList() {
        ArrayList<InventoryItem> inventoryItemList = new ArrayList<>();
        // List<InventoryItem> inventoryItemList = this.inventoryItemService
        InventoryItem pbTreat = new InventoryItem();
        pbTreat.setName("Special Peanut Butter Treat");
        inventoryItemList.add(pbTreat);
        return ResponseEntity.ok(inventoryItemList);
    }
}
