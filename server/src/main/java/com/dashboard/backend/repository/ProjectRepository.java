package com.dashboard.backend.repository;

import com.dashboard.backend.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface ProjectRepository extends JpaRepository<Project, UUID> {
}
