package com.loco.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "tags", schema = "public")
@Getter
@Setter
@EqualsAndHashCode
@NoArgsConstructor
@ToString
public class Tags {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "tags_id_gen")
    @SequenceGenerator(name = "tags_id_gen", sequenceName = "tags_id_seq")
    @Column(name = "id", nullable = false, columnDefinition = "serial")
    private Long id;

    @NotBlank
    @NonNull
    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @NotBlank
    @NonNull
    @Column(name = "slug", nullable = false, unique = true)
    private String slug;

    @NonNull
    @Size(max = 1000)
    @Column(name = "description")
    private String description;

    @Column(name = "created_at")
    @ColumnDefault("CURRENT_TIMESTAMP")
    @CreationTimestamp
    private Instant createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private Instant updatedAt;
}
