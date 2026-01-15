package com.dashboard.backend.controller;

import com.dashboard.backend.model.Project;
import com.dashboard.backend.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectRepository projectRepository;

    @GetMapping
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @PostMapping
    public Project createProject(@RequestBody Project project) {
        return projectRepository.save(project);
    }

    @PutMapping("/{id}")
    public Project updateProject(@PathVariable UUID id, @RequestBody Project projectDetails) {
        Project project = projectRepository.findById(id).orElseThrow();
        project.setName(projectDetails.getName());
        project.setDescription(projectDetails.getDescription());
        project.setStatus(projectDetails.getStatus());
        project.setTeam(projectDetails.getTeam());
        project.setDueDate(projectDetails.getDueDate());
        return projectRepository.save(project);
    }

    @DeleteMapping("/{id}")
    public void deleteProject(@PathVariable UUID id) {
        projectRepository.deleteById(id);
    }
}
