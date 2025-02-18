package com.loco.model;

import com.loco.service.UrlSafeStringGenerator;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Set;

@Entity
@Table(name = "inventory_items", schema = "public")
@Getter
@Setter
@EqualsAndHashCode
@NoArgsConstructor
@ToString
public class InventoryItems {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "inventory_item_id_gen")
    @SequenceGenerator(name = "inventory_item_id_gen", sequenceName = "inventory_item_id_seq")
    @Column(name = "id", nullable = false, columnDefinition = "serial")
    private Long id;

    @NotNull
    @Size(max = 25)
    @Column(name = "slug", nullable = false, unique = true)
    private String slug;

    @Size(max = 200)
    @NotNull
    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @NotNull
    @Size(max = 200)
    @Column(name = "short_description", nullable = false)
    private String shortDescription;

    @NotNull
    @Size(max = 1000)
    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "price", nullable = false)
    private BigDecimal price;

    @NotNull
    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;

    @Column(name = "image_filename")
    private String imageFilename;

    @OneToMany()
    @JoinColumn(name = "tags_id", nullable = false)
    private Set<Tags> tags;
    
    public InventoryItems(
            String name,
            String description,
            String shortDescription,
            BigDecimal price,
            String imageFilename,
            Set<Tags> tags) {
        this.name = name;
        this.description = description;
        this.shortDescription = shortDescription;
        this.price = price;
        this.imageFilename = imageFilename;
        this.slug = UrlSafeStringGenerator.generateUrlSafeString(name);
        this.tags = tags;
    }
}
