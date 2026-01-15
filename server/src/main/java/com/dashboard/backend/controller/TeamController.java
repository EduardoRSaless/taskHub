package com.dashboard.backend.controller;

import com.dashboard.backend.model.Team;
import com.dashboard.backend.model.User;
import com.dashboard.backend.repository.TeamRepository;
import com.dashboard.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Team> getAllTeams() {
        return teamRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Team> getTeamById(@PathVariable UUID id) {
        Optional<Team> team = teamRepository.findById(id);
        return team.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Team createTeam(@RequestBody Team team) {
        return teamRepository.save(team);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Team> updateTeam(@PathVariable UUID id, @RequestBody Team teamDetails) {
        Optional<Team> optionalTeam = teamRepository.findById(id);
        if (optionalTeam.isPresent()) {
            Team team = optionalTeam.get();
            team.setName(teamDetails.getName());
            team.setDescription(teamDetails.getDescription());
            return ResponseEntity.ok(teamRepository.save(team));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeam(@PathVariable UUID id) {
        if (teamRepository.existsById(id)) {
            teamRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // --- Rotas para Membros do Time (AGORA POR EMAIL) ---

    @PostMapping("/{teamId}/members") // Rota alterada para receber email no body
    public ResponseEntity<Team> addMemberToTeam(@PathVariable UUID teamId, @RequestBody MemberRequest memberRequest) {
        Optional<Team> optionalTeam = teamRepository.findById(teamId);
        Optional<User> optionalUser = userRepository.findByEmail(memberRequest.getEmail()); // Buscar por email

        if (optionalTeam.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if (optionalUser.isEmpty()) {
            return ResponseEntity.badRequest().body(null); // Usuário não encontrado
        }

        Team team = optionalTeam.get();
        User user = optionalUser.get();
        
        if (team.getMembers().contains(user)) {
            return ResponseEntity.badRequest().body(team); // Membro já existe
        }
        
        team.getMembers().add(user);
        return ResponseEntity.ok(teamRepository.save(team));
    }

    @DeleteMapping("/{teamId}/members") // Rota alterada para receber email no body
    public ResponseEntity<Team> removeMemberFromTeam(@PathVariable UUID teamId, @RequestBody MemberRequest memberRequest) {
        Optional<Team> optionalTeam = teamRepository.findById(teamId);
        Optional<User> optionalUser = userRepository.findByEmail(memberRequest.getEmail()); // Buscar por email

        if (optionalTeam.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if (optionalUser.isEmpty()) {
            return ResponseEntity.badRequest().body(null); // Usuário não encontrado
        }

        Team team = optionalTeam.get();
        User user = optionalUser.get();
        
        if (team.getMembers().remove(user)) {
            return ResponseEntity.ok(teamRepository.save(team));
        }
        return ResponseEntity.badRequest().body(team); // Membro não encontrado no time
    }
}

// Classe auxiliar para receber o email no corpo da requisição
class MemberRequest {
    private String email;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
