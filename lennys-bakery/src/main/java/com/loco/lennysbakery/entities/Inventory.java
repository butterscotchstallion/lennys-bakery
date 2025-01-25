package com.loco.lennysbakery.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "inventory")
@Getter
@Setter
public class Inventory {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    private String name;
    private String description;
    private BigDecimal price;

    public String toString() {
        return "Inventory(id=" + id + ", name=" + name + ", description=" + description + ", price=" + price + ")";
    }
}
