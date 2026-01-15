package com.dashboard.backend.model;

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
    private String team;
    
    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "owner_id")
    private UUID ownerId;
}
