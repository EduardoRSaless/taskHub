package com.dashboard.backend.controller;

import com.dashboard.backend.model.Project;
import com.dashboard.backend.model.Team;
import com.dashboard.backend.repository.ProjectRepository;
import com.dashboard.backend.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TeamRepository teamRepository;

    @GetMapping
    public List<Project> getAllProjects() {
        List<Project> projects = projectRepository.findAll();
        System.out.println("Retornando " + projects.size() + " projetos.");
        return projects;
    }

    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
        System.out.println("Criando projeto: " + project.getName());
        if (project.getTeam() != null && project.getTeam().getId() != null) {
            Optional<Team> team = teamRepository.findById(project.getTeam().getId());
            if (team.isEmpty()) {
                return ResponseEntity.badRequest().body(null);
            }
            project.setTeam(team.get());
        }
        Project savedProject = projectRepository.save(project);
        System.out.println("Projeto salvo com ID: " + savedProject.getId());
        return ResponseEntity.ok(savedProject);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable UUID id, @RequestBody Project projectDetails) {
        Optional<Project> optionalProject = projectRepository.findById(id);
        if (optionalProject.isPresent()) {
            Project project = optionalProject.get();
            project.setName(projectDetails.getName());
            project.setDescription(projectDetails.getDescription());
            project.setStatus(projectDetails.getStatus());
            project.setDueDate(projectDetails.getDueDate());
            project.setOwnerId(projectDetails.getOwnerId());

            if (projectDetails.getTeam() != null && projectDetails.getTeam().getId() != null) {
                Optional<Team> team = teamRepository.findById(projectDetails.getTeam().getId());
                if (team.isEmpty()) {
                    return ResponseEntity.badRequest().body(null);
                }
                project.setTeam(team.get());
            } else {
                project.setTeam(null);
            }

            return ResponseEntity.ok(projectRepository.save(project));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable UUID id) {
        if (projectRepository.existsById(id)) {
            projectRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
