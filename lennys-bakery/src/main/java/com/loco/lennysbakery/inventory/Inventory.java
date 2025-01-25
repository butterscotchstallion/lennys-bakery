package com.loco.lennysbakery.inventory;

import jakarta.persistence.*;
import java.math.BigDecimal;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "inventory", schema = "public")
@Getter
@Setter
@EqualsAndHashCode
@NoArgsConstructor
public class Inventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;
    private String description;
    private BigDecimal price;

    public Inventory(String name, String description, BigDecimal price) {
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
