package com.loco.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;

@Entity
public class AccountProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY, generator = "account_profile_sequence_gen")
    @SequenceGenerator(name = "account_profile_sequence_gen", sequenceName = "account_profile_id_seq")
    @Column(name = "id", nullable = false, columnDefinition = "serial")
    private Long id;

    @Size(max = 255)
    @Column(name = "avatar_filename")
    private String avatarFilename;

    @Size(max = 255)
    @Column(name = "about")
    private String about;

    @OneToOne(cascade = CascadeType.REMOVE, orphanRemoval = true)
    @JoinColumn(name = "users_id", nullable = false)
    private Users user;
}
