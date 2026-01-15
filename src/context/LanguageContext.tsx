"use client";

import React, { createContext, useState, useContext, useEffect } from "react";

type Language = "pt" | "en" | "es";

type Translations = {
  [key in Language]: {
    [key: string]: string;
  };
};

const translations: Translations = {
  pt: {
    "menu.dashboard": "Dashboard",
    "menu.calendar": "Calendário",
    "menu.profile": "Perfil de Usuário",
    "menu.teams": "Times",
    "menu.projects": "Projetos",
    "menu.permissions": "Permissões",
    "menu.forms": "Formulários",
    "menu.tables": "Tabelas",
    "menu.pages": "Páginas",
    "menu.others": "Outros",
    "menu.charts": "Gráficos",
    "menu.uiElements": "Elementos UI",
    "menu.auth": "Autenticação",
    "settings.title": "Configurações",
    "settings.general": "Geral",
    "settings.calendar": "Regras do Calendário",
    "settings.notifications": "Notificações",
    "settings.permissions": "Permissões",
    "settings.language": "Idioma do Sistema",
    "settings.save": "Salvar Alterações",
  },
  en: {
    "menu.dashboard": "Dashboard",
    "menu.calendar": "Calendar",
    "menu.profile": "User Profile",
    "menu.teams": "Teams",
    "menu.projects": "Projects",
    "menu.permissions": "Permissions",
    "menu.forms": "Forms",
    "menu.tables": "Tables",
    "menu.pages": "Pages",
    "menu.others": "Others",
    "menu.charts": "Charts",
    "menu.uiElements": "UI Elements",
    "menu.auth": "Authentication",
    "settings.title": "Settings",
    "settings.general": "General",
    "settings.calendar": "Calendar Rules",
    "settings.notifications": "Notifications",
    "settings.permissions": "Permissions",
    "settings.language": "System Language",
    "settings.save": "Save Changes",
  },
  es: {
    "menu.dashboard": "Tablero",
    "menu.calendar": "Calendario",
    "menu.profile": "Perfil de Usuario",
    "menu.teams": "Equipos",
    "menu.projects": "Proyectos",
    "menu.permissions": "Permisos",
    "menu.forms": "Formularios",
    "menu.tables": "Tablas",
    "menu.pages": "Páginas",
    "menu.others": "Otros",
    "menu.charts": "Gráficos",
    "menu.uiElements": "Elementos UI",
    "menu.auth": "Autenticación",
    "settings.title": "Configuraciones",
    "settings.general": "General",
    "settings.calendar": "Reglas del Calendario",
    "settings.notifications": "Notificaciones",
    "settings.permissions": "Permisos",
    "settings.language": "Idioma del Sistema",
    "settings.save": "Guardar Cambios",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<Language>("pt");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("app_language") as Language;
    if (savedLang && ["pt", "en", "es"].includes(savedLang)) {
      setLanguageState(savedLang);
    }
    setIsInitialized(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("app_language", lang);
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  if (!isInitialized) return null; // Evita flash de conteúdo errado

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
