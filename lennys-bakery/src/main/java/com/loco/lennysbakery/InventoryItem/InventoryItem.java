package com.loco.lennysbakery.InventoryItem;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "inventory", schema = "public")
@Getter
@Setter
@EqualsAndHashCode
@NoArgsConstructor
public class InventoryItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;
    private String description;
    private BigDecimal price;

    public InventoryItem(String name, String description, BigDecimal price) {
        this.name = name;
        this.description = description;
        this.price = price;
    }

    @Override
    public String toString() {
        return "Inventory(id="
                + id
                + ", name="
                + name
                + ", description="
                + description
                + ", price="
                + price
                + ")";
    }
}
