package com.loco.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.ColumnDefault;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "inventory_item", schema = "public")
@Getter
@Setter
@EqualsAndHashCode
@NoArgsConstructor
public class InventoryItem {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "inventory_item_id_gen")
    @SequenceGenerator(name = "inventory_item_id_gen", sequenceName = "inventory_item_id_seq")
    @Column(name = "id", nullable = false, columnDefinition = "serial")
    private Long id;

    @Size(max = 200)
    @Column(name = "name", nullable = false)
    private String name;

    @Size(max = 200)
    @Column(name = "short_description", nullable = false)
    private String shortDescription;

    @Size(max = 1000)
    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "price", nullable = false)
    private BigDecimal price;

    @NotNull
    @ColumnDefault("now()")
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @Column(name = "image_filename")
    private String imageFilename;

    public InventoryItem(String name, String description, String shortDescription, BigDecimal price, String imageFilename) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.imageFilename = imageFilename;
        this.shortDescription = shortDescription;
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
