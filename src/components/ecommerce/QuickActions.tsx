import React from "react";
import { Link } from "react-router";
import { CalenderIcon, GroupIcon, TaskIcon } from "../../icons"; // Remover PlusIcon da importação

export default function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-2">
      <Link to="/calendar" className="group flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white p-3 transition-all hover:border-brand-500 hover:bg-brand-50/50 hover:shadow-sm dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-brand-500/50 dark:hover:bg-brand-500/10">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100 text-brand-600 transition-colors group-hover:bg-brand-200 dark:bg-brand-500/20 dark:text-brand-400">
          {/* SVG inline para o ícone de "mais" */}
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </div>
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 group-hover:text-brand-600 dark:group-hover:text-brand-400">
          Criar Evento
        </span>
      </Link>

      <Link to="/projects" className="group flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white p-3 transition-all hover:border-blue-500 hover:bg-blue-50/50 hover:shadow-sm dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-blue-500/50 dark:hover:bg-blue-500/10">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 transition-colors group-hover:bg-blue-200 dark:bg-blue-500/20 dark:text-blue-400">
          <TaskIcon className="h-5 w-5" />
        </div>
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
          Criar Projeto
        </span>
      </Link>

      <Link to="/teams" className="group flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white p-3 transition-all hover:border-green-500 hover:bg-green-50/50 hover:shadow-sm dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-green-500/50 dark:hover:bg-green-500/10">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-600 transition-colors group-hover:bg-green-200 dark:bg-green-500/20 dark:text-green-400">
          <GroupIcon className="h-5 w-5" />
        </div>
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400">
          Adicionar Time
        </span>
      </Link>

      <Link to="/calendar" className="group flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white p-3 transition-all hover:border-purple-500 hover:bg-purple-50/50 hover:shadow-sm dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-purple-500/50 dark:hover:bg-purple-500/10">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600 transition-colors group-hover:bg-purple-200 dark:bg-purple-500/20 dark:text-purple-400">
          <CalenderIcon className="h-5 w-5" />
        </div>
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400">
          Calendário
        </span>
      </Link>
    </div>
  );
}
