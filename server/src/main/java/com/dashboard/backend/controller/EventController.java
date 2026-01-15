package com.dashboard.backend.controller;

import com.dashboard.backend.model.Event;
import com.dashboard.backend.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventRepository eventRepository;

    @GetMapping
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    @PostMapping
    public Event createEvent(@RequestBody Event event) {
        return eventRepository.save(event);
    }

    @PutMapping("/{id}")
    public Event updateEvent(@PathVariable UUID id, @RequestBody Event eventDetails) {
        Event event = eventRepository.findById(id).orElseThrow();
        event.setTitle(eventDetails.getTitle());
        event.setStartTime(eventDetails.getStartTime());
        event.setEndTime(eventDetails.getEndTime());
        event.setAllDay(eventDetails.getAllDay());
        event.setCategory(eventDetails.getCategory());
        event.setDescription(eventDetails.getDescription());
        event.setStatus(eventDetails.getStatus());
        event.setProjectId(eventDetails.getProjectId());
        return eventRepository.save(event);
    }

    @DeleteMapping("/{id}")
    public void deleteEvent(@PathVariable UUID id) {
        eventRepository.deleteById(id);
    }
}
