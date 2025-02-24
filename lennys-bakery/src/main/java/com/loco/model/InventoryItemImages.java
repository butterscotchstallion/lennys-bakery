package com.loco.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "inventory_item_images", schema = "public")
@Getter
@Setter
@EqualsAndHashCode
@NoArgsConstructor
public class InventoryItemImages {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "inventory_item_images_id_gen")
    @SequenceGenerator(name = "inventory_item_images_id_gen", sequenceName = "inventory_item_images_id_seq")
    @Column(name = "id", nullable = false, columnDefinition = "serial")
    private Long id;

    @NonNull
    @Column(name = "image_filename", nullable = false, unique = true)
    private String imageFilename;

    /*
    @NonNull
    @OneToOne
    @JoinColumn(name = "inventory_item_id", nullable = false)
    private InventoryItems inventoryItem;*/

    @Column(name = "created_at")
    @ColumnDefault("CURRENT_TIMESTAMP")
    @CreationTimestamp
    private Instant createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private Instant updatedAt;

    @Override
    public String toString() {
        return "InventoryItems(id=" + id + ", name=" + imageFilename + ")";  // Exclude the images collection
    }
}
