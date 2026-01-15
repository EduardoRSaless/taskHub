package com.dashboard.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Entity
@Table(name = "projects")
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String name;
    private String description;
    private String status;
    
    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "owner_id")
    private UUID ownerId;

    @ManyToOne(fetch = FetchType.EAGER) // Mudado para EAGER para evitar problemas de serialização
    @JoinColumn(name = "team_id")
    private Team team;
}
