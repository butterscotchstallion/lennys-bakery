package com.loco.lennysbakery.inventory;

import java.util.ArrayList;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/inventory")
public class InventoryController {
    @GetMapping("")
    public ResponseEntity<ArrayList<Inventory>> inventoryList() {
        ArrayList<Inventory> inventoryList = new ArrayList<>();
        Inventory pbTreat = new Inventory();
        pbTreat.setName("Pb Treat");
        inventoryList.add(pbTreat);
        return ResponseEntity.ok(inventoryList);
    }
}
