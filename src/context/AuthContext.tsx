"use client";

import React, { createContext, useContext, useState } from "react";
import { signInWithGoogle } from "../lib/firebase";

// --- Entidade User ---
export interface User {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "Member";
  avatar?: string;
  phone?: string; // Novo campo
  teamId?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fallback para produção se a variável falhar
const BASE_URL = import.meta.env.VITE_API_URL || "https://taskhub-backend-project.onrender.com/api";
const API_URL = `${BASE_URL}/auth`;
const USER_API_URL = `${BASE_URL}/users`;

const DEFAULT_AVATAR = "/images/user/perfil.svg";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("auth_user");
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (e) {
        console.error("Erro ao parsear usuário", e);
        return null;
      }
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Erro ao fazer login");
      }

      const userData = await res.json();
      const userWithAvatar = { ...userData, avatar: userData.avatar || DEFAULT_AVATAR };
      
      setUser(userWithAvatar);
      localStorage.setItem("auth_user", JSON.stringify(userWithAvatar));
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Erro ao cadastrar");
      }

      const userData = await res.json();
      const userWithAvatar = { ...userData, avatar: DEFAULT_AVATAR };

      setUser(userWithAvatar);
      localStorage.setItem("auth_user", JSON.stringify(userWithAvatar));
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const googleUser = await signInWithGoogle();
      
      const res = await fetch(`${API_URL}/social-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: googleUser.displayName,
          email: googleUser.email,
          avatar: googleUser.photoURL,
          provider: 'google'
        })
      });

      if (!res.ok) throw new Error("Erro ao autenticar com backend");

      const userData = await res.json();
      setUser(userData);
      localStorage.setItem("auth_user", JSON.stringify(userData));
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;
    
    try {
      const res = await fetch(`${USER_API_URL}/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Erro do servidor:", errorText);
        throw new Error(`Erro ao atualizar usuário: ${res.status} ${res.statusText}`);
      }

      const updatedUser = await res.json();
      const newUserState = { ...user, ...updatedUser };
      
      setUser(newUserState);
      localStorage.setItem("auth_user", JSON.stringify(newUserState));
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
    window.location.href = "/signin";
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, signup, loginWithGoogle, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
