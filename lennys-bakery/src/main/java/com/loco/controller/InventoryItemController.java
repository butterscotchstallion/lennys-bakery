package com.loco.controller;

import com.loco.model.InventoryItem;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;

@RestController
@RequestMapping("/inventory")
public class InventoryItemController {
    //private InventoryItemService inventoryItemService;

    @GetMapping("")
    public ResponseEntity<ArrayList<InventoryItem>> inventoryList() {
        ArrayList<InventoryItem> inventoryItemList = new ArrayList<>();
        InventoryItem pbTreat = new InventoryItem();
        pbTreat.setName("Special Peanut Butter Treat");
        inventoryItemList.add(pbTreat);
        return ResponseEntity.ok(inventoryItemList);
    }
}
