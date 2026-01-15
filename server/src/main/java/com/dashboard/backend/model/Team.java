package com.dashboard.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties; // Importar
import jakarta.persistence.*;
import lombok.Data;
import java.util.List;
import java.util.UUID;

@Data
@Entity
@Table(name = "teams")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) // Adicionar aqui para evitar erro de serialização do Proxy
public class Team {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String name;
    private String description;

    @ManyToMany
    @JoinTable(
        name = "team_members",
        joinColumns = @JoinColumn(name = "team_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> members;
}
