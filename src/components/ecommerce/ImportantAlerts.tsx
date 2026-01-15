import React from "react";
import { AlertIcon, GroupIcon, DocsIcon, TimeIcon } from "../../icons";

export default function ImportantAlerts() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
        Alertas Importantes
      </h3>
      <div className="space-y-4">
        {/* Reuniões sem participantes */}
        <div className="flex items-start gap-3 rounded-xl border border-orange-100 bg-orange-50 p-3 dark:border-orange-500/20 dark:bg-orange-500/10">
          <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-500 dark:bg-orange-500/20">
            <GroupIcon className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-800 dark:text-white/90">
              Reuniões sem participantes
            </h4>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              2 reuniões agendadas estão vazias.
            </p>
          </div>
        </div>

        {/* Eventos sem descrição */}
        <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-3 dark:border-blue-500/20 dark:bg-blue-500/10">
          <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-500 dark:bg-blue-500/20">
            <DocsIcon className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-800 dark:text-white/90">
              Eventos sem descrição
            </h4>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              5 eventos precisam de detalhes.
            </p>
          </div>
        </div>

        {/* Conflitos de horário */}
        <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-3 dark:border-red-500/20 dark:bg-red-500/10">
          <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-500 dark:bg-red-500/20">
            <AlertIcon className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-800 dark:text-white/90">
              Conflitos de horário
            </h4>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              1 conflito detectado hoje às 14:00.
            </p>
          </div>
        </div>

        {/* Prazos próximos */}
        <div className="flex items-start gap-3 rounded-xl border border-yellow-100 bg-yellow-50 p-3 dark:border-yellow-500/20 dark:bg-yellow-500/10">
          <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-yellow-500 dark:bg-yellow-500/20">
            <TimeIcon className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-800 dark:text-white/90">
              Prazos próximos
            </h4>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              3 entregas vencem em breve.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
