package com.loco.lennysbakery.InventoryItem;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;

@RestController
@RequestMapping("/inventory")
public class InventoryController {
    @GetMapping("")
    public ResponseEntity<ArrayList<InventoryItem>> inventoryList() {
        ArrayList<InventoryItem> inventoryItemList = new ArrayList<>();
        InventoryItem pbTreat = new InventoryItem();
        pbTreat.setName("Pb Treat");
        inventoryItemList.add(pbTreat);
        return ResponseEntity.ok(inventoryItemList);
    }
}
