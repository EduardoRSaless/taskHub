package com.dashboard.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore; // Importar JsonIgnore
import jakarta.persistence.*;
import lombok.Data;
import java.util.List;
import java.util.UUID;

@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String name;
    private String email;
    private String password;
    private String role;
    private String phone;
    
    @Column(columnDefinition = "TEXT")
    private String avatar;

    @ManyToMany(mappedBy = "members")
    @JsonIgnore // Ignorar a lista de times ao serializar o usuário para evitar loop infinito
    private List<Team> teams;
}
