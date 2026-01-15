package com.dashboard.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "events")
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String title;
    
    @Column(name = "start_time")
    private LocalDateTime startTime;
    
    @Column(name = "end_time")
    private LocalDateTime endTime;
    
    @Column(name = "all_day")
    private Boolean allDay;
    
    private String category;
    private String description;
    private String status;
    
    @Column(name = "project_id")
    private UUID projectId;
    
    @Column(name = "created_by")
    private UUID createdBy;
}
