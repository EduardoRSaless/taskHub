"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// --- Entidades ---

export interface Team {
  id: string;
  name: string;
  description: string;
  members: string[]; // IDs dos usuários
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: "Em Andamento" | "Concluído" | "Pausado" | "Atrasado";
  teamId: string; // ID do time
  teamName: string; // Nome do time (para exibição)
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
    team?: string; // Nome do time (legado/visual)
    teamId?: string; // ID do time
    projectId?: string;
    userId?: string;
    createdBy?: string;
    status: "pending" | "completed";
  };
}

// Importar User do AuthContext para usar no DataContext
import { User } from "./AuthContext";

interface DataContextType {
  projects: Project[];
  teams: Team[];
  events: CalendarEvent[];
  users: User[]; // Adicionado para armazenar todos os usuários
  loading: boolean;
  
  addProject: (project: Omit<Project, "id" | "teamName">) => Promise<void>;
  updateProject: (project: Project) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  
  addTeam: (team: Omit<Team, "id">) => Promise<void>;
  updateTeam: (team: Team) => Promise<void>;
  deleteTeam: (teamId: string) => Promise<void>;
  addMemberToTeam: (teamId: string, userEmail: string) => Promise<void>;
  removeMemberFromTeam: (teamId: string, userEmail: string) => Promise<void>;
  
  addEvent: (event: Omit<CalendarEvent, "id">) => Promise<void>;
  updateEvent: (event: CalendarEvent) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  toggleEventCompletion: (eventId: string) => Promise<void>;
  
  updateUserRole: (userId: string, newRole: string) => Promise<void>; // Novo
  deleteUser: (userId: string) => Promise<void>; // Novo

  getProjectProgress: (projectId: string) => number;
  getEventsByUser: (userId: string) => CalendarEvent[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const API_URL = "http://localhost:3001/api";

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [users, setUsers] = useState<User[]>([]); // Novo estado para usuários
  const [loading, setLoading] = useState(true);

  // --- Fetch Data ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const [projectsRes, eventsRes, teamsRes, usersRes] = await Promise.all([
        fetch(`${API_URL}/projects`),
        fetch(`${API_URL}/events`),
        fetch(`${API_URL}/teams`),
        fetch(`${API_URL}/users`)
      ]);

      if (teamsRes.ok) {
        const teamsData = await teamsRes.json();
        setTeams(teamsData.map((t: any) => ({
          id: t.id,
          name: t.name,
          description: t.description,
          members: t.members ? t.members.map((m: any) => m.id) : []
        })));
      }

      if (projectsRes.ok) {
        const projectsData = await projectsRes.json();
        setProjects(projectsData.map((p: any) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          status: p.status || "Em Andamento",
          teamId: p.team ? p.team.id : undefined,
          teamName: p.team ? p.team.name : "Sem Time",
          dueDate: p.dueDate ? p.dueDate : (p.due_date ? p.due_date.split('T')[0] : ''),
          ownerId: p.ownerId || p.owner_id
        })));
      }

      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        setEvents(eventsData.map((e: any) => ({
          id: e.id,
          title: e.title,
          start: e.startTime || e.start_time || e.start, 
          end: e.endTime || e.end_time || e.end,
          allDay: e.allDay !== undefined ? e.allDay : e.all_day,
          extendedProps: {
            category: e.category || e.extendedProps?.category || "Projeto",
            description: e.description || e.extendedProps?.description,
            projectId: e.projectId || e.project_id || e.extendedProps?.projectId,
            status: e.status || e.extendedProps?.status || "pending",
            createdBy: e.createdBy || e.created_by,
            teamId: e.teamId || e.extendedProps?.teamId
          }
        })));
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          avatar: u.avatar || `https://i.pravatar.cc/150?u=${u.id}`
        })));
      }
      
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

  const addProject = async (project: Omit<Project, "id" | "teamName">) => {
    try {
      const res = await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: project.name,
          description: project.description,
          status: project.status,
          team: project.teamId ? { id: project.teamId } : null,
          dueDate: project.dueDate,
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
          team: project.teamId ? { id: project.teamId } : null,
          dueDate: project.dueDate,
          ownerId: project.ownerId
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
    try {
      const res = await fetch(`${API_URL}/teams`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: team.name,
          description: team.description
        })
      });
      if (res.ok) fetchData();
    } catch (error) {
      console.error("Erro ao criar time:", error);
    }
  };

  const updateTeam = async (team: Team) => {
    try {
      const res = await fetch(`${API_URL}/teams/${team.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: team.name,
          description: team.description
        })
      });
      if (res.ok) fetchData();
    } catch (error) {
      console.error("Erro ao atualizar time:", error);
    }
  };

  const deleteTeam = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/teams/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (error) {
      console.error("Erro ao deletar time:", error);
    }
  };

  const addMemberToTeam = async (teamId: string, userEmail: string) => {
    try {
      const res = await fetch(`${API_URL}/teams/${teamId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail })
      });
      if (res.ok) fetchData();
      else {
        const errorData = await res.json();
        console.error("Erro ao adicionar membro:", errorData.message || res.statusText);
        throw new Error(errorData.message || "Erro ao adicionar membro");
      }
    } catch (error) {
      console.error("Erro ao adicionar membro:", error);
      throw error;
    }
  };

  const removeMemberFromTeam = async (teamId: string, userEmail: string) => {
    try {
      const res = await fetch(`${API_URL}/teams/${teamId}/members`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail })
      });
      if (res.ok) fetchData();
      else {
        const errorData = await res.json();
        console.error("Erro ao remover membro:", errorData.message || res.statusText);
        throw new Error(errorData.message || "Erro ao remover membro");
      }
    } catch (error) {
      console.error("Erro ao remover membro:", error);
      throw error;
    }
  };

  const addEvent = async (event: Omit<CalendarEvent, "id">) => {
    try {
      const res = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: event.title,
          startTime: event.start,
          endTime: event.end,
          allDay: event.allDay,
          category: event.extendedProps.category,
          description: event.extendedProps.description,
          projectId: event.extendedProps.projectId,
          status: event.extendedProps.status,
          teamId: event.extendedProps.teamId
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
          status: event.extendedProps.status,
          teamId: event.extendedProps.teamId
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
    
    const newStatus: "pending" | "completed" = event.extendedProps.status === "completed" ? "pending" : "completed"; // Tipagem explícita
    const updatedEvent: CalendarEvent = {
      ...event,
      extendedProps: { ...event.extendedProps, status: newStatus }
    };

    await updateEvent(updatedEvent);
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const res = await fetch(`${API_URL}/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) fetchData();
      else {
        const errorData = await res.json();
        console.error("Erro ao atualizar papel do usuário:", errorData.message || res.statusText);
        throw new Error(errorData.message || "Erro ao atualizar papel do usuário");
      }
    } catch (error) {
      console.error("Erro ao atualizar papel do usuário:", error);
      throw error;
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const res = await fetch(`${API_URL}/users/${userId}`, { method: 'DELETE' });
      if (res.ok) fetchData();
      else {
        const errorData = await res.json();
        console.error("Erro ao deletar usuário:", errorData.message || res.statusText);
        throw new Error(errorData.message || "Erro ao deletar usuário");
      }
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      throw error;
    }
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
      projects, teams, events, users, loading,
      addProject, updateProject, deleteProject,
      addTeam, updateTeam, deleteTeam, addMemberToTeam, removeMemberFromTeam,
      addEvent, updateEvent, deleteEvent, toggleEventCompletion,
      updateUserRole, deleteUser,
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
