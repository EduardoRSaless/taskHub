"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// --- Entidades ---

export interface Team {
  id: string;
  name: string;
  description: string;
  members: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: "Em Andamento" | "Concluído" | "Pausado" | "Atrasado";
  teamId: string;
  team: string;
  dueDate: string;
  ownerId?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
  extendedProps: {
    category: string;
    description?: string;
    team?: string;
    teamId?: string;
    projectId?: string;
    userId?: string;
    createdBy?: string;
    status: "pending" | "completed";
  };
}

interface DataContextType {
  projects: Project[];
  teams: Team[];
  events: CalendarEvent[];
  loading: boolean;
  
  addProject: (project: Omit<Project, "id">) => Promise<void>;
  updateProject: (project: Project) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  
  addTeam: (team: Omit<Team, "id">) => Promise<void>;
  
  addEvent: (event: Omit<CalendarEvent, "id">) => Promise<void>;
  updateEvent: (event: CalendarEvent) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  toggleEventCompletion: (eventId: string) => Promise<void>;
  
  getProjectProgress: (projectId: string) => number;
  getEventsByUser: (userId: string) => CalendarEvent[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const API_URL = "http://localhost:3001/api";

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Fetch Data ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const [projectsRes, eventsRes] = await Promise.all([
        fetch(`${API_URL}/projects`),
        fetch(`${API_URL}/events`)
      ]);

      if (projectsRes.ok) {
        const projectsData = await projectsRes.json();
        setProjects(projectsData.map((p: any) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          status: p.status || "Em Andamento",
          team: p.team || "Sem Time",
          dueDate: p.dueDate ? p.dueDate : (p.due_date ? p.due_date.split('T')[0] : ''), // Suporte a dueDate (Java) e due_date (Node)
          ownerId: p.ownerId || p.owner_id
        })));
      }

      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        setEvents(eventsData.map((e: any) => ({
          id: e.id,
          title: e.title,
          // Suporte a startTime (Java) e start_time (Node)
          start: e.startTime || e.start_time || e.start, 
          end: e.endTime || e.end_time || e.end,
          allDay: e.allDay !== undefined ? e.allDay : e.all_day,
          extendedProps: {
            category: e.category || e.extendedProps?.category || "Projeto",
            description: e.description || e.extendedProps?.description,
            projectId: e.projectId || e.project_id || e.extendedProps?.projectId,
            status: e.status || e.extendedProps?.status || "pending",
            createdBy: e.createdBy || e.created_by
          }
        })));
      }
      
      // Mock Teams
      setTeams([
        { id: "t1", name: "Time UI/UX Design", description: "Design", members: [] },
        { id: "t2", name: "Time Desenvolvimento", description: "Dev", members: [] }
      ]);

    } catch (error) {
      console.error("Erro ao buscar dados da API:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Actions ---

  const addProject = async (project: Omit<Project, "id">) => {
    try {
      const res = await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: project.name,
          description: project.description,
          status: project.status,
          team: project.team,
          dueDate: project.dueDate, // Java espera dueDate
          ownerId: project.ownerId
        })
      });
      if (res.ok) fetchData();
    } catch (error) {
      console.error("Erro ao criar projeto:", error);
    }
  };

  const updateProject = async (project: Project) => {
    try {
      const res = await fetch(`${API_URL}/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: project.name,
          description: project.description,
          status: project.status,
          team: project.team,
          dueDate: project.dueDate
        })
      });
      if (res.ok) fetchData();
    } catch (error) {
      console.error("Erro ao atualizar projeto:", error);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/projects/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (error) {
      console.error("Erro ao deletar projeto:", error);
    }
  };

  const addTeam = async (team: Omit<Team, "id">) => {
    // Implementar
  };

  const addEvent = async (event: Omit<CalendarEvent, "id">) => {
    try {
      const res = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: event.title,
          startTime: event.start, // Java espera startTime
          endTime: event.end,     // Java espera endTime
          allDay: event.allDay,
          category: event.extendedProps.category,
          description: event.extendedProps.description,
          projectId: event.extendedProps.projectId,
          status: event.extendedProps.status
        })
      });
      if (res.ok) fetchData();
    } catch (error) {
      console.error("Erro ao criar evento:", error);
    }
  };

  const updateEvent = async (event: CalendarEvent) => {
    try {
      const res = await fetch(`${API_URL}/events/${event.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: event.title,
          startTime: event.start,
          endTime: event.end,
          allDay: event.allDay,
          category: event.extendedProps.category,
          description: event.extendedProps.description,
          projectId: event.extendedProps.projectId,
          status: event.extendedProps.status
        })
      });
      if (res.ok) fetchData();
    } catch (error) {
      console.error("Erro ao atualizar evento:", error);
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/events/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (error) {
      console.error("Erro ao deletar evento:", error);
    }
  };

  const toggleEventCompletion = async (id: string) => {
    const event = events.find(e => e.id === id);
    if (!event) return;
    
    const newStatus = event.extendedProps.status === "completed" ? "pending" : "completed";
    const updatedEvent = {
      ...event,
      extendedProps: { ...event.extendedProps, status: newStatus }
    };

    await updateEvent(updatedEvent);
  };

  const getProjectProgress = (projectId: string) => {
    const projectEvents = events.filter(e => e.extendedProps.projectId === projectId);
    if (projectEvents.length === 0) return 0;
    const completed = projectEvents.filter(e => e.extendedProps.status === "completed");
    return Math.round((completed.length / projectEvents.length) * 100);
  };

  const getEventsByUser = (userId: string) => {
    return events.filter(e => e.extendedProps.userId === userId);
  };

  return (
    <DataContext.Provider value={{
      projects, teams, events, loading,
      addProject, updateProject, deleteProject,
      addTeam,
      addEvent, updateEvent, deleteEvent, toggleEventCompletion,
      getProjectProgress, getEventsByUser
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) throw new Error("useData must be used within a DataProvider");
  return context;
};
