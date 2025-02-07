package com.loco.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

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
    private InventoryItems inventoryItem;

    @NonNull
    @Column(name = "quantity", nullable = false)
    private Integer quantity = 1;

    @Column(name = "created_at")
    @ColumnDefault("CURRENT_TIMESTAMP")
    @CreationTimestamp
    private Instant createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private Instant updatedAt;

    @OneToOne(cascade = CascadeType.REMOVE, orphanRemoval = true)
    @JoinColumn(name = "users_id", nullable = false)
    private Users user;
}
