package com.loco.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Entity
@Table(name = "cart_items", schema = "public")
@Getter
@Setter
@EqualsAndHashCode
@NoArgsConstructor
public class CartItems {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY, generator = "cart_items_sequence_gen")
    @SequenceGenerator(name = "cart_items_sequence_gen", sequenceName = "cart_items_id_seq")
    @Column(name = "id", nullable = false, columnDefinition = "serial")
    private Long id;

    @OneToOne
    @JoinColumn(name = "inventory_item_id", referencedColumnName = "id", nullable = false)
    private InventoryItems inventoryItemId;

    @NonNull
    @Column(name = "quantity", nullable = false)
    private Integer quantity = 1;

    @NonNull
    @ColumnDefault("now()")
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @NonNull
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @NonNull
    @OneToOne(mappedBy = "id", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private Users userId;
}
